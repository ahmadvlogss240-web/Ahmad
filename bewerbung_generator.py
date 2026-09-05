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
    "justify", parent=style_normal, alignment=TA_LEFT, spaceAfter=10,
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
story.append(Paragraph("ahmadakumaa123@gmail.com", style_sender))
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
    "auf der Suche nach einer neuen Aufgabe bin ich auf Ihre Einrichtung "
    "aufmerksam geworden und möchte mich bei Ihnen als Pflegehilfskraft "
    "bzw. Betreuungskraft bewerben. Die Arbeit mit älteren Menschen liegt "
    "mir sehr am Herzen, und ich möchte einen Beitrag dazu leisten, dass "
    "sich Ihre Bewohnerinnen und Bewohner gut aufgehoben fühlen.",

    "Ich bringe zwar noch keine abgeschlossene Ausbildung im Pflegebereich "
    "mit, dafür aber viel Motivation, Herz und die Bereitschaft, mich "
    "engagiert einzubringen. Gerne unterstütze ich bei alltäglichen "
    "Aufgaben wie der Betreuung der Bewohner, der Zubereitung von "
    "Mahlzeiten sowie bei Reinigungs- und Hauswirtschaftsarbeiten.",

    "Zu meinen Stärken zählen Geduld, Zuverlässigkeit und ein respektvoller "
    "Umgang mit anderen Menschen. Ich arbeite gerne im Team, bin körperlich "
    "belastbar und auch bereit, im Schichtdienst sowie an Wochenenden zu "
    "arbeiten. An Schulungen und Weiterbildungen nehme ich sehr gerne teil, "
    "um mich Schritt für Schritt fachlich weiterzuentwickeln.",

    "Über eine Einladung zu einem persönlichen Gespräch würde ich mich "
    "sehr freuen und bedanke mich schon jetzt für Ihre Zeit und Ihr "
    "Interesse.",
]
for p in paragraphs:
    story.append(Paragraph(p, style_justify))

story.append(Spacer(1, 0.4 * cm))
story.append(Paragraph("Mit freundlichen Grüßen", style_normal))
story.append(Spacer(1, 1.6 * cm))
story.append(Paragraph("Ahmad Jumaa Almoustafa", style_normal))

doc.build(story)
print(f"Erstellt: {OUTPUT}")
