import { useState } from "react";
import { UploadZone } from "../components/UploadZone";
import { analyzeCV, type AnalysisResponse } from "../services/api";
import { ScoreCard } from "../components/ScoreCard";
import { KeywordsPanel } from "../components/KeywordsPanel";
import { SuggestionsPanel } from "../components/SuggestionsPanel";
import { AnalysisLoader } from "../components/AnalysisLoader";
import { exportToPDF } from "../services/exportPDF";

export const Home = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeCV(file, jobDescription);
      setResult(data);
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: unknown) {
      let message = "Error al analizar el CV. Intentá de nuevo.";
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { detail?: string } }; message?: string };
        message = axiosErr.response?.data?.detail || axiosErr.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobDescription("");
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canAnalyze = file && jobDescription.trim().length > 20 && !loading;

  return (
    <>
      <div className="bg-layer" />
      <div className="bg-glow" />

      <div className="page">

        {/* Navbar */}
        <nav className="navbar">
          <button className="nav-logo" onClick={handleReset} title="Volver al inicio">
            <div className="nav-logo-mark">R</div>
            <span>Resu<strong>match</strong></span>
          </button>
          <span className="nav-badge">Gemini 2.5 Flash</span>
        </nav>

        {/* Hero */}
        <header className="hero">
          <div className="hero-label">
            <span className="hero-label-line" />
            Análisis inteligente de CVs
          </div>
          <h1 className="hero-title">
            Tu CV merece<br />el puesto <em>correcto.</em>
          </h1>
          <p className="hero-sub">
            Subí tu PDF y pegá la descripción del trabajo. La IA analiza la compatibilidad,
            detecta keywords faltantes y te da sugerencias concretas para mejorar.
          </p>
          <div className="hero-divider">
            <div className="hero-stat">
              <span className="hero-stat-val">Gemini 2.5</span>
              <span className="hero-stat-label">Modelo de IA</span>
            </div>
            <div className="hero-sep" />
            <div className="hero-stat">
              <span className="hero-stat-val">0–100</span>
              <span className="hero-stat-label">Score de match</span>
            </div>
            <div className="hero-sep" />
            <div className="hero-stat">
              <span className="hero-stat-val">&lt; 30s</span>
              <span className="hero-stat-label">Tiempo respuesta</span>
            </div>
          </div>
        </header>

        <div className="section-line" />

        {/* Form */}
        <div className="form-card">
          <div className="form-card-top">
            <div className="form-pane">
              <p className="pane-label">Tu CV en PDF</p>
              <UploadZone onFileSelect={setFile} selectedFile={file} />
            </div>
            <div className="form-pane">
              <p className="pane-label">Descripción del puesto</p>
              <textarea
                className="job-textarea"
                placeholder="Pegá acá el aviso completo: responsabilidades, tecnologías requeridas, años de experiencia..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={7}
              />
              <p className="char-count">{jobDescription.length} caracteres</p>
            </div>
          </div>

          <div className="form-card-bottom">
            <button
              className={`analyze-btn ${loading ? "loading" : ""}`}
              onClick={handleAnalyze}
              disabled={!canAnalyze}
            >
              {loading
                ? <><span className="spinner" /> Analizando...</>
                : "Analizar CV →"
              }
            </button>
            {!canAnalyze && !loading && (
              <span className="hint-text">
                {!file
                  ? "Primero subí tu CV en PDF"
                  : "Necesitamos la descripción del trabajo (mín. 20 chars)"
                }
              </span>
            )}
          </div>
        </div>

        {/* Loader animado */}
        {loading && <AnalysisLoader />}

        {error && (
          <div className="error-banner">
            <span className="error-icon">!</span>
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <section id="results" className="results-section">
            <div className="results-top">
              <h2 className="results-heading">Resultados del análisis</h2>
              <div className="results-top-actions">
                <span className="results-file-pill">{result.cv_filename}</span>
                <button className="export-btn" onClick={() => exportToPDF(result)}>
                  ↓ Exportar PDF
                </button>
              </div>
            </div>

            <ScoreCard score={result.score} explanation={result.score_explanation} />
            <KeywordsPanel found={result.keywords_found} missing={result.keywords_missing} />
            <SuggestionsPanel
              suggestions={result.suggestions}
              strengths={result.strengths}
              overall={result.overall_assessment}
            />

            <div className="reset-row">
              <button className="reset-btn" onClick={handleReset}>
                Analizar otro CV
              </button>
            </div>
          </section>
        )}

        <footer className="footer">
          <div className="footer-row">
            <strong>Resumatch</strong>
            <span>Python · FastAPI · Google Gemini · React · TypeScript</span>
          </div>
          <div className="footer-credit">
            Desarrollado por <span className="footer-author">Agustín Pollán</span>
          </div>
        </footer>

      </div>
    </>
  );
};
