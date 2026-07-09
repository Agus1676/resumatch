"""
main.py — Punto de entrada de la aplicación FastAPI CV Analyzer.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import analysis

# Crea las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CV Analyzer API",
    description="API para analizar CVs con Inteligencia Artificial (Google Gemini)",
    version="1.0.0",
    docs_url="/docs",       # Swagger UI disponible en /docs
    redoc_url="/redoc",     # ReDoc disponible en /redoc
)

# Configuración de CORS para permitir peticiones desde cualquier frontend (Vercel, Local, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registramos las rutas
app.include_router(analysis.router, prefix="/api/analysis", tags=["Análisis"])


@app.get("/", tags=["Health"])
def root():
    """Health check del servidor."""
    return {
        "status": "ok",
        "message": "CV Analyzer API corriendo 🚀",
        "docs": "/docs"
    }
