import { useEffect, useState } from "react";

interface ScoreCardProps {
  score: number;
  explanation: string;
}

const getScoreStyle = (score: number) => {
  if (score >= 75) return {
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.25)",
    label: "Excelente match"
  };
  if (score >= 50) return {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
    label: "Match parcial"
  };
  return {
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.1)",
    border: "rgba(244,63,94,0.25)",
    label: "Bajo match"
  };
};

export const ScoreCard = ({ score, explanation }: ScoreCardProps) => {
  const { color, bg, border, label } = getScoreStyle(score);

  // Contador animado: arranca en 0 y llega al score final
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    setDisplayScore(0);
    const duration = 1400; // ms
    const steps = 60;
    const increment = score / steps;
    const interval = duration / steps;
    let current = 0;
    let count = 0;

    const timer = setInterval(() => {
      count++;
      current = Math.min(Math.round(increment * count), score);
      setDisplayScore(current);
      if (current >= score) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [score]);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="score-card">
      <div className="score-circle-wrapper">
        <svg className="score-svg" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="9" />
          <circle
            cx="65" cy="65" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 65 65)"
            style={{
              transition: "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)",
              filter: `drop-shadow(0 0 8px ${color}55)`,
            }}
          />
        </svg>
        <div className="score-text">
          <span className="score-number" style={{ color }}>{displayScore}</span>
          <span className="score-percent">%</span>
        </div>
      </div>

      <div className="score-info">
        <span
          className="score-badge"
          style={{ color, background: bg, borderColor: border }}
        >
          {label}
        </span>
        <p className="score-explanation">{explanation}</p>
      </div>
    </div>
  );
};
