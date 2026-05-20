const button = document.getElementById("calculează-btn");
const expensesSection = document.getElementById("expenses-section");

if (button && expensesSection) {
    button.addEventListener("click", () => {
        expensesSection.style.display = "block";
        button.style.display = "none";
    });
}

const langBtn = document.getElementById("langBtn");
const langFlag = document.getElementById("langFlag");

let lang = "RO";

if (langBtn) {
    langBtn.addEventListener("click", () => {
        lang = lang === "RO" ? "RU" : "RO";

        langFlag.src =
            lang === "RO"
                ? "images/flag-romania.svg"
                : "images/flag-russia.svg";
    });
}