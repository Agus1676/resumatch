import jsPDF from "jspdf";
import type { AnalysisResponse } from "../services/api";

/**
 * Genera y descarga un reporte PDF del análisis de CV.
 * Usa jsPDF para construir el PDF con texto nativo (escalable, liviano).
 */
export const exportToPDF = (result: AnalysisResponse): void => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  const colW = pageW - margin * 2;
  let y = 0;

  // ── Helpers ──────────────────────────────────────────────
  const addPage = () => {
    doc.addPage();
    y = margin;
  };

  const checkSpace = (needed: number) => {
    if (y + needed > 270) addPage();
  };

  const writeText = (
    text: string,
    x: number,
    fontSize: number,
    color: [number, number, number],
    style: "normal" | "bold" = "normal",
    maxWidth?: number
  ) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    doc.setFont("helvetica", style);
    if (maxWidth) {
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return lines.length * (fontSize * 0.4);
    } else {
      doc.text(text, x, y);
      return fontSize * 0.4;
    }
  };

  // ── HEADER ────────────────────────────────────────────────
  y = 0;
  // Gold header bar
  doc.setFillColor(232, 160, 32);
  doc.rect(0, 0, pageW, 18, "F");
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(6, 9, 15);
  doc.text("Resumatch — Reporte de Análisis de CV", margin, 12);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(6, 9, 15);
  doc.text(`Desarrollado por Agustín Pollán`, pageW - margin, 12, { align: "right" });

  y = 28;

  // ── FILE INFO ─────────────────────────────────────────────
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text(`Archivo: ${result.cv_filename}`, margin, y);
  const date = new Date(result.created_at).toLocaleString("es-AR");
  doc.text(`Fecha: ${date}`, pageW - margin, y, { align: "right" });
  y += 8;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageW - margin, y);
  y += 10;

  // ── SCORE ─────────────────────────────────────────────────
  checkSpace(30);
  const scoreLabel = result.score >= 75 ? "Excelente match" : result.score >= 50 ? "Match parcial" : "Bajo match";
  const scoreColor: [number, number, number] = result.score >= 75 ? [16, 185, 129] : result.score >= 50 ? [245, 158, 11] : [244, 63, 94];

  // Score circle (text-based)
  doc.setFillColor(...scoreColor);
  doc.circle(margin + 14, y + 10, 14, "F");
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(`${Math.round(result.score)}`, margin + 14, y + 12, { align: "center" });
  doc.setFontSize(7);
  doc.text("%", margin + 14, y + 17, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...scoreColor);
  doc.text(scoreLabel, margin + 34, y + 8);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  const explanationLines = doc.splitTextToSize(result.score_explanation, colW - 34);
  doc.text(explanationLines, margin + 34, y + 16);
  y += 30 + (explanationLines.length - 1) * 5;

  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageW - margin, y);
  y += 10;

  // ── EVALUACIÓN GENERAL ────────────────────────────────────
  checkSpace(20);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Evaluación General", margin, y);
  y += 6;

  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 116, 139);
  const overallLines = doc.splitTextToSize(`"${result.overall_assessment}"`, colW);
  checkSpace(overallLines.length * 5 + 4);
  doc.text(overallLines, margin, y);
  y += overallLines.length * 5 + 8;

  // ── FORTALEZAS ────────────────────────────────────────────
  checkSpace(20);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Fortalezas", margin, y);
  y += 6;

  result.strengths.forEach((s) => {
    checkSpace(10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.setFillColor(16, 185, 129);
    doc.circle(margin + 1.5, y - 1.5, 1.5, "F");
    const lines = doc.splitTextToSize(s, colW - 8);
    doc.text(lines, margin + 6, y);
    y += lines.length * 5 + 2;
  });
  y += 4;

  // ── KEYWORDS ENCONTRADAS ──────────────────────────────────
  checkSpace(20);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Keywords encontradas en tu CV", margin, y);
  y += 7;

  const foundChunks = result.keywords_found;
  let chipX = margin;
  foundChunks.forEach((kw) => {
    const w = doc.getStringUnitWidth(kw) * 10 * 0.35 + 8;
    if (chipX + w > pageW - margin) { chipX = margin; y += 8; }
    checkSpace(8);
    doc.setFillColor(16, 185, 129, 0.15);
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(chipX, y - 4, w, 6, 1.5, 1.5, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(21, 128, 61);
    doc.text(kw, chipX + 4, y);
    chipX += w + 4;
  });
  y += 12;

  // ── KEYWORDS FALTANTES ────────────────────────────────────
  checkSpace(20);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Keywords que te faltan agregar", margin, y);
  y += 7;

  chipX = margin;
  result.keywords_missing.forEach((kw) => {
    const w = doc.getStringUnitWidth(kw) * 10 * 0.35 + 8;
    if (chipX + w > pageW - margin) { chipX = margin; y += 8; }
    checkSpace(8);
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(chipX, y - 4, w, 6, 1.5, 1.5, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(146, 64, 14);
    doc.text(kw, chipX + 4, y);
    chipX += w + 4;
  });
  y += 12;

  // ── SUGERENCIAS ───────────────────────────────────────────
  checkSpace(20);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Sugerencias para mejorar tu CV", margin, y);
  y += 6;

  result.suggestions.forEach((s, i) => {
    checkSpace(12);
    const numLabel = `${String(i + 1).padStart(2, "0")}.`;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(232, 160, 32);
    doc.text(numLabel, margin, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    const lines = doc.splitTextToSize(s, colW - 12);
    doc.text(lines, margin + 10, y);
    y += lines.length * 5 + 4;
  });

  // ── FOOTER ────────────────────────────────────────────────
  const totalPages = (doc.internal as { getNumberOfPages(): number }).getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Resumatch · Desarrollado por Agustín Pollán · Página ${p} de ${totalPages}`,
      pageW / 2,
      290,
      { align: "center" }
    );
  }

  // ── DOWNLOAD ──────────────────────────────────────────────
  const filename = `resumatch-${result.cv_filename.replace(".pdf", "")}-${Date.now()}.pdf`;
  doc.save(filename);
};
