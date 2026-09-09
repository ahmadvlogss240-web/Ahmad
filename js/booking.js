/**
 * Buchungssystem – RuhePunkt.Massagen · Sandro Notz
 * -------------------------------------------------------------------
 * Vollständig funktionsfähige Client-seitige Buchung mit:
 *  – Auswahl der Massage
 *  – interaktivem Kalender (Monatsnavigation, gesperrte/vergangene Tage)
 *  – dynamisch berechneten freien Zeitfenstern
 *  – Persistenz per localStorage (leicht auf Backend-API umstellbar)
 *  – Zusammenfassung & Bestätigungsansicht
 *
 * Backend-Anbindung: Die drei Funktionen
 *   BookingStore.loadBookings(), BookingStore.saveBooking()
 *   und BookingStore.getBookingsForDate()
 * sind der einzige Berührungspunkt zur Persistenz – hier lässt sich
 * problemlos ein fetch('/api/bookings') einhängen.
 */

(function () {
    "use strict";

    const CONFIG = window.PRAXIS_CONFIG;
    const ICONS = window.SERVICE_ICONS;

    /* ------------------------------------------------------------------ */
    /* Persistenz-Layer                                                    */
    /* ------------------------------------------------------------------ */
    const STORAGE_KEY = "serenita.bookings.v1";

    const BookingStore = {
        loadBookings() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                return raw ? JSON.parse(raw) : [];
            } catch (e) { return []; }
        },
        saveBooking(booking) {
            const all = BookingStore.loadBookings();
            all.push(booking);
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); } catch (e) {}
            return booking;
        },
        getBookingsForDate(dateISO) {
            return BookingStore.loadBookings().filter(b => b.date === dateISO);
        }
    };

    /* ------------------------------------------------------------------ */
    /* Hilfs­funktionen                                                    */
    /* ------------------------------------------------------------------ */
    const MONATE = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
    const WOCHENTAGE = ["Mo","Di","Mi","Do","Fr","Sa","So"];

    function pad(n) { return String(n).padStart(2, "0"); }
    function toISO(d) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
    function fromISO(s) { const [y,m,d] = s.split("-").map(Number); return new Date(y, m-1, d); }
    function timeToMinutes(t) { const [h,m] = t.split(":").map(Number); return h*60 + m; }
    function minutesToTime(m) { return `${pad(Math.floor(m/60))}:${pad(m%60)}`; }
    function formatDateLong(d) {
        return `${WOCHENTAGE[(d.getDay()+6)%7]}, ${d.getDate()}. ${MONATE[d.getMonth()]} ${d.getFullYear()}`;
    }
    function formatPrice(v) {
        return v.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
    }

    /* ------------------------------------------------------------------ */
    /* Slot-Berechnung                                                     */
    /* ------------------------------------------------------------------ */
    function isDayOpen(date) {
        const hours = CONFIG.openingHours[date.getDay()];
        return !!hours;
    }

    function calculateAvailableSlots(date, service) {
        if (!service || !isDayOpen(date)) return [];
        const hours = CONFIG.openingHours[date.getDay()];
        const open = timeToMinutes(hours.open);
        const close = timeToMinutes(hours.close);
        const step = CONFIG.slotInterval;
        const duration = service.duration + CONFIG.bufferAfter;

        const now = new Date();
        const leadCutoff = new Date(now.getTime() + CONFIG.minLeadTimeHours * 60 * 60 * 1000);
        const isToday = toISO(date) === toISO(now);

        const booked = BookingStore.getBookingsForDate(toISO(date));
        const blocked = booked.map(b => {
            const start = timeToMinutes(b.time);
            const end = start + b.serviceDuration + CONFIG.bufferAfter;
            return [start, end];
        });

        const slots = [];
        for (let t = open; t + service.duration <= close; t += step) {
            const conflicts = blocked.some(([s,e]) => (t < e && t + duration > s));
            const slotDate = new Date(date);
            slotDate.setHours(0, 0, 0, 0);
            slotDate.setMinutes(t);

            const inPast = isToday && slotDate < leadCutoff;
            slots.push({ time: minutesToTime(t), available: !conflicts && !inPast });
        }
        return slots;
    }

    /* ------------------------------------------------------------------ */
    /* Formularstatus                                                      */
    /* ------------------------------------------------------------------ */
    const state = {
        step: 1,
        service: null,
        date: null,   /* ISO */
        time: null,
        calendarMonth: (() => { const d = new Date(); d.setDate(1); return d; })()
    };

    /* ------------------------------------------------------------------ */
    /* Rendering                                                           */
    /* ------------------------------------------------------------------ */
    function renderServiceCards() {
        const grid = document.getElementById("servicesGrid");
        if (!grid) return;
        grid.innerHTML = CONFIG.services.map(s => `
            <article class="service-card" data-animate>
                <div class="service-icon">${ICONS[s.icon] || ICONS.hand}</div>
                <h3>${s.name}</h3>
                <p>${s.description}</p>
                <div class="service-meta">
                    <span class="service-duration">${s.duration} Min.</span>
                    <span class="service-price">${formatPrice(s.price)}</span>
                </div>
                <a href="#buchung" class="service-book" data-service="${s.id}">Termin buchen</a>
            </article>
        `).join("");

        grid.querySelectorAll(".service-book").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-service");
                preselectService(id);
            });
        });
    }

    function renderServicePicker() {
        const picker = document.getElementById("servicePicker");
        if (!picker) return;
        picker.innerHTML = CONFIG.services.map(s => `
            <label class="picker-option" data-id="${s.id}">
                <input type="radio" name="service" value="${s.id}" />
                <div class="picker-option-info">
                    <h4>${s.name}</h4>
                    <p>${s.description}</p>
                </div>
                <div class="picker-option-meta">
                    <strong>${formatPrice(s.price)}</strong>
                    <small>${s.duration} Min.</small>
                </div>
            </label>
        `).join("");

        picker.querySelectorAll(".picker-option").forEach(opt => {
            opt.addEventListener("click", () => selectService(opt.dataset.id));
            opt.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectService(opt.dataset.id); }
            });
            opt.setAttribute("tabindex", "0");
            opt.setAttribute("role", "radio");
        });
    }

    function renderCalendar() {
        const el = document.getElementById("calendar");
        if (!el) return;

        const month = state.calendarMonth;
        const today = new Date(); today.setHours(0,0,0,0);
        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + CONFIG.bookingWindowDays);

        /* Kann man rückwärts blättern? */
        const prevDisabled = (month.getFullYear() === today.getFullYear() && month.getMonth() <= today.getMonth());
        /* Nach vorn nur, wenn im Fenster */
        const lastAllowedMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
        const nextDisabled = (month.getFullYear() > lastAllowedMonth.getFullYear() ||
            (month.getFullYear() === lastAllowedMonth.getFullYear() && month.getMonth() >= lastAllowedMonth.getMonth()));

        const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
        const daysInMonth = new Date(month.getFullYear(), month.getMonth()+1, 0).getDate();
        const weekdayOffset = (firstDay.getDay() + 6) % 7;   /* Mo = 0 */

        let cells = "";
        for (let i = 0; i < weekdayOffset; i++) cells += `<div class="calendar-day is-empty" aria-hidden="true"></div>`;
        for (let d = 1; d <= daysInMonth; d++) {
            const dt = new Date(month.getFullYear(), month.getMonth(), d);
            const iso = toISO(dt);
            const isPast = dt < today;
            const isTooFar = dt > maxDate;
            const closed = !isDayOpen(dt);
            const disabled = isPast || isTooFar || closed;
            const classes = [
                "calendar-day",
                closed && !isPast ? "is-closed" : "",
                toISO(dt) === toISO(today) ? "is-today" : "",
                state.date === iso ? "is-selected" : ""
            ].filter(Boolean).join(" ");

            const label = `${d}. ${MONATE[dt.getMonth()]} ${dt.getFullYear()}${closed ? " (geschlossen)" : ""}`;
            cells += `<button type="button" class="${classes}" data-date="${iso}" ${disabled ? "disabled aria-disabled='true'" : ""} aria-label="${label}">${d}</button>`;
        }

        el.innerHTML = `
            <div class="calendar-head">
                <button type="button" class="calendar-nav" data-nav="prev" ${prevDisabled ? "disabled" : ""} aria-label="Vorheriger Monat">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <h3>${MONATE[month.getMonth()]} ${month.getFullYear()}</h3>
                <button type="button" class="calendar-nav" data-nav="next" ${nextDisabled ? "disabled" : ""} aria-label="Nächster Monat">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
            </div>
            <div class="calendar-grid">
                ${WOCHENTAGE.map(d => `<div class="calendar-dow">${d}</div>`).join("")}
                ${cells}
            </div>
        `;

        el.querySelectorAll(".calendar-nav").forEach(btn => {
            btn.addEventListener("click", () => {
                const dir = btn.dataset.nav === "next" ? 1 : -1;
                state.calendarMonth = new Date(state.calendarMonth.getFullYear(), state.calendarMonth.getMonth() + dir, 1);
                renderCalendar();
            });
        });
        el.querySelectorAll(".calendar-day:not([disabled]):not(.is-empty)").forEach(btn => {
            btn.addEventListener("click", () => selectDate(btn.dataset.date));
        });
    }

    function renderSlots() {
        const slotsEl = document.getElementById("slots");
        const hint = document.getElementById("slotHint");
        const nextBtn = document.querySelector('[data-next="3"]');

        if (!state.date || !state.service) {
            slotsEl.innerHTML = "";
            hint.textContent = "Bitte wählen Sie zunächst ein Datum.";
            nextBtn.disabled = true;
            return;
        }

        const date = fromISO(state.date);
        const slots = calculateAvailableSlots(date, state.service);
        const anyAvailable = slots.some(s => s.available);

        if (!slots.length) {
            hint.textContent = "An diesem Tag sind wir leider geschlossen.";
            slotsEl.innerHTML = "";
            nextBtn.disabled = true;
            return;
        }
        if (!anyAvailable) {
            hint.textContent = "An diesem Tag sind leider keine Termine mehr verfügbar. Bitte wählen Sie ein anderes Datum.";
            slotsEl.innerHTML = "";
            nextBtn.disabled = true;
            return;
        }

        hint.textContent = `Freie Zeiten am ${formatDateLong(date)}:`;
        slotsEl.innerHTML = slots.map(s => `
            <button type="button" class="slot ${state.time === s.time ? "is-selected" : ""}" data-time="${s.time}" ${s.available ? "" : "disabled"} aria-pressed="${state.time === s.time}">
                ${s.time}
            </button>
        `).join("");

        slotsEl.querySelectorAll(".slot:not([disabled])").forEach(btn => {
            btn.addEventListener("click", () => selectTime(btn.dataset.time));
        });
        nextBtn.disabled = !state.time;
    }

    function renderSummary() {
        const el = document.getElementById("bookingSummary");
        if (!el) return;
        if (!state.service || !state.date || !state.time) { el.innerHTML = ""; return; }
        const date = fromISO(state.date);
        el.innerHTML = `
            <dt>Behandlung</dt><dd>${state.service.name}</dd>
            <dt>Dauer</dt><dd>${state.service.duration} Minuten</dd>
            <dt>Datum</dt><dd>${formatDateLong(date)}</dd>
            <dt>Uhrzeit</dt><dd>${state.time} Uhr</dd>
            <dt>Preis</dt><dd>${formatPrice(state.service.price)}</dd>
        `;
    }

    /* ------------------------------------------------------------------ */
    /* State-Übergänge                                                     */
    /* ------------------------------------------------------------------ */
    function selectService(id) {
        const svc = CONFIG.services.find(s => s.id === id);
        if (!svc) return;
        state.service = svc;
        document.querySelectorAll(".picker-option").forEach(o => {
            o.classList.toggle("is-selected", o.dataset.id === id);
            const input = o.querySelector("input");
            if (input) input.checked = (o.dataset.id === id);
            o.setAttribute("aria-checked", o.dataset.id === id);
        });
        document.querySelector('[data-next="1"]').disabled = false;
        /* Wenn Datum bereits gewählt: neue Slots */
        if (state.date) { state.time = null; renderSlots(); }
    }

    function preselectService(id) {
        selectService(id);
        goToStep(1);
        setTimeout(() => {
            document.getElementById("buchung").scrollIntoView({ behavior: "smooth", block: "start" });
        }, 40);
    }

    function selectDate(iso) {
        state.date = iso;
        state.time = null;
        renderCalendar();
        document.querySelector('[data-next="2"]').disabled = false;
        renderSlots();
    }

    function selectTime(t) {
        state.time = t;
        document.querySelectorAll(".slot").forEach(el => {
            el.classList.toggle("is-selected", el.dataset.time === t);
            el.setAttribute("aria-pressed", el.dataset.time === t);
        });
        document.querySelector('[data-next="3"]').disabled = false;
    }

    function goToStep(n) {
        state.step = n;
        document.querySelectorAll(".booking-step").forEach(el => {
            el.classList.toggle("is-active", Number(el.dataset.step) === n);
        });
        document.querySelectorAll(".booking-steps li").forEach(el => {
            const step = Number(el.dataset.step);
            el.classList.toggle("is-active", step === n);
            el.classList.toggle("is-done", step < n);
        });
        if (n === 4) renderSummary();
        /* Falls Bestätigungs-Container aktiv war, zurücksetzen */
        const confirm = document.querySelector('[data-step="5"]');
        if (confirm) confirm.hidden = true;
    }

    /* ------------------------------------------------------------------ */
    /* Formularverarbeitung                                                */
    /* ------------------------------------------------------------------ */
    function validateContactForm(form) {
        let valid = true;
        ["name","phone","email"].forEach(f => {
            const input = form.elements[f];
            const wrapper = input.closest(".field");
            if (!input.value.trim() || !input.checkValidity()) {
                wrapper.classList.add("error"); valid = false;
            } else { wrapper.classList.remove("error"); }
        });
        if (!form.elements.consent.checked) valid = false;
        return valid;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        if (!state.service || !state.date || !state.time) { goToStep(1); return; }
        if (!validateContactForm(form)) return;

        const booking = {
            id: `bk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
            createdAt: new Date().toISOString(),
            serviceId: state.service.id,
            serviceName: state.service.name,
            serviceDuration: state.service.duration,
            servicePrice: state.service.price,
            date: state.date,
            time: state.time,
            customer: {
                name: form.elements.name.value.trim(),
                phone: form.elements.phone.value.trim(),
                email: form.elements.email.value.trim(),
                notes: form.elements.notes.value.trim()
            }
        };

        BookingStore.saveBooking(booking);
        showConfirmation(booking);
    }

    function showConfirmation(booking) {
        document.querySelectorAll(".booking-step").forEach(el => el.classList.remove("is-active"));
        document.querySelectorAll(".booking-steps li").forEach(el => {
            el.classList.remove("is-active"); el.classList.add("is-done");
        });
        const confirm = document.querySelector('[data-step="5"]');
        confirm.hidden = false;
        document.getElementById("confirmationDetails").innerHTML = `
            <dl>
                <dt>Buchungsnummer</dt><dd>${booking.id}</dd>
                <dt>Behandlung</dt><dd>${booking.serviceName}</dd>
                <dt>Datum</dt><dd>${formatDateLong(fromISO(booking.date))}</dd>
                <dt>Uhrzeit</dt><dd>${booking.time} Uhr</dd>
                <dt>Preis</dt><dd>${formatPrice(booking.servicePrice)}</dd>
                <dt>Kontakt</dt><dd>${booking.customer.name}<br>${booking.customer.phone}<br>${booking.customer.email}</dd>
            </dl>
        `;
        confirm.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function resetBooking() {
        state.service = null;
        state.date = null;
        state.time = null;
        document.getElementById("bookingForm").reset();
        document.querySelectorAll(".picker-option").forEach(o => o.classList.remove("is-selected"));
        document.querySelectorAll('[data-next]').forEach(b => b.disabled = true);
        document.querySelector('[data-step="5"]').hidden = true;
        renderCalendar();
        renderSlots();
        goToStep(1);
    }

    /* ------------------------------------------------------------------ */
    /* Init                                                                */
    /* ------------------------------------------------------------------ */
    function init() {
        renderServiceCards();
        renderServicePicker();
        renderCalendar();
        renderSlots();

        document.querySelectorAll("[data-next]").forEach(btn => {
            btn.addEventListener("click", () => {
                const step = Number(btn.dataset.next);
                goToStep(step + 1);
            });
        });
        document.querySelectorAll("[data-prev]").forEach(btn => {
            btn.addEventListener("click", () => {
                const step = Number(btn.dataset.prev);
                goToStep(step - 1);
            });
        });

        const form = document.getElementById("bookingForm");
        form.addEventListener("submit", handleSubmit);
        document.getElementById("newBooking").addEventListener("click", resetBooking);
    }

    /* Öffentliche Referenz für spätere Backend-Anbindung */
    window.SerenitaBooking = { BookingStore, calculateAvailableSlots, CONFIG };

    if (document.readyState !== "loading") init();
    else document.addEventListener("DOMContentLoaded", init);
})();
