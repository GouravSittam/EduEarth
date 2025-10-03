from airflow import DAG
from airflow.providers.http.hooks.http import HttpHook
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.decorators import task
from airflow.models import Variable
from datetime import datetime, timedelta
import logging
import json

API_CONN_ID = 'guardian_default'
POSTGRES_CONN_ID = 'postgres_default'

default_args = {
    'owner': 'airflow',
    'start_date': datetime(2025, 1, 1),
    'retries': 1,
    'retry_delay': timedelta(minutes=3)
}

# dag object
with DAG(
    dag_id='env_etl_pipeline_dag',
    default_args=default_args,
    schedule='@daily',
    catchup=False,
    description='Extract environmental news from Guardian API and load to Postgres',
    tags=['environment', 'news', 'guardian']
) as dag:
    
    @task
    def verify_table():
        """Verify that the articles table exists and is accessible"""
        logger = logging.getLogger(__name__)
        
        try:
            postgres_hook = PostgresHook(postgres_conn_id=POSTGRES_CONN_ID)
            
            #  cheking if table exists and get its structure
            check_table_sql = """
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'articles' 
            ORDER BY ordinal_position;
            """
            
            columns = postgres_hook.get_records(check_table_sql)
            if not columns:
                raise Exception("Table 'articles' not found in database")
            
            logger.info(f"Table 'articles' found with {len(columns)} columns")
            for col_name, col_type in columns:
                logger.info(f"Column: {col_name} ({col_type})")
            
            # create indexes if they dont exist
            index_sql = """
            CREATE INDEX IF NOT EXISTS idx_articles_publish_date ON articles("publishDate");
            CREATE INDEX IF NOT EXISTS idx_articles_section ON articles(section);
            CREATE INDEX IF NOT EXISTS idx_articles_url ON articles(url);
            """
            
            postgres_hook.run(index_sql)
            logger.info("Indexes verified/created successfully")
            
        except Exception as e:
            logger.error(f"Table verification failed: {str(e)}")
            raise
    
    @task
    def extract_guardian():
        """Extract environment news articles from Guardian API"""
        logger = logging.getLogger(__name__)
        
        try:
            # API key
            api_key = Variable.get("GUARDIAN_API_KEY")
            
            # HttpHook to get connection details from airflow
            http_hook = HttpHook(http_conn_id=API_CONN_ID, method='GET')

            yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d') 
            today = datetime.now().strftime('%Y-%m-%d')
            
            # build endpoint - just the path- not full URL
            endpoint = '/search'

            # query parameters for URL
            query_params = {
                'section': 'environment',
                'from-date': yesterday,
                'to-date': today,
                'show-fields': 'headline,bodyText',
                'api-key': api_key,
                'page-size': '20'
            }
            
            logger.info(f"Fetching articles from {yesterday} to {today}")
            
            # HTTP request via endpoint
            response = http_hook.run(
                endpoint=endpoint,
                data=query_params,
                headers={'Accept': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                article_count = len(data.get('response', {}).get('results', []))
                logger.info(f"Successfully extracted {article_count} articles")
                return data
            else:
                logger.error(f"API request failed with status code: {response.status_code}")
                raise Exception(f"Guardian API request failed: {response.status_code}")
        
        except Exception as e:
            logger.error(f"Extract task failed: {str(e)}")
            raise

    @task
    def transform_guardian(data):
        """Transform guardian data into PostgreSQL-appropriate format"""
        logger = logging.getLogger(__name__)
        
        try:
            # validate input data
            if not data or 'response' not in data:
                raise ValueError("Invalid data structure from Guardian API")
            
            response_data = data['response']
            results = response_data.get('results', [])
            
            if not results:
                logger.warning("No articles found in API response")
                return []
            
            transformed_articles = []
            extraction_date = datetime.now()
            
            for article in results:
                # handle missing fields
                fields = article.get('fields', {})
                
                # parse publication date
                pub_date_str = article.get('webPublicationDate', '')
                try:
                    # if guardian API returns dates in ISO format like "2025-01-15T10:30:00Z"
                    if pub_date_str:
                        pub_date = datetime.fromisoformat(pub_date_str.replace('Z', '+00:00'))
                        # convert to naive datetime (remove timezone info for PostgreSQL)
                        pub_date = pub_date.replace(tzinfo=None)
                    else:
                        pub_date = None
                except ValueError:
                    logger.warning(f"Could not parse date: {pub_date_str}")
                    pub_date = None
                
                # clean and truncate text fields- no errors
                headline = fields.get('headline', 'No headline available')[:1000]  # Truncate if too long
                body = fields.get('bodyText', 'No content available')
                
                # article dictionary
                article_dict = {
                    'publishDate': pub_date,
                    'extractedDate': extraction_date,
                    'url': article.get('webUrl', '')[:2000],
                    'headline': headline,
                    'body': body,
                    'section': article.get('sectionName', 'environment')[:100],
                    'source': 'guardian_api'
                }
                
                transformed_articles.append(article_dict)
            
            logger.info(f"Successfully transformed {len(transformed_articles)} articles")
            return transformed_articles
            
        except Exception as e:
            logger.error(f"Transform task failed: {str(e)}")
            raise

    @task 
    def load_guardian(articles_data):
        """Load with PostgreSQL UUID generation"""
        logger = logging.getLogger(__name__)
        
        try:
            if not articles_data:
                logger.info("No articles to load")
                return {"loaded": 0, "errors": 0}
            
            postgres_hook = PostgresHook(postgres_conn_id=POSTGRES_CONN_ID)
            
            # Setup UUID extension and fix updatedAt column
            setup_sql = """
            -- Enable UUID extension if not already enabled
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            
            -- Setup defaults and constraints
            DO $
            BEGIN
                -- Try to set default UUID generation for id column
                ALTER TABLE articles ALTER COLUMN id SET DEFAULT uuid_generate_v4();
            EXCEPTION
                WHEN others THEN
                    -- If that fails, try gen_random_uuid (available in newer PostgreSQL)
                    BEGIN
                        ALTER TABLE articles ALTER COLUMN id SET DEFAULT gen_random_uuid();
                    EXCEPTION
                        WHEN others THEN
                            RAISE NOTICE 'Could not set UUID default, will generate manually';
                    END;
            END
            $;
            
            -- Fix updatedAt column to have proper default and trigger
            ALTER TABLE articles ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
            
            -- Create or replace the trigger function for updatedAt
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $
            BEGIN
                NEW."updatedAt" = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $ language 'plpgsql';
            
            -- Drop trigger if it exists and recreate
            DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
            CREATE TRIGGER update_articles_updated_at 
                BEFORE UPDATE ON articles 
                FOR EACH ROW 
                EXECUTE FUNCTION update_updated_at_column();
            """
            
            try:
                postgres_hook.run(setup_sql)
                logger.info("UUID extension and default setup completed")
            except Exception as setup_error:
                logger.warning(f"Setup warning (continuing): {setup_error}")
            
            # insert SQL
            insert_sql = """
            INSERT INTO articles (
                "publishDate", "extractedDate", url, headline, 
                body, section, source, "updatedAt"
            ) VALUES (
                %(publishDate)s, %(extractedDate)s, %(url)s, 
                %(headline)s, %(body)s, %(section)s, %(source)s, CURRENT_TIMESTAMP
            )
            ON CONFLICT (url) 
            DO UPDATE SET 
                "extractedDate" = EXCLUDED."extractedDate",
                headline = EXCLUDED.headline,
                body = EXCLUDED.body,
                section = EXCLUDED.section,
                "updatedAt" = CURRENT_TIMESTAMP
            RETURNING id, url;
            """
            
            loaded_count = 0
            error_count = 0
            
            for i, article in enumerate(articles_data):
                try:
                    logger.info(f"Processing article {i+1}/{len(articles_data)}: {article['headline'][:50]}...")
                    
                    result = postgres_hook.get_records(insert_sql, parameters=article)
                    
                    if result:
                        article_id, url = result[0]
                        logger.info(f"✓ Article {i+1} loaded successfully with ID: {article_id}")
                        loaded_count += 1
                    else:
                        logger.warning(f"Article {i+1} processed but no ID returned")
                        loaded_count += 1
                        
                except Exception as e:
                    error_count += 1
                    logger.error(f"✗ Failed to insert article {i+1}: {str(e)}")
                    continue
            
            logger.info(f"Load completed: {loaded_count} successful, {error_count} errors")
            
            # verify if inserted or not
            count_today = postgres_hook.get_first(
                'SELECT COUNT(*) FROM articles WHERE DATE("extractedDate") = CURRENT_DATE'
            )[0]
            logger.info(f"Total articles extracted today: {count_today}")
            
            return {"loaded": loaded_count, "errors": error_count}
            
        except Exception as e:
            logger.error(f"Load task failed: {str(e)}")
            raise

    @task
    def data_quality_check():
        """Perform basic data quality checks"""
        logger = logging.getLogger(__name__)
        
        try:
            postgres_hook = PostgresHook(postgres_conn_id=POSTGRES_CONN_ID)

            # check for duplicate URLs (since url is unique in schema)
            duplicate_check = """
            SELECT url, COUNT(*) as count 
            FROM articles 
            WHERE DATE("extractedDate") = CURRENT_DATE
            GROUP BY url 
            HAVING COUNT(*) > 1
            """
            
            duplicates = postgres_hook.get_records(duplicate_check)
            if duplicates:
                logger.warning(f"Found {len(duplicates)} duplicate URLs")
            
            # check for articles with missing critical fields
            missing_data_check = """
            SELECT COUNT(*) 
            FROM articles 
            WHERE DATE("extractedDate") = CURRENT_DATE 
            AND (headline IS NULL OR headline = '' OR body IS NULL OR body = '')
            """
            
            missing_count = postgres_hook.get_first(missing_data_check)[0]
            if missing_count > 0:
                logger.warning(f"Found {missing_count} articles with missing headline or body")
            
            logger.info("Data quality check completed")
            
        except Exception as e:
            logger.error(f"Data quality check failed: {str(e)}")
            raise

    # task dependencies
    verify_table_task = verify_table()
    extract_task = extract_guardian()
    transform_task = transform_guardian(extract_task)
    load_task = load_guardian(transform_task)
    quality_check_task = data_quality_check()
    
    # pipeline flow
    verify_table_task >> extract_task >> transform_task >> load_task >> quality_check_task