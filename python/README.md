# Overview

Welcome to Astronomer! This project was generated after you ran 'astro dev init' using the Astronomer CLI. This readme describes the contents of the project, as well as how to run Apache Airflow on your local machine.

# EduEarth Ingestion V2

This workspace now includes a decoupled ingestion DAG:

- `dags/environmental_ingestion_v2.py`

What it does:

- Scrapes climate providers and environmental RSS feeds from Python workers.
- Upserts historical records into PostgreSQL tables.
- Emits realtime-ready events into `websocket_outbox` for the Express Socket.io layer.
- Tracks ingestion run stats in `ingestion_runs`.

Required Airflow connections:

- `postgres_default`: target app PostgreSQL database.
- `climate_api_default`: HTTP connection to your climate provider base URL.

Useful Airflow Variables:

- `CLIMATE_LOCATIONS_JSON`: JSON city coordinates list for climate pulls.
- `CLIMATE_ENDPOINT`: provider endpoint path. Default: `/v1/forecast`.
- `CLIMATE_API_KEY`: provider API key if required.
- `NEWS_RSS_FEEDS`: comma-separated RSS URLs.

External providers configured in V2:

- Climate API: Open-Meteo (`https://api.open-meteo.com`)
- Environmental RSS: Guardian Environment, UNEP RSS, NASA Earth RSS

Recommended variables for provider fetch:

- `CLIMATE_LOCATIONS_JSON`: JSON list of city/latitude/longitude objects used by Open-Meteo
- `CLIMATE_ENDPOINT`: `/v1/forecast`
- `NEWS_RSS_FEEDS`: comma-separated RSS feed URLs

Bootstrap settings file:

- `airflow_settings.yaml` includes local defaults for connections and variables
- Load into local Airflow with `astro dev object import`

Contract SQL is provided at:

- `include/sql/environmental_ingestion_contract.sql`

# Project Contents

Your Astro project contains the following files and folders:

- dags: This folder contains the Python files for your Airflow DAGs. By default, this directory includes one example DAG:
  - `example_astronauts`: This DAG shows a simple ETL pipeline example that queries the list of astronauts currently in space from the Open Notify API and prints a statement for each astronaut. The DAG uses the TaskFlow API to define tasks in Python, and dynamic task mapping to dynamically print a statement for each astronaut. For more on how this DAG works, see our [Getting started tutorial](https://www.astronomer.io/docs/learn/get-started-with-airflow).
- Dockerfile: This file contains a versioned Astro Runtime Docker image that provides a differentiated Airflow experience. If you want to execute other commands or overrides at runtime, specify them here.
- include: This folder contains any additional files that you want to include as part of your project. It is empty by default.
- packages.txt: Install OS-level packages needed for your project by adding them to this file. It is empty by default.
- requirements.txt: Install Python packages needed for your project by adding them to this file. It is empty by default.
- plugins: Add custom or community plugins for your project to this file. It is empty by default.
- airflow_settings.yaml: Use this local-only file to specify Airflow Connections, Variables, and Pools instead of entering them in the Airflow UI as you develop DAGs in this project.

# Deploy Your Project Locally

Start Airflow on your local machine by running 'astro dev start'.

This command will spin up five Docker containers on your machine, each for a different Airflow component:

- Postgres: Airflow's Metadata Database
- Scheduler: The Airflow component responsible for monitoring and triggering tasks
- DAG Processor: The Airflow component responsible for parsing DAGs
- API Server: The Airflow component responsible for serving the Airflow UI and API
- Triggerer: The Airflow component responsible for triggering deferred tasks

When all five containers are ready the command will open the browser to the Airflow UI at http://localhost:8080/. You should also be able to access your Postgres Database at 'localhost:5432/postgres' with username 'postgres' and password 'postgres'.

Note: If you already have either of the above ports allocated, you can either [stop your existing Docker containers or change the port](https://www.astronomer.io/docs/astro/cli/troubleshoot-locally#ports-are-not-available-for-my-local-airflow-webserver).

# Deploy Your Project to Astronomer

If you have an Astronomer account, pushing code to a Deployment on Astronomer is simple. For deploying instructions, refer to Astronomer documentation: https://www.astronomer.io/docs/astro/deploy-code/

# Contact

The Astronomer CLI is maintained with love by the Astronomer team. To report a bug or suggest a change, reach out to our support.
