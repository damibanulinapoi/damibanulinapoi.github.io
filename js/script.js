const button = document.getElementById("calculează-btn");
const expensesSection = document.getElementById("expenses-section");

button.addEventListener("click", () => {

    // show expenses
    expensesSection.style.display = "block";

    // hide button
    button.style.display = "none";
});