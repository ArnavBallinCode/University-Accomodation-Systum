# Backend (Python)

This backend uses FastAPI + SQLAlchemy + MySQL.

## Setup

1. Create virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Configure environment variables:

```bash
cp .env.example .env
```

4. Apply schema:

```bash
mysql -u <user> -p <db_name> < schema.sql
```

5. Run server:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Run tests

```bash
pytest -q
```
