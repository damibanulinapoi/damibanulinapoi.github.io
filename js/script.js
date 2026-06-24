document.addEventListener("DOMContentLoaded", () => {

const MAX_DIGITS = 8;

/* =========================
   HELPERS
========================= */

const parseNumber = (val) =>
    Number(String(val).replace(/[^\d]/g, "")) || 0;

const formatNumber = (val) =>
    Math.round(val).toLocaleString("en-US");

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
   FAQ ACCORDION
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

let calcMode = "net";

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

        if (calcMode === "net") {
            salaryLabel.textContent = "Salariu net";
        } else if (calcMode === "brut") {
            salaryLabel.textContent = "Salariu brut";
        } else if (calcMode === "total") {
            salaryLabel.textContent = "Salariu total";
        }
    });
});

const advancedBtn = document.getElementById("advanced-btn");
const advancedOptions = document.getElementById("advanced-options");
const advancedIcon = document.getElementById("advanced-icon");

advancedBtn.addEventListener("click", () => {

    advancedOptions.classList.toggle("show");

    if (advancedOptions.classList.contains("show")) {
        advancedIcon.textContent = "−";
    } else {
        advancedIcon.textContent = "+";
    }

});

/* =========================
   HELPERS
========================= */

const R = (x) => Math.round(x);

function getInputValue() {
    return Number(
        document
            .getElementById("amount")
            .value
            .replace(/\D/g, "")
    ) || 0;
}

/* =========================
   CORE CALCULATION
========================= */

function calcFromBrut(brut) {

    brut = R(brut);

    const social = R(brut * 0.24);
    const medical = R(brut * 0.09);

    const venitImpozabil = R(brut - medical);
    const impozit = R(venitImpozabil * 0.12);

    const net = R(brut - medical - impozit);
    const total = R(brut + social);

    return {
        brut,
        net,
        total,
        social,
        medical,
        impozit,
        venitImpozabil
    };
}

/* =========================
   SALARY CALCULATOR
========================= */

document
    .getElementById("calculează-btn")
    .addEventListener("click", function () {

        const input = getInputValue();
        const scutire = 0;

        let result;

        if (calcMode === "brut") {
            result = calcFromBrut(input);
        }

        if (calcMode === "net") {

            let targetNet = input;
            let brut = targetNet;

            for (let i = 0; i < 25; i++) {
                const r = calcFromBrut(brut);
                const diff = targetNet - r.net;
                brut += diff;
                if (Math.abs(diff) < 1) break;
            }

            result = calcFromBrut(brut);
        }

        if (calcMode === "total") {

            let targetTotal = input;
            let brut = targetTotal / 1.24;

            for (let i = 0; i < 20; i++) {
                const r = calcFromBrut(brut);
                const diff = targetTotal - r.total;
                brut += diff;
                if (Math.abs(diff) < 1) break;
            }

            result = calcFromBrut(brut);
        }

        document.getElementById("netResult").textContent =
            result.net.toLocaleString("en-US") + " lei";

        document.getElementById("brutResult").textContent =
            result.brut.toLocaleString("en-US") + " lei";

        document.getElementById("totalResult").textContent =
            result.total.toLocaleString("en-US") + " lei";

        document.getElementById("scutireResult").textContent =
            scutire.toLocaleString("en-US") + " lei";

        document.getElementById("impozabilResult").textContent =
            result.venitImpozabil.toLocaleString("en-US") + " lei";

        document.getElementById("socialResult").textContent =
            result.social.toLocaleString("en-US") + " lei";

        document.getElementById("medicalResult").textContent =
            result.medical.toLocaleString("en-US") + " lei";

        document.getElementById("taxResult").textContent =
            result.impozit.toLocaleString("en-US") + " lei";

        document.getElementById("totalTaxResult").textContent =
            (result.social + result.medical + result.impozit)
                .toLocaleString("en-US") + " lei";

        document.querySelector(".resultat").classList.add("show");
    });

/* =========================
   CHART (SAFE + OPTIONAL)
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