"""
pdf_service.py
Extrae texto plano de un archivo PDF usando pypdf (100% Python, sin dependencias nativas).
"""
import io
from pypdf import PdfReader


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Recibe el contenido binario de un PDF y devuelve su texto extraído.
    
    Args:
        file_bytes: Contenido del PDF como bytes.
    
    Returns:
        Texto extraído del PDF como string limpio.
    
    Raises:
        ValueError: Si el PDF está vacío o no se puede leer.
    """
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        
        full_text = ""
        for page in reader.pages:
            full_text += page.extract_text() or ""
        
        # Limpiamos el texto de espacios extra
        cleaned_text = " ".join(full_text.split())
        
        if not cleaned_text.strip():
            raise ValueError(
                "El PDF no contiene texto legible. "
                "Asegurate de que no sea un PDF escaneado como imagen."
            )
        
        return cleaned_text

    except ValueError:
        raise
    except Exception as e:
        raise ValueError(f"No se pudo leer el PDF: {str(e)}")
