from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
from app.database.session import get_db
from app.database.models import FarmField
from app.schemas.schemas import FarmFieldCreate, FarmFieldResponse

router = APIRouter()

@router.get("/farms", response_model=List[FarmFieldResponse])
async def list_farm_fields(db: AsyncSession = Depends(get_db)):
    """Retrieve registered farm fields and approximate monitoring locations."""
    result = await db.execute(select(FarmField).order_by(desc(FarmField.created_at)))
    fields = result.scalars().all()
    return fields

@router.post("/farms", response_model=FarmFieldResponse, status_code=status.HTTP_201_CREATED)
async def create_farm_field(field_in: FarmFieldCreate, db: AsyncSession = Depends(get_db)):
    """Create a new farm or plot field boundary."""
    field = FarmField(
        name=field_in.name,
        crop_type=field_in.crop_type,
        area_hectares=field_in.area_hectares,
        latitude=field_in.latitude,
        longitude=field_in.longitude,
        notes=field_in.notes
    )
    db.add(field)
    await db.commit()
    await db.refresh(field)
    return field
