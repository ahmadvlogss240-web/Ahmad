from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
)
from reportlab.lib import colors
from datetime import date

OUTPUT = "Bewerbung_Pflege.pdf"

styles = getSampleStyleSheet()

style_normal = ParagraphStyle(
    "normal", parent=styles["Normal"],
    fontName="Helvetica", fontSize=11, leading=15, alignment=TA_LEFT,
)
style_justify = ParagraphStyle(
    "justify", parent=style_normal, alignment=TA_JUSTIFY, spaceAfter=8,
)
style_right = ParagraphStyle(
    "right", parent=style_normal, alignment=TA_RIGHT,
)
style_sender = ParagraphStyle(
    "sender", parent=style_normal, fontSize=10, leading=13,
)
style_subject = ParagraphStyle(
    "subject", parent=style_normal, fontName="Helvetica-Bold",
    fontSize=11.5, leading=15, spaceAfter=14,
)
style_name = ParagraphStyle(
    "name", parent=style_normal, fontName="Helvetica-Bold",
    fontSize=16, leading=19, spaceAfter=2,
)

doc = SimpleDocTemplate(
    OUTPUT, pagesize=A4,
    leftMargin=2.5 * cm, rightMargin=2.5 * cm,
    topMargin=2 * cm, bottomMargin=2 * cm,
    title="Bewerbung als Pflegehelfer / Alltagsbegleiter",
    author="Ahmad Jumaa Almoustafa",
)

story = []

# Header: sender left, receiver info follows
story.append(Paragraph("<b>Ahmad Jumaa Almoustafa</b>", style_sender))
story.append(Paragraph("Landshuter Straße 43", style_sender))
story.append(Paragraph("84307 Eggenfelden", style_sender))
story.append(Paragraph("Telefon: 0179 6774243", style_sender))
story.append(Paragraph("E-Mail: [Ihre E-Mail-Adresse]", style_sender))
story.append(Paragraph("Geburtsdatum: 15.01.2005", style_sender))
story.append(Spacer(1, 1.2 * cm))

# Recipient
story.append(Paragraph("Pichlmayr Senioren-Zentrum Eggenfelden", style_normal))
story.append(Paragraph("Personalabteilung", style_normal))
story.append(Paragraph("84307 Eggenfelden", style_normal))
story.append(Spacer(1, 1.0 * cm))

# Date right-aligned
today = date.today().strftime("%d.%m.%Y")
story.append(Paragraph(f"Eggenfelden, den {today}", style_right))
story.append(Spacer(1, 0.8 * cm))

# Subject
story.append(Paragraph(
    "Bewerbung als Pflegehilfskraft / Alltagsbegleiter",
    style_subject,
))

# Salutation
story.append(Paragraph("Sehr geehrte Damen und Herren,", style_normal))
story.append(Spacer(1, 0.4 * cm))

# Body paragraphs
paragraphs = [
    "mit großem Interesse bin ich auf Ihr Senioren-Zentrum in Eggenfelden "
    "aufmerksam geworden und möchte mich hiermit um eine Stelle als "
    "Pflegehilfskraft, Alltagsbegleiter oder Betreuungskraft bewerben. Die "
    "Arbeit mit älteren Menschen bereitet mir sehr viel Freude, und ich "
    "möchte gerne dazu beitragen, dass sich die Bewohnerinnen und Bewohner "
    "bei Ihnen wohl und gut aufgehoben fühlen.",

    "Ich bin ein zuverlässiger, geduldiger und hilfsbereiter Mensch und "
    "arbeite gerne im Team. Der respektvolle und freundliche Umgang mit "
    "älteren Menschen ist für mich selbstverständlich. Ich bin bereit, im "
    "Schichtdienst sowie an Wochenenden und Feiertagen zu arbeiten, und "
    "packe überall dort mit an, wo Unterstützung gebraucht wird.",

    "Zu meinen Tätigkeiten würde ich gerne Folgendes übernehmen:",
]
for p in paragraphs:
    story.append(Paragraph(p, style_justify))

bullet_style = ParagraphStyle(
    "bullet", parent=style_justify, leftIndent=18, bulletIndent=6,
    spaceAfter=2,
)
bullets = [
    "Unterstützung der Bewohner im Alltag (Ankleiden, Körperpflege, Begleitung)",
    "Hilfe bei der Nahrungsaufnahme und Zubereitung einfacher Mahlzeiten",
    "Reinigungs- und Hauswirtschaftsarbeiten (Zimmer, Wäsche, Küche)",
    "Gesellschaft leisten, Gespräche führen und gemeinsame Beschäftigungen",
    "Begleitung bei Spaziergängen, Arztbesuchen und Freizeitaktivitäten",
]
for b in bullets:
    story.append(Paragraph(b, bullet_style, bulletText="•"))

story.append(Spacer(1, 0.3 * cm))

more = [
    "Ich lerne schnell, arbeite sorgfältig und bin motiviert, mich in neue "
    "Aufgaben einzuarbeiten. Auch ohne abgeschlossene Ausbildung im "
    "Pflegebereich bringe ich die wichtigsten Eigenschaften mit, die für "
    "diese Arbeit zählen: Herz, Verantwortungsbewusstsein und Freude am "
    "Umgang mit Menschen. Gerne bin ich bereit, an Schulungen oder "
    "Weiterbildungen teilzunehmen.",

    "Über die Einladung zu einem persönlichen Gespräch, in dem ich Sie von "
    "meiner Motivation überzeugen kann, würde ich mich sehr freuen.",
]
for p in more:
    story.append(Paragraph(p, style_justify))

story.append(Spacer(1, 0.5 * cm))
story.append(Paragraph("Mit freundlichen Grüßen", style_normal))
story.append(Spacer(1, 1.6 * cm))
story.append(Paragraph("Ahmad Jumaa Almoustafa", style_normal))

doc.build(story)
print(f"Erstellt: {OUTPUT}")
