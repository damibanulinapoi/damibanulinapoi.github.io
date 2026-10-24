/* =====================================================
   SHARED SCRIPT — used by every page (script.js)
   Sections: helpers, language, FAQ, money inputs,
   salary calculator, budget chart, investment calculator
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

const MAX_DIGITS = 8;

/* =========================
   HELPERS
========================= */

const parseNumber = (val) =>
    Number(String(val).replace(/[^\d]/g, "")) || 0;

/* Texts that script.js writes into the page (the rest lives in the HTML).
   The page language comes from <html lang="ro"> or <html lang="ru">. */
const LANG = document.documentElement.lang === "ru" ? "ru" : "ro";

const TXT = LANG === "ru" ? {
    lei: "л",
    pers: "ч",
    salaryLabel: { net: "Зарплата нетто", brut: "Зарплата брутто", total: "Общая зарплата" },
    ov: {
        cnasEmp: "CNAS работодателя", cnam: "CNAM", it: "IT-парк", union: "Профсоюз",
        exempt: "Освобождение", spouse: "Супруг(а)", dep: "Иждивенцы",
        dis: "Иждивенцы с инвалидностью", manual: "Освобождение вручную"
    },
    social: "Социальный фонд работодателя (CNAS)",
    medical: "CNAM (медицинское страхование работника)"
} : {
    lei: "lei",
    pers: "p.",
    salaryLabel: { net: "Salariu net", brut: "Salariu brut", total: "Salariul total" },
    ov: {
        cnasEmp: "CNAS angajator", cnam: "CNAM", it: "IT Park", union: "Sindicat",
        exempt: "Scutire", spouse: "Soț/soție", dep: "Persoane întreținute",
        dis: "Persoane cu dizabilitate", manual: "Scutire manuală"
    },
    social: "Fond social angajator (CNAS)",
    medical: "CNAM (asigurare medicală angajat)"
};

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

        langMenu?.classList.remove("active");

        // Romanian pages live in the root folder, Russian pages in /ru/.
        // Pages whose Russian file name is different are listed here (RO file -> RU file).
        // Pages not listed keep the same file name in both languages.
        const PAGE_NAMES = {
            "calculator-de-salariu.html": "калькулятор-зарплаты.html"
        };
        const PAGE_NAMES_REVERSE = Object.fromEntries(
            Object.entries(PAGE_NAMES).map(([ro, ru]) => [ru, ro])
        );

        const inRussian = document.documentElement.lang === "ru";
        // decodeURIComponent: Cyrillic file names appear percent-encoded in the URL
        const file = decodeURIComponent(location.pathname.split("/").pop() || "index.html");

        if (lang === "RU" && !inRussian) {
            location.href = "ru/" + encodeURIComponent(PAGE_NAMES[file] || file) + location.search;
        } else if (lang === "RO" && inRussian) {
            location.href = "../" + (PAGE_NAMES_REVERSE[file] || file) + location.search;
        }
    });
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".lang-dropdown")) {
        langMenu?.classList.remove("active");
    }
});

/* =========================
   MENU (hamburger)
   Built here, so every page gets it without extra HTML.
   To add or rename an entry, edit the MENU list below.
========================= */

const siteHeader = document.querySelector(".header");
const menuIcon = document.querySelector(".header .menu");

if (siteHeader && menuIcon) {

    const ROOT = LANG === "ru" ? "../" : "";   // Russian pages sit inside /ru/

    // An entry with "children" opens a sub-list; one with only "href" is a plain link.
    const MENU = LANG === "ru" ? [
        { label: "Калькуляторы", children: [
            { label: "Калькулятор зарплаты",  href: "калькулятор-зарплаты.html" },
            { label: "Калькулятор бюджета",   href: "calculator-de-buget.html" },
            { label: "Калькулятор инвестиций", href: "calculator-de-investitii.html" }
        ]},
        { label: "Сравнение цен", href: "#" },
        { label: "Советы",        href: "#" },
        { label: "О нас",         href: "#" }
    ] : [
        { label: "Calculatoare", children: [
            { label: "Calculator de salariu",   href: "calculator-de-salariu.html" },
            { label: "Calculator de buget",     href: "calculator-de-buget.html" },
            { label: "Calculator de investiții", href: "calculator-de-investitii.html" }
        ]},
        { label: "Comparații de prețuri", href: "#" },
        { label: "Sfaturi",               href: "#" },
        { label: "Despre noi",            href: "#" }
    ];

    const overlay = document.createElement("nav");
    overlay.className = "menu-overlay";
    overlay.setAttribute("aria-label", LANG === "ru" ? "Меню" : "Meniu");

    const list = document.createElement("ul");

    MENU.forEach(item => {
        const li = document.createElement("li");
        li.className = "menu-item";

        const label = document.createElement("span");
        label.className = "body1";
        label.textContent = item.label;

        if (item.children) {
            const row = document.createElement("button");
            row.type = "button";
            row.className = "menu-row";
            row.append(label);

            const chevron = document.createElement("img");
            chevron.className = "menu-chevron";
            chevron.src = ROOT + "images/arrow-down.svg";
            chevron.alt = "";
            row.append(chevron);

            const sub = document.createElement("ul");
            sub.className = "menu-sub";
            item.children.forEach(child => {
                const subLi = document.createElement("li");
                const a = document.createElement("a");
                a.className = "body1";
                a.href = child.href;
                a.textContent = child.label;
                subLi.append(a);
                sub.append(subLi);
            });

            row.addEventListener("click", () => li.classList.toggle("open"));
            li.append(row, sub);
        } else {
            const a = document.createElement("a");
            a.className = "menu-row";
            a.href = item.href;
            a.append(label);
            li.append(a);
        }

        list.append(li);
    });

    overlay.append(list);
    document.body.append(overlay);

    const menuSrc = menuIcon.getAttribute("src");
    const closeSrc = menuSrc.replace("menu.svg", "close.svg");

    menuIcon.setAttribute("role", "button");
    menuIcon.setAttribute("tabindex", "0");
    menuIcon.setAttribute("aria-label", LANG === "ru" ? "Меню" : "Meniu");

    function setMenu(open) {
        siteHeader.classList.toggle("menu-open", open);
        overlay.classList.toggle("show", open);
        document.body.classList.toggle("menu-locked", open);
        menuIcon.setAttribute("src", open ? closeSrc : menuSrc);
        menuIcon.setAttribute("aria-expanded", String(open));
        langMenu?.classList.remove("active");
    }

    menuIcon.addEventListener("click", () => {
        setMenu(!overlay.classList.contains("show"));
    });

    menuIcon.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            menuIcon.click();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setMenu(false);
    });
}

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
   INPUT FORMATTING
   Reusable for every calculator page.
   - .income-input / .expense-input        -> money (1,000)
   - [data-format="money"]                 -> money (1,000)
   - [data-format="percent"]               -> number, optional decimals, 0–max
   - [data-format="count"]                 -> whole number, up to 2 digits
   On focus a "0" disappears so you can type right away;
   on blur an empty field goes back to "0".
========================= */

function formatMoney(value) {
    const raw = value.replace(/[^\d]/g, "").slice(0, MAX_DIGITS);
    return raw ? Number(raw).toLocaleString("en-US") : "0";
}

function formatCount(value) {
    const raw = value.replace(/[^\d]/g, "").slice(0, 2);
    return raw ? String(Number(raw)) : "0";
}

function formatPercent(value, max) {
    let v = value.replace(",", ".").replace(/[^\d.]/g, "");
    const parts = v.split(".");
    const intPart = String(Number(parts[0].slice(0, 2) || "0"));

    if (parts.length > 1) {
        v = intPart + "." + parts.slice(1).join("").slice(0, 2);
    } else {
        v = intPart;
    }

    if (Number(v) > max) v = String(max);
    return v;
}

function setupNumericField(input) {
    const format =
        input.dataset.format ||
        (input.classList.contains("income-input") ||
         input.classList.contains("expense-input") ? "money" : null);

    if (!format) return;

    const max = Number(input.dataset.max) || 20;

    input.addEventListener("input", () => {
        if (format === "money")   input.value = formatMoney(input.value);
        if (format === "count")   input.value = formatCount(input.value);
        if (format === "percent") input.value = formatPercent(input.value, max);
    });

    input.addEventListener("focus", () => {
        if (input.value === "0") {
            input.value = "";
        } else {
            // select existing value so the first keystroke replaces it
            setTimeout(() => input.select(), 0);
        }
    });

    input.addEventListener("blur", () => {
        let v = input.value.trim();
        if (v.endsWith(".")) v = v.slice(0, -1);
        input.value = (v === "" || v === ".") ? "0" : v;
    });
}

document
    .querySelectorAll(".income-input, .expense-input, [data-format]")
    .forEach(setupNumericField);

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

        // Hidden accessible label for the input (the visible label is just "Salariu")
        if (salaryLabel) {
            salaryLabel.textContent = TXT.salaryLabel[calcMode];
        }
    });
});

/* =========================
   ADVANCED OPTIONS
========================= */

const advancedWrapper = document.getElementById("advanced-wrapper");
const advancedBtn = document.getElementById("advanced-btn");
const advancedOptions = document.getElementById("advanced-options");
const advancedIcon = document.getElementById("advanced-icon");
const advancedOverview = document.getElementById("advanced-overview");

/* Overview line: current value of every option, shown only while collapsed */

const selectText = (id) => {
    const el = document.getElementById(id);
    return el && el.options ? el.options[el.selectedIndex].text : "";
};

const inputVal = (id) => {
    const el = document.getElementById(id);
    return el ? (el.value === "" ? "0" : el.value) : "0";
};

function updateAdvancedOverview() {
    if (!advancedOverview) return;

    advancedOverview.textContent = [
        `${TXT.ov.cnasEmp}: ${selectText("FondSocial")}`,
        `${TXT.ov.cnam}: ${inputVal("AsigMedAtManual")}%`,
        `${TXT.ov.it}: ${selectText("AngajatiIT")}`,
        `${TXT.ov.union}: ${selectText("CotizatieSindicat")}`,
        `${TXT.ov.exempt}: ${selectText("ScutPers")}`,
        `${TXT.ov.spouse}: ${selectText("ScutSot")}`,
        `${TXT.ov.dep}: ${inputVal("NrPersIntr")} ${TXT.pers}`,
        `${TXT.ov.dis}: ${inputVal("NrPersIntrI")} ${TXT.pers}`,
        `${TXT.ov.manual}: ${inputVal("ScutireManuala")} ${TXT.lei}`
    ].join(" / ");
}

if (advancedBtn && advancedOptions && advancedIcon) {

    advancedBtn.addEventListener("click", () => {
        const isOpen = advancedOptions.classList.toggle("show");

        advancedWrapper?.classList.toggle("is-open", isOpen);
        advancedIcon.textContent = isOpen ? "−" : "+";
    });

    advancedOptions.querySelectorAll("select, input").forEach(el => {
        el.addEventListener("input", updateAdvancedOverview);
        el.addEventListener("change", updateAdvancedOverview);
        el.addEventListener("blur", updateAdvancedOverview);
    });

    updateAdvancedOverview();
}

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
    const cnamRate   = (parseFloat(document.getElementById("AsigMedAtManual")?.value) || 0) / 100;
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

const calcBtn = document.getElementById("calculează-btn");
const amountInput = document.getElementById("amount");

// Button stays disabled until an amount greater than 0 is entered
function updateCalcBtnState() {
    if (!calcBtn || !amountInput) return;
    calcBtn.disabled = parseNumber(amountInput.value) === 0;
}

amountInput?.addEventListener("input", updateCalcBtnState);
updateCalcBtnState();

// Enter (desktop or phone keyboard) runs the calculation from the amount field or the advanced fields
const enterFields = [
    amountInput,
    ...document.querySelectorAll("#advanced-options input")
].filter(Boolean);

enterFields.forEach(field => {
    field.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();

        if (calcBtn && !calcBtn.disabled) {
            calcBtn.click();
            field.blur(); // closes the phone keyboard so the results are visible
        }
    });
});

calcBtn?.addEventListener("click", () => {

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
        (val ?? 0).toLocaleString("en-EN", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " " + TXT.lei;

    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = fmt(val);
    };

    // Update CNAS employer label to reflect current rate
    const socialLabel = document.getElementById("socialLabel");
    if (socialLabel) {
        const rate = document.getElementById("FondSocial")?.value ?? "24";
        socialLabel.textContent = `${TXT.social} ${rate}%`;
    }

    // Update medical label to reflect current rate
    const medicalLabel = document.getElementById("medicalLabel");
    if (medicalLabel) {
        const rate = document.getElementById("AsigMedAtManual")?.value ?? "9";
        medicalLabel.textContent = `${TXT.medical} ${rate}%`;
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
   BUDGET CHART
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

/* =========================
   INVESTMENT CALCULATOR
   (only runs on calculator-de-investitii.html)
========================= */

function initInvestmentCalculator() {

    const parseNum = (id) => {
        const v = document.getElementById(id)?.value ?? "0";
        return Number(String(v).replace(/[^\d.]/g, "")) || 0;
    };

    const fmt = (n) =>
        Math.round(n).toLocaleString("en-US") + " lei";

    const fmtPlain = (n) =>
        Math.round(n).toLocaleString("en-US");

    /* ---- input formatting ---- */
    ["startAmount","endKnown","targetAmount","contribution"].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("input", () => {
            let raw = el.value.replace(/[^\d]/g, "").slice(0, 12);
            el.value = raw ? Number(raw).toLocaleString("en-US") : "0";
            calculate();
        });
        el.addEventListener("focus", () => { if (el.value === "0") el.value = ""; });
        el.addEventListener("blur",  () => { if (!el.value.trim()) el.value = "0"; calculate(); });
    });

    ["rate", "years"].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("input", () => calculate());
    });

    ["compoundFreq", "contribFreq"].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("change", () => calculate());
    });

    document.querySelectorAll('input[name="contribTiming"]').forEach(radio => {
        radio.addEventListener("change", () => calculate());
    });

    /* ---- tabs ---- */
    let mode = "end"; // contribution | end | rate | start | length
    let currentSchedule = null;
    let scheduleView = "yearly";

    const rowTarget        = document.getElementById("rowTarget");
    const rowEndKnown      = document.getElementById("rowEndKnown");
    const rowStart         = document.getElementById("rowStart");
    const rowYears         = document.getElementById("rowYears");
    const rowRate          = document.getElementById("rowRate");
    const rowContribution  = document.getElementById("rowContribution");
    const mainLabelEl      = document.getElementById("mainLabel");

    function applyTabVisibility() {
        [rowTarget, rowEndKnown, rowStart, rowYears, rowRate, rowContribution].forEach(r => r.classList.add("hidden"));

        if (mode === "end") {
            rowStart.classList.remove("hidden");
            rowYears.classList.remove("hidden");
            rowRate.classList.remove("hidden");
            rowContribution.classList.remove("hidden");
        } else if (mode === "contribution") {
            rowTarget.classList.remove("hidden");
            rowStart.classList.remove("hidden");
            rowYears.classList.remove("hidden");
            rowRate.classList.remove("hidden");
        } else if (mode === "rate") {
            rowStart.classList.remove("hidden");
            rowEndKnown.classList.remove("hidden");
            rowYears.classList.remove("hidden");
            rowContribution.classList.remove("hidden");
        } else if (mode === "start") {
            rowEndKnown.classList.remove("hidden");
            rowYears.classList.remove("hidden");
            rowRate.classList.remove("hidden");
            rowContribution.classList.remove("hidden");
        } else if (mode === "length") {
            rowStart.classList.remove("hidden");
            rowEndKnown.classList.remove("hidden");
            rowRate.classList.remove("hidden");
            rowContribution.classList.remove("hidden");
        }

        calculate();
    }

    document.querySelectorAll("#tabRow .tab-item").forEach(item => {
        item.addEventListener("click", () => {
            document.querySelectorAll("#tabRow .tab-item").forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            mode = item.dataset.tab;
            applyTabVisibility();
        });
    });

    /* ---- core math ---- */

    function fvLumpSum(PV, r, n, years) {
        if (n === "continuous") return PV * Math.exp(r * years);
        const rPer = r / n;
        return PV * Math.pow(1 + rPer, n * years);
    }

    function fvContributions(PMT, contribFreqN, r, n, years, atBeginning) {
        if (!PMT || !contribFreqN) return 0;
        const totalContribs = Math.max(0, Math.round(contribFreqN * years));
        const yearsPerContrib = 1 / contribFreqN;
        let total = 0;
        for (let k = 0; k < totalContribs; k++) {
            const depositTime = atBeginning ? k * yearsPerContrib : (k + 1) * yearsPerContrib;
            const yearsToGrow = years - depositTime;
            if (yearsToGrow < 0) continue;
            total += fvLumpSum(PMT, r, n, yearsToGrow);
        }
        return total;
    }

    function totalFV(PV, PMT, contribFreqN, r, n, years, atBeginning) {
        return fvLumpSum(PV, r, n, years) + fvContributions(PMT, contribFreqN, r, n, years, atBeginning);
    }

    function solveRate(PV, PMT, contribFreqN, n, years, atBeginning, targetFV) {
        let lo = -0.5, hi = 2.0;
        for (let i = 0; i < 100; i++) {
            const mid = (lo + hi) / 2;
            const fv = totalFV(PV, PMT, contribFreqN, mid, n, years, atBeginning);
            if (fv < targetFV) lo = mid; else hi = mid;
        }
        return (lo + hi) / 2;
    }

    function solveYears(PV, PMT, contribFreqN, r, n, atBeginning, targetFV) {
        let lo = 0, hi = 100;
        for (let i = 0; i < 100; i++) {
            const mid = (lo + hi) / 2;
            const fv = totalFV(PV, PMT, contribFreqN, r, n, mid, atBeginning);
            if (fv < targetFV) lo = mid; else hi = mid;
        }
        return (lo + hi) / 2;
    }

    function solveStart(targetFV, PMT, contribFreqN, r, n, years, atBeginning) {
        const fvContrib = fvContributions(PMT, contribFreqN, r, n, years, atBeginning);
        const remaining = targetFV - fvContrib;
        const growth = n === "continuous" ? Math.exp(r * years) : Math.pow(1 + r / n, n * years);
        return remaining / growth;
    }

    function solveContribution(targetFV, PV, contribFreqN, r, n, years, atBeginning) {
        const fvPV = fvLumpSum(PV, r, n, years);
        const remaining = targetFV - fvPV;
        if (remaining <= 0) return 0;
        const perUnit = fvContributions(1, contribFreqN, r, n, years, atBeginning);
        if (perUnit <= 0) return 0;
        return remaining / perUnit;
    }

    /* ---- schedule ---- */

    function buildSchedule(PV, PMT, contribFreqN, r, n, years, atBeginning) {
        const months = Math.max(1, Math.round(years * 12));
        const monthlyRate = (n === "continuous")
            ? Math.exp(r / 12) - 1
            : Math.pow(1 + r / n, n / 12) - 1;

        const contribEveryMonths = contribFreqN === 12 ? 1 : 12;

        let balance = PV;
        const monthly = [];
        let yearDeposit = 0, yearInterest = 0;

        for (let m = 1; m <= months; m++) {
            let deposit = 0;
            const isContribMonth = atBeginning
                ? ((m - 1) % contribEveryMonths === 0)
                : (m % contribEveryMonths === 0);

            if (isContribMonth) deposit = PMT;

            if (atBeginning && deposit) balance += deposit;

            const interest = balance * monthlyRate;
            balance += interest;

            if (!atBeginning && deposit) balance += deposit;

            yearDeposit += deposit;
            yearInterest += interest;

            const isYearEnd = (m % 12 === 0) || (m === months);

            monthly.push({ month: m, deposit, interest, balance, isYearEnd });

            if (isYearEnd) {
                monthly[monthly.length - 1].yearDeposit = yearDeposit;
                monthly[monthly.length - 1].yearInterest = yearInterest;
                yearDeposit = 0;
                yearInterest = 0;
            }
        }

        const yearly = [];
        let yIdx = 0;
        for (let i = 0; i < monthly.length; i++) {
            if (monthly[i].isYearEnd) {
                yIdx++;
                yearly.push({
                    year: yIdx,
                    deposit: monthly[i].yearDeposit,
                    interest: monthly[i].yearInterest,
                    balance: monthly[i].balance
                });
            }
        }

        return { monthly, yearly };
    }

    /* ---- pie chart ---- */

    function drawPie(startPct, contribPct, interestPct) {
        const pie = document.getElementById("pieChart");
        const size = 220;
        pie.width = size;
        pie.height = size;
        const pctx = pie.getContext("2d");
        pctx.clearRect(0, 0, size, size);

        const center = size / 2;
        const radius = size * 0.4;
        const thickness = size * 0.16;

        const segments = [
            { pct: startPct, color: "#005451" },
            { pct: contribPct, color: "#FAD1D7" },
            { pct: interestPct, color: "#E84231" }
        ];

        let start = -Math.PI / 2;
        segments.forEach(seg => {
            if (seg.pct <= 0) return;
            const angle = (seg.pct / 100) * Math.PI * 2;
            pctx.beginPath();
            pctx.arc(center, center, radius, start, start + angle);
            pctx.strokeStyle = seg.color;
            pctx.lineWidth = thickness;
            pctx.stroke();
            start += angle;
        });
    }

    /* ---- bar chart ---- */

    function renderBars(yearlyData, PV) {
        const container = document.getElementById("barChart");
        container.innerHTML = "";

        let cumDeposit = 0;
        const maxFV = yearlyData[yearlyData.length - 1]?.balance || 1;

        const step = yearlyData.length <= 10 ? 1 : yearlyData.length <= 20 ? 2 : 5;
        const trackMaxHeight = 170; // px

        yearlyData.forEach((d, i) => {
            cumDeposit += d.deposit;

            const showRow = (i + 1) % step === 0 || i === yearlyData.length - 1;
            if (!showRow) return;

            const totalPx = Math.max(2, (d.balance / maxFV) * trackMaxHeight);
            const startPx = Math.min((PV / maxFV) * trackMaxHeight, totalPx);
            const contribPx = Math.min((cumDeposit / maxFV) * trackMaxHeight, totalPx - startPx);
            const interestPx = Math.max(0, totalPx - startPx - contribPx);

            const col = document.createElement("div");
            col.className = "stick-col";
            col.innerHTML = `
                <span class="stick-value">${fmtPlain(d.balance)}</span>
                <div class="stick-track" style="height:${totalPx}px;">
                    <div class="stick-interest" style="height:${interestPx}px;"></div>
                    <div class="stick-contrib" style="height:${contribPx}px;"></div>
                    <div class="stick-start" style="height:${startPx}px;"></div>
                </div>
                <span class="stick-label">An ${d.year}</span>
            `;
            container.appendChild(col);
        });
    }

    /* ---- schedule table ---- */

    function renderSchedule() {
        const head = document.getElementById("scheduleHead");
        const body = document.getElementById("scheduleBody");
        if (!currentSchedule) return;

        if (scheduleView === "yearly") {
            head.innerHTML = `<th>An</th><th>Depunere</th><th>Dobândă</th><th>Sold final</th>`;
            body.innerHTML = currentSchedule.yearly.map(d => `
                <tr class="year-end">
                    <td>${d.year}</td>
                    <td>${fmt(d.deposit)}</td>
                    <td>${fmt(d.interest)}</td>
                    <td>${fmt(d.balance)}</td>
                </tr>
            `).join("");
        } else {
            head.innerHTML = `<th>Lună</th><th>Depunere</th><th>Dobândă</th><th>Sold final</th>`;
            body.innerHTML = currentSchedule.monthly.map(d => `
                <tr class="${d.isYearEnd ? 'year-end' : ''}">
                    <td>${d.month}</td>
                    <td>${fmt(d.deposit)}</td>
                    <td>${fmt(d.interest)}</td>
                    <td>${fmt(d.balance)}</td>
                </tr>
            `).join("");
        }
    }

    document.querySelectorAll("#scheduleToggle .freq-item").forEach(item => {
        item.addEventListener("click", () => {
            document.querySelectorAll("#scheduleToggle .freq-item").forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            scheduleView = item.dataset.view;
            renderSchedule();
        });
    });

    /* ---- main calculate ---- */

    function calculate() {

        const compoundSel = document.getElementById("compoundFreq").value;
        const n = compoundSel === "continuous" ? "continuous" : Number(compoundSel);
        const contribFreqN = Number(document.getElementById("contribFreq").value);
        const atBeginning = document.querySelector('input[name="contribTiming"]:checked').value === "begin";

        let PV, PMT, r, years, FV;
        PMT = parseNum("contribution");
        r = parseNum("rate") / 100;
        years = Math.max(0.1, parseNum("years"));

        if (mode === "end") {
            PV = parseNum("startAmount");
            FV = totalFV(PV, PMT, contribFreqN, r, n, years, atBeginning);
            mainLabelEl.textContent = "Valoarea finală";

        } else if (mode === "contribution") {
            FV = parseNum("targetAmount");
            PV = parseNum("startAmount");
            PMT = solveContribution(FV, PV, contribFreqN, r, n, years, atBeginning);
            mainLabelEl.textContent = "Contribuție necesară per perioadă";

        } else if (mode === "rate") {
            PV = parseNum("startAmount");
            FV = parseNum("endKnown");
            PMT = parseNum("contribution");
            r = solveRate(PV, PMT, contribFreqN, n, years, atBeginning, FV);
            mainLabelEl.textContent = "Rata dobânzii necesară";

        } else if (mode === "start") {
            FV = parseNum("endKnown");
            PV = solveStart(FV, PMT, contribFreqN, r, n, years, atBeginning);
            mainLabelEl.textContent = "Suma inițială necesară";

        } else if (mode === "length") {
            PV = parseNum("startAmount");
            FV = parseNum("endKnown");
            years = solveYears(PV, PMT, contribFreqN, r, n, atBeginning, FV);
            mainLabelEl.textContent = "Durata necesară";
        }

        // Guard against invalid numbers
        if (!isFinite(PV)) PV = 0;
        if (!isFinite(PMT)) PMT = 0;
        if (!isFinite(r)) r = 0;
        if (!isFinite(years) || years <= 0) years = 0.1;
        if (!isFinite(FV)) FV = totalFV(PV, PMT, contribFreqN, r, n, years, atBeginning);

        // Main value depends on the selected tab
        if (mode === "end") {
            document.getElementById("mainValue").textContent = fmt(FV);
        } else if (mode === "start") {
            document.getElementById("mainValue").textContent = fmt(PV);
        } else if (mode === "contribution") {
            document.getElementById("mainValue").textContent = fmt(PMT);
        } else if (mode === "rate") {
            document.getElementById("mainValue").textContent = (r * 100).toFixed(2) + "%";
        } else if (mode === "length") {
            document.getElementById("mainValue").textContent = years.toFixed(1) + " ani";
        }

        const totalContribAmount = PMT * contribFreqN * years;
        const totalInterest = FV - PV - totalContribAmount;

        document.getElementById("resStart").textContent = fmt(PV);
        document.getElementById("resContribs").textContent = fmt(totalContribAmount);
        document.getElementById("resInterest").textContent = fmt(Math.max(0, totalInterest));

        // Pie chart
        const totalForPie = Math.max(FV, 1);
        const startPct = Math.max(0, Math.min(100, (PV / totalForPie) * 100));
        const contribPct = Math.max(0, Math.min(100 - startPct, (totalContribAmount / totalForPie) * 100));
        const interestPct = Math.max(0, 100 - startPct - contribPct);

        drawPie(startPct, contribPct, interestPct);
        document.getElementById("pieCenterValue").textContent = fmt(FV);
        document.getElementById("legendStart").textContent = `Suma inițială — ${startPct.toFixed(0)}%`;
        document.getElementById("legendContrib").textContent = `Contribuții — ${contribPct.toFixed(0)}%`;
        document.getElementById("legendInterest").textContent = `Dobândă — ${interestPct.toFixed(0)}%`;

        // Schedule + bar chart (capped at 50 years for performance)
        const scheduleYears = Math.min(years, 50);
        currentSchedule = buildSchedule(PV, PMT, contribFreqN, r, n, scheduleYears, atBeginning);
        renderSchedule();
        renderBars(currentSchedule.yearly, PV);
    }

    document.getElementById("calc-btn")?.addEventListener("click", calculate);

    applyTabVisibility(); // also runs the first calculation
}

if (document.getElementById("tabRow")) {
    initInvestmentCalculator();
}


/* =========================
   BUDGET CALCULATOR
   (only runs on calculator-de-buget.html)
   Needs / wants / savings come from data-group on each .expense-input
========================= */

function initBudgetCalculator() {

    const incomeInput   = document.getElementById("amount");
    const expenseInputs = document.querySelectorAll(".expense-input");
    const $ = (id) => document.getElementById(id);

    // Texts written by the script (the rest lives in the HTML)
    const B = LANG === "ru" ? {
        savings: "Накопления",
        link: "Посмотрите, как могут расти ваши накопления со временем",
        deficit: "Дефицит",
        hints: {
            needsOk: { emoji: "👍", title: "Вы хорошо откладываете.",
                       text: "Потребности превышают 50%, но для накоплений остаётся место.", link: true },
            wantsOk: { emoji: "👍", title: "Вы хорошо откладываете.",
                       text: "Желания превышают 30%, но для накоплений остаётся место.", link: true },
            empty:   { emoji: "🤔", title: "Что-то забыли?",
                       text: "Проверьте ещё раз выше, всё ли вы ввели, и исправьте данные." },
            deficit: { emoji: "😬", title: "Расходы превышают доход",
                       text: "Вы тратите больше, чем зарабатываете. Проверьте категории выше и найдите, где можно сократить расходы." },
            needs:   { emoji: "🏠", title: "Потребности превышают 50% дохода",
                       text: "Попробуйте снизить постоянные расходы, например коммунальные услуги или транспорт, чтобы больше оставалось на накопления." },
            wants:   { emoji: "🛍️", title: "Желания превышают 30% дохода",
                       text: "Небольшое сокращение покупок или развлечений поможет откладывать больше." },
            low:     { emoji: "💰", title: "Накопления меньше 20% дохода",
                       text: "Откладывайте деньги в начале месяца, до того как начнёте тратить." },
            great:   { emoji: "🎉", title: "Вы укладываетесь в правило 50-30-20!",
                       text: "Ваши деньги сбалансированно распределены между потребностями, желаниями и накоплениями. Так держать!", link: true }
        }
    } : {
        savings: "Economisiri",
        link: "Vezi cât pot crește economiile tale în timp",
        deficit: "Deficit",
        hints: {
            needsOk: { emoji: "👍", title: "Economisești bine.",
                       text: "Nevoile sunt peste 50%, dar rămâne loc pentru economii.", link: true },
            wantsOk: { emoji: "👍", title: "Economisești bine.",
                       text: "Dorințele sunt peste 30%, dar rămâne loc pentru economii.", link: true },
            empty:   { emoji: "🤔", title: "Ai uitat ceva?",
                       text: "Verifică din nou mai sus dacă ai introdus totul și corectează-ți intrările." },
            deficit: { emoji: "😬", title: "Cheltuielile depășesc venitul",
                       text: "Ai cheltuit mai mult decât câștigi. Verifică categoriile de mai sus și vezi unde poți reduce costurile." },
            needs:   { emoji: "🏠", title: "Nevoile depășesc 50% din venit",
                       text: "Încearcă să reduci costurile fixe, cum ar fi utilitățile sau transportul, ca să rămână mai mult pentru economii." },
            wants:   { emoji: "🛍️", title: "Dorințele depășesc 30% din venit",
                       text: "Câteva tăieri mici la shopping sau la ieșiri te pot ajuta să economisești mai mult." },
            low:     { emoji: "💰", title: "Economiile sunt sub 20% din venit",
                       text: "Încearcă să pui bani deoparte la începutul lunii, înainte să începi să cheltuiești." },
            great:   { emoji: "🎉", title: "Te încadrezi în regula 50-30-20!",
                       text: "Banii tăi sunt împărțiți echilibrat între nevoi, dorințe și economii. Continuă așa!", link: true }
        }
    };

    const money = (n) => Math.round(n).toLocaleString("en-US") + " " + TXT.lei;
    const pct   = (n) => n + " %";

    /* "Ce e asta?" (and a link ending in #faq-categorii) opens the 50-30-20 FAQ answer */
    function openRuleFaq(smooth) {
        const target = $("faq-categorii");
        if (!target) return;

        document.querySelectorAll(".item").forEach(i => i.classList.remove("open"));
        target.classList.add("open");
        target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    }

    $("ruleLink")?.addEventListener("click", (e) => {
        e.preventDefault();
        openRuleFaq(true);
    });

    if (location.hash === "#faq-categorii") openRuleFaq(false);

    function pickHint(income, expenses, needsP, wantsP, savingsP) {
        if (income === 0 || expenses === 0) return B.hints.empty;
        if (expenses > income)              return B.hints.deficit;

        // Saving 20 % or more: always a positive message (with the link to the investment calculator)
        if (savingsP >= 20) {
            if (needsP > 50) return B.hints.needsOk;
            if (wantsP > 30) return B.hints.wantsOk;
            return B.hints.great;
        }

        if (needsP > 50) return B.hints.needs;
        if (wantsP > 30) return B.hints.wants;
        return B.hints.low;
    }

    function update() {

        const income = parseNumber(incomeInput.value);

        const groups = { needs: 0, wants: 0 };
        expenseInputs.forEach(input => {
            const g = input.dataset.group;
            if (g in groups) groups[g] += parseNumber(input.value);
        });

        const expenses = groups.needs + groups.wants;
        const balance  = income - expenses;
        const savings  = Math.max(0, balance);

        /* ---- At a glance ---- */
        $("glanceIncome").textContent       = money(income);
        $("glanceExpenses").textContent     = money(expenses);
        $("glanceBalance").textContent      = money(balance);
        $("glanceBalanceLabel").textContent = balance < 0 ? B.deficit : B.savings;

        $("glanceBalance").classList.toggle("is-negative", balance < 0);
        $("glanceBalanceLabel").classList.toggle("is-negative", balance < 0);

        /* ---- 50-30-20 (percentages of net income) ---- */
        let needsP = 0, wantsP = 0, savingsP = 0;

        if (income > 0) {
            needsP   = Math.round(groups.needs / income * 100);
            wantsP   = Math.round(groups.wants / income * 100);
            // Savings = the rest, so the three parts add up to 100 %
            savingsP = balance > 0 ? Math.max(0, 100 - needsP - wantsP) : 0;
        }

        $("needsPct").textContent   = pct(needsP);
        $("wantsPct").textContent   = pct(wantsP);
        $("savingsPct").textContent = pct(savingsP);

        $("needsAmt").textContent   = money(groups.needs);
        $("wantsAmt").textContent   = money(groups.wants);
        $("savingsAmt").textContent = money(savings);

        /* ---- Feedback ---- */
        const hint = pickHint(income, expenses, needsP, wantsP, savingsP);
        $("hintEmoji").textContent = hint.emoji;
        $("hintTitle").textContent = hint.title;
        $("hintText").textContent  = hint.text;

        const hintLink = $("hintLink");
        if (hintLink) {
            hintLink.textContent = B.link;
            hintLink.hidden = !hint.link;
        }
    }

    // The money formatting above (setupNumericField) is registered first, so the value is already formatted
    incomeInput.addEventListener("input", update);
    expenseInputs.forEach(input => input.addEventListener("input", update));

    update();
}

if (document.getElementById("glanceBalance")) {
    initBudgetCalculator();
}

});