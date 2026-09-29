import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "version" in data

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_list_models():
    response = client.get("/api/models")
    assert response.status_code == 200
    models = response.json()
    assert isinstance(models, list)
    assert len(models) >= 1

def test_compare_models():
    response = client.get("/api/models/compare")
    assert response.status_code == 200
    data = response.json()
    assert "models" in data
    assert "recommended_model" in data

def test_analytics_summary():
    response = client.get("/api/analytics/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_consumption_kwh" in data
    assert "peak_demand_kw" in data
    assert "submetering" in data

def test_alerts_list():
    response = client.get("/api/alerts")
    assert response.status_code == 200
    alerts = response.json()
    assert isinstance(alerts, list)

def test_quick_forecast():
    response = client.get("/api/forecast/quick?model=xgboost&horizon=12")
    assert response.status_code == 200
    data = response.json()
    assert data["horizon_hours"] == 12
    assert len(data["forecast_items"]) == 12
    assert "mean_forecast" in data
