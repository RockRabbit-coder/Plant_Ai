from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from collections import Counter
from datetime import datetime, timedelta
from app.database.session import get_db
from app.database.models import Scan, Plant

router = APIRouter()

@router.get("/dashboard/stats")
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    """Aggregate real database statistics for dashboard analytics and charts."""
    # 1. Total Scans
    scans_res = await db.execute(select(Scan).order_by(desc(Scan.created_at)))
    all_scans = scans_res.scalars().all()
    total_scans = len(all_scans)
    
    # 2. Total Plants
    plants_res = await db.execute(select(Plant))
    all_plants = plants_res.scalars().all()
    total_plants = len(all_plants)
    
    # 3. Healthy vs Diseased
    healthy_count = sum(1 for s in all_scans if s.is_healthy)
    diseased_count = total_scans - healthy_count
    healthy_ratio = round((healthy_count / total_scans * 100), 1) if total_scans > 0 else 100.0
    
    # 4. Crop Distribution
    crop_counts = Counter(s.crop for s in all_scans)
    crop_distribution = [{"name": crop, "scans": count} for crop, count in crop_counts.most_common(8)]
    
    # 5. Disease Distribution (excluding healthy)
    disease_counts = Counter(s.disease for s in all_scans if not s.is_healthy)
    disease_distribution = [{"name": dis, "count": count} for dis, count in disease_counts.most_common(8)]
    
    # 6. Scans over time (last 7 days grouped)
    today = datetime.utcnow().date()
    date_counts = {}
    for i in range(6, -1, -1):
        d_str = (today - timedelta(days=i)).strftime("%b %d")
        date_counts[d_str] = {"date": d_str, "scans": 0, "healthy": 0, "diseased": 0}
        
    for s in all_scans:
        s_date_str = s.created_at.date().strftime("%b %d")
        if s_date_str in date_counts:
            date_counts[s_date_str]["scans"] += 1
            if s.is_healthy:
                date_counts[s_date_str]["healthy"] += 1
            else:
                date_counts[s_date_str]["diseased"] += 1
                
    activity_timeline = list(date_counts.values())
    
    # 7. Recent Scans
    recent_scans = [
        {
            "id": s.id,
            "crop": s.crop,
            "disease": s.disease,
            "is_healthy": s.is_healthy,
            "confidence": s.confidence,
            "created_at": s.created_at.isoformat(),
            "image_url": f"/uploads/{s.image_filename}"
        }
        for s in all_scans[:5]
    ]
    
    return {
        "summary": {
            "total_scans": total_scans,
            "healthy_scans": healthy_count,
            "suspected_disease_scans": diseased_count,
            "healthy_ratio_pct": healthy_ratio,
            "total_plants_monitored": total_plants,
            "active_alerts_count": sum(1 for s in all_scans if not s.is_healthy and s.confidence > 70.0)
        },
        "crop_distribution": crop_distribution,
        "disease_distribution": disease_distribution,
        "activity_timeline": activity_timeline,
        "recent_scans": recent_scans
    }
