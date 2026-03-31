from fastapi.testclient import TestClient

from app.main import app


EXPECTED_ENDPOINTS = [
    "/health",
    "/",
    "/api/reports/hall-managers",
    "/api/reports/student-leases",
    "/api/reports/summer-leases",
    "/api/reports/student-rent-paid/{banner_id}",
    "/api/reports/unpaid-invoices",
    "/api/reports/unsatisfactory-inspections",
    "/api/reports/hall-student-rooms/{hall_id}",
    "/api/reports/waiting-list",
    "/api/reports/student-category-counts",
    "/api/reports/students-without-kin",
    "/api/reports/student-adviser/{banner_id}",
    "/api/reports/rent-stats",
    "/api/reports/hall-place-counts",
    "/api/reports/senior-staff",
    "/api/{entity}",
    "/api/{entity}/{record_id}",
]


def test_route_registration() -> None:
    route_paths = {route.path for route in app.routes}

    for expected_path in EXPECTED_ENDPOINTS:
        assert expected_path in route_paths


def test_health_endpoint() -> None:
    client = TestClient(app)
    response = client.get("/health")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["service"] == "uni-accom-api-python"
