# University Accommodation Office Application

Python + MySQL full-stack DBMS course project with organized split folders:

- `frontend/` for the UI
- `backend/` for the API

## Stack

- Backend: FastAPI + SQLAlchemy + PyMySQL
- Database: MySQL 8+
- Frontend: HTML/CSS/Vanilla JS

## Folder Layout

```text
.
|-- frontend/
|-- backend/
|   |-- app/
|   |-- tests/
|   |-- requirements.txt
|   |-- schema.sql
|-- docs/
|-- explainer.md
```

## Features

- Full CRUD APIs for:
	- staff
	- courses
	- students
	- halls
	- apartments
	- rooms
	- leases
	- invoices
	- next-of-kin
	- inspections
- All assignment report APIs `(a)` through `(n)`
- MySQL constraints, foreign keys, and room validation triggers
- Animated dashboard UI for CRUD + report execution

## Run Locally

### 1) Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env
```

### 2) Apply schema

```bash
mysql -u <user> -p <database_name> < schema.sql
```

### 3) Start backend API

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4) Open app

- Preferred: open `http://localhost:8000` (backend serves frontend)
- Optional split mode: serve `frontend/` separately and keep backend on `8000`

## Test

```bash
cd backend
pytest -q
```

## API Docs

See [docs/API.md](docs/API.md) for endpoint details.

## Render Deployment

The project includes a Render blueprint in `render.yaml` configured for Python:

- build: `pip install -r backend/requirements.txt`
- start: `python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT`
- health check: `/health`

Set these environment variables in Render:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_TLS_MODE` (optional, default `preferred`)
- `DB_CA_CERT_PATH` (optional, default `ca.pem`)

## Full Architecture Notes

See [explainer.md](explainer.md) for complete end-to-end explanation.
