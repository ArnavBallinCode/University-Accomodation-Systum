# University Accommodation API

Go + Gin + MySQL REST API for the University Accommodation Office project.

## What This Service Provides

- Student listing and creation
- Operational reports for halls, leases, unpaid invoices, and rent stats
- MySQL connectivity for Aiven-hosted databases
- JSON responses for web and mobile frontends
- A simple health endpoint for deployment platforms

## Project Layout

```text
.
|-- api/
|-- config/
|-- models/
|-- repository/
|-- docs/
|-- main.go
|-- schema.sql
|-- render.yaml
```

## Local Setup

### Requirements

- Go 1.25+
- MySQL 8 compatible database
- Aiven CA certificate if TLS verification is enabled

### Environment Variables

Use [.env.example](.env.example) as the template for local configuration.

Required:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

Optional:

- `DB_TLS_MODE`
  - `preferred`: use system CA store, or `DB_CA_CERT_PATH` if provided
  - `skip-verify`: TLS enabled without certificate verification
  - `false`: no TLS
- `DB_CA_CERT_PATH`
- `GIN_MODE`
- `TRUSTED_PROXIES`
- `PORT`

### Start Locally

1. Create your database tables:

```sql
SOURCE schema.sql;
```

Or paste the contents of [schema.sql](schema.sql) into your SQL editor and run it.

2. Copy the env template and fill in real values:

```powershell
Copy-Item .env.example .env
```

3. Install dependencies:

```powershell
go mod tidy
```

4. Start the API:

```powershell
go run main.go
```

5. Verify:

- `GET http://localhost:8080/health`
- `GET http://localhost:8080/api/students`

## Frontend Handoff

The base URL is:

- local: `http://localhost:8080`
- deployed: `https://<your-render-service>.onrender.com`

All API responses are JSON.

Dates accepted by write endpoints use `YYYY-MM-DD`.

Current API surface is documented in [docs/API.md](docs/API.md).

## Common Responses

- `200 OK`: successful reads
- `201 Created`: successful student creation
- `400 Bad Request`: invalid payload or invalid referenced advisor
- `409 Conflict`: duplicate `banner_id`
- `500 Internal Server Error`: database or server-side failure

Error shape:

```json
{
  "error": "failed to load students"
}
```

## Deploy To Render

This repo includes [render.yaml](render.yaml) and the app supports Render's `PORT` environment variable.

### Option 1: Dashboard Deployment

1. Push this project to GitHub.
2. In Render, click `New` -> `Web Service`.
3. Connect the repository.
4. Use:
   - Runtime: `Go`
   - Build Command: `go build -tags netgo -ldflags '-s -w' -o app`
   - Start Command: `./app`
   - Health Check Path: `/health`
5. Add environment variables in Render:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `DB_TLS_MODE=preferred`
   - `DB_CA_CERT_PATH=ca.pem`
   - `GIN_MODE=release`
   - `TRUSTED_PROXIES=127.0.0.1,::1`
6. Commit `ca.pem` if you want the service to load the Aiven CA from the repo root.
7. Deploy.

### Option 2: Blueprint Deployment

1. Push the repo with [render.yaml](render.yaml).
2. In Render, create a Blueprint from the repository.
3. Render will prompt for the `sync: false` database variables.
4. Confirm the health check path and deploy.

### Notes For Render

- Render expects the service to bind the assigned port. This app reads `PORT` automatically and defaults to `8080` locally.
- If certificate verification fails on Render, confirm that `ca.pem` exists in the repo root and `DB_CA_CERT_PATH=ca.pem`.
- If you only need a temporary class-project deploy, `DB_TLS_MODE=skip-verify` can work, but it is less secure.

## Security Notes

- Do not commit a real `.env` file with live passwords.
- Rotate any credential that was shared in chat or pushed to a repository.
- Prefer `.env.example` for onboarding and Render environment variables for deployment secrets.
