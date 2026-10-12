from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)
def test_health():
    assert client.get("/api/health").json()["execution"] == "browser-worker"
def test_shared_curriculum():
    data=client.get("/api/v1/curriculum").json()
    assert len(data["levels"]) == 7
    assert data["available_lesson"]["id"] == "first-program"
    assert data["future_lessons"] == "coming-soon"
def test_no_server_code_execution():
    assert client.post("/api/execute", json={"code":"print(1)"}).status_code == 404
def test_future_features_honest():
    assert client.get("/api/v1/features").json()["server_execution"] is False
    assert client.post("/api/v1/tutor").status_code == 501
