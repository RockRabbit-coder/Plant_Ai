import io
from pathlib import Path
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as ReportLabImage
from app.core.config import settings

def generate_scan_pdf_report(scan_data: dict, output_path: Path) -> Path:
    """Generate a publication-grade agricultural diagnosis report PDF."""
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Heading1"],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#1b4332"),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        "ReportSubtitle",
        parent=styles["Normal"],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#2d6a4f"),
        spaceAfter=15
    )
    
    section_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#1b4332"),
        spaceBefore=10,
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        "ReportBody",
        parent=styles["Normal"],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#222222")
    )
    
    disclaimer_style = ParagraphStyle(
        "Disclaimer",
        parent=styles["Normal"],
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#666666"),
        fontName="Helvetica-Oblique"
    )
    
    elements = []
    
    # 1. Header Banner
    elements.append(Paragraph("🌿 PlantCare AI — Diagnostic & Disease Assessment Report", title_style))
    elements.append(Paragraph(f"Official Agricultural Health Dossier | Report ID: {scan_data.get('id', 'N/A')}", subtitle_style))
    elements.append(Spacer(1, 5))
    
    # Metadata Table
    meta_info = [
        [
            Paragraph(f"<b>Scan Date:</b> {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}", body_style),
            Paragraph(f"<b>Model Engine:</b> {scan_data.get('model_version', 'MobileNetV3')}", body_style)
        ],
        [
            Paragraph(f"<b>Crop Species:</b> {scan_data.get('crop', 'Unknown')}", body_style),
            Paragraph(f"<b>Condition:</b> {scan_data.get('disease', 'Healthy')}", body_style)
        ],
        [
            Paragraph(f"<b>Confidence:</b> {scan_data.get('confidence', 0):.1f}%", body_style),
            Paragraph(f"<b>Affected Area:</b> {scan_data.get('severity_pct', 0):.1f}% (Grad-CAM Salience)", body_style)
        ]
    ]
    meta_table = Table(meta_info, colWidths=[270, 270])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f3f7f4")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#d8e2dc")),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 10))
    
    # 2. Uncertainty Warning (if flagged)
    if scan_data.get("is_uncertain"):
        reasons = scan_data.get("uncertainty_reasons", [])
        warning_text = f"<b>⚠️ Uncertainty Notice:</b> This scan has been flagged with elevated uncertainty. Key factor: {'; '.join(reasons) if reasons else 'Marginal decision threshold'}. Field inspection recommended."
        warning_table = Table([[Paragraph(warning_text, body_style)]], colWidths=[540])
        warning_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#fff3cd")),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#ffeeba")),
            ('PADDING', (0, 0), (-1, -1), 8)
        ]))
        elements.append(warning_table)
        elements.append(Spacer(1, 10))
        
    # 3. Symptoms and Observations
    elements.append(Paragraph("Clinical Symptoms & Visual Features", section_style))
    symptoms = scan_data.get("symptoms", [])
    if symptoms:
        symptom_items = "<br/>".join([f"• {s}" for s in symptoms])
        elements.append(Paragraph(symptom_items, body_style))
    else:
        elements.append(Paragraph("• No macroscopic fungal lesions, chlorosis, or bacterial spotting observed.", body_style))
    elements.append(Spacer(1, 10))
    
    # 4. Immediate Management & Treatment Guide
    elements.append(Paragraph("Evidence-Based Management Recommendations", section_style))
    mgmt = scan_data.get("management", [])
    if mgmt:
        mgmt_items = "<br/>".join([f"<b>{i+1}.</b> {m}" for i, m in enumerate(mgmt)])
        elements.append(Paragraph(mgmt_items, body_style))
    else:
        elements.append(Paragraph("Maintain standard irrigation and fertility protocols. Continue weekly scouting.", body_style))
    elements.append(Spacer(1, 10))
    
    # 5. Prevention & Cultural Sanitation
    elements.append(Paragraph("Preventive Sanitation & Cultural Controls", section_style))
    prev = scan_data.get("prevention", [])
    if prev:
        prev_items = "<br/>".join([f"• {p}" for p in prev])
        elements.append(Paragraph(prev_items, body_style))
    else:
        elements.append(Paragraph("Ensure good field drainage and avoid overhead sprinkler watering on leaf canopies.", body_style))
    elements.append(Spacer(1, 15))
    
    # 6. Legal & Agronomic Disclaimer
    elements.append(Spacer(1, 10))
    disclaimer_text = (
        "<b>Important Scientific Disclaimer:</b> PlantCare AI utilizes deep learning computer vision "
        "(MobileNetV3) and Gradient-weighted Class Activation Mapping (Grad-CAM) to identify possible foliar pathogens. "
        "AI assessments are diagnostic aids and must not replace laboratory testing or advice from certified agricultural "
        "extension specialists. Do not apply regulated pesticides without consulting registered local label instructions."
    )
    elements.append(Paragraph(disclaimer_text, disclaimer_style))
    
    doc.build(elements)
    return output_path
