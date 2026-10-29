from fastapi import APIRouter, Query, HTTPException, status
from typing import List, Optional
from app.ml.labels import PLANT_CLASSES, parse_class_name, get_disease_info, DISEASE_KNOWLEDGE_BASE
from app.schemas.schemas import DiseaseDetail, ReferenceItem

router = APIRouter()

@router.get("/diseases", response_model=List[dict])
async def list_diseases(
    crop: Optional[str] = Query(None, description="Filter by crop name (e.g. Tomato, Corn)"),
    healthy_only: Optional[bool] = Query(None, description="Filter by healthy status"),
    search: Optional[str] = Query(None, description="Search keyword across crop and disease names")
):
    """Retrieve full catalog of supported plant diseases and healthy crop categories."""
    results = []
    for raw_label in PLANT_CLASSES:
        parsed = parse_class_name(raw_label)
        info = get_disease_info(raw_label)
        
        # Crop filter
        if crop and crop.lower() not in parsed["crop"].lower():
            continue
            
        # Healthy filter
        if healthy_only is not None and parsed["is_healthy"] != healthy_only:
            continue
            
        # Search filter
        if search:
            s = search.lower()
            in_crop = s in parsed["crop"].lower()
            in_disease = s in parsed["disease"].lower()
            in_desc = s in info.get("description", "").lower()
            in_sym = any(s in sym.lower() for sym in info.get("symptoms", []))
            if not (in_crop or in_disease or in_desc or in_sym):
                continue
                
        results.append({
            "raw_label": raw_label,
            "crop": parsed["crop"],
            "disease": parsed["disease"],
            "display_name": parsed["display_name"],
            "scientific_name": info.get("scientific_name"),
            "is_healthy": parsed["is_healthy"],
            "severity_level": info.get("severity_level", "Moderate"),
            "description": info.get("description", ""),
            "symptoms_count": len(info.get("symptoms", [])),
            "symptoms_preview": info.get("symptoms", [])[:2]
        })
        
    return results

@router.get("/diseases/{raw_label:path}", response_model=DiseaseDetail)
async def get_disease_detail(raw_label: str):
    """Get full agricultural dossier for a specific disease or healthy class."""
    if raw_label not in PLANT_CLASSES:
        # Try finding a fuzzy or clean match
        matched = [c for c in PLANT_CLASSES if raw_label.lower() in c.lower()]
        if matched:
            raw_label = matched[0]
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Disease category '{raw_label}' not found in supported knowledge base."
            )
            
    info = get_disease_info(raw_label)
    return DiseaseDetail(
        raw_label=info["raw_label"],
        crop=info["crop"],
        disease=info["disease"],
        scientific_name=info.get("scientific_name"),
        is_healthy=info["is_healthy"],
        severity_level=info["severity_level"],
        description=info["description"],
        symptoms=info["symptoms"],
        causes=info["causes"],
        prevention=info["prevention"],
        management=info["management"],
        references=[ReferenceItem(**r) for r in info.get("references", [])]
    )
