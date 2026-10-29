import os
import uuid
import json
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.database.session import get_db
from app.database.models import Scan
from app.ml.model_loader import run_inference
from app.schemas.schemas import AnalysisResponse, PredictionItem, VisualExplanation, QualityAssessment, DiseaseDetail, ReferenceItem

router = APIRouter()

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/jpg"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_plant_image(
    file: UploadFile = File(...),
    plant_id: str = Form(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Validate uploaded image, run real PyTorch MobileNetV3 inference,
    generate Grad-CAM attention heatmap, store scan record, and return diagnosis.
    """
    # 1. Content Type / Extension validation
    ext = Path(file.filename or "leaf.jpg").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS or file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{file.content_type}'. Please upload a JPG, JPEG, or PNG image."
        )
        
    image_bytes = await file.read()
    file_size_mb = len(image_bytes) / (1024 * 1024)
    if file_size_mb > settings.MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB."
        )
        
    if len(image_bytes) < 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty or corrupted."
        )
        
    # 2. Save original file safely with UUID
    scan_id = str(uuid.uuid4())
    filename = f"{scan_id}{ext}"
    filepath = settings.UPLOADS_DIR / filename
    with open(filepath, "wb") as f:
        f.write(image_bytes)
        
    # 3. Perform real AI model inference + Grad-CAM
    try:
        inference_result = run_inference(image_bytes)
    except Exception as e:
        # Clean up file on failure
        if filepath.exists():
            filepath.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI model inference failed: {str(e)}"
        )
        
    primary = inference_result["primary_prediction"]
    vis = inference_result["visual_explanation"]
    det = inference_result["disease_details"]
    
    # 4. Save heatmap image to disk if available
    heatmap_filename = f"{scan_id}_heatmap.jpg"
    heatmap_url = f"/uploads/{heatmap_filename}"
    
    # 5. Persist record in database
    db_scan = Scan(
        id=scan_id,
        plant_id=plant_id if plant_id and plant_id.strip() else None,
        image_filename=filename,
        heatmap_filename=heatmap_filename,
        predicted_class=primary["raw_label"],
        crop=primary["crop"],
        disease=primary["disease"],
        is_healthy=primary["is_healthy"],
        confidence=primary["confidence"],
        alternatives_json=json.dumps(inference_result["alternative_predictions"]),
        symptoms_json=json.dumps(det.get("symptoms", [])),
        severity_pct=vis["estimated_affected_area_pct"],
        is_uncertain=inference_result["is_uncertain"],
        uncertainty_reasons_json=json.dumps(inference_result["uncertainty_reasons"]),
        model_version=inference_result["model_version"]
    )
    db.add(db_scan)
    await db.commit()
    await db.refresh(db_scan)
    
    return AnalysisResponse(
        status="success",
        scan_id=scan_id,
        image_url=f"/uploads/{filename}",
        primary_prediction=PredictionItem(**primary),
        alternative_predictions=[PredictionItem(**p) for p in inference_result["alternative_predictions"]],
        is_uncertain=inference_result["is_uncertain"],
        uncertainty_reasons=inference_result["uncertainty_reasons"],
        entropy=inference_result["entropy"],
        quality=QualityAssessment(**inference_result["quality"]),
        visual_explanation=VisualExplanation(**vis),
        disease_details=DiseaseDetail(
            raw_label=det["raw_label"],
            crop=det["crop"],
            disease=det["disease"],
            scientific_name=det.get("scientific_name"),
            is_healthy=det["is_healthy"],
            severity_level=det["severity_level"],
            description=det["description"],
            symptoms=det["symptoms"],
            causes=det["causes"],
            prevention=det["prevention"],
            management=det["management"],
            references=[ReferenceItem(**r) for r in det.get("references", [])]
        ),
        model_version=inference_result["model_version"]
    )
