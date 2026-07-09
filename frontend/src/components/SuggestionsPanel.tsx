import { useState } from "react";

interface SuggestionsPanelProps {
  suggestions: string[];
  strengths: string[];
  overall: string;
}

export const SuggestionsPanel = ({ suggestions, strengths, overall }: SuggestionsPanelProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="result-block">
      <div className="result-block-header">
        <span className="result-block-title">🎯 Análisis detallado</span>
      </div>
      <div className="block-body">

        {/* Overall */}
        <div className="overall-quote">{overall}</div>

        {/* Strengths */}
        <p className="sub-heading">💪 Fortalezas del candidato</p>
        <ul className="strengths-list">
          {strengths.map((s, i) => (
            <li key={i} className="strength-item">
              <span className="strength-icon">✓</span>
              {s}
            </li>
          ))}
        </ul>

        {/* Suggestions */}
        <div className="suggestions-header-row">
          <p className="sub-heading" style={{ margin: 0 }}>💡 Sugerencias para mejorar</p>
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? "✅ Copiado" : "📋 Copiar todo"}
          </button>
        </div>
        <ol className="suggestions-list">
          {suggestions.map((s, i) => (
            <li key={i} className="suggestion-item">
              <span className="suggestion-num">{String(i + 1).padStart(2, "0")}</span>
              {s}
            </li>
          ))}
        </ol>

      </div>
    </div>
  );
};
