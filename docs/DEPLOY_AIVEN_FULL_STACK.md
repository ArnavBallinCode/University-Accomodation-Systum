# Full Stack Deployment Guide (Aiven DB + Backend + Frontend)

This guide deploys all three parts:
- Database: Aiven MySQL
- Backend: Render or Railway (FastAPI)
- Frontend: Vercel or Netlify (Vite + React)

It is written for this repository and its current backend environment variable format.

## 1) First: Are your Railway DB logs actually broken?

The MySQL lines you shared are startup status and warnings, not a fatal crash:
- InnoDB initialization ended
- TLS channel enabled
- X Plugin ready
- mysqld ready for connections

The warning about self-signed CA is common for managed DBs using provider certificates.

If you can run a query and get rows, the DB is healthy.

## 2) Deploy the Database on Aiven

### 2.1 Create the service
1. Create a MySQL service in Aiven.
2. Create (or choose) a database name, for example: uni_accom_python.
3. Copy credentials:
- host
- port
- username
- password
- database name
4. Download Aiven CA certificate and save it as ca.pem.

### 2.2 Apply schema and seed from your local machine
From repository root:

mysql --host=<AIVEN_HOST> --port=<AIVEN_PORT> --user=<AIVEN_USER> --password='<AIVEN_PASSWORD>' --ssl-mode=REQUIRED <AIVEN_DB_NAME> < backend/schema.sql

mysql --host=<AIVEN_HOST> --port=<AIVEN_PORT> --user=<AIVEN_USER> --password='<AIVEN_PASSWORD>' --ssl-mode=REQUIRED <AIVEN_DB_NAME> < seed.sql

### 2.3 Verify table counts

mysql --host=<AIVEN_HOST> --port=<AIVEN_PORT> --user=<AIVEN_USER> --password='<AIVEN_PASSWORD>' --ssl-mode=REQUIRED <AIVEN_DB_NAME> -e "SHOW TABLES; SELECT 'staff' AS t, COUNT(*) AS c FROM staff UNION ALL SELECT 'students', COUNT(*) FROM students UNION ALL SELECT 'rooms', COUNT(*) FROM rooms;" -t

## 3) Deploy Backend (FastAPI)

You can use Render or Railway for backend hosting.

### 3.1 Render backend deployment
1. Create Web Service from this GitHub repo.
2. Build command:
- pip install -r backend/requirements.txt
3. Start command:
- python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT

Set environment variables in Render:
- DB_HOST=<AIVEN_HOST>
- DB_PORT=<AIVEN_PORT>
- DB_USER=<AIVEN_USER>
- DB_PASSWORD=<AIVEN_PASSWORD>
- DB_NAME=<AIVEN_DB_NAME>
- DB_TLS_MODE=preferred
- DB_CA_CERT_PATH=ca.pem
- PORT=8000
- AUTH_SECRET_KEY=<strong-random-secret>
- AUTH_TOKEN_EXPIRE_MINUTES=120

Notes:
- Put ca.pem in repository root if you use DB_CA_CERT_PATH=ca.pem.
- If CA verification causes startup failure and you need a temporary unblock, set DB_TLS_MODE=skip-verify.

### 3.2 Railway backend deployment
1. Create a new service from GitHub repo.
2. Build command:
- pip install -r backend/requirements.txt
3. Start command:
- python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT

Set the same DB_* variables listed above (pointing to Aiven DB).

### 3.3 Backend smoke test
Open these URLs:
- /health
- /docs

Then test login and data endpoint:
- POST /auth/login
- GET /api/students (with bearer token)

## 4) Deploy Frontend (Vite React)

### 4.1 Vercel
1. Import project from GitHub.
2. Set root directory to frontend.
3. Build command: npm run build
4. Output directory: dist
5. Environment variable:
- VITE_API_BASE_URL=https://<your-backend-domain>

Redeploy and test login + reports.

### 4.2 Netlify (alternative)
1. Base directory: frontend
2. Build command: npm run build
3. Publish directory: frontend/dist
4. Environment variable:
- VITE_API_BASE_URL=https://<your-backend-domain>

## 5) Final Production Checks

1. Backend health:
- GET /health returns status ok.
2. Auth flow:
- POST /auth/login returns access_token.
3. CRUD/report:
- GET /api/students
- GET /api/reports/hall-managers
4. Frontend:
- Login works
- Entity Studio loads records
- Reports render rows/charts

## 6) Environment Reference for this Repo

Current backend code expects these variable names:
- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME
- DB_TLS_MODE
- DB_CA_CERT_PATH
- PORT

Railway-specific MYSQL* names are useful for reference, but this backend reads DB_* values directly.

## 7) If You Stay on Railway DB Instead of Aiven

Railway DB can work fine. The startup logs shown earlier do not by themselves mean failure.

Only treat as failure if:
- backend cannot connect
- query execution fails
- or deployment health checks fail repeatedly

If needed, map Railway service vars to this app's DB_* vars in your backend host environment.
