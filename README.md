# University Accommodation Office Application

Python + MySQL full-stack DBMS course project with organized split folders:

- `frontend/` for the UI
- `backend/` for the API

## Stack

- Backend: FastAPI + SQLAlchemy + PyMySQL
- Database: MySQL 8+
- Frontend: React + TypeScript + Tailwind CSS + Framer Motion (Vite)

## Folder Layout

```text
.
|-- frontend/
|   |-- src/
|   |-- package.json
|   |-- vite.config.ts
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
- Multi-page animated React UI:
	- Neon Lobby (overview)
	- Entity Forge (full CRUD)
	- Report Reactor (all reports)
	- Pulse Board (live metrics)

## Run Locally

### 1) Prepare database

Create database and apply schema:

```bash
cd backend
mysql -u <user> -p <database_name> < schema.sql
```

### 2) Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env
```

### 3) Frontend setup

```bash
cd frontend
npm install
```

### 4) Run in development mode (2 terminals)

Terminal A (backend):

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Terminal B (frontend):

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`.

### 5) Run in production-like single-service mode

Build frontend and let backend serve it:

```bash
cd frontend
npm run build
cd ../backend
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Open `http://localhost:8000`.

## Test

```bash
cd backend
pytest -q
python tests/runtime_smoke.py
```

## API Docs

See [docs/API.md](docs/API.md) for endpoint details.

## Render Deployment

The project includes a Render blueprint in `render.yaml` configured for Python:

- build: `pip install -r backend/requirements.txt`
- start: `python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT`
- health check: `/health`

Important:

- Backend serves the built React app from `frontend/dist`.
- Before deployment, run `npm run build` in `frontend/` and commit `frontend/dist` updates.

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
