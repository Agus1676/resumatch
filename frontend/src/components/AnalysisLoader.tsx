import { useEffect, useState } from "react";

const STEPS = [
  { id: 1, label: "Extrayendo texto del PDF", duration: 2000 },
  { id: 2, label: "Enviando a Gemini 2.5", duration: 3000 },
  { id: 3, label: "Analizando compatibilidad", duration: 5000 },
  { id: 4, label: "Generando sugerencias", duration: 4000 },
];

export const AnalysisLoader = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [dots, setDots] = useState(".");

  // Avanzar pasos progresivamente
  useEffect(() => {
    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    STEPS.forEach((step, i) => {
      const t = setTimeout(() => setActiveStep(i), elapsed);
      timers.push(t);
      elapsed += step.duration;
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  // Animación de puntos suspensivos
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loader-overlay">
      <div className="loader-card">
        <div className="loader-spinner-ring" />

        <div className="loader-steps">
          {STEPS.map((step, i) => {
            const isDone    = i < activeStep;
            const isCurrent = i === activeStep;
            return (
              <div
                key={step.id}
                className={`loader-step ${isDone ? "done" : ""} ${isCurrent ? "active" : ""}`}
              >
                <div className="loader-step-icon">
                  {isDone ? "✓" : isCurrent ? <span className="loader-pulse" /> : "·"}
                </div>
                <span className="loader-step-label">
                  {step.label}
                  {isCurrent && <span className="loader-dots">{dots}</span>}
                </span>
              </div>
            );
          })}
        </div>

        <p className="loader-note">Esto puede tardar hasta 30 segundos</p>
      </div>
    </div>
  );
};
