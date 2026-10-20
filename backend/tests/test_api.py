from fastapi.testclient import TestClient
from app.main import app,FEATURES

client=TestClient(app)

def test_health():
    r=client.get("/health");assert r.status_code==200;assert r.json()["rows"]==3531

def test_metadata():
    r=client.get("/metadata");assert r.status_code==200;assert len(r.json()["feature_order"])==10
    assert "NOT a physiological stress diagnosis" in r.json()["limitations"]

def test_records():
    r=client.get("/records",params={"split":"test", "line":3,"limit":2})
    assert r.status_code==200;assert r.json()["total"]==353;assert len(r.json()["items"])==2

def test_validation():
    r=client.post("/predict/features",json={"values":{"soil_humidity":20}})
    assert r.status_code==422

def test_saved_outputs():
    r=client.get("/test/predictions",params={"limit":2});assert r.status_code==200
    assert r.json()["total"]==706


def test_model_load_and_real_inference():
    r=client.get('/health')
    assert r.status_code==200 and r.json()['predictor_loaded'] is True
    p=client.get('/predict/record',params={'line':1,'timestamp':'2023-08-30T06:00:00+00:00','split':'test'})
    assert p.status_code==200, p.text
    data=p.json()
    assert data['observed_treatment_class']==0
    assert data['inference']['predicted_class']==0
    assert 0 <= data['inference']['probability_30percent_line'] <= 1

def test_cors_local_frontend():
    r=client.options('/health',headers={'Origin':'http://localhost:5173','Access-Control-Request-Method':'GET'})
    assert r.status_code==200
    assert r.headers['access-control-allow-origin']=='http://localhost:5173'
