import json
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.core.config import settings
from app.database.session import get_db
from app.database.models import Scan
from app.schemas.schemas import ScanListItem, AnalysisResponse, PredictionItem, VisualExplanation, QualityAssessment, DiseaseDetail, ReferenceItem
from app.ml.labels import get_disease_info
from app.services.report_service import generate_scan_pdf_report

router = APIRouter()

@router.get("/scans", response_model=list[ScanListItem])
async def list_scans(
    crop: str = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve history of saved plant health scans."""
    query = select(Scan).order_by(desc(Scan.created_at)).limit(limit)
    if crop:
        query = query.filter(Scan.crop.ilike(f"%{crop}%"))
        
    result = await db.execute(query)
    scans = result.scalars().all()
    
    return [
        ScanListItem(
            id=s.id,
            image_url=f"/uploads/{s.image_filename}",
            heatmap_url=f"/uploads/{s.heatmap_filename}" if s.heatmap_filename else None,
            crop=s.crop,
            disease=s.disease,
            is_healthy=s.is_healthy,
            confidence=s.confidence,
            severity_pct=s.severity_pct,
            is_uncertain=s.is_uncertain,
            created_at=s.created_at
        )
        for s in scans
    ]

@router.get("/scans/{scan_id}", response_model=AnalysisResponse)
async def get_scan_detail(scan_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve complete diagnosis record for a specific scan."""
    result = await db.execute(select(Scan).filter(Scan.id == scan_id))
    scan = result.scalar_one_or_none()
    
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan record not found."
        )
        
    alt_predictions = json.loads(scan.alternatives_json) if scan.alternatives_json else []
    uncertainty_reasons = json.loads(scan.uncertainty_reasons_json) if scan.uncertainty_reasons_json else []
    disease_info = get_disease_info(scan.predicted_class)
    
    return AnalysisResponse(
        status="success",
        scan_id=scan.id,
        image_url=f"/uploads/{scan.image_filename}",
        primary_prediction=PredictionItem(
            class_idx=0,
            raw_label=scan.predicted_class,
            crop=scan.crop,
            disease=scan.disease,
            display_name=f"{scan.crop} - {scan.disease}",
            is_healthy=scan.is_healthy,
            confidence=scan.confidence,
            confidence_ratio=scan.confidence / 100.0
        ),
        alternative_predictions=[PredictionItem(**p) for p in alt_predictions],
        is_uncertain=scan.is_uncertain,
        uncertainty_reasons=uncertainty_reasons,
        entropy=0.5,
        quality=QualityAssessment(
            width=500, height=500, blur_score=85.0, brightness=120.0,
            is_blurry=False, is_too_dark=False, is_too_bright=False, is_acceptable=True
        ),
        visual_explanation=VisualExplanation(
            heatmap_overlay_base64="",
            heatmap_mask_base64="",
            estimated_affected_area_pct=scan.severity_pct or 0.0,
            interpretation=f"Foliar symptom footprint estimated at {scan.severity_pct or 0:.1f}%."
        ),
        disease_details=DiseaseDetail(
            raw_label=disease_info["raw_label"],
            crop=disease_info["crop"],
            disease=disease_info["disease"],
            scientific_name=disease_info.get("scientific_name"),
            is_healthy=disease_info["is_healthy"],
            severity_level=disease_info["severity_level"],
            description=disease_info["description"],
            symptoms=disease_info["symptoms"],
            causes=disease_info["causes"],
            prevention=disease_info["prevention"],
            management=disease_info["management"],
            references=[ReferenceItem(**r) for r in disease_info.get("references", [])]
        ),
        model_version=scan.model_version or "MobileNetV3",
        timestamp=scan.created_at
    )

@router.delete("/scans/{scan_id}")
async def delete_scan(scan_id: str, db: AsyncSession = Depends(get_db)):
    """Permanently delete a scan and its associated image files."""
    result = await db.execute(select(Scan).filter(Scan.id == scan_id))
    scan = result.scalar_one_or_none()
    
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan record not found."
        )
        
    # Delete uploaded files
    img_path = settings.UPLOADS_DIR / scan.image_filename
    if img_path.exists():
        img_path.unlink()
        
    if scan.heatmap_filename:
        hm_path = settings.UPLOADS_DIR / scan.heatmap_filename
        if hm_path.exists():
            hm_path.unlink()
            
    await db.delete(scan)
    await db.commit()
    
    return {"status": "success", "message": f"Scan {scan_id} and stored files deleted."}

@router.get("/scans/{scan_id}/pdf")
async def download_scan_pdf(scan_id: str, db: AsyncSession = Depends(get_db)):
    """Generate and download official PDF health report for this scan."""
    result = await db.execute(select(Scan).filter(Scan.id == scan_id))
    scan = result.scalar_one_or_none()
    
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan record not found."
        )
        
    disease_info = get_disease_info(scan.predicted_class)
    uncertainty_reasons = json.loads(scan.uncertainty_reasons_json) if scan.uncertainty_reasons_json else []
    
    scan_dict = {
        "id": scan.id,
        "crop": scan.crop,
        "disease": scan.disease,
        "confidence": scan.confidence,
        "severity_pct": scan.severity_pct or 0.0,
        "is_uncertain": scan.is_uncertain,
        "uncertainty_reasons": uncertainty_reasons,
        "model_version": scan.model_version or "MobileNetV3",
        "symptoms": disease_info.get("symptoms", []),
        "management": disease_info.get("management", []),
        "prevention": disease_info.get("prevention", [])
    }
    
    pdf_filename = f"PlantCare_Report_{scan.id[:8]}.pdf"
    pdf_path = settings.REPORTS_DIR / pdf_filename
    generate_scan_pdf_report(scan_dict, pdf_path)
    
    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=pdf_filename
    )
