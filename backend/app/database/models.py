import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=True, default="Farmer / Grower")
    language = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    scans = relationship("Scan", back_populates="user", cascade="all, delete-orphan")
    plants = relationship("Plant", back_populates="user", cascade="all, delete-orphan")
    farms = relationship("FarmField", back_populates="user", cascade="all, delete-orphan")

class Plant(Base):
    __tablename__ = "plants"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    owner_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    name = Column(String(255), nullable=False)
    crop_species = Column(String(100), nullable=False)
    variety = Column(String(100), nullable=True)
    planting_date = Column(DateTime, nullable=True)
    field_identifier = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="plants")
    scans = relationship("Scan", back_populates="plant")

class Scan(Base):
    __tablename__ = "scans"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    owner_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    plant_id = Column(String(36), ForeignKey("plants.id"), nullable=True)
    
    image_filename = Column(String(255), nullable=False)
    heatmap_filename = Column(String(255), nullable=True)
    
    predicted_class = Column(String(100), nullable=False)
    crop = Column(String(100), nullable=False)
    disease = Column(String(100), nullable=False)
    is_healthy = Column(Boolean, default=False)
    confidence = Column(Float, nullable=False)
    
    alternatives_json = Column(Text, nullable=True)     # JSON string of top alternatives
    symptoms_json = Column(Text, nullable=True)         # JSON list of symptoms
    severity_pct = Column(Float, nullable=True)         # Grad-CAM affected area estimate
    
    is_uncertain = Column(Boolean, default=False)
    uncertainty_reasons_json = Column(Text, nullable=True)
    model_version = Column(String(100), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="scans")
    plant = relationship("Plant", back_populates="scans")

class FarmField(Base):
    __tablename__ = "farm_fields"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    owner_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    name = Column(String(255), nullable=False)
    crop_type = Column(String(100), nullable=False)
    area_hectares = Column(Float, default=1.0)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="farms")

class Feedback(Base):
    __tablename__ = "feedback"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    scan_id = Column(String(36), nullable=True)
    category = Column(String(100), nullable=False)  # accuracy, feature_request, bug, general
    description = Column(Text, nullable=False)
    rating = Column(Integer, default=5)
    contact_email = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
