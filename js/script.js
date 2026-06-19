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