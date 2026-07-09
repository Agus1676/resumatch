import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cv_analyzer.db")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY no está configurada en el archivo .env")
