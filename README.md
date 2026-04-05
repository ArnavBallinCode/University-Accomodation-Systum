# CS266 DBMS Course Project
## University Accommodation Office Management System

A full-stack DBMS application for managing university housing operations end-to-end.

This project models real accommodation workflows in a normalized MySQL schema, exposes the data through a FastAPI backend, and provides a modern React dashboard for operations, CRUD workflows, and reporting.

## 1) Project Introduction

### What problem this solves
University accommodation offices must track students, rooms, leases, invoices, inspections, staff assignments, and emergency contacts. In many settings, this data is fragmented across spreadsheets and manual records.

This application centralizes those workflows into:
- A relational DBMS schema with integrity rules.
- A role-protected backend API.
- A frontend that supports day-to-day management and analytical reporting.

### Core capabilities
- CRUD operations for 10 core entities.
- 14 reporting endpoints aligned to DBMS assignment-style queries.
- JWT-based authentication and role-based authorization:
  - `admin`: read + create + update + delete
  - `manager`: read + create + update
  - `viewer`: read-only
- Frontend modules for dashboard metrics, entity management, report execution, and pulse analytics.

## 2) Tech Stack Overview (and why)

| Layer | Technology | Why it is used |
|---|---|---|
| Database | MySQL 8+ | Reliable relational engine with strong FK/constraint support, ideal for DBMS coursework and SQL report queries. |
| Backend API | FastAPI | High-performance Python API framework with clear route/dependency model and automatic OpenAPI docs. |
| Data Access | SQLAlchemy Core + metadata reflection | Enables generic CRUD across multiple tables by reflecting schema instead of duplicating model classes. |
| MySQL Driver | PyMySQL | DBAPI driver used by SQLAlchemy to establish actual MySQL socket/TCP connections. |
| Auth | python-jose + passlib | JWT token generation/validation and secure password hash verification for role-based access. |
| Frontend | React 18 + TypeScript | Componentized UI with static type safety for forms, tables, and report contracts. |
| Build Tool | Vite | Fast local dev server and production build pipeline for React frontend. |
| Styling | Tailwind CSS + custom theme tokens | Rapid utility-first styling plus custom visual identity. |
| Motion/UI | Framer Motion + Lucide icons | Visual transitions and readable iconography for better UX feedback. |
| Testing | pytest + FastAPI TestClient + runtime smoke script | Ensures route presence, auth correctness, and live endpoint behavior. |

## 3) Architecture At A Glance

1. Frontend pages call API helpers in `frontend/src/lib/api.ts`.
2. Requests go to FastAPI routes in `backend/app/main.py`.
3. Auth dependencies in `backend/app/auth.py` enforce JWT and role rules.
4. DB sessions come from `backend/app/database.py`.
5. CRUD routes use reflected metadata (`get_table`) to target the selected entity table.
6. Report routes execute SQL text queries and return JSON rows.
7. Backend can also serve `frontend/dist` for a single-service deployment.

## 4) Repository Structure

```text
.
|-- backend/
|   |-- app/
|   |   |-- main.py        # FastAPI routes (auth, CRUD, reports, SPA fallback)
|   |   |-- auth.py        # JWT auth + role dependencies
|   |   |-- database.py    # SQLAlchemy engine/session/metadata reflection
|   |   |-- config.py      # Environment loading and settings
|   |-- tests/
|   |   |-- test_routes.py
|   |   |-- runtime_smoke.py
|   |-- schema.sql         # Canonical DB schema (tables, FKs, checks, triggers, indexes)
|   |-- requirements.txt
|-- frontend/
|   |-- src/
|   |   |-- pages/         # Login, home, CRUD studio, reports, pulse dashboards
|   |   |-- lib/api.ts     # HTTP helper + auth token wiring
|   |   |-- config/        # Entity/report metadata used by UI
|   |-- package.json
|   |-- vite.config.ts
|-- docs/
|   |-- API.md             # Full API reference
|-- seed.sql               # Optional sample data
|-- render.yaml            # Render deployment config
|-- explainer.md           # Deep technical explainer
|-- epxlainer.md           # Compatibility filename alias
```

## 5) Database Snapshot

The schema defines 10 transactional tables:
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

Important DBMS rules implemented in SQL:
- Foreign keys with explicit `ON DELETE`/`ON UPDATE` behavior.
- Check constraints (e.g., rent >= 0, valid apartment bedroom counts).
- Triggers enforcing room residency exclusivity (a room belongs to exactly one of hall/apartment).
- Indexes on report-heavy/filter-heavy columns.

See full deep-dive in `explainer.md`.

## 6) Local Setup

### Prerequisites
- Python 3.11+ (3.14 works in this repository)
- Node.js 18+ and npm
- MySQL 8+ running and reachable

### Linux/macOS

```bash
# 1) Create DB + schema (from repo root)
mysql -u <mysql_user> -p -e "CREATE DATABASE IF NOT EXISTS <db_name>;"
mysql -u <mysql_user> -p <db_name> < backend/schema.sql

# Optional: sample data
mysql -u <mysql_user> -p <db_name> < seed.sql

# 2) Configure backend env
cp backend/.env.example backend/.env
# Edit backend/.env values

# 3) Backend venv
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt

# 4) Frontend deps
cd frontend
npm install
cd ..
```

Run in two terminals:

```bash
# Terminal A: backend
source .venv/bin/activate
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```

```bash
# Terminal B: frontend
cd frontend
npm run dev
```

Open `http://localhost:5173`.

### Windows (CMD/PowerShell)

```cmd
REM 1) Create DB + schema
mysql -u <mysql_user> -p -e "CREATE DATABASE IF NOT EXISTS <db_name>;"
mysql -u <mysql_user> -p <db_name> < backend\schema.sql

REM Optional: sample data
mysql -u <mysql_user> -p <db_name> < seed.sql

REM 2) Configure backend env
copy backend\.env.example backend\.env
REM Edit backend\.env values

REM 3) Backend venv
python -m venv .venv
.venv\Scripts\activate
pip install -r backend\requirements.txt

REM 4) Frontend deps
cd frontend
npm install
cd ..
```

Run in two terminals:

```cmd
REM Terminal A: backend
.venv\Scripts\activate
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```

```cmd
REM Terminal B: frontend
cd frontend
npm run dev
```

## 7) Environment Variables

Main backend env file: `backend/.env`

Required:
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

Optional:
- `DB_TLS_MODE` (`false`, `preferred`, `skip-verify`)
- `DB_CA_CERT_PATH`
- `PORT` (default `8000`)
- `AUTH_SECRET_KEY`
- `AUTH_TOKEN_EXPIRE_MINUTES`

## 8) Demo Login Accounts

- `admin` / `Admin@123`
- `manager` / `Manager@123`
- `viewer` / `Viewer@123`

## 9) Testing

```bash
# Route-level tests
source .venv/bin/activate
PYTHONPATH=backend python -m pytest backend/tests -q

# Live runtime smoke tests (backend must already be running)
source .venv/bin/activate
python backend/tests/runtime_smoke.py
```

## 10) Documentation

- Full API reference: `docs/API.md`
- Deep architecture + DBMS explainer: `explainer.md`
- Compatibility alias: `epxlainer.md`

## 11) Deployment (Summary)

This repo already includes `render.yaml` for deploying the FastAPI service on Render free tier.

For a complete free-tier frontend/backend/database split deployment plan (Vercel/Netlify + Render/Railway + Aiven/TiDB), see section 5 in `explainer.md`.

## 12) Troubleshooting

### Error: "Can't connect to MySQL server on 'your-mysql-host'"
Your `backend/.env` still has placeholder values. Replace host/user/db with real values and restart Uvicorn.

### Error: table not available in metadata
Schema has not been applied to the DB in `DB_NAME`. Re-run:

```bash
mysql -u <mysql_user> -p <db_name> < backend/schema.sql
```

### 401 on `/api/*`
You are missing/using an invalid JWT token. Login via `/auth/login` and pass `Authorization: Bearer <token>`.
