const button = document.getElementById("calculează-btn");
const expensesSection = document.getElementById("expenses-section");

if (button && expensesSection) {
    button.addEventListener("click", () => {
        expensesSection.style.display = "block";
        button.style.display = "none";
    });
}

const langBtn = document.getElementById("langBtn");

if (langBtn) {
    langBtn.addEventListener("click", () => {
        langBtn.textContent =
            langBtn.textContent.trim() === "RO" ? "RU" : "RO";
    });
}