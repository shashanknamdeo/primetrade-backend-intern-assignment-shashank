import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_register_and_login():
    # Register
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "password123", "full_name": "Test User"},
    )
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"
    
    # Login
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "test@example.com", "password": "password123"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_crud_tasks():
    # Register & Login
    client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "password123", "full_name": "Test User"},
    )
    login_response = client.post(
        "/api/v1/auth/login",
        data={"username": "test@example.com", "password": "password123"},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create
    response = client.post(
        "/api/v1/tasks/",
        json={"title": "Test Task", "description": "Test Desc"},
        headers=headers
    )
    assert response.status_code == 200
    task_id = response.json()["id"]
    
    # Read
    response = client.get("/api/v1/tasks/", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) == 1
    
    # Delete
    response = client.delete(f"/api/v1/tasks/{task_id}", headers=headers)
    assert response.status_code == 200
    
    # Verify deleted
    response = client.get("/api/v1/tasks/", headers=headers)
    assert len(response.json()) == 0
