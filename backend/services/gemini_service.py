"""
gemini_service.py
Comunicación con la API de Google Gemini para analizar CVs.
"""
import json
import re
from google import genai
from google.genai import types
from config import GEMINI_API_KEY
from models.schemas import AnalysisResult

# Inicializamos el cliente con la API key
client = genai.Client(api_key=GEMINI_API_KEY)

ANALYSIS_PROMPT = """
Sos un experto en recursos humanos y reclutamiento con más de 10 años de experiencia.
Tu tarea es analizar el siguiente CV en relación a la descripción del trabajo proporcionada.

═══ CV DEL CANDIDATO ═══
{cv_text}

═══ DESCRIPCIÓN DEL TRABAJO ═══
{job_description}

Analizá en profundidad y respondé ÚNICAMENTE con un objeto JSON válido (sin markdown, sin explicaciones extra, solo el JSON):

{{
  "score": <número entero del 0 al 100 que indica la compatibilidad del CV con el puesto>,
  "score_explanation": "<explicación concisa del score en 1-2 oraciones>",
  "keywords_found": ["<keyword técnica o habilidad del job description que SÍ aparece en el CV>", ...],
  "keywords_missing": ["<keyword técnica o habilidad del job description que NO aparece en el CV>", ...],
  "suggestions": [
    "<sugerencia concreta y accionable #1 para mejorar el CV>",
    "<sugerencia concreta y accionable #2>",
    "<sugerencia concreta y accionable #3>",
    "<sugerencia concreta y accionable #4>",
    "<sugerencia concreta y accionable #5>"
  ],
  "strengths": [
    "<fortaleza principal del candidato #1>",
    "<fortaleza principal del candidato #2>",
    "<fortaleza principal del candidato #3>"
  ],
  "overall_assessment": "<evaluación general del candidato en 2-3 oraciones>"
}}

IMPORTANTE: El JSON debe ser válido. Usá comillas dobles para strings. No incluyas ningún texto fuera del JSON.
"""


def analyze_cv_with_gemini(cv_text: str, job_description: str) -> AnalysisResult:
    """
    Envía el texto del CV y la descripción del trabajo a Gemini y devuelve el análisis.

    Args:
        cv_text: Texto extraído del CV.
        job_description: Descripción del puesto de trabajo.

    Returns:
        AnalysisResult con el análisis completo.

    Raises:
        ValueError: Si Gemini devuelve una respuesta que no se puede parsear.
        Exception: Si hay un error de conexión con la API.
    """
    prompt = ANALYSIS_PROMPT.format(
        cv_text=cv_text[:8000],
        job_description=job_description[:3000]
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(temperature=0.3)
    )

    raw_text = response.text.strip()

    # Extraemos el JSON aunque Gemini agregue markdown (```json ... ```)
    json_match = re.search(r'\{.*\}', raw_text, re.DOTALL)
    if not json_match:
        raise ValueError(f"Gemini no devolvió un JSON válido. Respuesta: {raw_text[:200]}")

    try:
        data = json.loads(json_match.group())
    except json.JSONDecodeError as e:
        raise ValueError(f"Error al parsear el JSON de Gemini: {str(e)}")

    return AnalysisResult(
        score=float(data.get("score", 0)),
        score_explanation=data.get("score_explanation", ""),
        keywords_found=data.get("keywords_found", []),
        keywords_missing=data.get("keywords_missing", []),
        suggestions=data.get("suggestions", []),
        strengths=data.get("strengths", []),
        overall_assessment=data.get("overall_assessment", "")
    )

