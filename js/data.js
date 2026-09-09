/**
 * Zentrale Konfiguration – Services, Öffnungszeiten & Slot-Dauer
 * -------------------------------------------------------------------
 * Diese Datei ist bewusst als schlanke Datenschicht ausgelegt.
 * Später kann sie problemlos gegen einen Backend-API-Aufruf
 * (z. B. /api/services, /api/availability) ausgetauscht werden.
 */

window.PRAXIS_CONFIG = {
    /* Angebotene Massagen */
    services: [
        {
            id: "klassisch",
            name: "Klassische Massage",
            description: "Bewährte Grifftechniken zur Lockerung der gesamten Muskulatur – ideal zum ruhigen Ankommen.",
            duration: 60,
            price: 75,
            icon: "hand"
        },
        {
            id: "ruecken-nacken",
            name: "Rücken- & Nackenmassage",
            description: "Gezielte Behandlung der besonders belasteten Zonen. Perfekt gegen Bildschirm- und Alltagsverspannungen.",
            duration: 30,
            price: 45,
            icon: "back"
        },
        {
            id: "ganzkoerper",
            name: "Ganzkörpermassage",
            description: "Umfassende Behandlung von Kopf bis Fuß – tiefe Entspannung und neue Energie für Körper und Geist.",
            duration: 90,
            price: 110,
            icon: "body"
        },
        {
            id: "entspannung",
            name: "Entspannungsmassage",
            description: "Sanfte Streichungen mit warmem Aromaöl. Für alle, die einfach nur abschalten möchten.",
            duration: 60,
            price: 85,
            icon: "leaf"
        },
        {
            id: "sport",
            name: "Sportmassage",
            description: "Kräftige, tiefenwirksame Behandlung zur Regeneration nach Training oder Wettkampf.",
            duration: 60,
            price: 90,
            icon: "sport"
        },
        {
            id: "faszien",
            name: "Faszien- & Triggerpunkt",
            description: "Gezielte Arbeit an verhärtetem Bindegewebe und Schmerzpunkten für nachhaltige Linderung.",
            duration: 45,
            price: 70,
            icon: "target"
        }
    ],

    /* Öffnungszeiten (0 = Sonntag, 1 = Montag, … 6 = Samstag) */
    openingHours: {
        1: { open: "09:00", close: "19:00" },
        2: { open: "09:00", close: "19:00" },
        3: { open: "09:00", close: "19:00" },
        4: { open: "09:00", close: "19:00" },
        5: { open: "09:00", close: "19:00" },
        6: { open: "10:00", close: "15:00" },
        0: null   /* Sonntag geschlossen */
    },

    /* Raster in Minuten, in dem Termine angeboten werden */
    slotInterval: 30,

    /* Puffer nach jedem Termin in Minuten */
    bufferAfter: 15,

    /* Wie viele Tage im Voraus buchbar? */
    bookingWindowDays: 60,

    /* Kürzeste Vorlaufzeit einer Buchung in Stunden */
    minLeadTimeHours: 3
};

/* SVG-Icons für Services (inline für Performance & Design-Kontrolle) */
window.SERVICE_ICONS = {
    hand: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11V4.5a1.5 1.5 0 0 1 3 0V11"/><path d="M12 11V3a1.5 1.5 0 0 1 3 0v8"/><path d="M15 11V4a1.5 1.5 0 0 1 3 0v10"/><path d="M6 11V6.5a1.5 1.5 0 0 1 3 0V11"/><path d="M6 11c0 6 3 10 7 10 4 0 7-3 7-8"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/><path d="M9 11h6l1 4H8l1-4z"/><path d="M9 15v6M15 15v6"/><path d="M7 13h2M15 13h2"/></svg>',
    body: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.5"/><path d="M8 13l1-5h6l1 5"/><path d="M9 13v8M15 13v8"/><path d="M7 15h2M15 15h2"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4c-8 0-14 5-14 12 0 2 1 4 2 4 6 0 12-5 12-14 0-1-.5-2 0-2z"/><path d="M6 20c2-6 6-10 12-14"/></svg>',
    sport: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h2l2-4 4 12 4-16 2 8h2"/></svg>',
    target: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>'
};
