# University Accommodation Office - End-to-End Project Explainer

This document explains the full Python implementation of the DBMS course project, from schema design to API behavior, frontend integration, testing, and Render deployment.

## 1) Project objective and scope

The system models a university accommodation office and supports:

- Master data management (staff, students, courses, halls, apartments, rooms)
- Transactional data (leases, invoices, inspections, next-of-kin)
- Operational reporting (assignment reports `(a)` through `(n)`)
- Full CRUD functionality through both API and UI

The implementation is designed so all business data is persisted in MySQL, with constraints enforced at the database level.

## 2) Repository structure

The application is split into dedicated folders:

```text
.
|-- frontend/
|   |-- index.html
|   |-- styles.css
|   |-- app.js
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

Why this structure:

- `frontend/` is self-contained for static assets.
- `backend/` is self-contained for Python runtime, dependency management, schema, and tests.
- `docs/` centralizes documentation artifacts and assignment PDFs.

## 3) Database model and integrity

Canonical schema file: `backend/schema.sql`.

Core relational entities include:

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

Integrity is enforced with:

- Foreign keys for relationships (student/adviser, lease/student, invoice/lease, etc.)
- Check constraints for allowed value domains
- Uniqueness and identity constraints
- Triggers to enforce room ownership rules (hall-or-apartment exclusivity)

Because these constraints live in MySQL, data quality remains consistent even if multiple clients consume the API.

## 4) Backend architecture (FastAPI + SQLAlchemy Core)

Primary backend files:

- `backend/app/config.py`: environment parsing and settings object
- `backend/app/database.py`: engine/session creation + table metadata reflection
- `backend/app/main.py`: route definitions, CRUD engine, report queries

### Request lifecycle

1. Request enters FastAPI route.
2. Route validates path/query/body input.
3. Generic CRUD or report SQL logic is selected.
4. SQLAlchemy executes against MySQL.
5. DB-level constraints run.
6. API maps result/errors to stable JSON responses.

### Generic CRUD strategy

The backend uses entity metadata maps for common operations:

- list records
- get by primary key
- create
- update
- delete

Benefits:

- Less repeated code across 10 entities
- Consistent behavior and status codes
- Easier maintenance when schema evolves

### Explicit report strategy

Reports are kept as explicit endpoints with focused SQL. This keeps assignment traceability clear and avoids hiding report logic behind generic abstractions.

## 5) Configuration and environment variables

Backend runtime variables:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_TLS_MODE`
- `DB_CA_CERT_PATH`

Behavior notes:

- Empty DB password is supported for local setups when intentionally configured.
- Missing critical DB settings return clear error details rather than opaque stack traces.
- TLS is configurable for cloud databases while still allowing local development.

## 6) API surface

### Health and app shell

- `GET /health`
- `GET /` (serves frontend dashboard)
- `GET /static/*` (serves static assets)

### CRUD API

Pattern:

- `GET /api/{entity}`
- `GET /api/{entity}/{id}`
- `POST /api/{entity}`
- `PUT /api/{entity}/{id}`
- `DELETE /api/{entity}/{id}`

Entities:

- `staff`
- `courses`
- `students`
- `halls`
- `apartments`
- `rooms`
- `leases`
- `invoices`
- `next-of-kin`
- `inspections`

### Report API `(a)` through `(n)`

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

Detailed endpoint examples and request/response formats are in `docs/API.md`.

## 7) Validation, coercion, and error mapping

Input handling:

- Empty optional strings are normalized to `NULL` when appropriate.
- Date fields are validated as `YYYY-MM-DD`.
- Numeric and boolean values are coerced to DB-compatible types.

Error handling is standardized:

- Duplicate key conflict -> HTTP `409`
- FK/check/trigger/data-validation issues -> HTTP `400`
- Missing record -> HTTP `404`
- Unexpected server/DB failures -> HTTP `500`

This gives the frontend predictable failure contracts.

## 8) Frontend architecture and behavior

Frontend files:

- `frontend/index.html`
- `frontend/styles.css`
- `frontend/app.js`

UI behavior:

- Dynamic CRUD forms generated from entity configuration
- Data grids with edit/delete flows
- Report cards mapped to all assignment reports
- Error toasts and status feedback for API operations

Frontend-backend integration:

- Default mode: backend serves frontend at `GET /`
- Split mode: frontend can be served independently while targeting backend on `http://localhost:8000`
- FastAPI error payloads (`detail`) are parsed and displayed cleanly in the UI

## 9) Local development and verification flow

### Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env
```

### Schema apply

```bash
mysql -u <user> -p <database_name> < schema.sql
```

### Start service

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Open application

- `http://localhost:8000`

### Automated checks

```bash
cd backend
pytest -q
python tests/runtime_smoke.py
```

`runtime_smoke.py` validates critical CRUD/report paths against a running backend.

## 10) Render deployment (Python)

Deployment blueprint file: `render.yaml`.

Current blueprint config:

- Service type: web
- Runtime: Python
- Build command: `pip install -r backend/requirements.txt`
- Start command: `python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT`
- Health check: `/health`

Environment variables expected in Render:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_TLS_MODE` (default `preferred`)
- `DB_CA_CERT_PATH` (default `ca.pem`)
- `PORT` (default `8000`)

Why this deployment command works:

- `--app-dir backend` ensures module import resolution for `app.main`.
- The backend serves the frontend shell, so a single web service is enough for full-stack hosting.
- Health endpoint is lightweight and suitable for Render readiness checks.

## 11) Documentation assets and submission materials

Documentation location: `docs/`.

Now included in `docs/`:

- `API.md`
- `DBMS Project.pdf`
- `University Accommodation Office Problem Statement.pdf`

This keeps assignment references and technical API documentation in one place.

## 12) Troubleshooting guide

If startup fails:

- Confirm `backend/.env` exists and has valid DB values.
- Verify MySQL database and tables were created from `backend/schema.sql`.
- Confirm backend dependency install completed (`pip install -r backend/requirements.txt`).

If DB connection fails in cloud:

- Check `DB_TLS_MODE` value and server SSL requirements.
- Ensure `DB_CA_CERT_PATH` points to a valid certificate path if required by the provider.

If frontend cannot reach backend:

- If serving frontend separately, confirm API base points to `http://localhost:8000` (or deployed backend URL).
- Check CORS and network/firewall rules in deployed environment.

## 13) Final outcome

The project now runs as a Python + MySQL full-stack application with:

- complete CRUD coverage,
- complete assignment report coverage `(a)` through `(n)`,
- organized frontend/backend structure,
- Render-ready deployment blueprint,
- consolidated documentation assets in `docs/`.
