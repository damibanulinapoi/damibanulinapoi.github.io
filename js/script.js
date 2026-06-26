document.addEventListener("DOMContentLoaded", () => {

const MAX_DIGITS = 8;

/* =========================
   HELPERS
========================= */

const parseNumber = (val) =>
    Number(String(val).replace(/[^\d]/g, "")) || 0;

/* =========================
   LANGUAGE
========================= */

const langBtn = document.getElementById("langBtn");
const langMenu = document.getElementById("langMenu");
const langFlag = document.getElementById("langFlag");
const options = document.querySelectorAll(".lang-option");

if (langBtn) {
    langBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        langMenu.classList.toggle("active");
    });
}

options.forEach(option => {
    option.addEventListener("click", () => {
        const lang = option.dataset.lang;

        if (langFlag) {
            langFlag.src =
                lang === "RO"
                    ? "images/flag-romania.svg"
                    : "images/flag-russia.svg";
        }

        langMenu?.classList.remove("active");
    });
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".lang-dropdown")) {
        langMenu?.classList.remove("active");
    }
});

/* =========================
   INPUT FORMATTING
========================= */

const allMoneyInputs = document.querySelectorAll(".income-input, .expense-input");

allMoneyInputs.forEach(input => {

    input.addEventListener("input", (e) => {
        let raw = e.target.value.replace(/[^\d]/g, "").slice(0, MAX_DIGITS);
        e.target.value = raw ? Number(raw).toLocaleString("en-US") : "0";
    });

    input.addEventListener("focus", () => {
        if (input.value === "0") input.value = "";
    });

    input.addEventListener("blur", () => {
        if (input.value.trim() === "") input.value = "0";
    });
});

/* =========================
   FAQ
========================= */

const faqItems = document.querySelectorAll(".item");

faqItems.forEach(item => {
    const q = item.querySelector(".question");
    if (!q) return;

    q.addEventListener("click", () => {
        const open = item.classList.contains("open");
        faqItems.forEach(i => i.classList.remove("open"));
        if (!open) item.classList.add("open");
    });
});

/* =========================
   SEGMENT CONTROL
========================= */

let calcMode = "brut";

const salaryLabel = document.getElementById("salary-label");
const segmentItems = document.querySelectorAll(".segment-item");

segmentItems.forEach(item => {
    item.addEventListener("click", () => {

        segmentItems.forEach(i => {
            i.classList.remove("active");
            i.querySelector("span").className = "body1-secondary";
        });

        item.classList.add("active");
        item.querySelector("span").className = "body1-red";

        calcMode = item.dataset.value;

        salaryLabel.textContent =
            calcMode === "net"
                ? "Salariu net"
                : calcMode === "brut"
                    ? "Salariu brut"
                    : "Salariul total";
    });
});

const advancedBtn = document.getElementById("advanced-btn");
const advancedOptions = document.getElementById("advanced-options");
const advancedIcon = document.getElementById("advanced-icon");

if (advancedBtn && advancedOptions && advancedIcon) {
    advancedBtn.addEventListener("click", () => {
        advancedOptions.classList.toggle("show");

        advancedIcon.textContent =
            advancedOptions.classList.contains("show") ? "−" : "+";
    });
}

/* =========================
   ADVANCED OPTIONS
========================= */

/* =========================
   EXEMPTIONS
========================= */

function getTotalExemption() {

    const personal = parseNumber(document.getElementById("ScutPers")?.value);
    const spouse = parseNumber(document.getElementById("ScutSot")?.value);
    const dependents = parseNumber(document.getElementById("NrPersIntr")?.value) * 825;
    const disabled = parseNumber(document.getElementById("NrPersIntrI")?.value) * 1815;
    const manual = parseNumber(document.getElementById("ScutireManuala")?.value);

    return personal + spouse + dependents + disabled + manual;
}

/* =========================
   CORE CALCULATION
========================= */

function getOptions() {
    const isITPark   = document.getElementById("AngajatiIT")?.value === "1";
    const unionMode  = document.getElementById("CotizatieSindicat")?.value ?? "0";
    const cnasEmpRate = parseFloat(document.getElementById("FondSocial")?.value ?? "24") / 100;
    const cnamRate   = parseFloat(document.getElementById("AsigMedAtManual")?.value ?? "9") / 100;
    return { isITPark, unionMode, cnasEmpRate, cnamRate };
}

function calcFromBrut(brut) {
    brut = Math.round(brut);

    const opts       = getOptions();
    const exemption  = getTotalExemption();

    // IT Park: 7% flat tax paid by employer, no CNAS/CNAM/income tax from employee
    if (opts.isITPark) {
        const itTax  = Math.round(brut * 0.07);
        const social = Math.round(brut * opts.cnasEmpRate);
        const total  = brut + social + itTax;
        return {
            brut,
            net: brut,       // employee receives full brut
            total,
            cnasEmployee: 0,
            medical: 0,
            tax: itTax,      // shown as "impozit" even though employer pays
            taxable: brut,
            social,
            exemption: 0,
            totalTaxes: social + itTax
        };
    }

    // Standard calculation
    // In Moldova: CNAS employee 6% is shown informatively but NOT withheld from net
    // CNAM 9% IS withheld from net
    // Taxable = brut - CNAM - personal exemption
    const cnasEmployee = Math.round(brut * 0.06);       // informational only
    const medical      = Math.round(brut * opts.cnamRate); // withheld from net

    // Union fee from employee (withheld from net)
    const unionEmployee = opts.unionMode === "1" ? Math.round(brut * 0.01) : 0;

    const taxable = Math.max(0, brut - medical - exemption);
    const tax     = Math.round(taxable * 0.12);

    // Net = brut - CNAM - income tax - union(employee) — CNAS employee NOT subtracted
    const net = brut - medical - tax - unionEmployee;

    // Employer contributions
    const social        = Math.round(brut * opts.cnasEmpRate);
    const unionEmployer = opts.unionMode === "2" ? Math.round(brut * 0.01) : 0;
    const total         = brut + social + unionEmployer;

    // Total taxes excludes CNAS employee (it's informational)
    const totalTaxes = medical + tax + social + unionEmployee + unionEmployer;

    return {
        brut,
        net:   Math.round(net),
        total: Math.round(total),
        cnasEmployee,
        medical,
        tax,
        taxable,
        social,
        exemption,
        totalTaxes
    };
}

/* =========================
   CALCULATOR BUTTON
========================= */

document.getElementById("calculează-btn")?.addEventListener("click", () => {

    const input = parseNumber(document.getElementById("amount")?.value);
    if (!input) return;

    let result;

    if (calcMode === "brut") {
        result = calcFromBrut(input);
    }

    if (calcMode === "net") {
        let brut = input * 1.25; // initial estimate
        for (let i = 0; i < 50; i++) {
            const r    = calcFromBrut(brut);
            const diff = input - r.net;
            brut      += diff;
            if (Math.abs(diff) < 0.5) break;
        }
        result = calcFromBrut(Math.round(brut));
    }

    if (calcMode === "total") {
        const opts  = getOptions();
        let brut    = input / (1 + opts.cnasEmpRate); // initial estimate
        for (let i = 0; i < 50; i++) {
            const r    = calcFromBrut(brut);
            const diff = input - r.total;
            brut      += diff;
            if (Math.abs(diff) < 0.5) break;
        }
        result = calcFromBrut(Math.round(brut));
    }

    if (!result) return;

    const fmt = (val) =>
        (val ?? 0).toLocaleString("en-EN", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " lei";

    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = fmt(val);
    };

    // Update CNAS employer label to reflect current rate
    const socialLabel = document.getElementById("socialLabel");
    if (socialLabel) {
        const rate = document.getElementById("FondSocial")?.value ?? "24";
        socialLabel.textContent = `Fond social angajator (CNAS) ${rate}%`;
    }

    // Update medical label to reflect current rate
    const medicalLabel = document.getElementById("medicalLabel");
    if (medicalLabel) {
        const rate = document.getElementById("AsigMedAtManual")?.value ?? "9";
        medicalLabel.textContent = `CNAM (asigurare medicală angajat) ${rate}%`;
    }

    set("netResult",          result.net);
    set("brutResult",         result.brut);
    set("totalResult",        result.total);
    set("scutireResult",      result.exemption);
    set("impozabilResult",    result.taxable);
    set("socialResult",       result.social);
    set("medicalResult",      result.medical);
    set("cnasEmployeeResult", result.cnasEmployee);
    set("taxResult",          result.tax);
    set("totalTaxResult",     result.totalTaxes);

    document.querySelector(".resultat")?.classList.add("show");
});

/* =========================
   CHART (UNCHANGED SAFE)
========================= */

const canvas = document.getElementById("chart");

if (canvas) {

    const ctx = canvas.getContext("2d");

    const incomeInput = document.getElementById("amount");
    const expenseInputs = document.querySelectorAll(".expense-input");

    const colors = [
        "#243e92","#3c59c0","#5a7fe0",
        "#10312a","#174741","#0f615c",
        "#2ca153","#218f4a","#55cc80",
        "#fe7f07","#d46f05","#ffa03a",
        "#c93a3a","#e55252","#ff7a7a"
    ];

    function drawChart() {

        const income = parseNumber(incomeInput?.value);

        const expenses = [...expenseInputs].map(i =>
            parseNumber(i.value)
        );

        const size = canvas.clientWidth;
        const center = size / 2;

        canvas.width = size;
        canvas.height = size;

        ctx.clearRect(0, 0, size, size);

        const base = size * 0.35;
        const thick = size * 0.12;

        ctx.beginPath();
        ctx.arc(center, center, base, 0, Math.PI * 2);
        ctx.strokeStyle = "#eee";
        ctx.lineWidth = thick;
        ctx.stroke();

        if (!income) return;

        let start = -Math.PI / 2;

        expenses.forEach((v, i) => {

            if (!v) return;

            const angle = (v / income) * Math.PI * 2;

            ctx.beginPath();
            ctx.arc(center, center, base, start, start + angle);

            ctx.strokeStyle = colors[i % colors.length];
            ctx.lineWidth = thick;
            ctx.stroke();

            start += angle;
        });
    }

    incomeInput?.addEventListener("input", drawChart);
    expenseInputs.forEach(i => i.addEventListener("input", drawChart));
    window.addEventListener("resize", drawChart);

    drawChart();
}

});