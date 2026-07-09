"""
routes/analysis.py
Endpoints para analizar CVs y recuperar análisis del historial.
"""
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.schemas import AnalysisResponse, HistoryItem
from services.analysis_service import run_full_analysis, get_analysis_history, get_analysis_by_id
from typing import List

router = APIRouter()

ALLOWED_CONTENT_TYPES = {"application/pdf"}
MAX_FILE_SIZE_MB = 10


@router.post("/analyze", response_model=AnalysisResponse, summary="Analizar un CV contra una descripción de trabajo")
async def analyze_cv(
    cv_file: UploadFile = File(..., description="Archivo PDF del CV"),
    job_description: str = Form(..., description="Descripción del puesto de trabajo"),
    db: Session = Depends(get_db)
):
    """
    Recibe un CV en PDF y una descripción de trabajo,
    analiza la compatibilidad con IA y devuelve el reporte completo.
    """
    # Validar tipo de archivo
    if cv_file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Solo se aceptan archivos PDF. Recibido: {cv_file.content_type}"
        )
    
    # Validar tamaño del archivo
    file_bytes = await cv_file.read()
    file_size_mb = len(file_bytes) / (1024 * 1024)
    if file_size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"El archivo es demasiado grande ({file_size_mb:.1f}MB). Máximo permitido: {MAX_FILE_SIZE_MB}MB"
        )
    
    # Validar que haya descripción del trabajo
    if not job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="La descripción del trabajo no puede estar vacía"
        )
    
    try:
        result = run_full_analysis(
            file_bytes=file_bytes,
            filename=cv_file.filename or "cv.pdf",
            job_description=job_description,
            db=db
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar el análisis: {str(e)}")


@router.get("/history", response_model=List[HistoryItem], summary="Obtener historial de análisis")
def get_history(limit: int = 10, db: Session = Depends(get_db)):
    """Retorna los últimos análisis realizados."""
    return get_analysis_history(db, limit=limit)


@router.get("/{analysis_id}", response_model=AnalysisResponse, summary="Obtener análisis por ID")
def get_analysis(analysis_id: int, db: Session = Depends(get_db)):
    """Retorna un análisis completo dado su ID."""
    result = get_analysis_by_id(analysis_id, db)
    if not result:
        raise HTTPException(status_code=404, detail=f"Análisis con ID {analysis_id} no encontrado")
    return result
