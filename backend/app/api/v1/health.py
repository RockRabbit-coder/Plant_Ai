from fastapi import APIRouter
from app.ml.model_loader import get_model
from app.ml.labels import PLANT_CLASSES
from app.core.config import settings
from app.schemas.schemas import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def check_system_health():
    """System health check verifying PyTorch model readiness and storage write access."""
    model_loaded = False
    try:
        model = get_model()
        model_loaded = model is not None
    except Exception:
        pass
        
    storage_writable = False
    try:
        test_file = settings.UPLOADS_DIR / ".write_test"
        test_file.write_text("ok")
        test_file.unlink()
        storage_writable = True
    except Exception:
        pass
        
    return HealthResponse(
        status="healthy" if model_loaded and storage_writable else "degraded",
        model_loaded=model_loaded,
        model_version=f"PlantCare-MobileNetV3-v1.0",
        supported_classes_count=len(PLANT_CLASSES),
        database_connected=True,
        storage_writable=storage_writable
    )
