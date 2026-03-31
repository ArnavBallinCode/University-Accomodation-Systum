import json
import urllib.error
import urllib.request

BASE = "http://127.0.0.1:8000"
AUTH_HEADERS: dict[str, str] = {}


results = []


def check(name, method, path, expected=(200,), **kwargs):
    headers = {**AUTH_HEADERS, **(kwargs.get("headers", {}) or {})}
    json_payload = kwargs.get("json")
    body = None

    if json_payload is not None:
        body = json.dumps(json_payload).encode("utf-8")
        headers = {**headers, "Content-Type": "application/json"}

    request = urllib.request.Request(
        url=BASE + path,
        data=body,
        headers=headers,
        method=method,
    )

    response_text = ""
    response_status = None
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            response_status = response.status
            response_text = response.read().decode("utf-8")
    except urllib.error.HTTPError as error:
        response_status = error.code
        response_text = error.read().decode("utf-8", errors="replace")

    ok = response_status in expected
    row = {
        "name": name,
        "status": response_status,
        "ok": ok,
    }
    if not ok:
        try:
            row["body"] = json.loads(response_text)
        except Exception:
            row["body"] = response_text[:300]
    results.append(row)
    if not ok:
        raise RuntimeError(f"{name} failed: {response_status} {row.get('body')}")

    class ResponseLike:
        def __init__(self, status: int, text: str):
            self.status_code = status
            self._text = text

        def json(self):
            if not self._text:
                return {}
            return json.loads(self._text)

    return ResponseLike(response_status, response_text)


def main() -> None:
    check("health", "GET", "/health")
    check("root", "GET", "/")

    login_response = check(
        "auth login",
        "POST",
        "/auth/login",
        json={"username": "admin", "password": "Admin@123"},
    )
    access_token = login_response.json()["access_token"]

    global AUTH_HEADERS
    AUTH_HEADERS = {"Authorization": f"Bearer {access_token}"}

    check("auth me", "GET", "/auth/me")

    entities = [
        "staff",
        "courses",
        "students",
        "halls",
        "apartments",
        "rooms",
        "leases",
        "invoices",
        "next-of-kin",
        "inspections",
    ]
    for entity in entities:
        check(f"list {entity}", "GET", f"/api/{entity}")

    check("get staff 1", "GET", "/api/staff/1")
    check("get course CSE-Y1", "GET", "/api/courses/CSE-Y1")
    check("get student B001", "GET", "/api/students/B001")
    check("get hall 1", "GET", "/api/halls/1")
    check("get apartment 1", "GET", "/api/apartments/1")
    check("get room 1001", "GET", "/api/rooms/1001")
    check("get lease 1", "GET", "/api/leases/1")
    check("get invoice 1", "GET", "/api/invoices/1")
    check("get next-of-kin 1", "GET", "/api/next-of-kin/1")
    check("get inspection 1", "GET", "/api/inspections/1")

    report_paths = [
        "/api/reports/hall-managers",
        "/api/reports/student-leases",
        "/api/reports/summer-leases",
        "/api/reports/student-rent-paid/B001",
        "/api/reports/unpaid-invoices?due_before=2026-12-31",
        "/api/reports/unsatisfactory-inspections",
        "/api/reports/hall-student-rooms/1",
        "/api/reports/waiting-list",
        "/api/reports/student-category-counts",
        "/api/reports/students-without-kin",
        "/api/reports/student-adviser/B001",
        "/api/reports/rent-stats",
        "/api/reports/hall-place-counts",
        "/api/reports/senior-staff",
    ]
    for path in report_paths:
        check(f"report {path}", "GET", path)

    temp_suffix = "TMPPY"

    staff_payload = {
        "first_name": "Temp",
        "last_name": "Staff",
        "email": "temp.staff.pypy@uni.edu",
        "position": "Administrative Assistant",
        "location": "Residence Office",
    }
    staff_resp = check("create staff", "POST", "/api/staff", expected=(200,), json=staff_payload)
    staff_id = staff_resp.json()["staff_id"]
    check("update staff", "PUT", f"/api/staff/{staff_id}", expected=(200,), json={**staff_payload, "position": "Cleaner"})

    course_payload = {
        "course_number": f"CSE-{temp_suffix}",
        "course_title": "Temporary Course",
        "instructor_name": "Temp Instructor",
        "department_name": "Computer Science",
    }
    check("create course", "POST", "/api/courses", expected=(200,), json=course_payload)
    check(
        "update course",
        "PUT",
        f"/api/courses/{course_payload['course_number']}",
        expected=(200,),
        json={
            "course_title": "Temporary Course Updated",
            "instructor_name": "Temp Instructor",
            "department_name": "Computer Science",
        },
    )

    hall_payload = {
        "hall_name": f"Temp Hall {temp_suffix}",
        "street": "Temp Street",
        "city": "Bhubaneswar",
        "postcode": "751099",
        "telephone": "0674-2222",
        "manager_staff_id": 1,
    }
    hall_resp = check("create hall", "POST", "/api/halls", expected=(200,), json=hall_payload)
    hall_id = hall_resp.json()["hall_id"]
    check("update hall", "PUT", f"/api/halls/{hall_id}", expected=(200,), json={**hall_payload, "telephone": "0674-2223"})

    apartment_payload = {
        "street": "Temp Apartment Street",
        "city": "Bhubaneswar",
        "postcode": "751098",
        "number_of_bedrooms": 3,
    }
    apartment_resp = check("create apartment", "POST", "/api/apartments", expected=(200,), json=apartment_payload)
    apartment_id = apartment_resp.json()["apartment_id"]
    check("update apartment", "PUT", f"/api/apartments/{apartment_id}", expected=(200,), json={**apartment_payload, "city": "Cuttack"})

    room_payload = {
        "place_number": 909001,
        "room_number": "T-909",
        "monthly_rent": 7000,
        "hall_id": hall_id,
        "apartment_id": None,
    }
    check("create room", "POST", "/api/rooms", expected=(200,), json=room_payload)
    check("update room", "PUT", "/api/rooms/909001", expected=(200,), json={**room_payload, "monthly_rent": 7100})

    student_payload = {
        "banner_id": f"B{temp_suffix}",
        "first_name": "Temp",
        "last_name": "Student",
        "street": "Temp Home",
        "city": "Bhubaneswar",
        "postcode": "751097",
        "dob": "2004-02-11",
        "gender": "Male",
        "category": "Undergraduate",
        "nationality": "Indian",
        "status": "Waiting",
        "major": "Computer Science",
        "course_number": "CSE-Y1",
        "advisor_staff_id": 2,
    }
    check("create student", "POST", "/api/students", expected=(200,), json=student_payload)
    check("update student", "PUT", f"/api/students/{student_payload['banner_id']}", expected=(200,), json={**student_payload, "status": "Placed"})

    lease_payload = {
        "banner_id": student_payload["banner_id"],
        "place_number": 909001,
        "duration_semesters": "Semester 1",
        "includes_summer_semester": False,
        "date_enter": "2026-01-10",
        "date_leave": "2026-05-30",
    }
    lease_resp = check("create lease", "POST", "/api/leases", expected=(200,), json=lease_payload)
    lease_id = lease_resp.json()["lease_id"]
    check("update lease", "PUT", f"/api/leases/{lease_id}", expected=(200,), json={**lease_payload, "includes_summer_semester": True})

    invoice_payload = {
        "lease_id": lease_id,
        "semester": "Semester 1",
        "amount_due": 15000,
        "due_date": "2026-01-20",
        "payment_method": "UPI",
    }
    invoice_resp = check("create invoice", "POST", "/api/invoices", expected=(200,), json=invoice_payload)
    invoice_id = invoice_resp.json()["invoice_id"]
    check("update invoice", "PUT", f"/api/invoices/{invoice_id}", expected=(200,), json={**invoice_payload, "amount_due": 15100})

    kin_payload = {
        "banner_id": student_payload["banner_id"],
        "name": "Temp Guardian",
        "relationship": "Mother",
        "street": "Guardian St",
        "city": "Bhubaneswar",
        "postcode": "751096",
        "phone": "9000000000",
    }
    kin_resp = check("create kin", "POST", "/api/next-of-kin", expected=(200,), json=kin_payload)
    kin_id = kin_resp.json()["kin_id"]
    check("update kin", "PUT", f"/api/next-of-kin/{kin_id}", expected=(200,), json={**kin_payload, "phone": "9000000001"})

    inspection_payload = {
        "apartment_id": apartment_id,
        "staff_id": 1,
        "inspection_date": "2026-04-01",
        "is_satisfactory": True,
        "comments": "Temp inspection",
    }
    inspection_resp = check("create inspection", "POST", "/api/inspections", expected=(200,), json=inspection_payload)
    inspection_id = inspection_resp.json()["inspection_id"]
    check("update inspection", "PUT", f"/api/inspections/{inspection_id}", expected=(200,), json={**inspection_payload, "is_satisfactory": False})

    check("delete invoice", "DELETE", f"/api/invoices/{invoice_id}", expected=(204,))
    check("delete kin", "DELETE", f"/api/next-of-kin/{kin_id}", expected=(204,))
    check("delete lease", "DELETE", f"/api/leases/{lease_id}", expected=(204,))
    check("delete student", "DELETE", f"/api/students/{student_payload['banner_id']}", expected=(204,))
    check("delete inspection", "DELETE", f"/api/inspections/{inspection_id}", expected=(204,))
    check("delete room", "DELETE", "/api/rooms/909001", expected=(204,))
    check("delete hall", "DELETE", f"/api/halls/{hall_id}", expected=(204,))
    check("delete apartment", "DELETE", f"/api/apartments/{apartment_id}", expected=(204,))
    check("delete course", "DELETE", f"/api/courses/{course_payload['course_number']}", expected=(204,))
    check("delete staff", "DELETE", f"/api/staff/{staff_id}", expected=(204,))

    print("INTEGRATION_SMOKE_OK")
    print(json.dumps({"checks": len(results)}, indent=2))


if __name__ == "__main__":
    main()
