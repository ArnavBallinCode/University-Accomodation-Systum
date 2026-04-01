## Quick start (Linux/macOS)

All commands below assume you are in the project root directory. Use your terminal (bash/zsh/fish/etc).

### 1) Create and load database schema

```bash
# Create database (replace <mysql_user> and <db_name> as needed)
mysql -u <mysql_user> -p -e "CREATE DATABASE IF NOT EXISTS <db_name>;"
mysql -u <mysql_user> -p <db_name> < backend/schema.sql
```

### 2) Configure backend environment

```bash
cp .env.example backend/.env
```

Edit `backend/.env` with your MySQL credentials and settings.

### 3) Set up backend Python environment

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

### 4) Set up frontend dependencies

```bash
cd frontend
npm install
cd ..
```

### 5) Run in development mode (two terminals)

Open two terminals:

**Terminal A (backend):**

```bash
source .venv/bin/activate
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```

**Terminal B (frontend):**

```bash
cd frontend
npm run dev
```

Open: `http://localhost:5173` in your browser.

---
# University Accommodation Office Application

A full-stack DBMS course project built with MySQL + FastAPI + React.

This repository now uses a Python backend and a React TypeScript frontend.

## What this project includes

- A normalized relational schema for university accommodation workflows.
- CRUD APIs for 10 core modules.
- Assignment report endpoints `(a)` through `(n)`.
- Role-based authentication using JWT:
  - `admin`: read, create, update, delete
  - `manager`: read, create, update
  - `viewer`: read-only
- A modern frontend with animated pages, role-aware UI behavior, and light/dark mode.

## Tech stack

- Database: MySQL 8+
- Backend: FastAPI, SQLAlchemy, PyMySQL
- Auth: python-jose (JWT), passlib
- Frontend: React 18, TypeScript, Tailwind CSS, Framer Motion, Vite

## Repository layout

```text
.
|-- backend/
|   |-- app/
|   |-- tests/
|   |-- requirements.txt
|   |-- schema.sql
|-- frontend/
|   |-- src/
|   |-- package.json
|-- docs/
|   |-- API.md
|-- .env.example
|-- render.yaml
```

## Prerequisites

- Python 3.11+ (project currently works with 3.14 too)
- Node.js 18+ and npm
- MySQL server running and accessible

## Quick start (local)

---

## Quick start (Windows)

All commands below assume you are in the project root directory. Use Command Prompt (cmd.exe) or PowerShell as noted.

### 1) Create and load database schema

Open Command Prompt or PowerShell:

```cmd
REM Create database (replace <mysql_user> and <db_name> as needed)
mysql -u <mysql_user> -p -e "CREATE DATABASE IF NOT EXISTS <db_name>;"
mysql -u <mysql_user> -p <db_name> < backend\schema.sql
```

### 2) Configure backend environment

```cmd
REM Copy .env.example to backend/.env
copy .env.example backend\.env
```

Edit `backend/.env` with your MySQL credentials and settings.

### 3) Set up backend Python environment

```cmd
REM Create virtual environment
python -m venv .venv

REM Activate venv (Command Prompt)
.venv\Scripts\activate

REM Or activate venv (PowerShell)
.venv\Scripts\Activate.ps1

REM Install dependencies
pip install -r backend\requirements.txt
```

### 4) Set up frontend dependencies

```cmd
cd frontend
npm install
cd ..
```

### 5) Run in development mode (two terminals)

Open two terminals:

**Terminal A (backend):**

```cmd
.venv\Scripts\activate
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```

**Terminal B (frontend):**

```cmd
cd frontend
npm run dev
```

Open: `http://localhost:5173` in your browser.

---

### 1) Create and load database schema

```bash
# from repository root
mysql -u <mysql_user> -p -e "CREATE DATABASE IF NOT EXISTS <db_name>;"
mysql -u <mysql_user> -p <db_name> < backend/schema.sql
```

### 2) Configure backend environment

```bash
# from repository root
cp .env.example backend/.env
```

Edit `backend/.env` values:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_TLS_MODE` (usually `preferred` locally)
- `DB_CA_CERT_PATH` (optional)

### 3) Set up backend Python environment

```bash
# from repository root
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

### 4) Set up frontend dependencies

```bash
# from repository root
cd frontend
npm install
cd ..
```

### 5) Run in development mode (two terminals)

Terminal A (backend):

```bash
# from repository root
source .venv/bin/activate
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```

Terminal B (frontend):

```bash
# from repository root
cd frontend
npm run dev
```

Open: `http://localhost:5173`

Notes:

- Vite proxies `/api` and `/health` to backend `http://localhost:8000`.
- Backend auth routes are `/auth/login` and `/auth/me`.

## Login credentials (demo users)

Use one of the seeded users from the login page:

- `admin` / `Admin@123`
- `manager` / `Manager@123`
- `viewer` / `Viewer@123`

## Run as one service (production-like local run)

Build frontend, then let backend serve `frontend/dist`.

```bash
# from repository root
cd frontend
npm run build
cd ..
source .venv/bin/activate
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000
```

Open: `http://localhost:8000`

## Testing

Run backend tests:

```bash
# from repository root
source .venv/bin/activate
PYTHONPATH=backend python -m pytest backend/tests -q
```

Run runtime smoke checks (requires backend server already running on `:8000`):

```bash
# from repository root
source .venv/bin/activate
python backend/tests/runtime_smoke.py
```

## API reference

Detailed endpoint documentation:

- `docs/API.md`

## Deployment (Render)

This repo includes `render.yaml` configured for the Python backend.

Important deployment note:

- Backend serves static frontend from `frontend/dist`.
- Run `npm run build` in `frontend/` and commit updated `frontend/dist` before deploy.

Required env vars on Render:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

Optional env vars:

- `DB_TLS_MODE` (default `preferred`)
- `DB_CA_CERT_PATH` (default `ca.pem`)
- `PORT` (default `8000`)

## Additional docs

- Backend-only setup: `backend/README.md`
- Frontend-only setup: `frontend/README.md`
- Database and schema explainer: `explainer.md` (local reference)
