/**
 * Haupt-Interaktion: Navigation, Scroll-Effekte, Animationen, Kontaktformular
 */

(function () {
    "use strict";

    /* Copyright-Jahr */
    const yearEl = document.getElementById("copyYear");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ----------------------------- Header-Scroll ----------------------------- */
    const header = document.getElementById("siteHeader");
    const onScroll = () => {
        if (window.scrollY > 20) header.classList.add("is-scrolled");
        else header.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ----------------------------- Mobile Menü ----------------------------- */
    const navToggle = document.querySelector(".nav-toggle");
    const navList = document.getElementById("mainMenu");

    function closeMenu() {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Menü öffnen");
        navList.classList.remove("is-open");
        document.body.style.overflow = "";
    }
    function openMenu() {
        navToggle.setAttribute("aria-expanded", "true");
        navToggle.setAttribute("aria-label", "Menü schließen");
        navList.classList.add("is-open");
        document.body.style.overflow = "hidden";
    }
    navToggle.addEventListener("click", () => {
        const open = navToggle.getAttribute("aria-expanded") === "true";
        open ? closeMenu() : openMenu();
    });
    navList.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

    /* -------------------------- Scroll-Animationen -------------------------- */
    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: "0px 0px -80px 0px", threshold: 0.05 });

        function observeAll() {
            document.querySelectorAll("[data-animate]:not(.is-visible)").forEach(el => io.observe(el));
        }
        observeAll();
        /* Neu gerenderte Service-Karten mit einbeziehen */
        setTimeout(observeAll, 100);
    } else {
        document.querySelectorAll("[data-animate]").forEach(el => el.classList.add("is-visible"));
    }

    /* ----------------------------- Kontaktformular ----------------------------- */
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const status = document.getElementById("contactStatus");
            const fd = new FormData(contactForm);
            let valid = true;

            ["name", "email", "message"].forEach(field => {
                const input = contactForm.elements[field];
                const wrapper = input.closest(".field");
                if (!input.value.trim() || !input.checkValidity()) {
                    wrapper.classList.add("error"); valid = false;
                } else { wrapper.classList.remove("error"); }
            });
            if (!contactForm.elements.consent.checked) valid = false;

            if (!valid) {
                status.className = "form-status error";
                status.textContent = "Bitte füllen Sie alle Pflichtfelder korrekt aus.";
                return;
            }

            /* Persistenz für Demo-Zwecke; im Live-Betrieb per fetch() an ein Backend/Mail-Endpoint schicken */
            try {
                const stored = JSON.parse(localStorage.getItem("serenita.messages") || "[]");
                stored.push({
                    createdAt: new Date().toISOString(),
                    name: fd.get("name"),
                    email: fd.get("email"),
                    message: fd.get("message")
                });
                localStorage.setItem("serenita.messages", JSON.stringify(stored));
            } catch (err) { /* ignore */ }

            contactForm.reset();
            status.className = "form-status";
            status.textContent = "Vielen Dank – wir melden uns innerhalb eines Werktages.";
        });
    }

    /* ----------------------------- Smooth-Scroll für interne Anker ----------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", (e) => {
            const id = link.getAttribute("href");
            if (id.length <= 1) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const headerH = header.offsetHeight;
            const y = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
            window.scrollTo({ top: y, behavior: "smooth" });
        });
    });
})();
