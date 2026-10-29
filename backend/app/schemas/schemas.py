from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

class PredictionItem(BaseModel):
    class_idx: int
    raw_label: str
    crop: str
    disease: str
    display_name: str
    is_healthy: bool
    confidence: float
    confidence_ratio: float

class VisualExplanation(BaseModel):
    heatmap_overlay_base64: str
    heatmap_mask_base64: str
    estimated_affected_area_pct: float
    interpretation: str

class QualityAssessment(BaseModel):
    width: int
    height: int
    blur_score: float
    brightness: float
    is_blurry: bool
    is_too_dark: bool
    is_too_bright: bool
    is_acceptable: bool
    quality_warnings: List[str] = []

class ReferenceItem(BaseModel):
    title: str
    url: str

class DiseaseDetail(BaseModel):
    raw_label: str
    crop: str
    disease: str
    scientific_name: Optional[str] = None
    is_healthy: bool
    severity_level: str
    description: str
    symptoms: List[str]
    causes: str
    prevention: List[str]
    management: List[str]
    references: List[ReferenceItem]

class AnalysisResponse(BaseModel):
    status: str
    scan_id: str
    image_url: str
    primary_prediction: PredictionItem
    alternative_predictions: List[PredictionItem]
    is_uncertain: bool
    uncertainty_reasons: List[str]
    entropy: float
    quality: QualityAssessment
    visual_explanation: VisualExplanation
    disease_details: DiseaseDetail
    model_version: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ScanListItem(BaseModel):
    id: str
    image_url: str
    heatmap_url: Optional[str] = None
    crop: str
    disease: str
    is_healthy: bool
    confidence: float
    severity_pct: Optional[float] = None
    is_uncertain: bool
    created_at: datetime

    class Config:
        from_attributes = True

class PlantCreate(BaseModel):
    name: str
    crop_species: str
    variety: Optional[str] = None
    field_identifier: Optional[str] = None
    notes: Optional[str] = None

class PlantResponse(BaseModel):
    id: str
    name: str
    crop_species: str
    variety: Optional[str] = None
    field_identifier: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    scans_count: int = 0
    scans: List[ScanListItem] = []

    class Config:
        from_attributes = True

class FarmFieldCreate(BaseModel):
    name: str
    crop_type: str
    area_hectares: float = 1.0
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    notes: Optional[str] = None

class FarmFieldResponse(BaseModel):
    id: str
    name: str
    crop_type: str
    area_hectares: float
    latitude: Optional[float]
    longitude: Optional[float]
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class DiseaseRiskFactor(BaseModel):
    disease: str
    crop: str
    risk_level: str  # "Low", "Moderate", "High", "Critical"
    contributing_factors: List[str]
    recommendation: str

class WeatherRiskResponse(BaseModel):
    location: str
    crop: str
    temperature_c: float
    humidity_pct: float
    rainfall_mm: float
    condition: str
    source: str
    disease_risks: List[DiseaseRiskFactor]
    summary_guidance: str

class ChatMessage(BaseModel):
    role: str # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    current_scan_id: Optional[str] = None
    history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    reply: str
    source_type: str  # "gemini_generative", "openai_generative", or "botanical_knowledge_engine"
    relevant_references: List[ReferenceItem] = []

class FeedbackCreate(BaseModel):
    scan_id: Optional[str] = None
    category: str
    description: str
    rating: int = 5
    contact_email: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_version: str
    supported_classes_count: int
    database_connected: bool
    storage_writable: bool
