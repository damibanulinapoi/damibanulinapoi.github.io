const langBtn = document.getElementById("langBtn");
const langMenu = document.getElementById("langMenu");
const langFlag = document.getElementById("langFlag");
const options = document.querySelectorAll(".lang-option");

const incomeInputs = document.querySelectorAll(".income-input");

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
incomeInputs.forEach(input => {
    input.addEventListener("focus", () => {
        if (input.value === "0") input.value = "";
    });

    input.addEventListener("input", (e) => {
        e.target.value = formatIncome(e.target.value);
    });
});

/* =========================
   DONUT CHART
========================= */

const ctx = document.getElementById("chart");

const categoryInputs = document.querySelectorAll(".income-input");

const categoryLabels = [
    "Venit",
    "Locuință",
    "Utilități",
    "Datorii",
    "Mâncare",
    "Transport",
    "Sănătate",
    "Îngrijire",
    "Casă",
    "Abonamente",
    "Shopping",
    "Ieșiri",
    "Donații",
    "Alte"
];

// IMPORTANT: same order as HTML inputs
function getValues() {
    return Array.from(categoryInputs).map(input => {
        return Number(input.value.replace(/\D/g, "")) || 0;
    });
}

const chart = new Chart(ctx, {
    type: "doughnut",
    data: {
        labels: categoryLabels,
        datasets: [{
            data: getValues(),
            backgroundColor: [
                "#E84231",
                "#FAD1D7",
                "#005451",
                "#FFD200",
                "#003F87",
                "#8A2BE2",
                "#FF7A00",
                "#00A8A8",
                "#B22222",
                "#2E8B57",
                "#C71585",
                "#FF4500",
                "#7B68EE",
                "#A9A9A9"
            ],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        cutout: "70%",
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

/* UPDATE CHART LIVE */
function updateChart() {
    chart.data.datasets[0].data = getValues();
    chart.update();

    const totalIncome = Number(incomeInputs[0].value.replace(/\D/g, "")) || 0;
    document.getElementById("incomeText").textContent =
        totalIncome.toLocaleString("en-US");
}

incomeInputs.forEach(input => {
    input.addEventListener("input", updateChart);
});

updateChart();

const text = document.querySelector('.hero-text');
const image = document.querySelector('.hero-image img');

function syncImageHeight() {
    const height = text.offsetHeight;

    // safety cap (prevents breaking layout)
    const max = 220;

    image.style.height = Math.min(height, max) + "px";
}

syncImageHeight();
window.addEventListener('resize', syncImageHeight);

incomeInputs.forEach(input => {
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

    input.addEventListener("input", updateChart);
});

const buttons = document.querySelectorAll(".toggle-btn");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
    });
});