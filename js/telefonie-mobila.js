/* =====================================================
   TELEFONIE MOBILĂ (telefonie-mobila.html only)
   1. DATA   - all plans live in the PLANS list below. To update a price
               or add a plan, edit ONLY that list: the table, the
               "cheapest" cells and the savings finder all read from it.
   2. Savings finder ("Vezi cât poți economisi")
   3. Plans table with company filter
===================================================== */
(function () {

    /* ---------- 1. DATA ---------- */

    const UPDATED = "octombrie 2026";

    // signature = can you get the mobile signature (semnătură electronică mobilă) from this operator?
    const OPS = {
        orange:      { name: "Orange Moldova",      signature: true,  url: "https://www.orange.md/ro/abonament" },
        moldcell:    { name: "Moldcell",            signature: true,  url: "https://eshop.moldcell.md/ro/abonament/conectare" },
        moldtelecom: { name: "Moldtelecom (Unité)", signature: false, url: "https://www.moldtelecom.md/ro/mobile/" }
    };

    /* std        = standard price, lei / month
       promo      = promotional price (or null), promoMonths = how long it lasts
       promoNote  = shown when we know a discount exists but not the exact price
       gbNum      = GB included (9999 = unlimited), used for the "internet needed" filter */
    const PLANS = [
        { op: "orange", name: "One 170", std: 170, promo: 119, promoMonths: 12,
          promoWho: "la conectare, portare sau transfer de la PrePay",
          minutes: "450 min naționale", minutesNote: "+ nelimitat în rețeaua Orange",
          sms: "Incluse în cele 450 min/SMS", gb: "20 GB + 20 GB bonus", gbNum: 20, roaming: "13,29 GB" },
        { op: "orange", name: "One 220", std: 220, promo: 154, promoMonths: 12,
          promoWho: "la conectare, portare sau transfer de la PrePay",
          minutes: "Nelimitat național", minutesNote: "500 min spre UE/SEE + 50 min internaționale",
          sms: "Nelimitat", gb: "60 GB + 60 GB bonus", gbNum: 60, roaming: "17,20 GB" },
        { op: "orange", name: "One 300", std: 300, promo: 165, promoMonths: 12,
          promoWho: "la conectare, portare sau transfer de la PrePay",
          minutes: "Nelimitat național", minutesNote: "500 min spre UE/SEE + 50 min internaționale",
          sms: "Nelimitat", gb: "100 GB + 100 GB bonus", gbNum: 100, roaming: "23,45 GB" },
        { op: "orange", name: "One 400", std: 400, promo: null, promoNote: "Reducere posibilă, vezi la operator",
          minutes: "Nelimitat național", minutesNote: "500 min spre UE/SEE + 100 min internaționale",
          sms: "Nelimitat", gb: "Nelimitat", gbNum: 9999, roaming: "31,27 GB" },

        { op: "moldcell", name: "Lumo 100", std: 100, promo: null,
          minutes: "500 min naționale", minutesNote: "+ nelimitat în rețeaua Moldcell · ofertă regională",
          sms: "Incluse în cele 500 min/SMS", gb: "10 GB + 10 GB bonus", gbNum: 10, roaming: "8 GB" },
        { op: "moldcell", name: "Lumo 170", std: 170, promo: 110, promoMonths: 24,
          promoWho: "la conectare sau transfer, contract 24 luni",
          minutes: "600 min naționale", minutesNote: "+ nelimitat în rețeaua Moldcell",
          sms: "Incluse în cele 600 min/SMS", gb: "25 GB + 25 GB bonus", gbNum: 25, roaming: "14 GB" },
        { op: "moldcell", name: "Lumo 220", std: 220, promo: 120, promoMonths: 24,
          promoWho: "la conectare sau transfer, contract 24 luni",
          minutes: "Nelimitat național", minutesNote: "500 min UE + Ucraina, 50 min internaționale",
          sms: "Nelimitat", gb: "60 GB + 60 GB bonus", gbNum: 60, roaming: "18 GB" },
        { op: "moldcell", name: "Lumo 290", std: 290, promo: 160, promoMonths: 24,
          promoWho: "la conectare sau transfer, contract 24 luni",
          minutes: "Nelimitat național", minutesNote: "500 min UE + Ucraina, 50 min internaționale",
          sms: "Nelimitat", gb: "100 GB + 100 GB bonus", gbNum: 100, roaming: "23 GB" },
        { op: "moldcell", name: "Lumo 390", std: 390, promo: 195, promoMonths: 24,
          promoWho: "la conectare sau transfer, contract 24 luni",
          minutes: "Nelimitat național", minutesNote: "500 min UE + Ucraina, 100 min internaționale",
          sms: "Nelimitat", gb: "200 GB + 200 GB bonus", gbNum: 200, roaming: "31 GB" },

        { op: "moldtelecom", name: "Start 120", std: 120, promo: 95, promoMonths: 24,
          promoWho: "la conectare nouă sau portare; 80 lei cu internet fix Moldtelecom",
          minutes: "Nelimitat în rețeaua Moldtelecom", minutesNote: "Alte rețele: vezi la operator",
          sms: "Nelimitat în rețeaua Moldtelecom", gb: "Nelimitat*", gbNum: 9999, roaming: "Inclus*" },
        { op: "moldtelecom", name: "Flex 150", std: 150, promo: null, promoNote: "Reducere lunară posibilă, vezi la operator",
          minutes: "Nelimitat în rețeaua Moldtelecom", minutesNote: "Alte rețele: vezi la operator",
          sms: "Nelimitat în rețeaua Moldtelecom", gb: "Nelimitat*", gbNum: 9999, roaming: "Inclus*" },
        { op: "moldtelecom", name: "Liberty 200", std: 200, promo: null, promoNote: "Reducere lunară posibilă, vezi la operator",
          minutes: "Nelimitat în rețeaua Moldtelecom", minutesNote: "Alte rețele: vezi la operator",
          sms: "Nelimitat în rețeaua Moldtelecom", gb: "Nelimitat*", gbNum: 9999, roaming: "Inclus*" },
        { op: "moldtelecom", name: "Liberty Plus 290", std: 290, promo: null, promoNote: "Reducere lunară posibilă, vezi la operator",
          minutes: "Nelimitat în rețeaua Moldtelecom", minutesNote: "Alte rețele: vezi la operator",
          sms: "Nelimitat în rețeaua Moldtelecom", gb: "Nelimitat*", gbNum: 9999, roaming: "Inclus*" }
    ];

    /* ---------- helpers ---------- */

    const $ = (id) => document.getElementById(id);
    const digits = (v) => Number(String(v).replace(/[^\d]/g, "")) || 0;
    const fmt = (n) => {
        const r = Math.round(n);
        return (r < 0 ? "-" : "") + String(Math.abs(r)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    const dec = (n) => (Math.round(n * 10) / 10).toString().replace(".", ",");
    const eff = (p) => (p.promo !== null && p.promo !== undefined ? p.promo : p.std);

    // average cost per month over 24 months (promo first, standard after)
    const total24 = (p) => {
        if (p.promo === null || p.promo === undefined) return p.std * 24;
        const m = Math.min(p.promoMonths || 12, 24);
        return p.promo * m + p.std * (24 - m);
    };

    /* ---------- 2. SAVINGS FINDER ---------- */

    const spendInput = $("pmSpend");
    const typeSel    = $("pmType");
    const gbSel      = $("pmGb");
    const sigSel     = $("pmSig");
    const btn        = $("pmBtn");
    const results    = $("pmResults");

    if (spendInput && btn && results) {

        const refreshBtn = () => { btn.disabled = digits(spendInput.value) === 0; };

        spendInput.addEventListener("input", () => {
            const raw = spendInput.value.replace(/[^\d]/g, "").slice(0, 5);
            spendInput.value = raw ? fmt(Number(raw)) : "0";
            refreshBtn();
        });
        spendInput.addEventListener("focus", () => {
            if (spendInput.value === "0") spendInput.value = "";
            else setTimeout(() => spendInput.select(), 0);
        });
        spendInput.addEventListener("blur", () => {
            if (!spendInput.value.trim()) spendInput.value = "0";
            refreshBtn();
        });
        spendInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !btn.disabled) { e.preventDefault(); btn.click(); spendInput.blur(); }
        });

        refreshBtn();

        const optionCard = (p, spend, isBest) => {
            const op = OPS[p.op];
            const hasPromo = p.promo !== null && p.promo !== undefined;
            const months = p.promoMonths || 12;
            const saveNow = spend - eff(p);
            const saveAfter = spend - p.std;
            const save24 = spend * 24 - total24(p);

            let lines = `<p class="body2 pm-save">Economisești <strong>${fmt(saveNow)} lei/lună</strong> (${fmt(saveNow * 12)} lei/an)`;
            if (hasPromo) {
                lines += ` <span class="pm-sub">în primele ${months} luni</span>`;
            }
            lines += `</p>`;

            if (hasPromo && months < 24 || hasPromo && p.std >= spend) {
                lines += saveAfter > 0
                    ? `<p class="small-secondary">După ofertă: ${fmt(p.std)} lei/lună, tot cu ${fmt(saveAfter)} lei mai puțin decât acum.</p>`
                    : `<p class="small-secondary">După ofertă prețul devine ${fmt(p.std)} lei/lună${saveAfter < 0 ? `, cu ${fmt(-saveAfter)} lei mai mult decât plătești acum` : ""}.</p>`;
            }
            if (hasPromo) {
                lines += `<p class="small-secondary">Pe 24 de luni: ${save24 >= 0 ? "economisești" : "plătești în plus"} ≈ <strong>${fmt(Math.abs(save24))} lei</strong>.</p>`;
            }

            return `
            <article class="pm-option">
                <div class="pm-option-head">
                    <div>
                        <p class="small-secondary">${op.name}</p>
                        <h3 class="h5">${p.name}</h3>
                    </div>
                    <div class="pm-price">
                        ${isBest ? '<span class="pm-badge">Cel mai ieftin</span>' : ""}
                        <strong>${fmt(eff(p))} lei</strong><span class="small-secondary"> / lună</span>
                        ${hasPromo ? `<span class="small-secondary pm-strike">standard ${fmt(p.std)} lei</span>` : ""}
                    </div>
                </div>
                <ul class="pm-chips">
                    <li>${p.gb}</li>
                    <li>${p.minutes}</li>
                    <li class="${op.signature ? "pm-chip-yes" : "pm-chip-no"}">${op.signature ? "✓" : "✕"} Semnătură mobilă</li>
                </ul>
                ${lines}
                ${hasPromo ? `<p class="small-secondary pm-fine">Prețul redus se aplică ${p.promoWho}. Dacă ești deja client al operatorului, condițiile pot diferi.</p>` : ""}
                <a class="pm-link" href="${op.url}" target="_blank" rel="noopener">Vezi oferta pe site-ul ${op.name.split(" (")[0]}</a>
            </article>`;
        };

        const calculate = () => {
            const spend = digits(spendInput.value);
            if (!spend) return;

            const minGb = Number(gbSel.value);
            const needSig = sigSel.value === "1";

            const fits = PLANS.filter((p) => p.gbNum >= minGb && (!needSig || OPS[p.op].signature));
            const cheaper = fits
                .filter((p) => eff(p) < spend)
                .sort((a, b) => eff(a) - eff(b) || b.gbNum - a.gbNum);
            const cheaperAny = PLANS.filter((p) => eff(p) < spend);

            let html = "";

            if (cheaper.length) {
                const best = spend - eff(cheaper[0]);
                const shown = cheaper.slice(0, 5);
                html += `
                <div class="result-highlight">
                    <span class="result-label">Poți economisi până la</span>
                    <span class="result-value">${fmt(best)} lei / lună</span>
                    <span class="result-label">≈ ${fmt(best * 12)} lei pe an · ${cheaper.length} ${cheaper.length === 1 ? "abonament costă" : "abonamente costă"} mai puțin decât plătești acum</span>
                </div>
                <div class="pm-options">${shown.map((p, i) => optionCard(p, spend, i === 0)).join("")}</div>
                ${cheaper.length > shown.length ? `<p class="body2">Mai sunt ${cheaper.length - shown.length} abonamente mai ieftine în <a href="#comparatie">tabelul de mai jos</a>.</p>` : ""}`;
            } else if (cheaperAny.length) {
                html += `
                <div class="pm-empty">
                    <h3 class="h5">Nu am găsit nimic mai ieftin cu filtrele alese</h3>
                    <p class="body2">Există ${cheaperAny.length} abonamente care costă mai puțin decât plătești acum, dar nu ating internetul sau semnătura mobilă pe care le-ai cerut. Încearcă să relaxezi unul dintre filtre.</p>
                </div>`;
            } else {
                const cheapest = Math.min(...PLANS.map(eff));
                html += `
                <div class="pm-empty">
                    <h3 class="h5">Plătești deja mai puțin decât oricare abonament din listă</h3>
                    <p class="body2">Cel mai ieftin abonament din tabel costă ${fmt(cheapest)} lei/lună. Dacă plătești mai puțin, probabil folosești puțin telefonul și ai deja o variantă potrivită. Verifică în continuare sfaturile de mai jos și revino când se schimbă ofertele.</p>
                </div>`;
            }

            if (typeSel.value === "prepay") {
                html += `<p class="small-secondary">Ai cartelă (prepay), deci poți trece oricând la abonament. Atenție: abonamentele vin cu contract de 12 sau 24 de luni și penalități la reziliere anticipată. Citește mai jos <a href="#abonament-vs-prepay">când merită abonamentul</a>.</p>`;
            } else {
                html += `<p class="small-secondary">Ai deja abonament: verifică în contract perioada minimă și penalitățile înainte de a-l schimba. Cel mai ușor se trece prin portare, păstrând numărul.</p>`;
            }
            html += `<p class="small-secondary">Prețuri în lei, preluate de pe site-urile operatorilor în ${UPDATED}. Prețul final îl confirmă operatorul.</p>`;

            results.innerHTML = html;
            results.hidden = false;
        };

        btn.addEventListener("click", () => {
            calculate();
            results.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        [typeSel, gbSel, sigSel].forEach((el) => el?.addEventListener("change", () => {
            if (!results.hidden) calculate();
        }));
    }

    /* ---------- 3. PLANS TABLE ---------- */

    const tbody = $("plansBody");

    if (tbody) {
        const priceCell = (p) => {
            const hasPromo = p.promo !== null && p.promo !== undefined;
            return hasPromo
                ? `<strong>${fmt(p.promo)}</strong><span class="pm-sub">standard ${fmt(p.std)}</span>`
                : `<strong>${fmt(p.std)}</strong>`;
        };
        const offerCell = (p) => {
            if (p.promo !== null && p.promo !== undefined) {
                return `<span class="pm-yes">Da</span><span class="pm-sub">${p.promoMonths} luni</span>`;
            }
            return p.promoNote
                ? `Posibil<span class="pm-sub">${p.promoNote}</span>`
                : "Nu";
        };

        const render = (filter) => {
            let html = "";
            Object.keys(OPS).forEach((key) => {
                if (filter !== "all" && filter !== key) return;
                const op = OPS[key];
                html += `<tr class="plans-group"><th colspan="8"><span>${op.name}</span></th></tr>`;
                PLANS.filter((p) => p.op === key).forEach((p) => {
                    html += `
                    <tr>
                        <td><strong>${p.name}</strong></td>
                        <td>${priceCell(p)}</td>
                        <td>${offerCell(p)}</td>
                        <td>${p.minutes}<span class="pm-sub">${p.minutesNote}</span></td>
                        <td>${p.sms}</td>
                        <td>${p.gb}</td>
                        <td>${p.roaming}</td>
                        <td>${op.signature ? '<span class="pm-yes">✓ Da</span>' : '<span class="pm-no">✕ Nu</span>'}</td>
                    </tr>`;
                });
            });
            tbody.innerHTML = html;
        };

        render("all");

        document.querySelectorAll("#pmTabs .tab-item").forEach((tab) => {
            tab.addEventListener("click", () => {
                document.querySelectorAll("#pmTabs .tab-item").forEach((t) => t.classList.remove("active"));
                tab.classList.add("active");
                render(tab.dataset.op);
            });
        });
    }

    /* ---------- cheapest plan per company (company comparison table) ---------- */

    document.querySelectorAll("[data-cheapest]").forEach((cell) => {
        const list = PLANS.filter((p) => p.op === cell.dataset.cheapest);
        if (!list.length) return;
        const best = list.reduce((a, b) => (eff(b) < eff(a) ? b : a));
        const hasPromo = best.promo !== null && best.promo !== undefined;
        cell.innerHTML = `${best.name}: <strong>${fmt(eff(best))} lei</strong>` +
            (hasPromo ? `<span class="pm-sub">la ofertă · standard ${fmt(best.std)} lei</span>` : `<span class="pm-sub">preț standard</span>`);
    });

    document.querySelectorAll("[data-updated]").forEach((el) => { el.textContent = UPDATED; });
})();
