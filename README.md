# Massagepraxis Serenità – Website

Moderne, elegante Website für eine selbstständige Massagepraxis mit
funktionierendem Online-Buchungssystem, Admin-Bereich und
responsive Design für Handy, Tablet und Desktop.

## Struktur

```
├── index.html          Hauptseite (Start, Über, Massagen, Buchung, Bewertungen, Kontakt)
├── admin.html          Verwaltung: Buchungen einsehen · Öffnungszeiten anpassen
├── css/style.css       Vollständiges Design-System
├── js/data.js          Konfiguration (Massagen, Preise, Öffnungszeiten)
├── js/booking.js       Buchungslogik (Kalender, Slots, Bestätigung)
├── js/main.js          Navigation, Animationen, Kontaktformular
└── assets/             Bilder & Icons (zurzeit SVG-Platzhalter)
```

## Anpassen ohne Code

Die wichtigsten Inhalte lassen sich schnell tauschen:

- **Name, Adresse, Telefon, E-Mail** → in `index.html` per Suche/Ersetzen
  (`Musterstraße 12`, `+49 123 4567890`, `hallo@serenita-massage.de`,
  `Serenità`)
- **Massagen & Preise** → in `js/data.js`, Array `services`
- **Öffnungszeiten & Buchungsregeln** → in `js/data.js`, `openingHours`
  bzw. über `admin.html`
- **Fotos** → SVG-Platzhalter in `index.html` durch `<img src="...">`
  ersetzen (Portrait im Bereich „Über mich", Hero-Bild in `hero-image`)

## Buchungssystem

Vollständig client-seitig, speichert Buchungen in `localStorage`.
Klare Schnittstelle für spätere Backend-Anbindung:

```js
window.SerenitaBooking.BookingStore.saveBooking(...)
window.SerenitaBooking.BookingStore.loadBookings()
window.SerenitaBooking.BookingStore.getBookingsForDate(iso)
```

Diese drei Funktionen können 1:1 durch `fetch('/api/bookings')`-Aufrufe
ersetzt werden. Alles andere (Slot-Berechnung, Kalender, UI) bleibt
unverändert.

Der Admin-Bereich (`admin.html`) zeigt alle Buchungen, erlaubt
Öffnungszeiten, Slot-Raster und Vorlaufzeit zu ändern, und
exportiert alle Termine als JSON.

## Technik

- Kein Framework, keine Build-Pipeline nötig.
- Nur zwei externe Ressourcen: Google Fonts.
- Lazy-Loading via `IntersectionObserver` für Scroll-Animationen.
- `prefers-reduced-motion` und Tastatur-Bedienung berücksichtigt.
- SEO: Meta-Tags, Open Graph, `application/ld+json` (Local Business).

## Lokal starten

```
python3 -m http.server 8080
```

Anschließend `http://localhost:8080/` im Browser öffnen.
