# Resumatch

A simple, fast ATS (Applicant Tracking System) resume analyzer. Upload a PDF resume, paste a job description, and get instant feedback on keyword matches, strengths, and actionable suggestions to improve your application.

This project was built to help job seekers optimize their resumes against specific job postings before applying.

---

## Features

- **PDF Parsing:** Extracts text from uploaded PDF resumes.
- **ATS Score Matching:** Calculates a match score (0-100%) based on job requirements.
- **Keyword Analysis:** Compares your resume against the job description to find matching and missing key terms.
- **Detailed Suggestions:** Actionable feedback on what to rewrite, add, or highlight.
- **PDF Report Export:** Download a clean, formatted PDF copy of the analysis report.
- **Analysis History:** Saves past analyses in a local SQLite database.

---

## Tech Stack

### Frontend
- **React 18** (Vite + TypeScript)
- **Vanilla CSS** (custom dark theme inspired by premium dashboard interfaces)
- **jsPDF** (client-side PDF generation)
- **Axios** (API requests)

### Backend
- **FastAPI** (Python 3.10+)
- **google-genai** (Google Gemini 2.5 Flash API)
- **SQLAlchemy** (SQLite database for storing history)
- **pypdf** (pure-python PDF reader)

---

## Setup & Running Locally

### 1. Prerequisites
- Python 3.10 or higher
- Node.js (v18+)
- A Gemini API Key (get one for free at Google AI Studio)

### 2. Backend Setup
Go to the `backend` folder:
```bash
cd backend
```

Create a virtual environment and install dependencies:
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./cv_analyzer.db
```

Start the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```
The backend API docs will be available at `http://localhost:8000/docs`.

### 3. Frontend Setup
Go to the `frontend` folder:
```bash
cd ../frontend
```

Install packages and start the dev server:
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Project Structure

```
cv-analyzer/
├── backend/
│   ├── models/          # DB Schemas (SQLAlchemy)
│   ├── routes/          # FastAPI router endpoints
│   ├── services/        # PDF extraction & Gemini integration
│   ├── main.py          # FastAPI application entrypoint
│   └── database.py      # SQLite connection setup
└── frontend/
    ├── src/
    │   ├── components/  # ScoreCard, UploadZone, Panels
    │   ├── pages/       # Home page layout
    │   ├── services/    # Axios API & PDF export logic
    │   └── index.css    # Global custom styling
    └── package.json
```

---

*Developed by Agustín Pollán.*
