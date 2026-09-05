from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

OUTPUT = "Bewerbung_Pflege.pdf"

style_sender = ParagraphStyle(
    "sender", fontName="Helvetica", fontSize=11, leading=14, alignment=TA_LEFT,
)
style_normal = ParagraphStyle(
    "normal", fontName="Helvetica", fontSize=11, leading=15, alignment=TA_LEFT,
    spaceAfter=8,
)
style_justify = ParagraphStyle(
    "justify", parent=style_normal, alignment=TA_JUSTIFY, spaceAfter=10,
)
style_subject = ParagraphStyle(
    "subject", fontName="Helvetica-Bold", fontSize=12, leading=16,
    spaceAfter=14,
)

doc = SimpleDocTemplate(
    OUTPUT, pagesize=A4,
    leftMargin=2.5 * cm, rightMargin=2.5 * cm,
    topMargin=3 * cm, bottomMargin=2.5 * cm,
    title="Bewerbung als Pflegehilfskraft / Betreuungskraft",
    author="Ahmad Jumaa Almoustafa",
)

story = []

# Sender block (mirrors the reference layout)
story.append(Paragraph("Ahmad Jumaa Almoustafa", style_sender))
story.append(Paragraph("Landshuter Straße 43", style_sender))
story.append(Paragraph("84307 Eggenfelden", style_sender))
story.append(Paragraph("+49 179 6774243", style_sender))
story.append(Paragraph("[Ihre E-Mail-Adresse]", style_sender))
story.append(Spacer(1, 1.0 * cm))

# Subject
story.append(Paragraph(
    "Bewerbung als Pflegehilfskraft / Betreuungskraft",
    style_subject,
))

# Salutation
story.append(Paragraph("Sehr geehrte Damen und Herren,", style_normal))

# Body
paragraphs = [
    "hiermit möchte ich mich bei Ihnen um eine Stelle als Pflegehilfskraft "
    "bzw. als Unterstützung in Ihrer Einrichtung bewerben.",

    "Auch wenn ich derzeit keine berufliche Ausbildung oder spezielle "
    "Qualifikation im Pflegebereich habe, bin ich sehr motiviert, in diesem "
    "Bereich zu arbeiten und neue Aufgaben zu lernen. Der Umgang mit älteren "
    "Menschen ist für mich eine verantwortungsvolle und zugleich wertvolle "
    "Tätigkeit. Ich bin geduldig, zuverlässig, hilfsbereit und gehe "
    "respektvoll mit anderen Menschen um.",

    "Ich bin bereit, mich schnell in neue Aufgaben einzuarbeiten und die "
    "notwendigen Kenntnisse und Fähigkeiten durch praktische Erfahrung sowie "
    "entsprechende Schulungen zu erwerben. Besonders wichtig sind mir ein "
    "freundlicher Umgang, Respekt und ein verantwortungsbewusstes Arbeiten "
    "im Team.",

    "Über die Möglichkeit, mich persönlich bei Ihnen vorzustellen und mehr "
    "über die Tätigkeit zu erfahren, würde ich mich sehr freuen.",
]
for p in paragraphs:
    story.append(Paragraph(p, style_justify))

story.append(Spacer(1, 0.4 * cm))
story.append(Paragraph("Mit freundlichen Grüßen", style_normal))
story.append(Spacer(1, 1.6 * cm))
story.append(Paragraph("Ahmad Jumaa Almoustafa", style_normal))

doc.build(story)
print(f"Erstellt: {OUTPUT}")
