from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.database.session import init_db
from app.ml.model_loader import initialize_model

from app.api.v1.analyze import router as analyze_router
from app.api.v1.diseases import router as diseases_router
from app.api.v1.scans import router as scans_router
from app.api.v1.plants import router as plants_router
from app.api.v1.weather import router as weather_router
from app.api.v1.chat import router as chat_router
from app.api.v1.farms import router as farms_router
from app.api.v1.feedback import router as feedback_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.health import router as health_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB and load PyTorch model into memory
    print("[PlantCare AI] Initializing database tables...")
    await init_db()
    print("[PlantCare AI] Loading PyTorch MobileNetV3 model...")
    initialize_model()
    print("[PlantCare AI] Backend engine initialized and ready.")
    yield
    # Shutdown
    print("[PlantCare AI] Shutting down backend engine.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Intelligent Plant Disease Detection & Agricultural Health Advisory Platform",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploads and Grad-CAM heatmaps
app.mount("/uploads", StaticFiles(directory=str(settings.UPLOADS_DIR)), name="uploads")

# Include API V1 Routers
app.include_router(health_router, prefix=settings.API_V1_STR, tags=["Health"])
app.include_router(analyze_router, prefix=settings.API_V1_STR, tags=["Disease Detection"])
app.include_router(diseases_router, prefix=settings.API_V1_STR, tags=["Disease Library"])
app.include_router(scans_router, prefix=settings.API_V1_STR, tags=["Scans & Reports"])
app.include_router(plants_router, prefix=settings.API_V1_STR, tags=["Plant Profiles"])
app.include_router(weather_router, prefix=settings.API_V1_STR, tags=["Weather & Risk"])
app.include_router(chat_router, prefix=settings.API_V1_STR, tags=["Chatbot Assistant"])
app.include_router(farms_router, prefix=settings.API_V1_STR, tags=["Farm Monitoring"])
app.include_router(dashboard_router, prefix=settings.API_V1_STR, tags=["Dashboard Analytics"])
app.include_router(feedback_router, prefix=settings.API_V1_STR, tags=["Feedback"])

@app.get("/")
def root():
    return {
        "project": "PlantCare AI API",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "status": "online"
    }
