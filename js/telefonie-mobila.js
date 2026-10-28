/* =====================================================
   TELEFONIE MOBILĂ (telefonie-mobila.html only)
   1. DATA   - every plan lives in the DATA list below (one row = one line
               of the Excel "Abonamente telefonie mobilă"). To update a
               price or add a plan, edit ONLY that list: the sortable table,
               the "cheapest" cells and the savings finder all read from it.
   2. Savings finder ("Vezi cât poți economisi")
   3. One table with all plans: click a header to sort, click again to
      reverse, a third click goes back to the original order
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

    const ROWS = DATA.map((d, i) => ({
        ...d,
        i,
        key: d.op.toLowerCase(),
        // a new-customer offer (Conectare / Portare / Transfer) or a standard price (Modificare)
        kind: /Conectare/.test(d.offer) ? "offer" : "standard",
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

    const gbText = (v) => (typeof v === "number" ? dec(v) + " GB" : v);

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
                ${cheaper.length > shown.length ? `<p class="body2">Mai sunt ${cheaper.length - shown.length} abonamente mai ieftine în <a href="#comparatie">tabelul de mai jos</a>.</p>` : ""}`;
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

    /* ---------- 3. ONE TABLE, SORTABLE ---------- */

    const tbody = $("plansBody");

    if (tbody) {
        const dash = '<span class="pm-dash" aria-label="nu este cazul">–</span>';
        const or = (v, f) => (has(v) ? f(v) : dash);

        // data-sort name in the <th>  ->  value used for sorting (null = empty, always last)
        const SORT = {
            name:      (r) => r.name,
            op:        (r) => r.op,
            months:    (r) => r.months,
            cOffer:    (r) => r.avg,
            cAfter:    (r) => r.cAfter,
            gbOffer:   (r) => gbSortVal(r.gbOffer),
            gbAfter:   (r) => gbSortVal(has(r.gbAfter) ? r.gbAfter : r.gbOffer),
            roamUE:    (r) => r.roamUE,
            netMin:    (r) => (has(r.netMin) ? (/nelimitat/i.test(r.netMin) ? 1 : 0) : null),
            natMin:    (r) => natSortVal(r.natMin),
            intl:      (r) => r.intl,
            intlUE:    (r) => r.intlUE,
            nonUE:     (r) => r.nonUE,
            roamNonUE: (r) => roamNonSortVal(r.roamNonUE),
            sig:       (r) => r.sig
        };

        // Min. către UE, Min. non-UE and Roaming non-UE are hidden for now.
        // To bring them back: set this to true AND remove the comment around their <th> in the html.
        const SHOW_HIDDEN_COLS = false;

        const rowHtml = (r) => `
            <tr>
                <td><strong>${r.name}</strong></td>
                <td>${r.op}</td>
                <td class="num">${or(r.months, (v) => v + " luni")}</td>
                <td class="num"><strong>${r.avgApprox ? "≈ " + dec(r.avg) : fmt(r.avg)} lei</strong></td>
                <td class="num">${or(r.cAfter, (v) => fmt(v) + " lei")}</td>
                <td class="num">${or(r.gbOffer, gbText)}</td>
                <td class="num">${or(has(r.gbAfter) ? r.gbAfter : r.gbOffer, gbText)}</td>
                <td class="num">${or(r.roamUE, (v) => dec(v) + " GB")}</td>
                <td class="num">${or(r.netMin, (v) => natText(v))}</td>
                <td class="num">${or(r.natMin, natText)}</td>
                <td class="num">${or(r.intl, (v) => v + " min")}</td>
                ${SHOW_HIDDEN_COLS ? `<td class="num">${or(r.intlUE, (v) => v + " min")}</td>
                <td class="num">${or(r.nonUE, (v) => v + " min")}</td>
                <td class="num">${or(r.roamNonUE, roamNonText)}</td>` : ""}
                <td>${r.sig === "Da" ? '<span class="pm-yes">✓ Da</span>' : '<span class="pm-no">✕ Nu</span>'}</td>
            </tr>`;

        let showOffers = true;     // true: new-customer offers; false: standard prices
        let sort = { key: null, dir: 1 };   // dir: 1 = ascending, -1 = descending

        const heads = document.querySelectorAll("#plansTable th[data-sort]");
        const countEl = $("plansCount");
        const toggleBtn = $("pmToggle");
        const modeNote = $("plansMode");

        const cmp = (a, b) => {
            if (typeof a === "string" || typeof b === "string") {
                return String(a).localeCompare(String(b), "ro", { sensitivity: "base" });
            }
            return a - b;
        };

        const render = () => {
            let list = ROWS.filter((r) =>
                r.kind === (showOffers ? "offer" : "standard")
            );

            if (toggleBtn) {
                toggleBtn.textContent = showOffers ? "Ascunde ofertele" : "Arată ofertele";
                toggleBtn.setAttribute("aria-pressed", String(!showOffers));
            }
            if (modeNote) {
                modeNote.textContent = showOffers
                    ? "Se afișează ofertele pentru clienți noi (conectare, portare, transfer de la PrePay)."
                    : "Se afișează prețurile standard, pentru cine trece la alt abonament la același operator.";
            }

            if (sort.key) {
                const get = SORT[sort.key];
                const byKey = (x, y) => {
                    const a = get(x), b = get(y);
                    // empty cells always go to the bottom, whatever the direction
                    if (a === null && b === null) return x.i - y.i;
                    if (a === null) return 1;
                    if (b === null) return -1;
                    return cmp(a, b) * sort.dir || x.i - y.i;
                };
                list.sort(byKey);
            }

            tbody.innerHTML = list.map(rowHtml).join("");

            heads.forEach((th) => {
                const on = th.dataset.sort === sort.key;
                th.setAttribute("aria-sort", on ? (sort.dir === 1 ? "ascending" : "descending") : "none");
                th.classList.toggle("is-asc", on && sort.dir === 1);
                th.classList.toggle("is-desc", on && sort.dir === -1);
            });

            if (countEl) {
                countEl.textContent = list.length + (list.length === 1 ? " abonament" : " abonamente");
            }
        };

        // click: ascending -> descending -> original order
        heads.forEach((th) => {
            const b = th.querySelector(".sort-btn");
            if (!b) return;
            b.addEventListener("click", () => {
                const key = th.dataset.sort;
                if (sort.key !== key) sort = { key, dir: 1 };
                else if (sort.dir === 1) sort = { key, dir: -1 };
                else sort = { key: null, dir: 1 };
                render();
            });
        });

        if (toggleBtn) {
            toggleBtn.addEventListener("click", () => { showOffers = !showOffers; render(); });
        }

        render();

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
