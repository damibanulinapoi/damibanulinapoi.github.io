/* =====================================================
   TELEFONIE MOBILĂ (telefonie-mobila.html, abonamente-mobile.html, compara-abonamente.html)
   1. DATA   - every plan lives in the DATA list below (one row = one line
               of the Excel "Abonamente telefonie mobilă"). To update a
               price or add a plan, edit ONLY that list: the shop page, the comparison
               page, the "cheapest" cells and the savings finder all read from it.
   2. Savings finder ("Vezi cât poți economisi")
   3. Shared plan details (used by the shop and comparison pages)
   4. Shop page (abonamente-mobile.html): cards, sort, filters, details
   5. Comparison page (compara-abonamente.html)
===================================================== */
(function () {

    /* ---------- 1. DATA ---------- */

    const UPDATED = "octombrie 2026";

    // url = where the operator shows its offers
    const OPS = {
        orange:      { name: "Orange Moldova",      url: "https://www.orange.md/ro/abonament" },
        moldcell:    { name: "Moldcell",            url: "https://eshop.moldcell.md/ro/abonament/conectare" },
        moldtelecom: { name: "Moldtelecom (Unité)", url: "https://www.moldtelecom.md/ro/mobile/" }
    };

    /* Field meaning (same as the Excel columns):
       name, op          = plan name, operator
       months            = minimum contract in months (null = none / not stated)
       c12               = price per month in the first 12 months (lei)
       c24               = price per month in months 13-24 (only 24-month contracts)
       cAfter            = price per month after the contract ends
                           (null = the plan has only one price, c12)
       gbOffer, gbAfter  = internet during the offer / after the offer
                           (number = GB, text as written: "40 GB*" = bonus valid 24 months,
                            "40 GB**" = unlimited above the included GB, reduced speed)
       roamUE            = internet in EU roaming (GB)
       netMin            = minutes/SMS inside the operator's network
       natMin            = national minutes/SMS ("600/100" = 600 min / 100 SMS)
       intl, intlUE, nonUE = international minutes: total / to EU / to non-EU
       roamNonUE         = internet in non-EU roaming (GB, or text like "500 MB")
       offer             = who gets this price
       sig               = mobile signature: "Da" / "Nu"                          */
    const DATA = [
        {"name": "Start 5G", "op": "Moldtelecom", "months": 24, "c12": 85, "c24": 120, "cAfter": 170, "gbOffer": "40 GB**", "gbAfter": null, "roamUE": 13.3, "netMin": "nelimitat", "natMin": "600/100", "intl": null, "intlUE": null, "nonUE": null, "roamNonUE": null, "offer": "Conectare/ Portare/ Transfer PrePay", "sig": "Nu"},
        {"name": "Pro 5G", "op": "Moldtelecom", "months": 24, "c12": 105, "c24": 150, "cAfter": 210, "gbOffer": "75 GB**", "gbAfter": null, "roamUE": 16.43, "netMin": "nelimitat", "natMin": "nelimitat", "intl": 50, "intlUE": null, "nonUE": null, "roamNonUE": null, "offer": "Conectare/ Portare/ Transfer PrePay", "sig": "Nu"},
        {"name": "Plus 5G", "op": "Moldtelecom", "months": 24, "c12": 145, "c24": 220, "cAfter": 290, "gbOffer": "100 GB**", "gbAfter": null, "roamUE": 22.68, "netMin": "nelimitat", "natMin": "nelimitat", "intl": 100, "intlUE": null, "nonUE": null, "roamNonUE": null, "offer": "Conectare/ Portare/ Transfer PrePay", "sig": "Nu"},
        {"name": "Max 5G", "op": "Moldtelecom", "months": 24, "c12": 195, "c24": 280, "cAfter": 390, "gbOffer": "200 GB**", "gbAfter": null, "roamUE": 30.51, "netMin": "nelimitat", "natMin": "nelimitat", "intl": 200, "intlUE": null, "nonUE": null, "roamNonUE": 1, "offer": "Conectare/ Portare/ Transfer PrePay", "sig": "Nu"},
        {"name": "Lumo 100", "op": "Moldcell", "months": 12, "c12": 100, "c24": null, "cAfter": 100, "gbOffer": 20, "gbAfter": 10, "roamUE": 8, "netMin": "nelimitat", "natMin": 500, "intl": null, "intlUE": null, "nonUE": null, "roamNonUE": null, "offer": "Conectare/ Portare/ Transfer PrePay", "sig": "Da"},
        {"name": "Lumo 170", "op": "Moldcell", "months": 12, "c12": 110, "c24": null, "cAfter": 170, "gbOffer": 50, "gbAfter": 25, "roamUE": 14, "netMin": "nelimitat", "natMin": 600, "intl": null, "intlUE": null, "nonUE": null, "roamNonUE": null, "offer": "Conectare/ Portare/ Transfer PrePay", "sig": "Da"},
        {"name": "Lumo 220", "op": "Moldcell", "months": 12, "c12": 150, "c24": null, "cAfter": 220, "gbOffer": 60, "gbAfter": 30, "roamUE": 18, "netMin": "nelimitat", "natMin": "nelimitat", "intl": 50, "intlUE": 500, "nonUE": null, "roamNonUE": null, "offer": "Conectare/ Portare/ Transfer PrePay", "sig": "Da"},
        {"name": "Lumo 290", "op": "Moldcell", "months": 12, "c12": 160, "c24": null, "cAfter": 290, "gbOffer": 200, "gbAfter": 100, "roamUE": 23, "netMin": "nelimitat", "natMin": "nelimitat", "intl": 50, "intlUE": 500, "nonUE": 30, "roamNonUE": 1, "offer": "Conectare/ Portare/ Transfer PrePay", "sig": "Da"},
        {"name": "Lumo 390", "op": "Moldcell", "months": 12, "c12": 195, "c24": null, "cAfter": 390, "gbOffer": 400, "gbAfter": 200, "roamUE": 31, "netMin": "nelimitat", "natMin": "nelimitat", "intl": 100, "intlUE": 500, "nonUE": 30, "roamNonUE": 2, "offer": "Conectare/ Portare/ Transfer PrePay", "sig": "Da"},
        {"name": "One 170", "op": "Orange", "months": 12, "c12": 119, "c24": null, "cAfter": 170, "gbOffer": "40 GB*", "gbAfter": 20, "roamUE": 13.29, "netMin": "nelimitat", "natMin": 450, "intl": null, "intlUE": null, "nonUE": null, "roamNonUE": null, "offer": "Conectare/ Portare/ Transfer PrePay", "sig": "Da"},
        {"name": "One 220", "op": "Orange", "months": 12, "c12": 154, "c24": null, "cAfter": 220, "gbOffer": "120 GB*", "gbAfter": 60, "roamUE": 17.2, "netMin": "nelimitat", "natMin": "nelimitat", "intl": 50, "intlUE": 500, "nonUE": null, "roamNonUE": null, "offer": "Conectare/ Portare/ Transfer PrePay", "sig": "Da"},
        {"name": "One 300", "op": "Orange", "months": 12, "c12": 165, "c24": null, "cAfter": 300, "gbOffer": "200 GB*", "gbAfter": 100, "roamUE": 23.45, "netMin": "nelimitat", "natMin": "nelimitat", "intl": 50, "intlUE": 500, "nonUE": 30, "roamNonUE": "500 MB", "offer": "Conectare/ Portare/ Transfer PrePay", "sig": "Da"},
        {"name": "One 400", "op": "Orange", "months": 12, "c12": 200, "c24": null, "cAfter": 400, "gbOffer": "Nelimitat*", "gbAfter": "Nelimitat", "roamUE": 31.27, "netMin": "nelimitat", "natMin": "nelimitat", "intl": 100, "intlUE": 500, "nonUE": 30, "roamNonUE": "500 MB", "offer": "Conectare/ Portare/ Transfer PrePay", "sig": "Da"},
        {"name": "Start 5G", "op": "Moldtelecom", "months": null, "c12": 170, "c24": null, "cAfter": null, "gbOffer": "40 GB**", "gbAfter": null, "roamUE": 13.3, "netMin": "nelimitat", "natMin": "600/100", "intl": null, "intlUE": null, "nonUE": null, "roamNonUE": null, "offer": "Modificare", "sig": "Nu"},
        {"name": "Pro 5G", "op": "Moldtelecom", "months": null, "c12": 210, "c24": null, "cAfter": null, "gbOffer": "75 GB**", "gbAfter": null, "roamUE": 16.43, "netMin": "nelimitat", "natMin": "nelimitat", "intl": 50, "intlUE": null, "nonUE": null, "roamNonUE": null, "offer": "Modificare", "sig": "Nu"},
        {"name": "Plus 5G", "op": "Moldtelecom", "months": null, "c12": 290, "c24": null, "cAfter": null, "gbOffer": "100 GB**", "gbAfter": null, "roamUE": 22.68, "netMin": "nelimitat", "natMin": "nelimitat", "intl": 100, "intlUE": null, "nonUE": null, "roamNonUE": null, "offer": "Modificare", "sig": "Nu"},
        {"name": "Max 5G", "op": "Moldtelecom", "months": null, "c12": 390, "c24": null, "cAfter": null, "gbOffer": "200 GB**", "gbAfter": null, "roamUE": 30.51, "netMin": "nelimitat", "natMin": "nelimitat", "intl": 200, "intlUE": null, "nonUE": null, "roamNonUE": 1, "offer": "Modificare", "sig": "Nu"},
        {"name": "Lumo 100", "op": "Moldcell", "months": null, "c12": 100, "c24": null, "cAfter": null, "gbOffer": 10, "gbAfter": null, "roamUE": 8, "netMin": "nelimitat", "natMin": 500, "intl": null, "intlUE": null, "nonUE": null, "roamNonUE": null, "offer": "Modificare", "sig": "Da"},
        {"name": "Lumo 170", "op": "Moldcell", "months": null, "c12": 170, "c24": null, "cAfter": null, "gbOffer": 25, "gbAfter": null, "roamUE": 14, "netMin": "nelimitat", "natMin": 600, "intl": null, "intlUE": 500, "nonUE": null, "roamNonUE": null, "offer": "Modificare", "sig": "Da"},
        {"name": "Lumo 220", "op": "Moldcell", "months": null, "c12": 220, "c24": null, "cAfter": null, "gbOffer": 60, "gbAfter": null, "roamUE": 18, "netMin": "nelimitat", "natMin": "nelimitat", "intl": 50, "intlUE": 500, "nonUE": null, "roamNonUE": null, "offer": "Modificare", "sig": "Da"},
        {"name": "Lumo 290", "op": "Moldcell", "months": null, "c12": 290, "c24": null, "cAfter": null, "gbOffer": 100, "gbAfter": null, "roamUE": 23, "netMin": "nelimitat", "natMin": "nelimitat", "intl": 50, "intlUE": 500, "nonUE": 30, "roamNonUE": 1, "offer": "Modificare", "sig": "Da"},
        {"name": "Lumo 390", "op": "Moldcell", "months": null, "c12": 390, "c24": null, "cAfter": null, "gbOffer": 200, "gbAfter": null, "roamUE": 31, "netMin": "nelimitat", "natMin": "nelimitat", "intl": 100, "intlUE": 500, "nonUE": 30, "roamNonUE": 2, "offer": "Modificare", "sig": "Da"},
        {"name": "One 170", "op": "Orange", "months": 6, "c12": 170, "c24": null, "cAfter": null, "gbOffer": "40 GB*", "gbAfter": 20, "roamUE": 13.29, "netMin": "nelimitat", "natMin": 450, "intl": null, "intlUE": null, "nonUE": null, "roamNonUE": null, "offer": "Modificare", "sig": "Da"},
        {"name": "One 220", "op": "Orange", "months": 6, "c12": 220, "c24": null, "cAfter": null, "gbOffer": "120 GB*", "gbAfter": 60, "roamUE": 17.2, "netMin": "nelimitat", "natMin": "nelimitat", "intl": 50, "intlUE": 500, "nonUE": null, "roamNonUE": null, "offer": "Modificare", "sig": "Da"},
        {"name": "One 300", "op": "Orange", "months": 6, "c12": 300, "c24": null, "cAfter": null, "gbOffer": "200 GB*", "gbAfter": 100, "roamUE": 23.45, "netMin": "nelimitat", "natMin": "nelimitat", "intl": 50, "intlUE": 500, "nonUE": 30, "roamNonUE": "500 MB", "offer": "Modificare", "sig": "Da"},
        {"name": "One 400", "op": "Orange", "months": 6, "c12": 400, "c24": null, "cAfter": null, "gbOffer": "Nelimitat*", "gbAfter": "Nelimitat", "roamUE": 31.27, "netMin": "nelimitat", "natMin": "nelimitat", "intl": 100, "intlUE": 500, "nonUE": 30, "roamNonUE": "500 MB", "offer": "Modificare", "sig": "Da"}
    ];

    /* ---------- helpers ---------- */

    const $ = (id) => document.getElementById(id);
    const digits = (v) => Number(String(v).replace(/[^\d]/g, "")) || 0;
    const fmt = (n) => {
        const r = Math.round(n);
        return (r < 0 ? "-" : "") + String(Math.abs(r)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    // 13.29 -> "13,29", 8 -> "8"
    const dec = (n) => String(Math.round(n * 100) / 100).replace(".", ",");
    const has = (v) => v !== null && v !== undefined;

    // readable id used in links, e.g. "orange-one-170-offer"
    const slug = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const ROWS = DATA.map((d, i) => ({
        ...d,
        i,
        key: d.op.toLowerCase(),
        // a new-customer offer (Conectare / Portare / Transfer) or a standard price (Modificare)
        kind: /Conectare/.test(d.offer) ? "offer" : "standard",
        id: slug(d.op + " " + d.name + " " + (/Conectare/.test(d.offer) ? "offer" : "standard")),
        // average price per month over the whole offer period (24-month contracts have two prices)
        avg: has(d.c24) ? (d.c12 + d.c24) / 2 : d.c12,
        avgApprox: has(d.c24)
    }));

    /* ----- internet text -> numbers ----- */

    // for sorting: the GB written in the cell ("40 GB**" -> 40), "Nelimitat" -> 9999
    const gbSortVal = (v) => {
        if (!has(v)) return null;
        if (typeof v === "number") return v;
        if (/nelimitat/i.test(v)) return 9999;
        const n = parseFloat(v);
        return isNaN(n) ? null : n;
    };
    // for the finder: what you keep after the offer; "**" and "Nelimitat" count as unlimited
    const gbFinderVal = (r) => {
        const v = has(r.gbAfter) ? r.gbAfter : r.gbOffer;
        if (typeof v === "string" && (/nelimitat/i.test(v) || /\*\*/.test(v))) return 9999;
        return gbSortVal(v) || 0;
    };

    // "Nelimitat*" -> "GB nelimitat*", so the word does not stand alone
    const gbText = (v) => (typeof v === "number" ? dec(v) + " GB" : String(v).replace(/^nelimitat/i, "GB nelimitat"));

    /* ----- minutes ----- */

    const natSortVal = (v) => {
        if (!has(v)) return null;
        if (typeof v === "number") return v;
        if (/nelimitat/i.test(v)) return 99999;
        const n = parseFloat(v);
        return isNaN(n) ? null : n;
    };
    const natText = (v) => {
        if (!has(v)) return null;
        if (typeof v === "number") return v + " min";
        if (/nelimitat/i.test(v)) return "Nelimitat";
        if (v.includes("/")) {
            const [m, s] = v.split("/").map((x) => x.trim());
            return m + " min / " + s + " SMS";
        }
        return v;
    };
    const natLong = (v) => {
        const t = natText(v);
        if (t === "Nelimitat") return "Nelimitat național";
        return t && !t.includes("SMS") ? t.replace(" min", " min naționale") : t;
    };

    /* ----- non-EU roaming -> MB for sorting ----- */

    const roamNonSortVal = (v) => {
        if (!has(v)) return null;
        if (typeof v === "number") return v * 1000;
        const n = parseFloat(v);
        if (isNaN(n)) return null;
        return /gb/i.test(v) ? n * 1000 : n;
    };
    const roamNonText = (v) => (typeof v === "number" ? dec(v) + " GB" : v);

    /* ---------- 2. SAVINGS FINDER ---------- */

    /* The finder only uses plans a new customer can get for everyone:
       rows that start with "Conectare" and have a price after the offer.
       (Youth / senior plans and plan-change rows stay in the table only.)  */
    /* isNew    = the row is for new customers (Conectare / Portare / Transfer PrePay)
       isChange = the row is for someone who already has an abonament at that operator
                  and moves to another plan ("Modificare"); its price is the standard price */
    const ALL = ROWS
        .map((r) => {
            const promo = has(r.cAfter) && r.c12 !== r.cAfter;   // Lumo 100 has the same price all the way
            const second = has(r.c24) ? r.c24 : (has(r.cAfter) ? r.cAfter : r.c12);   // price in months 13-24
            return {
                ...r,
                isNew: /Conectare/.test(r.offer) && has(r.cAfter),
                isChange: /Modificare/.test(r.offer),
                promo,
                eff: r.c12,
                gbNum: gbFinderVal(r),
                total24: r.c12 * 12 + second * 12,
                second
            };
        });

    // new-customer plans only (used for the "cheapest plan" cells)
    const PLANS = ALL.filter((p) => p.isNew);

    /* Which plans can this person actually get?
       - abonament at operator X: not X's new-customer plans, but X's "Modificare" plans;
         every other operator's new-customer plans (portare)
       - cartelă (prepay) or an operator not listed: all new-customer plans */
    const available = (type, op) => ALL.filter((p) =>
        type === "abonament" && p.key === op ? p.isChange : p.isNew
    );

    const gbDisplay = (p) => {
        const a = gbText(p.gbOffer);
        if (!has(p.gbAfter)) return a;
        if (gbSortVal(p.gbAfter) === gbSortVal(p.gbOffer)) return a;
        return a + ", apoi " + gbText(p.gbAfter);
    };

    const spendInput = $("pmSpend");
    const typeSel    = $("pmType");
    const opSel      = $("pmOp");
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

        // the operator only matters when you already have an abonament
        const opRow = $("pmOpRow");
        const syncOpRow = () => { if (opRow) opRow.hidden = typeSel.value !== "abonament"; };
        typeSel.addEventListener("change", syncOpRow);
        syncOpRow();

        const optionCard = (p, spend, isBest) => {
            const op = OPS[p.key];
            const saveNow = spend - p.eff;
            const save24 = spend * 24 - p.total24;

            let lines = `<p class="body2 pm-save">Economisești <strong>${fmt(saveNow)} lei/lună</strong> (${fmt(saveNow * 12)} lei/an)`;
            if (p.promo) lines += ` <span class="pm-sub">în primele 12 luni</span>`;
            lines += `</p>`;

            if (p.promo) {
                const next = has(p.c24)
                    ? `Din luna 13: ${fmt(p.c24)} lei/lună, iar după ${p.months} luni: ${fmt(p.cAfter)} lei/lună.`
                    : `După primele 12 luni: ${fmt(p.cAfter)} lei/lună${p.cAfter > spend ? `, cu ${fmt(p.cAfter - spend)} lei mai mult decât plătești acum` : ""}.`;
                lines += `<p class="small-secondary">${next}</p>`;
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
                        <strong>${fmt(p.eff)} lei</strong><span class="small-secondary"> / lună</span>
                        ${p.promo ? `<span class="small-secondary pm-strike">după ofertă ${fmt(p.cAfter)} lei</span>` : ""}
                    </div>
                </div>
                <ul class="pm-chips">
                    <li>${gbDisplay(p)}</li>
                    <li>${natLong(p.natMin)}</li>
                    ${has(p.months) ? `<li>Contract ${p.months} luni</li>` : ""}
                    <li class="${p.sig === "Da" ? "pm-chip-yes" : "pm-chip-no"}">${p.sig === "Da" ? "✓" : "✕"} Semnătură mobilă</li>
                </ul>
                ${lines}
                <p class="small-secondary pm-fine">${p.isNew
                    ? `Prețul se aplică la: ${p.offer.split("/").map((s) => s.trim()).join(", ")}.`
                    : `Prețul standard la trecerea de la alt abonament ${op.name.split(" (")[0]} (fără ofertă pentru clienți noi).`}</p>
                <a class="pm-link" href="${op.url}" target="_blank" rel="noopener">Vezi oferta pe site-ul ${op.name.split(" (")[0]}</a>
            </article>`;
        };

        const calculate = () => {
            const spend = digits(spendInput.value);
            if (!spend) return;

            const minGb = Number(gbSel.value);
            const needSig = sigSel.value === "1";

            const pool = available(typeSel.value, opSel ? opSel.value : "other");
            const fits = pool.filter((p) => p.gbNum >= minGb && (!needSig || p.sig === "Da"));
            const cheaper = fits
                .filter((p) => p.eff < spend)
                .sort((a, b) => a.eff - b.eff || b.gbNum - a.gbNum);
            const cheaperAny = pool.filter((p) => p.eff < spend);

            let html = "";

            if (cheaper.length) {
                const best = spend - cheaper[0].eff;
                const shown = cheaper.slice(0, 5);
                html += `
                <div class="result-highlight">
                    <span class="result-label">Poți economisi până la</span>
                    <span class="result-value">${fmt(best)} lei / lună</span>
                    <span class="result-label">≈ ${fmt(best * 12)} lei pe an · ${cheaper.length} ${cheaper.length === 1 ? "abonament costă" : "abonamente costă"} mai puțin decât plătești acum</span>
                </div>
                <div class="pm-options">${shown.map((p, i) => optionCard(p, spend, i === 0)).join("")}</div>
                ${cheaper.length > shown.length ? `<p class="body2">Mai sunt ${cheaper.length - shown.length} abonamente mai ieftine în <a href="abonamente-mobile.html">pagina cu toate abonamentele</a>.</p>` : ""}`;
            } else if (cheaperAny.length) {
                html += `
                <div class="pm-empty">
                    <h3 class="h5">Nu am găsit nimic mai ieftin cu filtrele alese</h3>
                    <p class="body2">Există ${cheaperAny.length} abonamente care costă mai puțin decât plătești acum, dar nu ating internetul sau semnătura mobilă pe care le-ai cerut. Încearcă să relaxezi unul dintre filtre.</p>
                </div>`;
            } else {
                const cheapest = Math.min(...pool.map((p) => p.eff));
                html += `
                <div class="pm-empty">
                    <h3 class="h5">Plătești deja mai puțin decât oricare abonament din listă</h3>
                    <p class="body2">Cel mai ieftin abonament la care poți trece costă ${fmt(cheapest)} lei/lună. Dacă plătești mai puțin, probabil folosești puțin telefonul și ai deja o variantă potrivită. Verifică în continuare sfaturile de mai jos și revino când se schimbă ofertele.</p>
                </div>`;
            }

            const opName = opSel && OPS[opSel.value] ? OPS[opSel.value].name.split(" (")[0] : "";
            if (typeSel.value === "abonament" && opName) {
                html += `<p class="small-secondary">Ai abonament la ${opName}, deci nu poți lua ofertele pentru clienți noi ale ${opName}. Îți arătăm prețurile standard pentru schimbarea abonamentului la ${opName} și ofertele celorlalți operatori, la care treci prin portare.</p>`;
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
        [typeSel, opSel, gbSel, sigSel].forEach((el) => el?.addEventListener("change", () => {
            if (!results.hidden) calculate();
        }));
    }

    /* ---------- 3. SHARED: how a plan is written out ---------- */

    const SHOP_URL = "abonamente-mobile.html";
    const COMPARE_URL = "compara-abonamente.html";

    const dash = '<span class="pm-dash" aria-label="nu este cazul">–</span>';
    const or = (v, f) => (has(v) ? f(v) : dash);
    const sigHtml = (r) => (r.sig === "Da" ? '<span class="pm-yes">✓ Da</span>' : '<span class="pm-no">✕ Nu</span>');
    const priceText = (r) => (r.avgApprox ? "≈ " + dec(r.avg) : fmt(r.avg)) + " lei";
    const opShort = (r) => OPS[r.key].name.split(" (")[0];
    const kindLabel = (r) => (r.kind === "offer" ? "Ofertă pentru clienți noi" : "Preț standard (schimbare abonament)");
    const gbAfterOf = (r) => (has(r.gbAfter) ? r.gbAfter : r.gbOffer);
    const byId = (id) => ROWS.find((r) => r.id === id);

    // Min. către UE, Min. non-UE and Roaming non-UE are hidden for now.
    // To bring them back: set this to true.
    const SHOW_HIDDEN_COLS = false;

    /* every detail of a plan: used by the details window and by the comparison page */
    const ATTRS = [
        ["Tip",                  (r) => kindLabel(r)],
        ["Preț în ofertă",       (r) => "<strong>" + priceText(r) + "</strong>"],
        ["Preț după ofertă",     (r) => or(r.cAfter, (v) => fmt(v) + " lei")],
        ["Contract",             (r) => or(r.months, (v) => v + " luni")],
        ["Internet în ofertă",   (r) => or(r.gbOffer, gbText)],
        ["Internet după ofertă", (r) => or(gbAfterOf(r), gbText)],
        ["Roaming UE",           (r) => or(r.roamUE, (v) => dec(v) + " GB")],
        ["Min/SMS în rețea",     (r) => or(r.netMin, (v) => natText(v))],
        ["Min/SMS naționale",    (r) => or(r.natMin, natText)],
        ["Min. internaționale",  (r) => or(r.intl, (v) => v + " min")]
    ];
    if (SHOW_HIDDEN_COLS) {
        ATTRS.push(
            ["Min. către UE",     (r) => or(r.intlUE, (v) => v + " min")],
            ["Min. non-UE",       (r) => or(r.nonUE, (v) => v + " min")],
            ["Roaming non-UE",    (r) => or(r.roamNonUE, roamNonText)]
        );
    }
    ATTRS.push(["Semnătură mobilă", sigHtml]);

    /* the plans picked for comparison are remembered in the browser, so they
       are still selected when you come back from the comparison page */
    const STORE = "pm-compare";
    const loadCompared = () => {
        try {
            const v = JSON.parse(localStorage.getItem(STORE) || "[]");
            return Array.isArray(v) ? v.filter((id) => byId(id)) : [];
        } catch (e) { return []; }
    };
    const saveCompared = (list) => {
        try { localStorage.setItem(STORE, JSON.stringify(list)); } catch (e) { /* private mode: fine */ }
    };
    const compareLink = (list) => COMPARE_URL + (list.length ? "?p=" + list.join(",") : "");

    /* ---------- 4. SHOP PAGE (abonamente-mobile.html): cards, sort, filters, details ---------- */

    const cardsEl = $("pmCards");

    if (cardsEl) {
        const SORT = {
            cOffer: (r) => r.avg,
            gbOffer: (r) => gbSortVal(r.gbOffer),
            op: (r) => r.op
        };

        let sort = { key: null, dir: 1 };   // dir: 1 = ascending, -1 = descending
        const filters = { hideOffers: false, minGb: 0, min: null, max: null, ops: { orange: true, moldcell: true, moldtelecom: true }, sig: false };
        const MAX_COMPARE = 8;
        let compared = loadCompared();

        const countEl = $("plansCount");
        const sortSel = $("pmSort");
        const filterBtn = $("pmFilterBtn");
        const filterPanel = $("pmFilters");
        const filterBadge = $("pmFilterCount");

        const cmp = (a, b) => {
            if (typeof a === "string" || typeof b === "string") {
                return String(a).localeCompare(String(b), "ro", { sensitivity: "base" });
            }
            return a - b;
        };

        const passes = (r) => {
            if (filters.hideOffers && r.kind === "offer") return false;
            if (!filters.ops[r.key]) return false;
            if (filters.sig && r.sig !== "Da") return false;
            if (filters.minGb) {
                const g = gbSortVal(r.gbOffer);
                if (g === null || g < filters.minGb) return false;
            }
            if (filters.min !== null && r.avg < filters.min) return false;
            if (filters.max !== null && r.avg > filters.max) return false;
            return true;
        };

        const activeFilters = () =>
            (filters.hideOffers ? 1 : 0) +
            (filters.minGb ? 1 : 0) +
            (filters.min !== null || filters.max !== null ? 1 : 0) +
            (Object.values(filters.ops).some((v) => !v) ? 1 : 0) +
            (filters.sig ? 1 : 0);

        /* ----- cards ----- */

        const CMP_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4"/></svg>';

        const OFFER_HINT = "Ofertă: preț pentru conectare nouă, portare sau transfer de la PrePay";

        const cardHtml = (r) => {
            const on = compared.includes(r.id);
            return `
            <article class="pm-card" data-open="${r.id}" tabindex="0" role="button" aria-label="${r.name}, ${opShort(r)}${r.kind === "offer" ? ", ofertă" : ""}: vezi detaliile">
                <div class="pm-card-top">
                    <div class="pm-card-title">
                        ${r.kind === "offer" ? `<span class="pm-badge pm-badge-offer" title="${OFFER_HINT}">Ofertă</span>` : `<span class="pm-badge pm-badge-offer pm-badge-ghost" aria-hidden="true">Ofertă</span>`}
                        <p class="small-secondary">${opShort(r)}</p>
                        <h3 class="h5">${r.name}</h3>
                    </div>
                    <button type="button" class="pm-cmp${on ? " is-on" : ""}" data-cmp="${r.id}" aria-pressed="${on}" aria-label="Compară ${r.name} de la ${opShort(r)}" title="Compară">${CMP_ICON}</button>
                </div>
                <div class="pm-card-price">
                    <strong>${priceText(r)}</strong>
                    <span class="small-secondary">/ lună</span>
                </div>
                <ul class="pm-chips">
                    <li>${gbDisplay(r)}</li>
                    ${has(r.months) ? `<li>Contract ${r.months} luni</li>` : ""}
                    <li class="${r.sig === "Da" ? "pm-chip-yes" : "pm-chip-no"}">${r.sig === "Da" ? "✓" : "✕"} Semnătură mobilă</li>
                </ul>
            </article>`;
        };

        const emptyHtml = `<div class="pm-empty"><p class="body2">Niciun abonament nu se potrivește filtrelor alese.</p><button type="button" class="pm-toggle" data-reset-filters>Resetează filtrele</button></div>`;

        /* ----- render ----- */

        const render = () => {
            const list = ROWS.filter(passes);

            if (sort.key) {
                const get = SORT[sort.key];
                list.sort((x, y) => {
                    const a = get(x), b = get(y);
                    // empty values always go to the end, whatever the direction
                    if (a === null && b === null) return x.i - y.i;
                    if (a === null) return 1;
                    if (b === null) return -1;
                    return cmp(a, b) * sort.dir || x.i - y.i;
                });
            }

            cardsEl.innerHTML = list.length ? list.map(cardHtml).join("") : emptyHtml;

            const n = activeFilters();
            if (filterBadge) { filterBadge.textContent = n; filterBadge.hidden = n === 0; }
            if (countEl) countEl.textContent = list.length + (list.length === 1 ? " abonament" : " abonamente");
        };

        if (sortSel) {
            sortSel.addEventListener("change", () => {
                const [key, dir] = sortSel.value.split(":");
                sort = key ? { key, dir: Number(dir) } : { key: null, dir: 1 };
                render();
            });
        }

        /* ----- filters ----- */

        const fHide = $("pmFHide"), fGb = $("pmFGb"), fMin = $("pmFMin"), fMax = $("pmFMax"), fSig = $("pmFSig");
        const fOps = document.querySelectorAll("[data-fop]");

        const readFilters = () => {
            filters.hideOffers = fHide.checked;
            filters.minGb = Number(fGb.value) || 0;
            filters.min = digits(fMin.value) ? digits(fMin.value) : null;
            filters.max = digits(fMax.value) ? digits(fMax.value) : null;
            filters.sig = fSig.checked;
            fOps.forEach((c) => { filters.ops[c.dataset.fop] = c.checked; });
            render();
        };
        const resetFilters = () => {
            fHide.checked = false; fGb.value = "0"; fMin.value = ""; fMax.value = ""; fSig.checked = false;
            fOps.forEach((c) => { c.checked = true; });
            readFilters();
        };

        if (filterBtn && filterPanel && fGb) {
            filterBtn.addEventListener("click", () => {
                const open = filterPanel.hidden;
                filterPanel.hidden = !open;
                filterBtn.setAttribute("aria-expanded", String(open));
            });
            [fHide, fGb, fSig, ...fOps].forEach((el) => el.addEventListener("change", readFilters));
            [fMin, fMax].forEach((el) => el.addEventListener("input", () => {
                el.value = el.value.replace(/[^\d]/g, "").slice(0, 5);
                readFilters();
            }));
            $("pmFReset")?.addEventListener("click", resetFilters);
            document.addEventListener("click", (e) => {
                if (e.target.closest("[data-reset-filters]")) resetFilters();
            });
        }

        /* ----- compare bar (leads to the comparison page) ----- */

        const detail = $("pmDetail");
        const bar = $("pmCompareBar");
        const barCount = $("pmCompareCount");
        const barOpen = $("pmCompareOpen");
        const barClear = $("pmCompareClear");

        const refreshCompareUi = () => {
            document.querySelectorAll("[data-cmp]").forEach((b) => {
                const on = compared.includes(b.dataset.cmp);
                b.classList.toggle("is-on", on);
                b.setAttribute("aria-pressed", String(on));
                const t = b.querySelector(".pm-cmp-text");
                if (t) t.textContent = on ? "În comparație ✓" : "Adaugă la comparație";
            });
            if (bar) {
                const n = compared.length;
                bar.hidden = n === 0;
                barCount.textContent = n === 1 ? "1 abonament ales" : n + " abonamente alese";
                barOpen.href = compareLink(compared);
                barOpen.setAttribute("aria-disabled", String(n < 2));
                barOpen.textContent = n < 2 ? "Alege încă unul" : "Compară";
            }
        };

        const toggleCompare = (id) => {
            if (compared.includes(id)) compared = compared.filter((x) => x !== id);
            else if (compared.length >= MAX_COMPARE) {
                alert("Poți compara cel mult " + MAX_COMPARE + " abonamente odată.");
                return;
            } else compared.push(id);
            saveCompared(compared);
            refreshCompareUi();
        };

        barOpen?.addEventListener("click", (e) => {
            if (compared.length < 2) e.preventDefault();
        });
        barClear?.addEventListener("click", () => { compared = []; saveCompared(compared); refreshCompareUi(); });

        /* ----- details window ----- */

        const openDetail = (id) => {
            const r = byId(id);
            if (!r || !detail) return;
            const on = compared.includes(id);
            detail.innerHTML = `
                <div class="pm-dialog-body">
                    <div class="pm-dialog-head">
                        <div>
                            <p class="small-secondary">${opShort(r)}</p>
                            <h3 class="h5">${r.name}</h3>
                        </div>
                        <button type="button" class="pm-x" data-close aria-label="Închide">✕</button>
                    </div>
                    <dl class="pm-dl">
                        ${ATTRS.map(([l, g]) => `<div class="pm-dl-row"><dt>${l}</dt><dd>${g(r)}</dd></div>`).join("")}
                    </dl>
                    ${r.kind === "offer" ? `<p class="small-secondary">Prețul din ofertă se aplică la: ${r.offer.split("/").map((s) => s.trim()).join(", ")}.</p>` : ""}
                    <p class="small-secondary">Prețul final îl confirmă operatorul.</p>
                    <div class="pm-dialog-actions">
                        <button type="button" class="pm-toggle${on ? " is-on" : ""}" data-cmp="${r.id}" aria-pressed="${on}"><span class="pm-cmp-text">${on ? "În comparație ✓" : "Adaugă la comparație"}</span></button>
                        <a class="pm-link-btn" href="${OPS[r.key].url}" target="_blank" rel="noopener">Vezi oferta pe site-ul ${opShort(r)}</a>
                    </div>
                </div>`;
            document.documentElement.classList.add("pm-lock");
            detail.showModal();
        };

        if (detail) {
            detail.addEventListener("close", () => document.documentElement.classList.remove("pm-lock"));
            detail.addEventListener("click", (e) => {
                if (e.target === detail || e.target.closest("[data-close]")) { detail.close(); return; }
                const c = e.target.closest("[data-cmp]");
                if (c) toggleCompare(c.dataset.cmp);
            });
        }

        cardsEl.addEventListener("click", (e) => {
            const c = e.target.closest("[data-cmp]");
            if (c) { toggleCompare(c.dataset.cmp); return; }
            const o = e.target.closest("[data-open]");
            if (o) openDetail(o.dataset.open);
        });
        cardsEl.addEventListener("keydown", (e) => {
            if ((e.key === "Enter" || e.key === " ") && e.target.matches(".pm-card")) {
                e.preventDefault();
                openDetail(e.target.dataset.open);
            }
        });

        render();
        refreshCompareUi();
    }

    /* ---------- 5. COMPARISON PAGE (compara-abonamente.html) ---------- */

    const compareBody = $("pmCompareBody");

    if (compareBody) {
        // plans come from the link (?p=id,id,...) or, if there is none, from what was picked last
        const fromUrl = (new URLSearchParams(location.search).get("p") || "").split(",").filter((id) => byId(id));
        let picked = fromUrl.length ? fromUrl : loadCompared();
        const emptyEl = $("pmCompareEmpty");
        const clearAll = $("pmCompareClearAll");

        const sync = () => {
            saveCompared(picked);
            try { history.replaceState(null, "", compareLink(picked)); } catch (e) { /* not important */ }
        };

        const draw = () => {
            const plans = picked.map(byId);
            if (emptyEl) emptyEl.hidden = plans.length > 0;
            if (clearAll) clearAll.hidden = plans.length === 0;

            if (!plans.length) { compareBody.innerHTML = ""; return; }

            const head = plans.map((r) => `
                <th scope="col">
                    <button type="button" class="pm-x pm-x-small" data-remove="${r.id}" aria-label="Scoate ${r.name} din comparație">✕</button>
                    <span class="small-secondary">${opShort(r)}</span>
                    <strong class="pm-ct-name">${r.name}</strong>
                </th>`).join("");
            const rows = ATTRS.map(([label, get]) =>
                `<tr><th scope="row">${label}</th>${plans.map((r) => `<td>${get(r)}</td>`).join("")}</tr>`).join("");
            const links = `<tr><th scope="row">Oferta</th>${plans.map((r) =>
                `<td><a class="pm-link" href="${OPS[r.key].url}" target="_blank" rel="noopener">Vezi pe site-ul ${opShort(r)}</a></td>`).join("")}</tr>`;

            compareBody.innerHTML = `
                <table class="pm-ctable">
                    <thead><tr><th scope="col" class="pm-ct-corner"></th>${head}</tr></thead>
                    <tbody>${rows}${links}</tbody>
                </table>`;
        };

        compareBody.addEventListener("click", (e) => {
            const x = e.target.closest("[data-remove]");
            if (!x) return;
            picked = picked.filter((id) => id !== x.dataset.remove);
            sync();
            draw();
        });
        clearAll?.addEventListener("click", () => { picked = []; sync(); draw(); });

        if (fromUrl.length) saveCompared(picked);
        draw();
    }

    /* ---------- cheapest plan per company (company comparison table) ---------- */

    document.querySelectorAll("[data-cheapest]").forEach((cell) => {
        const list = PLANS.filter((p) => p.key === cell.dataset.cheapest);
        if (!list.length) return;
        const best = list.reduce((a, b) => (b.eff < a.eff ? b : a));
        cell.innerHTML = `${best.name}: <strong>${fmt(best.eff)} lei</strong>` +
            (best.promo
                ? `<span class="pm-sub">primele 12 luni · apoi ${fmt(has(best.c24) ? best.c24 : best.cAfter)} lei${has(best.c24) ? `, după ${best.months} luni ${fmt(best.cAfter)} lei` : ""}</span>`
                : `<span class="pm-sub">preț fix</span>`);
    });

    document.querySelectorAll("[data-updated]").forEach((el) => { el.textContent = UPDATED; });
})();
