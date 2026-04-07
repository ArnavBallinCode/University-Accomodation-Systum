# 15-Minute Demo Simulation (View-Based Reports a-n)

This script is designed for a live professor/demo panel where you must prove:

1. All required queries (a) to (n) are supported.
2. Reports are view-based in MySQL (not only hardcoded in frontend/backend).
3. You understand how the entire system works end-to-end.

Use this exactly as a runbook.

---

## 1) Demo Objective (What you are proving)

By the end of the demo, you must have shown:

- Functional correctness: all requirements (a) to (n) are demonstrable.
- DBMS correctness: SQL views exist and back the report layer.
- System understanding: UI -> API -> SQL view -> base tables -> response.
- Role/auth awareness: secured API with JWT and role-based access.

If the examiner asks: "How do we know this is view-based?"

- Show `backend/schema.sql` view definitions.
- Show `backend/app/main.py` report routes selecting from `v_*` views.
- Run same query in MySQL Workbench and compare with app output.

---

## 2) Pre-Demo Checklist (Do this 10 minutes before)

### 2.1 Start services

From repository root:

```bash
source .venv/bin/activate
uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```

In a second terminal:

```bash
cd frontend
npm run dev
```

Open frontend at:

- `http://localhost:5173`

### 2.2 Quick health check

```bash
curl -sS http://127.0.0.1:8000/health
```

Expected:

- `{"status":"ok","service":"uni-accom-api-python"}`

### 2.3 Demo login accounts

- `admin / Admin@123`
- `manager / Manager@123`
- `viewer / Viewer@123`

Use `admin` for the live demo.

---

## 3) Make sure reports are non-empty (recommended)

Some reports can validly return empty arrays if data is missing (for example summer leases, unpaid invoices, unsatisfactory inspections, senior staff). To keep your demo strong, run this once in MySQL Workbench before presenting.

```sql
USE uni_accom_python;

-- Make summer lease visible for report (c)
UPDATE leases
SET includes_summer_semester = TRUE
WHERE lease_id = 1;

-- Ensure adviser details are visible for report (k)
UPDATE students
SET advisor_staff_id = 2
WHERE banner_id = 'B00123456';

UPDATE staff
SET internal_phone = 'EXT-2202', dob = '1960-02-14'
WHERE staff_id = 2;

-- Ensure senior staff report (n) has rows
UPDATE staff
SET dob = '1958-03-10'
WHERE staff_id = 1;

-- Add one paid invoice for report (d) total rent paid > 0
INSERT INTO invoices (lease_id, semester, amount_due, due_date, date_paid, payment_method)
SELECT 1, 'DEMO_PAID_2026_S1', 1200.00, '2026-01-15', '2026-01-10', 'Card'
WHERE NOT EXISTS (
    SELECT 1 FROM invoices
    WHERE lease_id = 1 AND semester = 'DEMO_PAID_2026_S1'
);

-- Add one unpaid invoice for report (e)
INSERT INTO invoices (lease_id, semester, amount_due, due_date)
SELECT 1, 'DEMO_UNPAID_2026_S2', 1400.00, '2026-02-15'
WHERE NOT EXISTS (
    SELECT 1 FROM invoices
    WHERE lease_id = 1 AND semester = 'DEMO_UNPAID_2026_S2'
);

-- Add one unsatisfactory inspection for report (f)
INSERT INTO inspections (apartment_id, staff_id, inspection_date, is_satisfactory, comments)
SELECT 1, 2, CURDATE(), FALSE, 'DEMO: damp wall in bedroom'
WHERE NOT EXISTS (
    SELECT 1 FROM inspections
    WHERE apartment_id = 1
      AND comments = 'DEMO: damp wall in bedroom'
);

-- Optional: add next-of-kin for one student so report (j) becomes more meaningful
INSERT INTO next_of_kin (banner_id, name, relationship, street, city, postcode, phone)
SELECT 'B00123456', 'Alice Guardian', 'Mother', '12 Guardian St', 'London', 'SW1 1ZZ', '07123456789'
WHERE NOT EXISTS (
    SELECT 1 FROM next_of_kin WHERE banner_id = 'B00123456'
);
```

---

## 4) 15-Minute Timeline Script (What to do and what to say)

## Minute 0:00 - 1:00 | Opening

Action:

- Open frontend login page.
- Login as `admin`.

Say:

- "This is a full-stack accommodation management system built on a normalized MySQL schema, FastAPI backend, and React frontend."
- "Today I will prove all required reports (a) to (n), and also prove they are backed by SQL views in the DB."

## Minute 1:00 - 3:00 | Architecture explanation (important)

Action:

- Show short architecture in words (or a slide/whiteboard).

Say:

- "Flow is: UI triggers report -> backend route authorizes and executes SQL -> SQL reads from a dedicated view -> view derives from transactional tables."
- "So business/report logic lives in DB views, while backend handles auth, parameters, and serialization."
- "This separation is the key DBMS design choice we are demonstrating."

Mention concretely:

- `backend/schema.sql` defines `v_*` views.
- `backend/app/main.py` report routes use `SELECT ... FROM v_*`.

## Minute 3:00 - 4:30 | Proof that views exist in MySQL

Action in MySQL Workbench:

```sql
USE uni_accom_python;
SHOW FULL TABLES WHERE TABLE_TYPE = 'VIEW';
SHOW CREATE VIEW v_student_leases;
```

Say:

- "These are physical SQL view objects in MySQL, not frontend-only transformations."
- "The backend simply consumes these views via API routes."

## Minute 4:30 - 11:30 | Run all required reports (a) to (n)

Open the Reports page and execute each report in order.
Use these demo parameters:

- `banner_id = B00123456`
- `hall_id = 1`
- `due_before = 2026-12-31`

For each report, you must say three things:

1. Requirement statement.
2. View used.
3. Why this query is correct (join/filter/aggregate logic).

### (a) Hall Managers

- Route: `/api/reports/hall-managers`
- View: `v_hall_managers`
- Explain: joins `halls` and `staff` to provide manager name + phone per hall.

### (b) Student Leases

- Route: `/api/reports/student-leases`
- View: `v_student_leases`
- Explain: joins `students`, `leases`, `rooms`, and residence info for full lease context.

### (c) Summer Leases

- Route: `/api/reports/summer-leases`
- View: `v_summer_leases`
- Explain: filtered subset where `includes_summer_semester = TRUE`.

### (d) Total Rent Paid by Student

- Route: `/api/reports/student-rent-paid/B00123456`
- View: `v_student_rent_paid`
- Explain: aggregation over paid invoices grouped by student.

### (e) Unpaid Invoices by Date

- Route: `/api/reports/unpaid-invoices?due_before=2026-12-31`
- View: `v_unpaid_invoices`
- Explain: unpaid invoices (`date_paid IS NULL`) filtered by due date parameter.

### (f) Unsatisfactory Inspections

- Route: `/api/reports/unsatisfactory-inspections`
- View: `v_unsatisfactory_inspections`
- Explain: filter on `is_satisfactory = FALSE` with inspector and apartment details.

### (g) Students with room/place in a hall

- Route: `/api/reports/hall-student-rooms/1`
- View: `v_hall_student_rooms`
- Explain: joins leases + rooms + hall, filtered by hall ID.

### (h) Waiting List

- Route: `/api/reports/waiting-list`
- View: `v_waiting_list`
- Explain: students where status is `Waiting`.

### (i) Total students per category

- Route: `/api/reports/student-category-counts`
- View: `v_student_category_counts`
- Explain: grouped count by `category`.

### (j) Students without next-of-kin

- Route: `/api/reports/students-without-kin`
- View: `v_students_without_kin`
- Explain: left join anti-match (`next_of_kin` missing).

### (k) Adviser details for a student

- Route: `/api/reports/student-adviser/B00123456`
- View: `v_student_advisers`
- Explain: student left join adviser staff details.

### (l) Min/Max/Avg hall rent

- Route: `/api/reports/rent-stats`
- View: `v_hall_rent_stats`
- Explain: aggregate stats computed over hall rooms.

### (m) Total places per hall

- Route: `/api/reports/hall-place-counts`
- View: `v_hall_place_counts`
- Explain: group by hall and count places.

### (n) Staff older than 60

- Route: `/api/reports/senior-staff`
- View: `v_senior_staff`
- Explain: age computed with `TIMESTAMPDIFF(YEAR, dob, CURDATE()) > 60`.

## Minute 11:30 - 13:00 | Prove API-level correctness quickly

Run this from terminal while screen-sharing:

```bash
BASE="http://127.0.0.1:8000"
TOKEN=$(curl -sS -X POST "$BASE/auth/login" -H "Content-Type: application/json" -d '{"username":"admin","password":"Admin@123"}' | sed -E 's/.*"access_token"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/')

for ep in \
  "/api/reports/hall-managers" \
  "/api/reports/student-leases" \
  "/api/reports/summer-leases" \
  "/api/reports/student-rent-paid/B00123456" \
  "/api/reports/unpaid-invoices?due_before=2026-12-31" \
  "/api/reports/unsatisfactory-inspections" \
  "/api/reports/hall-student-rooms/1" \
  "/api/reports/waiting-list" \
  "/api/reports/student-category-counts" \
  "/api/reports/students-without-kin" \
  "/api/reports/student-adviser/B00123456" \
  "/api/reports/rent-stats" \
  "/api/reports/hall-place-counts" \
  "/api/reports/senior-staff"

do
  code=$(curl -sS -o /tmp/report_out.json -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE$ep")
  bytes=$(wc -c < /tmp/report_out.json | tr -d ' ')
  echo "$code $bytes $ep"
done
```

Say:

- "This confirms each required report endpoint is reachable and responding."
- "Frontend is not faking data; API and DB layer are live."

## Minute 13:00 - 14:00 | Show route-to-view mapping in code

Open `backend/app/main.py` and show one route, for example report (e):

- `SELECT ... FROM v_unpaid_invoices WHERE due_date <= :due_before`

Say:

- "Each endpoint is directly selecting from a named SQL view."
- "Parameter handling is done in backend, relational logic remains in DB view definitions."

## Minute 14:00 - 15:00 | Closing summary

Say:

- "All required report queries (a) through (n) are implemented and demonstrated."
- "Implementation is view-based, secured via JWT roles, and exposed through FastAPI endpoints plus UI."
- "The same report logic is reproducible in MySQL Workbench and in the application, proving DBMS integration."

---

## 5) Workbench Queries for all requirements (a-n)

```sql
-- (a)
SELECT * FROM v_hall_managers ORDER BY hall_id;

-- (b)
SELECT * FROM v_student_leases ORDER BY banner_id, lease_id;

-- (c)
SELECT * FROM v_summer_leases ORDER BY lease_id;

-- (d)
SELECT * FROM v_student_rent_paid WHERE banner_id = 'B00123456';

-- (e)
SELECT * FROM v_unpaid_invoices WHERE due_date <= '2026-12-31' ORDER BY invoice_id;

-- (f)
SELECT * FROM v_unsatisfactory_inspections ORDER BY inspection_date DESC;

-- (g)
SELECT * FROM v_hall_student_rooms WHERE hall_id = 1 ORDER BY banner_id;

-- (h)
SELECT * FROM v_waiting_list ORDER BY banner_id;

-- (i)
SELECT * FROM v_student_category_counts ORDER BY category;

-- (j)
SELECT * FROM v_students_without_kin ORDER BY banner_id;

-- (k)
SELECT * FROM v_student_advisers WHERE banner_id = 'B00123456';

-- (l)
SELECT * FROM v_hall_rent_stats;

-- (m)
SELECT * FROM v_hall_place_counts ORDER BY hall_id;

-- (n)
SELECT * FROM v_senior_staff ORDER BY age DESC, staff_id;
```

---

## 6) Key explanation lines to memorize (high scoring)

Use these exact concepts while speaking:

- "Views act as the report abstraction layer in the DB."
- "Backend routes are thin: auth + parameter validation + view query execution."
- "This avoids duplicating heavy joins in frontend or business layer."
- "Each requirement maps to one view and one endpoint, making behavior auditable."
- "If underlying table data changes, view outputs update automatically and reports reflect it immediately."

---

## 7) If something goes wrong during demo

### Issue: report returns empty array

- Reason: no matching data, not necessarily an error.
- Action: run section 3 SQL booster and re-run report.

### Issue: 401 Unauthorized

- Action: login again and refresh token.

### Issue: 404 for parameterized report

- Action: check banner ID/hall ID exists in database.

### Issue: backend not reachable

- Action: verify Uvicorn terminal is runni	ng and `/health` works.

---

## 8) Final quick checklist before entering demo room

- Backend health endpoint returns `ok`.
- Frontend opens and login works.
- Views visible in Workbench.
- At least one meaningful row appears for each major report family:
  - occupancy (b, g, h)
  - finance (d, e, l)
  - compliance/admin (f, i, j, k, m, n)
- You can explain one full flow: `UI click -> API route -> SQL view -> base tables`.

You are now ready for a complete 15-minute simulation with both implementation proof and deep explanation.
