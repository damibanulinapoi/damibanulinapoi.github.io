const button = document.getElementById("show-expenses-btn");
const expensesSection = document.getElementById("expenses-section");

button.addEventListener("click", () => {

    // show expenses
    expensesSection.style.display = "block";

    // hide button
    button.style.display = "none";
});