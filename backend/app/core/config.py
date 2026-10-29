from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "PlantCare AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    UPLOADS_DIR: Path = BASE_DIR / "uploads"
    REPORTS_DIR: Path = BASE_DIR / "uploads" / "reports"
    MODEL_PATH: Path = BASE_DIR.parent / "ml" / "models" / "plantcare_mobilenetv3.pth"
    
    DATABASE_URL: str = f"sqlite+aiosqlite:///{BASE_DIR}/plantcare.db"
    
    # Model & Inference Settings
    CONFIDENCE_THRESHOLD: float = 0.40  # Below this, flag as uncertain
    BLUR_THRESHOLD: float = 40.0         # Laplacian variance below this is blurry
    MIN_IMAGE_DIM: int = 100            # Minimum width/height in px
    MAX_FILE_SIZE_MB: int = 15          # Max upload size
    
    # External API Keys (Optional with fallbacks)
    OPENWEATHER_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    
    # Security & CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
settings.UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
settings.REPORTS_DIR.mkdir(parents=True, exist_ok=True)
