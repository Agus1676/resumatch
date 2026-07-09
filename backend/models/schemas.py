from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# ── Request Schemas ──────────────────────────────────────────────────────────

class AnalysisRequest(BaseModel):
    """Schema para validar la petición de análisis (job description)."""
    job_description: str


# ── Response Schemas ─────────────────────────────────────────────────────────

class AnalysisResult(BaseModel):
    """Schema completo del resultado de análisis devuelto por Gemini."""
    score: float
    score_explanation: str
    keywords_found: List[str]
    keywords_missing: List[str]
    suggestions: List[str]
    strengths: List[str]
    overall_assessment: str


class AnalysisResponse(BaseModel):
    """Schema de respuesta completa del endpoint /analyze."""
    id: int
    cv_filename: str
    score: float
    score_explanation: str
    keywords_found: List[str]
    keywords_missing: List[str]
    suggestions: List[str]
    strengths: List[str]
    overall_assessment: str
    created_at: datetime

    class Config:
        from_attributes = True


class HistoryItem(BaseModel):
    """Schema simplificado para el historial de análisis."""
    id: int
    cv_filename: str
    score: float
    overall_assessment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
