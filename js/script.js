const langBtn = document.getElementById("langBtn");
const langMenu = document.getElementById("langMenu");
const langFlag = document.getElementById("langFlag");
const options = document.querySelectorAll(".lang-option");

const allMoneyInputs = document.querySelectorAll(".income-input, .expense-input");

const MAX_DIGITS = 6;

/* LANGUAGE TOGGLE */
langBtn.addEventListener("click", () => {
    langMenu.classList.toggle("active");
});

/* LANGUAGE SWITCH */
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

/* CLOSE OUTSIDE */
document.addEventListener("click", (e) => {
    if (!e.target.closest(".lang-dropdown")) {
        langMenu.classList.remove("active");
    }
});

/* NUMBER FORMAT HELPERS */
function formatIncome(value) {
    value = value.replace(/\D/g, "").slice(0, MAX_DIGITS);

    if (!value) return "0";

    return Number(value).toLocaleString("en-US");
}

/* INCOME INPUTS */
allMoneyInputs.forEach(input => {
    input.addEventListener("focus", () => {
        if (input.value === "0") {
            input.value = "";
        }
    });

    input.addEventListener("blur", () => {
        if (input.value.trim() === "") {
            input.value = "0";
        }
    });

    input.addEventListener("input", (e) => {
        e.target.value = formatIncome(e.target.value);
    });
});

// IMPORTANT: same order as HTML inputs
function getValues() {
    return Array.from(categoryInputs).map(input => {
        return Number(input.value.replace(/\D/g, "")) || 0;
    });
}

const items = document.querySelectorAll('.item');

items.forEach(item => {
    const question = item.querySelector('.question');

    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all
        items.forEach(i => {
            i.classList.remove('open');
        });

        // Open clicked item if it wasn't open
        if (!isOpen) {
            item.classList.add('open');
        }
    });
});

const canvas = document.getElementById("chart");
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

function getNumericValue(value) {
    return Number(value.replace(/\D/g, "")) || 0;
}

const income = getNumericValue(incomeInput.value);

const expenses = [...expenseInputs].map(input =>
    getNumericValue(input.value)
);

    const baseRadius = size * 0.35;
    const thickness = size * 0.12;
    const overflowRadius = baseRadius + thickness;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(center, center, baseRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = thickness;
    ctx.stroke();

    if (income <= 0) {
        incomeText.textContent = "0";
        return;
    }

    let start = -Math.PI / 2;
    const gap = 0.025;
    let used = 0;

    expenses.forEach((value, i) => {

        if (value <= 0) return;

        let inside = Math.max(
            0,
            Math.min(value, income - used)
        );

        let overflow = Math.max(
            0,
            value - inside
        );

        if (inside > 0) {

            let angle =
                (inside / income) *
                Math.PI * 2;

            if (angle > gap) {

                ctx.beginPath();

                ctx.arc(
                    center,
                    center,
                    baseRadius,
                    start + gap / 2,
                    start + gap / 2 + (angle - gap)
                );

                ctx.strokeStyle =
                    colors[i % colors.length];

                ctx.lineWidth = thickness;

                ctx.stroke();
            }

            start += angle;
            used += inside;
        }

        if (overflow > 0) {

            let angle =
                (overflow / income) *
                Math.PI * 2;

            if (angle > gap) {

                ctx.beginPath();

                ctx.arc(
                    center,
                    center,
                    overflowRadius,
                    start + gap / 2,
                    start + gap / 2 + (angle - gap)
                );

                ctx.strokeStyle =
                    colors[i % colors.length];

                ctx.lineWidth =
                    thickness * 0.3;

                ctx.stroke();
            }

            start += angle;
        }
    });

    incomeText.textContent =
        income.toLocaleString("en-US");
}

incomeInput.addEventListener("input", drawChart);

expenseInputs.forEach(input => {
    input.addEventListener("input", drawChart);
});

window.addEventListener("resize", drawChart);

drawChart();