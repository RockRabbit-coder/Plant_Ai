import pytest
import io
from PIL import Image
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] in ("healthy", "degraded")
        assert data["model_loaded"] is True
        assert data["supported_classes_count"] == 38

@pytest.mark.asyncio
async def test_diseases_catalog():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # List all diseases
        response = await client.get("/api/v1/diseases")
        assert response.status_code == 200
        diseases = response.json()
        assert len(diseases) == 38
        
        # Filter by Tomato
        response = await client.get("/api/v1/diseases?crop=Tomato")
        assert response.status_code == 200
        tomato_diseases = response.json()
        assert len(tomato_diseases) > 0
        assert all("tomato" in d["crop"].lower() for d in tomato_diseases)
        
        # Get specific disease detail
        response = await client.get("/api/v1/diseases/Tomato___Early_blight")
        assert response.status_code == 200
        detail = response.json()
        assert detail["crop"] == "Tomato"
        assert "Early Blight" in detail["disease"]
        assert len(detail["symptoms"]) > 0
        assert len(detail["prevention"]) > 0

@pytest.mark.asyncio
async def test_weather_risk_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/weather-risk?location=Salinas%20Valley&crop=Tomato")
        assert response.status_code == 200
        data = response.json()
        assert "disease_risks" in data
        assert len(data["disease_risks"]) > 0

@pytest.mark.asyncio
async def test_chat_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/chat",
            json={"message": "What should I do about tomato early blight concentric rings?", "language": "en"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "reply" in data
        assert len(data["reply"]) > 20

@pytest.mark.asyncio
async def test_image_upload_and_inference():
    # Generate a dummy RGB test leaf image in memory
    img = Image.new("RGB", (256, 256), color=(34, 139, 34))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    image_bytes = buf.getvalue()
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/analyze",
            files={"file": ("test_leaf.jpg", image_bytes, "image/jpeg")}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "scan_id" in data
        assert "primary_prediction" in data
        assert data["primary_prediction"]["crop"] is not None
        assert "visual_explanation" in data
        assert "estimated_affected_area_pct" in data["visual_explanation"]

@pytest.mark.asyncio
async def test_invalid_upload_rejection():
    # Attempt uploading an unsupported text file
    fake_file = b"This is a text file, not a plant leaf."
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/analyze",
            files={"file": ("notes.txt", fake_file, "text/plain")}
        )
        assert response.status_code == 400

@pytest.mark.asyncio
async def test_dashboard_stats():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/dashboard/stats")
        assert response.status_code == 200
        data = response.json()
        assert "summary" in data
        assert "crop_distribution" in data
        assert "activity_timeline" in data
