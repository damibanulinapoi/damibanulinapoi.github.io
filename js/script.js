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
   CORE CALCULATION (BRUT → ALL)
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

        /* ===== FROM BRUT ===== */
        if (calcMode === "brut") {
            result = calcFromBrut(input);
        }

        /* ===== FROM NET (ITERATIVE SOLVER) ===== */
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

        /* ===== FROM TOTAL (ITERATIVE SOLVER) ===== */
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

        /* =========================
           OUTPUT
        ========================= */

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