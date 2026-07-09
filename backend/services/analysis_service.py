"""
analysis_service.py
Orquesta el proceso completo: extrae texto del PDF, llama a Gemini y guarda en DB.
"""
import json
from sqlalchemy.orm import Session
from models.db_models import AnalysisModel
from models.schemas import AnalysisResult, AnalysisResponse, HistoryItem
from services.pdf_service import extract_text_from_pdf
from services.gemini_service import analyze_cv_with_gemini
from typing import List


def run_full_analysis(
    file_bytes: bytes,
    filename: str,
    job_description: str,
    db: Session
) -> AnalysisResponse:
    """
    Proceso completo de análisis:
    1. Extrae texto del PDF
    2. Analiza con Gemini
    3. Persiste en base de datos
    4. Retorna el resultado formateado
    """
    # Paso 1: Extraer texto del PDF
    cv_text = extract_text_from_pdf(file_bytes)
    
    # Paso 2: Analizar con Gemini
    result: AnalysisResult = analyze_cv_with_gemini(cv_text, job_description)
    
    # Paso 3: Persistir en base de datos
    db_record = AnalysisModel(
        cv_filename=filename,
        job_description=job_description,
        cv_text=cv_text,
        score=result.score,
        score_explanation=result.score_explanation,
        keywords_found=json.dumps(result.keywords_found),
        keywords_missing=json.dumps(result.keywords_missing),
        suggestions=json.dumps(result.suggestions),
        strengths=json.dumps(result.strengths),
        overall_assessment=result.overall_assessment,
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    # Paso 4: Retornar respuesta formateada
    return _model_to_response(db_record)


def get_analysis_history(db: Session, limit: int = 10) -> List[HistoryItem]:
    """Obtiene los últimos análisis del historial."""
    records = (
        db.query(AnalysisModel)
        .order_by(AnalysisModel.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        HistoryItem(
            id=r.id,
            cv_filename=r.cv_filename,
            score=r.score,
            overall_assessment=r.overall_assessment,
            created_at=r.created_at,
        )
        for r in records
    ]


def get_analysis_by_id(analysis_id: int, db: Session) -> AnalysisResponse | None:
    """Obtiene un análisis completo por su ID."""
    record = db.query(AnalysisModel).filter(AnalysisModel.id == analysis_id).first()
    if not record:
        return None
    return _model_to_response(record)


def _model_to_response(record: AnalysisModel) -> AnalysisResponse:
    """Convierte un registro de DB al schema de respuesta."""
    return AnalysisResponse(
        id=record.id,
        cv_filename=record.cv_filename,
        score=record.score,
        score_explanation=record.score_explanation,
        keywords_found=json.loads(record.keywords_found or "[]"),
        keywords_missing=json.loads(record.keywords_missing or "[]"),
        suggestions=json.loads(record.suggestions or "[]"),
        strengths=json.loads(record.strengths or "[]"),
        overall_assessment=record.overall_assessment or "",
        created_at=record.created_at,
    )
