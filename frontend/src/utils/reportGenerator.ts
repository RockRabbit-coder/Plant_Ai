import jsPDF from 'jspdf';
import { AnalysisResponse } from '../types';

export function exportClientPdf(analysis: AnalysisResponse) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  });

  const margin = 40;
  let y = margin;

  // Title Banner
  doc.setFillColor(27, 67, 50); // Forest green
  doc.rect(0, 0, 612, 60, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('PlantCare AI - Diagnostic Report', margin, 38);

  y = 80;
  doc.setTextColor(34, 34, 34);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Report ID: ${analysis.scan_id}`, margin, y);
  doc.text(`Date: ${new Date(analysis.timestamp).toLocaleDateString()}`, 400, y);

  y += 25;
  // Diagnosis Box
  doc.setFillColor(243, 247, 244);
  doc.roundedRect(margin, y, 532, 60, 4, 4, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(27, 67, 50);
  doc.text(`Primary Diagnosis: ${analysis.primary_prediction.crop} - ${analysis.primary_prediction.disease}`, margin + 15, y + 25);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text(`Confidence: ${analysis.primary_prediction.confidence.toFixed(1)}% | Status: ${analysis.primary_prediction.is_healthy ? 'Healthy' : 'Pathogen Detected'}`, margin + 15, y + 45);

  y += 85;
  // Symptoms
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(27, 67, 50);
  doc.text('Clinical Symptoms & Observations', margin, y);
  y += 18;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  const symptoms = analysis.disease_details.symptoms || [];
  if (symptoms.length > 0) {
    symptoms.forEach(s => {
      doc.text(`• ${s}`, margin + 10, y);
      y += 15;
    });
  } else {
    doc.text('• No macroscopic lesions or fungal structures detected.', margin + 10, y);
    y += 15;
  }

  y += 15;
  // Management Recommendations
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(27, 67, 50);
  doc.text('Evidence-Based Management Actions', margin, y);
  y += 18;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  const mgmt = analysis.disease_details.management || [];
  mgmt.slice(0, 3).forEach((m, idx) => {
    const lines = doc.splitTextToSize(`${idx + 1}. ${m}`, 510);
    doc.text(lines, margin + 10, y);
    y += lines.length * 13 + 4;
  });

  y += 15;
  // Disclaimer
  doc.setFillColor(254, 243, 199); // Amber 100
  doc.roundedRect(margin, y, 532, 50, 4, 4, 'F');
  doc.setTextColor(146, 64, 14); // Amber 800
  doc.setFontSize(8);
  const disclaimerText = 'Disclaimer: PlantCare AI generates predictive guidance using computer vision (MobileNetV3). Results are advisory and should not replace laboratory testing or advice from certified agricultural extension advisors before applying chemical pesticides.';
  const disclaimerLines = doc.splitTextToSize(disclaimerText, 510);
  doc.text(disclaimerLines, margin + 10, y + 18);

  // Save PDF
  doc.save(`PlantCare_Report_${analysis.scan_id.substring(0, 8)}.pdf`);
}
