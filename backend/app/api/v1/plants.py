from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from typing import List
from app.database.session import get_db
from app.database.models import Plant, Scan
from app.schemas.schemas import PlantCreate, PlantResponse, ScanListItem

router = APIRouter()

@router.get("/plants", response_model=List[PlantResponse])
async def list_plants(db: AsyncSession = Depends(get_db)):
    """List tracked plant and crop profiles."""
    result = await db.execute(select(Plant).order_by(desc(Plant.created_at)))
    plants = result.scalars().all()
    
    responses = []
    for p in plants:
        # Load related scans
        scans_res = await db.execute(select(Scan).filter(Scan.plant_id == p.id).order_by(desc(Scan.created_at)))
        scans = scans_res.scalars().all()
        
        responses.append(
            PlantResponse(
                id=p.id,
                name=p.name,
                crop_species=p.crop_species,
                variety=p.variety,
                field_identifier=p.field_identifier,
                notes=p.notes,
                created_at=p.created_at,
                scans_count=len(scans),
                scans=[
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
            )
        )
    return responses

@router.post("/plants", response_model=PlantResponse, status_code=status.HTTP_201_CREATED)
async def create_plant(plant_in: PlantCreate, db: AsyncSession = Depends(get_db)):
    """Create a new plant profile to track health over time."""
    plant = Plant(
        name=plant_in.name,
        crop_species=plant_in.crop_species,
        variety=plant_in.variety,
        field_identifier=plant_in.field_identifier,
        notes=plant_in.notes
    )
    db.add(plant)
    await db.commit()
    await db.refresh(plant)
    
    return PlantResponse(
        id=plant.id,
        name=plant.name,
        crop_species=plant.crop_species,
        variety=plant.variety,
        field_identifier=plant.field_identifier,
        notes=plant.notes,
        created_at=plant.created_at,
        scans_count=0,
        scans=[]
    )

@router.get("/plants/{plant_id}", response_model=PlantResponse)
async def get_plant(plant_id: str, db: AsyncSession = Depends(get_db)):
    """Get plant profile with historical progression scans."""
    result = await db.execute(select(Plant).filter(Plant.id == plant_id))
    plant = result.scalar_one_or_none()
    
    if not plant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plant profile not found.")
        
    scans_res = await db.execute(select(Scan).filter(Scan.plant_id == plant.id).order_by(desc(Scan.created_at)))
    scans = scans_res.scalars().all()
    
    return PlantResponse(
        id=plant.id,
        name=plant.name,
        crop_species=plant.crop_species,
        variety=plant.variety,
        field_identifier=plant.field_identifier,
        notes=plant.notes,
        created_at=plant.created_at,
        scans_count=len(scans),
        scans=[
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
    )

@router.delete("/plants/{plant_id}")
async def delete_plant(plant_id: str, db: AsyncSession = Depends(get_db)):
    """Delete plant profile and dissociate scans."""
    result = await db.execute(select(Plant).filter(Plant.id == plant_id))
    plant = result.scalar_one_or_none()
    
    if not plant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plant profile not found.")
        
    await db.delete(plant)
    await db.commit()
    return {"status": "success", "message": f"Plant {plant_id} deleted."}
