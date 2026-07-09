# Resumatch

Un analizador de CVs simple y rápido enfocado en sistemas ATS (Applicant Tracking System). Subí tu CV en formato PDF, pegá la descripción del puesto y obtené feedback instantáneo sobre palabras clave (keywords), fortalezas y sugerencias específicas para mejorar tu postulación.

Este proyecto fue desarrollado para ayudar a postulantes a optimizar sus CVs frente a ofertas de trabajo específicas antes de enviar su postulación.

---

## Características principales

- **Lectura de PDF:** Extrae el texto del archivo PDF subido de forma automática.
- **Score de compatibilidad ATS:** Calcula un porcentaje de coincidencia (0-100%) basado en los requerimientos del puesto.
- **Análisis de palabras clave (Keywords):** Compara tu CV con la descripción del puesto para encontrar términos clave presentes y faltantes.
- **Sugerencias de mejora:** Feedback directo sobre qué modificar, agregar o destacar.
- **Exportación a PDF:** Descarga un reporte limpio y formateado con el análisis realizado.
- **Historial de análisis:** Guarda los análisis anteriores en una base de datos local SQLite.

---

## Tecnologías utilizadas

### Frontend
- **React 18** (Vite + TypeScript)
- **Vanilla CSS** (diseño oscuro premium personalizado)
- **jsPDF** (generación del reporte PDF del lado del cliente)
- **Axios** (peticiones HTTP)

### Backend
- **FastAPI** (Python 3.10+)
- **google-genai** (SDK oficial para integrar la API de Google Gemini 2.5 Flash)
- **SQLAlchemy** (base de datos SQLite para almacenar el historial)
- **pypdf** (librería para procesar archivos PDF)

---

## Configuración y ejecución en local

### 1. Requisitos previos
- Python 3.10 o superior
- Node.js (v18+)
- Una API Key de Gemini (se obtiene gratis en Google AI Studio)

### 2. Configurar el Backend
Ingresá a la carpeta `backend`:
```bash
cd backend
```

Creá un entorno virtual e instalá las dependencias:
```bash
python -m venv venv
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Creá un archivo `.env` en la carpeta `backend/`:
```env
GEMINI_API_KEY=tu_api_key_aqui
DATABASE_URL=sqlite:///./cv_analyzer.db
```

Iniciá el servidor de FastAPI:
```bash
uvicorn main:app --reload --port 8000
```
La documentación interactiva de la API estará disponible en `http://localhost:8000/docs`.

### 3. Configurar el Frontend
Ingresá a la carpeta `frontend`:
```bash
cd ../frontend
```

Instalá los paquetes e iniciá el servidor de desarrollo:
```bash
npm install
npm run dev
```
Abrí `http://localhost:5173` en tu navegador.

---

## Estructura del Proyecto

```
cv-analyzer/
├── backend/
│   ├── models/          # Modelos de base de datos (SQLAlchemy)
│   ├── routes/          # Endpoints de la API
│   ├── services/        # Extracción de PDF e integración con Gemini
│   ├── main.py          # Punto de entrada de FastAPI
│   └── database.py      # Configuración de SQLite
└── frontend/
    ├── src/
    │   ├── components/  # Componentes (ScoreCard, UploadZone, etc.)
    │   ├── pages/       # Layout de la vista principal
    │   ├── services/    # Conexión API y exportación a PDF
    │   └── index.css    # Estilos globales personalizados
    └── package.json
```

---

*Desarrollado por Agustín Pollán.*
