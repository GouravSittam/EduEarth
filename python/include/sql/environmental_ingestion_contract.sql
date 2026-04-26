-- Environmental ingestion contract for Architecture V2
-- Apply this once in your application Postgres (or let DAG bootstrap it)

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

CREATE INDEX IF NOT EXISTS idx_outbox_unsent
ON websocket_outbox (created_at)
WHERE sent_at IS NULL;

ALTER TABLE news_articles_ingested
ADD COLUMN IF NOT EXISTS curriculum_topic TEXT,
ADD COLUMN IF NOT EXISTS grade_band TEXT,
ADD COLUMN IF NOT EXISTS difficulty_level TEXT,
ADD COLUMN IF NOT EXISTS learning_objective TEXT,
ADD COLUMN IF NOT EXISTS curriculum_tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS relevance_score DOUBLE PRECISION;
