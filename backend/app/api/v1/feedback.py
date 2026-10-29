from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.database.models import Feedback
from app.schemas.schemas import FeedbackCreate

router = APIRouter()

@router.post("/feedback", status_code=status.HTTP_201_CREATED)
async def submit_feedback(fb_in: FeedbackCreate, db: AsyncSession = Depends(get_db)):
    """Submit user feedback or model diagnostic correction report."""
    fb = Feedback(
        scan_id=fb_in.scan_id,
        category=fb_in.category,
        description=fb_in.description,
        rating=fb_in.rating,
        contact_email=fb_in.contact_email
    )
    db.add(fb)
    await db.commit()
    return {"status": "success", "message": "Thank you for your feedback! It helps improve PlantCare AI."}
