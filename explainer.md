# University Accommodation Office - End-to-End Project Explainer

This document explains the complete architecture after the frontend migration to React + TypeScript + Tailwind, while preserving the Python FastAPI + MySQL backend and assignment report coverage.

## 1) What this application solves

The system handles university accommodation operations, including:

- staff, courses, and students
- halls, apartments, and rooms
- leases and invoices
- inspections and next-of-kin records
- all assignment report queries `(a)` through `(n)`

Every record is persisted in MySQL with relational constraints and validation logic at the database layer.

## 2) Repository structure

```text
.
|-- frontend/
|   |-- src/
|   |   |-- App.tsx
|   |   |-- pages/
|   |   |-- components/
|   |   |-- config/
|   |   |-- lib/
|   |-- index.html
|   |-- package.json
|   |-- vite.config.ts
|   |-- tailwind.config.ts
|   |-- postcss.config.js
|   |-- dist/                # build output served by backend
|-- backend/
|   |-- app/
|   |   |-- config.py
|   |   |-- database.py
|   |   |-- main.py
|   |-- tests/
|   |   |-- test_routes.py
|   |   |-- runtime_smoke.py
|   |-- requirements.txt
|   |-- schema.sql
|-- docs/
|   |-- API.md
|   |-- DBMS Project.pdf
|   |-- University Accommodation Office Problem Statement.pdf
|-- README.md
|-- explainer.md
|-- render.yaml
```

## 3) Database and integrity model

Canonical schema: `backend/schema.sql`.

Entities:

- `staff`
- `courses`
- `students`
- `halls`
- `apartments`
- `rooms`
- `leases`
- `invoices`
- `next_of_kin`
- `inspections`

Integrity controls:

- foreign keys for all cross-entity references
- check constraints for allowed values and numeric limits
- uniqueness constraints (for example email and next-of-kin uniqueness)
- triggers that enforce exactly one ownership link for rooms (`hall_id` xor `apartment_id`)

## 4) Backend architecture (FastAPI)

Key files:

- `backend/app/config.py`: loads env and validates runtime settings
- `backend/app/database.py`: SQLAlchemy engine/session and reflected table access
- `backend/app/main.py`: CRUD endpoints, report routes, static asset routing, SPA fallback

Request flow:

1. Frontend calls API endpoint.
2. Route resolves entity/report logic.
3. SQLAlchemy executes SQL against MySQL.
4. DB applies constraints/triggers.
5. API returns JSON payload or structured error.

## 5) API shape

Health and frontend shell:

- `GET /health`
- `GET /` (serves React app from `frontend/dist/index.html`)
- `GET /assets/*` (serves Vite build assets)
- `GET /{spa-path}` (SPA fallback for frontend routes)

CRUD routes:

- `GET /api/{entity}`
- `GET /api/{entity}/{id}`
- `POST /api/{entity}`
- `PUT /api/{entity}/{id}`
- `DELETE /api/{entity}/{id}`

Report routes `(a)` through `(n)`:

- `GET /api/reports/hall-managers`
- `GET /api/reports/student-leases`
- `GET /api/reports/summer-leases`
- `GET /api/reports/student-rent-paid/{banner_id}`
- `GET /api/reports/unpaid-invoices?due_before=YYYY-MM-DD`
- `GET /api/reports/unsatisfactory-inspections`
- `GET /api/reports/hall-student-rooms/{hall_id}`
- `GET /api/reports/waiting-list`
- `GET /api/reports/student-category-counts`
- `GET /api/reports/students-without-kin`
- `GET /api/reports/student-adviser/{banner_id}`
- `GET /api/reports/rent-stats`
- `GET /api/reports/hall-place-counts`
- `GET /api/reports/senior-staff`

## 6) Validation and error contracts

Input normalization includes:

- empty optional strings mapped to `NULL`
- strict `YYYY-MM-DD` parsing for date fields
- type coercion for numeric and boolean DB columns

Error mapping:

- duplicate key violations -> `409`
- FK/check/trigger/data issues -> `400`
- missing records -> `404`
- unexpected DB/server failures -> `500`

Frontend consumes FastAPI `detail` errors and surfaces them as animated toast notifications.

## 7) Frontend architecture (React + TS + Tailwind)

Frontend stack:

- React 18 + TypeScript
- React Router
- Tailwind CSS
- Framer Motion animations
- Vite bundler and dev server

Main frontend modules:

- `src/App.tsx`: route tree and page transitions
- `src/pages/HomePage.tsx`: hero landing and quick metrics
- `src/pages/EntityStudioPage.tsx`: dynamic full CRUD cockpit for every entity
- `src/pages/ReportsPage.tsx`: all report cards with parameter inputs
- `src/pages/PulseBoardPage.tsx`: live metric and rent insight dashboard
- `src/config/entities.ts`: entity field schema for form rendering
- `src/config/reports.ts`: report endpoint metadata
- `src/lib/api.ts`: API client and error handling

UI direction:

- multi-page "command universe" design
- strong gradient atmosphere and animated background layers
- glass panels, bright accent palette, bold typography
- responsive layout for desktop and mobile

## 8) Local run instructions (complete)

### Step 1: Create DB and apply schema

```bash
cd backend
mysql -u <user> -p <database_name> < schema.sql
```

### Step 2: Setup backend environment

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env
```

Edit `backend/.env` with real MySQL values.

### Step 3: Setup frontend dependencies

```bash
cd frontend
npm install
```

### Step 4A: Development mode (recommended while building UI)

Run backend and frontend in separate terminals:

Terminal 1:

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`.

### Step 4B: Production-like local mode (single service)

```bash
cd frontend
npm run build
cd ../backend
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Open `http://localhost:8000`.

## 9) Testing and verification

Backend tests:

```bash
cd backend
pytest -q
```

Runtime smoke checks:

```bash
cd backend
python tests/runtime_smoke.py
```

Frontend build validation:

```bash
cd frontend
npm run build
```

## 10) Render deployment details

Render blueprint: `render.yaml`.

Configured values:

- runtime: Python
- build command: `pip install -r backend/requirements.txt`
- start command: `python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT`
- health check path: `/health`

Required environment variables on Render:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_TLS_MODE` (default `preferred`)
- `DB_CA_CERT_PATH` (default `ca.pem`)
- `PORT` (default `8000`)

Frontend deployment note:

- backend serves prebuilt frontend files from `frontend/dist`
- run `npm run build` in `frontend/` before deploying and commit updated `dist` output

## 11) Troubleshooting quick guide

If API fails to start:

- verify `backend/.env` exists and includes DB settings
- confirm MySQL is reachable and schema has been applied

If frontend shows backend errors:

- in dev mode, confirm backend is running on `8000`
- check browser network responses for `detail` messages

If frontend is missing in production-like mode:

- run `cd frontend && npm run build`
- restart backend after build output is generated

## 12) Final outcome

The project now provides:

- full CRUD coverage across all required entities
- full assignment report coverage `(a)` through `(n)`
- a high-motion React + TypeScript + Tailwind multi-page UI
- safe backend integration and SPA routing
- Render-ready Python deployment with MySQL-backed persistence
