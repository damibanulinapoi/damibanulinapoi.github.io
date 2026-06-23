const langBtn = document.getElementById("langBtn");
const langMenu = document.getElementById("langMenu");
const langFlag = document.getElementById("langFlag");
const options = document.querySelectorAll(".lang-option");

const allMoneyInputs = document.querySelectorAll(".income-input, .expense-input");

const MAX_DIGITS = 8;

/* =========================
   SEGMENT CONTROL
========================= */

let calcMode = "net";

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
    });
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
   LANGUAGE TOGGLE
========================= */

langBtn.addEventListener("click", () => {
    langMenu.classList.toggle("active");
});

options.forEach(option => {
    option.addEventListener("click", () => {
        const lang = option.dataset.lang;

        langFlag.src =
            lang === "RO"
                ? "images/flag-romania.svg"
                : "images/flag-russia.svg";

        langMenu.classList.remove("active");
    });
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".lang-dropdown")) {
        langMenu.classList.remove("active");
    }
});

/* =========================
   INPUT FORMATTING
========================= */

function formatIncome(value) {
    value = value.replace(/\D/g, "").slice(0, MAX_DIGITS);
    if (!value) return "0";
    return Number(value).toLocaleString("en-US");
}

allMoneyInputs.forEach(input => {

    input.addEventListener("focus", () => {
        if (input.value === "0") input.value = "";
    });

    input.addEventListener("blur", () => {
        if (input.value.trim() === "") input.value = "0";
    });

    input.addEventListener("input", (e) => {
        e.target.value = formatIncome(e.target.value);
    });
});

/* =========================
   FAQ ACCORDION (RESTORED)
========================= */

const items = document.querySelectorAll('.item');

items.forEach(item => {
    const question = item.querySelector('.question');

    if (!question) return;

    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        items.forEach(i => i.classList.remove('open'));

        if (!isOpen) {
            item.classList.add('open');
        }
    });
});

/* =========================
   CHART (SAFE RESTORE)
========================= */

const canvas = document.getElementById("chart");

if (canvas) {

    const ctx = canvas.getContext("2d");

    const incomeInput = document.getElementById("amount");
    const incomeText = document.getElementById("incomeText");
    const expenseInputs = document.querySelectorAll(".expense-input");

    const colors = [
        "#243e92","#3c59c0","#5a7fe0",
        "#10312a","#174741","#0f615c",
        "#2ca153","#218f4a","#55cc80",
        "#fe7f07","#d46f05","#ffa03a",
        "#c93a3a","#e55252","#ff7a7a"
    ];

    function resizeCanvas() {
        const size = canvas.clientWidth;
        const dpr = window.devicePixelRatio || 1;

        canvas.width = size * dpr;
        canvas.height = size * dpr;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawChart() {

        resizeCanvas();

        const size = canvas.clientWidth;
        const center = size / 2;

        const income = Number(incomeInput.value.replace(/\D/g, "")) || 0;

        const expenses = [...expenseInputs].map(i =>
            Number(i.value.replace(/\D/g, "")) || 0
        );

        const baseRadius = size * 0.35;
        const thickness = size * 0.12;
        const overflowRadius = baseRadius + thickness;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(center, center, baseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = thickness;
        ctx.stroke();

        if (income <= 0) {
            if (incomeText) incomeText.textContent = "0";
            return;
        }

        let start = -Math.PI / 2;
        const gap = 0.025;
        let used = 0;

        expenses.forEach((value, i) => {

            if (value <= 0) return;

            let inside = Math.max(0, Math.min(value, income - used));
            let overflow = Math.max(0, value - inside);

            if (inside > 0) {

                let angle = (inside / income) * Math.PI * 2;

                if (angle > gap) {
                    ctx.beginPath();
                    ctx.arc(center, center, baseRadius,
                        start + gap / 2,
                        start + gap / 2 + (angle - gap)
                    );

                    ctx.strokeStyle = colors[i % colors.length];
                    ctx.lineWidth = thickness;
                    ctx.stroke();
                }

                start += angle;
                used += inside;
            }

            if (overflow > 0) {

                let angle = (overflow / income) * Math.PI * 2;

                if (angle > gap) {
                    ctx.beginPath();
                    ctx.arc(center, center, overflowRadius,
                        start + gap / 2,
                        start + gap / 2 + (angle - gap)
                    );

                    ctx.strokeStyle = colors[i % colors.length];
                    ctx.lineWidth = thickness * 0.3;
                    ctx.stroke();
                }

                start += angle;
            }
        });

        if (incomeText) {
            incomeText.textContent = income.toLocaleString("en-US");
        }
    }

    incomeInput.addEventListener("input", drawChart);
    expenseInputs.forEach(i => i.addEventListener("input", drawChart));
    window.addEventListener("resize", drawChart);

    drawChart();
}