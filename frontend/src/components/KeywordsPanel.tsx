interface KeywordsPanelProps {
  found: string[];
  missing: string[];
}

export const KeywordsPanel = ({ found, missing }: KeywordsPanelProps) => (
  <div className="result-block">
    <div className="result-block-header">
      <span className="result-block-title">🔑 Keywords detectadas</span>
      <span className="result-block-meta">{found.length} encontradas · {missing.length} faltantes</span>
    </div>
    <div className="keywords-cols">
      <div className="keywords-col">
        <p className="kw-col-title found">✅ En tu CV</p>
        <div className="chips">
          {found.length === 0
            ? <span className="empty-note">Sin coincidencias.</span>
            : found.map((kw, i) => <span key={i} className="chip found">{kw}</span>)
          }
        </div>
      </div>
      <div className="keywords-col">
        <p className="kw-col-title missing">⚠️ Te faltan</p>
        <div className="chips">
          {missing.length === 0
            ? <span className="empty-note">¡Perfecto! No falta ninguna.</span>
            : missing.map((kw, i) => <span key={i} className="chip missing">{kw}</span>)
          }
        </div>
      </div>
    </div>
  </div>
);
