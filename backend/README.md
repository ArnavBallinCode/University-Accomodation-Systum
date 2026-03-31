# Backend (FastAPI + MySQL)

Python backend for the University Accommodation Office application.

## Responsibilities

- Exposes authenticated CRUD and report APIs.
- Enforces role-based access (`admin`, `manager`, `viewer`).
- Reflects MySQL schema via SQLAlchemy metadata.
- Serves built frontend from `../frontend/dist`.

## Requirements

- Python 3.11+
- MySQL 8+

## Setup

From repository root:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
cp .env.example backend/.env
```

Edit `backend/.env` values for your MySQL instance.

## Database schema

Apply schema:

```bash
mysql -u <mysql_user> -p -e "CREATE DATABASE IF NOT EXISTS <db_name>;"
mysql -u <mysql_user> -p <db_name> < backend/schema.sql
```

## Run backend

Development mode:

```bash
# from repository root
source .venv/bin/activate
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```

Open `http://localhost:8000/health`.

If frontend has been built (`frontend/dist` exists), `http://localhost:8000` serves the app UI.

## Authentication

Auth endpoints:

- `POST /auth/login`
- `GET /auth/me`

Default demo users:

- `admin` / `Admin@123`
- `manager` / `Manager@123`
- `viewer` / `Viewer@123`

## Role access model

- `admin`: read + create + update + delete
- `manager`: read + create + update
- `viewer`: read-only

## Tests

```bash
# from repository root
source .venv/bin/activate
PYTHONPATH=backend python -m pytest backend/tests -q
```

Runtime smoke test (server must already be running at `http://127.0.0.1:8000`):

```bash
source .venv/bin/activate
python backend/tests/runtime_smoke.py
```

## Useful files

- API routes: `backend/app/main.py`
- Auth logic: `backend/app/auth.py`
- DB config: `backend/app/config.py`
- DB engine/session/reflection: `backend/app/database.py`
- API docs: `docs/API.md`
