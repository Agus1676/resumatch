from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from database import Base


class AnalysisModel(Base):
    """Modelo de base de datos para guardar cada análisis realizado."""
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    cv_filename = Column(String(255), nullable=False)
    job_description = Column(Text, nullable=False)
    cv_text = Column(Text, nullable=False)
    score = Column(Float, nullable=False)
    score_explanation = Column(Text)
    keywords_found = Column(Text)       # Se guarda como JSON string
    keywords_missing = Column(Text)     # Se guarda como JSON string
    suggestions = Column(Text)          # Se guarda como JSON string
    strengths = Column(Text)            # Se guarda como JSON string
    overall_assessment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
