from __future__ import annotations

import json
from datetime import datetime, timedelta
from email.utils import parsedate_to_datetime
from hashlib import sha256
from typing import Any

import feedparser
from airflow import DAG
from airflow.decorators import task
from airflow.models import Variable
from airflow.operators.python import get_current_context
from airflow.providers.http.hooks.http import HttpHook
from airflow.providers.postgres.hooks.postgres import PostgresHook

POSTGRES_CONN_ID = "postgres_default"
CLIMATE_HTTP_CONN_ID = "climate_api_default"

DEFAULT_CLIMATE_LOCATIONS = [
    {"city": "Nairobi", "latitude": -1.286389, "longitude": 36.817223},
    {"city": "Delhi", "latitude": 28.613939, "longitude": 77.209023},
    {"city": "London", "latitude": 51.507351, "longitude": -0.127758},
]

DEFAULT_NEWS_RSS_FEEDS = [
    "https://www.theguardian.com/environment/rss",
    "https://www.unep.org/rss.xml",
    "https://www.nasa.gov/rss/dyn/earth.rss",
]

DEFAULT_ARGS = {
    "owner": "eduearth",
    "depends_on_past": False,
    "retries": 2,
    "retry_delay": timedelta(minutes=2),
}


def _safe_str(value: Any, default: str = "") -> str:
    if value is None:
        return default
    return str(value).strip()


def _record_hash(*values: str) -> str:
    normalized = "|".join(v.strip().lower() for v in values if v)
    return sha256(normalized.encode("utf-8")).hexdigest()


def _parse_rss_datetime(value: str) -> str | None:
    if not value:
        return None

    try:
        parsed = parsedate_to_datetime(value)
        return parsed.isoformat()
    except Exception:
        return None


def _curriculum_topic_from_text(text: str) -> str:
    lowered = text.lower()
    topic_rules = [
        ("air quality", ["aqi", "air quality", "smog", "pm2.5", "pollution"]),
        ("climate change", ["climate", "warming", "emissions", "carbon", "cop"]),
        ("renewable energy", ["solar", "wind", "renewable", "battery", "grid"]),
        ("biodiversity", ["species", "wildlife", "habitat", "ecosystem"]),
        (
            "water conservation",
            ["water", "drought", "flood", "river", "groundwater", "rain"],
        ),
        ("waste management", ["waste", "plastic", "recycle", "landfill", "compost"]),
        ("environmental policy", ["policy", "law", "regulation", "ministry", "parliament"]),
    ]

    for topic, keywords in topic_rules:
        if any(keyword in lowered for keyword in keywords):
            return topic

    return "sustainable living"


def _grade_band_from_text(text: str) -> str:
    words = len([token for token in text.split(" ") if token.strip()])

    if words <= 80:
        return "grade_4_6"
    if words <= 150:
        return "grade_7_9"
    if words <= 260:
        return "grade_10_12"
    return "higher_ed"


def _curriculum_tags(text: str) -> list[str]:
    lowered = text.lower()
    tags_map = {
        "climate": ["climate", "warming", "emissions", "carbon"],
        "air": ["aqi", "pm2.5", "air quality", "smog"],
        "water": ["water", "drought", "flood", "rainfall"],
        "energy": ["solar", "wind", "energy", "battery"],
        "biodiversity": ["species", "wildlife", "forest", "ecosystem"],
        "waste": ["waste", "plastic", "recycling", "compost"],
        "policy": ["policy", "law", "regulation", "governance"],
    }

    tags = [tag for tag, hints in tags_map.items() if any(hint in lowered for hint in hints)]
    if not tags:
        return ["environment"]
    return sorted(set(tags))


def _learning_objective(topic: str, grade_band: str) -> str:
    objectives = {
        "climate change": "Explain the causes and local effects of climate change using current evidence.",
        "air quality": "Interpret air quality indicators and propose school-safe mitigation actions.",
        "renewable energy": "Compare renewable energy options and evaluate trade-offs for communities.",
        "biodiversity": "Describe ecosystem interdependence and identify local biodiversity risks.",
        "water conservation": "Analyze water stress patterns and design practical conservation habits.",
        "waste management": "Apply circular-economy principles to reduce and sort waste effectively.",
        "environmental policy": "Evaluate policy decisions and their impact on environmental outcomes.",
        "sustainable living": "Connect daily choices with measurable environmental impacts.",
    }
    objective = objectives.get(topic, objectives["sustainable living"])
    return f"[{grade_band}] {objective}"


def _enrich_news_record(record: dict[str, Any]) -> dict[str, Any]:
    title = _safe_str(record.get("title"))
    summary = _safe_str(record.get("summary"))
    text = f"{title} {summary}".strip()

    topic = _curriculum_topic_from_text(text)
    grade_band = _grade_band_from_text(text)
    tags = _curriculum_tags(text)

    enrichment = {
        "curriculum_topic": topic,
        "grade_band": grade_band,
        "difficulty_level": "intro" if grade_band in {"grade_4_6", "grade_7_9"} else "intermediate",
        "learning_objective": _learning_objective(topic, grade_band),
        "curriculum_tags": tags,
        "relevance_score": min(1.0, round(0.45 + (0.08 * len(tags)), 2)),
    }

    enriched = dict(record)
    enriched["enrichment"] = enrichment
    return enriched


with DAG(
    dag_id="environmental_ingestion_v2",
    description="Decoupled ingestion for climate and RSS sources with outbox events",
    start_date=datetime(2026, 1, 1),
    schedule="*/10 * * * *",
    catchup=False,
    default_args=DEFAULT_ARGS,
    max_active_runs=1,
    tags=["eduearth", "environment", "ingestion", "v2"],
) as dag:
    @task
    def ensure_ingestion_contract() -> None:
        postgres = PostgresHook(postgres_conn_id=POSTGRES_CONN_ID)
        postgres.run(
            """
            CREATE TABLE IF NOT EXISTS ingestion_runs (
                id BIGSERIAL PRIMARY KEY,
                dag_run_id TEXT NOT NULL,
                source TEXT NOT NULL,
                status TEXT NOT NULL,
                fetched_count INT NOT NULL DEFAULT 0,
                inserted_count INT NOT NULL DEFAULT 0,
                updated_count INT NOT NULL DEFAULT 0,
                error_count INT NOT NULL DEFAULT 0,
                started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                finished_at TIMESTAMPTZ,
                notes JSONB
            );

            CREATE TABLE IF NOT EXISTS climate_observations (
                id BIGSERIAL PRIMARY KEY,
                provider_record_id TEXT NOT NULL,
                source TEXT NOT NULL,
                city TEXT NOT NULL,
                observed_at TIMESTAMPTZ NOT NULL,
                temperature_c DOUBLE PRECISION,
                humidity DOUBLE PRECISION,
                payload JSONB NOT NULL,
                ingested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                UNIQUE (source, provider_record_id)
            );

            CREATE TABLE IF NOT EXISTS news_articles_ingested (
                id BIGSERIAL PRIMARY KEY,
                provider_record_id TEXT NOT NULL,
                source TEXT NOT NULL,
                title TEXT NOT NULL,
                url TEXT NOT NULL,
                summary TEXT,
                published_at TIMESTAMPTZ,
                curriculum_topic TEXT,
                grade_band TEXT,
                difficulty_level TEXT,
                learning_objective TEXT,
                curriculum_tags TEXT[] DEFAULT '{}',
                relevance_score DOUBLE PRECISION,
                payload JSONB NOT NULL,
                ingested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                UNIQUE (source, provider_record_id),
                UNIQUE (url)
            );

            CREATE TABLE IF NOT EXISTS websocket_outbox (
                id BIGSERIAL PRIMARY KEY,
                channel TEXT NOT NULL,
                event_name TEXT NOT NULL,
                payload JSONB NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                sent_at TIMESTAMPTZ
            );

            CREATE INDEX IF NOT EXISTS idx_outbox_unsent ON websocket_outbox (created_at)
            WHERE sent_at IS NULL;

            ALTER TABLE news_articles_ingested
            ADD COLUMN IF NOT EXISTS curriculum_topic TEXT,
            ADD COLUMN IF NOT EXISTS grade_band TEXT,
            ADD COLUMN IF NOT EXISTS difficulty_level TEXT,
            ADD COLUMN IF NOT EXISTS learning_objective TEXT,
            ADD COLUMN IF NOT EXISTS curriculum_tags TEXT[] DEFAULT '{}',
            ADD COLUMN IF NOT EXISTS relevance_score DOUBLE PRECISION;
            """
        )

    @task
    def scrape_climate() -> list[dict[str, Any]]:
        hook = HttpHook(http_conn_id=CLIMATE_HTTP_CONN_ID, method="GET")
        endpoint = Variable.get("CLIMATE_ENDPOINT", default_var="/v1/forecast")
        api_key = Variable.get("CLIMATE_API_KEY", default_var="")
        locations_json = Variable.get(
            "CLIMATE_LOCATIONS_JSON",
            default_var=json.dumps(DEFAULT_CLIMATE_LOCATIONS),
        )

        try:
            parsed_locations = json.loads(locations_json)
            locations = [loc for loc in parsed_locations if isinstance(loc, dict)]
        except Exception:
            locations = DEFAULT_CLIMATE_LOCATIONS

        records: list[dict[str, Any]] = []
        for location in locations:
            city = _safe_str(location.get("city"), default="Unknown")
            latitude = location.get("latitude")
            longitude = location.get("longitude")

            if latitude is None or longitude is None:
                continue

            params = {
                "latitude": latitude,
                "longitude": longitude,
                "current": "temperature_2m,relative_humidity_2m",
                "timezone": "UTC",
            }
            if api_key:
                params["api_key"] = api_key

            response = hook.run(endpoint=endpoint, data=params)
            response.raise_for_status()
            payload = response.json()

            current_payload = payload.get("current") if isinstance(payload, dict) else {}
            if not isinstance(current_payload, dict):
                current_payload = {}

            observed_at = _safe_str(current_payload.get("time")) or datetime.utcnow().isoformat()
            provider_record_id = _record_hash(city, _safe_str(observed_at))

            records.append(
                {
                    "provider_record_id": provider_record_id,
                    "source": "open_meteo",
                    "city": city,
                    "observed_at": observed_at,
                    "temperature_c": current_payload.get("temperature_2m"),
                    "humidity": current_payload.get("relative_humidity_2m"),
                    "payload": payload,
                }
            )

        return records

    @task
    def scrape_news_rss() -> list[dict[str, Any]]:
        feeds_raw = Variable.get("NEWS_RSS_FEEDS", default_var=",".join(DEFAULT_NEWS_RSS_FEEDS))
        feeds = [feed.strip() for feed in feeds_raw.split(",") if feed.strip()]

        records: list[dict[str, Any]] = []
        for feed_url in feeds:
            parsed = feedparser.parse(feed_url)
            source_title = _safe_str(parsed.feed.get("title"), default="rss")

            for entry in parsed.entries:
                url = _safe_str(entry.get("link"))
                title = _safe_str(entry.get("title"), default="Untitled")
                published = _safe_str(entry.get("published"))
                summary = _safe_str(entry.get("summary"))
                published_at = _parse_rss_datetime(published)
                provider_record_id = _record_hash(feed_url, url or title)

                if not url:
                    continue

                records.append(
                    {
                        "provider_record_id": provider_record_id,
                        "source": source_title,
                        "title": title,
                        "url": url,
                        "summary": summary,
                        "published_at": published_at,
                        "payload": {
                            "feed_url": feed_url,
                            "entry": {
                                "title": title,
                                "link": url,
                                "summary": summary,
                                "published": published,
                            },
                        },
                    }
                )

        return records

    @task
    def enrich_curriculum_content(
        news_records: list[dict[str, Any]],
    ) -> list[dict[str, Any]]:
        return [_enrich_news_record(record) for record in news_records]

    @task
    def upsert_historical_data(
        climate_records: list[dict[str, Any]],
        enriched_news_records: list[dict[str, Any]],
    ) -> dict[str, int]:
        postgres = PostgresHook(postgres_conn_id=POSTGRES_CONN_ID)

        inserted_climate = 0
        inserted_news = 0

        for row in climate_records:
            postgres.run(
                """
                INSERT INTO climate_observations (
                    provider_record_id,
                    source,
                    city,
                    observed_at,
                    temperature_c,
                    humidity,
                    payload
                ) VALUES (
                    %(provider_record_id)s,
                    %(source)s,
                    %(city)s,
                    %(observed_at)s,
                    %(temperature_c)s,
                    %(humidity)s,
                    %(payload)s::jsonb
                )
                ON CONFLICT (source, provider_record_id)
                DO UPDATE SET
                    temperature_c = EXCLUDED.temperature_c,
                    humidity = EXCLUDED.humidity,
                    payload = EXCLUDED.payload,
                    ingested_at = NOW();
                """,
                parameters={
                    **row,
                    "payload": json.dumps(row["payload"]),
                },
            )
            inserted_climate += 1

        for row in enriched_news_records:
            enrichment = row.get("enrichment") or {}
            postgres.run(
                """
                INSERT INTO news_articles_ingested (
                    provider_record_id,
                    source,
                    title,
                    url,
                    summary,
                    published_at,
                    curriculum_topic,
                    grade_band,
                    difficulty_level,
                    learning_objective,
                    curriculum_tags,
                    relevance_score,
                    payload
                ) VALUES (
                    %(provider_record_id)s,
                    %(source)s,
                    %(title)s,
                    %(url)s,
                    %(summary)s,
                    %(published_at)s,
                    %(curriculum_topic)s,
                    %(grade_band)s,
                    %(difficulty_level)s,
                    %(learning_objective)s,
                    %(curriculum_tags)s,
                    %(relevance_score)s,
                    %(payload)s::jsonb
                )
                ON CONFLICT (source, provider_record_id)
                DO UPDATE SET
                    title = EXCLUDED.title,
                    summary = EXCLUDED.summary,
                    published_at = EXCLUDED.published_at,
                    curriculum_topic = EXCLUDED.curriculum_topic,
                    grade_band = EXCLUDED.grade_band,
                    difficulty_level = EXCLUDED.difficulty_level,
                    learning_objective = EXCLUDED.learning_objective,
                    curriculum_tags = EXCLUDED.curriculum_tags,
                    relevance_score = EXCLUDED.relevance_score,
                    payload = EXCLUDED.payload,
                    ingested_at = NOW();
                """,
                parameters={
                    **row,
                    "curriculum_topic": enrichment.get("curriculum_topic"),
                    "grade_band": enrichment.get("grade_band"),
                    "difficulty_level": enrichment.get("difficulty_level"),
                    "learning_objective": enrichment.get("learning_objective"),
                    "curriculum_tags": enrichment.get("curriculum_tags", []),
                    "relevance_score": enrichment.get("relevance_score"),
                    "payload": json.dumps(row["payload"]),
                },
            )
            inserted_news += 1

        return {
            "climate_records": inserted_climate,
            "news_records": inserted_news,
            "total": inserted_climate + inserted_news,
        }

    @task
    def publish_realtime_outbox(
        climate_records: list[dict[str, Any]],
        enriched_news_records: list[dict[str, Any]],
    ) -> dict[str, int]:
        postgres = PostgresHook(postgres_conn_id=POSTGRES_CONN_ID)
        emitted = 0

        for row in climate_records:
            postgres.run(
                """
                INSERT INTO websocket_outbox (channel, event_name, payload)
                VALUES (
                    'climate',
                    'climate.observation.updated',
                    %(payload)s::jsonb
                );
                """,
                parameters={"payload": json.dumps(row)},
            )
            emitted += 1

        for row in enriched_news_records:
            postgres.run(
                """
                INSERT INTO websocket_outbox (channel, event_name, payload)
                VALUES (
                    'news',
                    'news.article.ingested',
                    %(payload)s::jsonb
                );
                """,
                parameters={"payload": json.dumps(row)},
            )
            emitted += 1

        return {"outbox_events": emitted}

    @task
    def track_run_stats(
        upsert_stats: dict[str, int], outbox_stats: dict[str, int]
    ) -> None:
        postgres = PostgresHook(postgres_conn_id=POSTGRES_CONN_ID)
        context = get_current_context()
        run_id = _safe_str(context.get("run_id"), default="manual")

        total_fetched = upsert_stats.get("total", 0)
        outbox_count = outbox_stats.get("outbox_events", 0)

        postgres.run(
            """
            INSERT INTO ingestion_runs (
                dag_run_id,
                source,
                status,
                fetched_count,
                inserted_count,
                finished_at,
                notes
            ) VALUES (
                %(dag_run_id)s,
                %(source)s,
                'success',
                %(fetched_count)s,
                %(inserted_count)s,
                NOW(),
                %(notes)s::jsonb
            );
            """,
            parameters={
                "dag_run_id": run_id,
                "source": "climate+rss",
                "fetched_count": total_fetched,
                "inserted_count": total_fetched,
                "notes": json.dumps(
                    {
                        "outbox_events": outbox_count,
                        "climate_records": upsert_stats.get("climate_records", 0),
                        "news_records": upsert_stats.get("news_records", 0),
                    }
                ),
            },
        )

    ensure_contract = ensure_ingestion_contract()
    climate = scrape_climate()
    news = scrape_news_rss()
    enriched_news = enrich_curriculum_content(news)
    upserted = upsert_historical_data(climate, enriched_news)
    outbox = publish_realtime_outbox(climate, enriched_news)
    run_stats = track_run_stats(upserted, outbox)

    ensure_contract >> [climate, news] >> enriched_news >> upserted >> outbox >> run_stats
