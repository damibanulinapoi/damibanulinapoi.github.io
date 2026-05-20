const button = document.getElementById("calculează-btn");
const expensesSection = document.getElementById("expenses-section");

if (button && expensesSection) {
    button.addEventListener("click", () => {
        expensesSection.style.display = "block";
        button.style.display = "none";
    });
}

const langBtn = document.getElementById("langBtn");
const langMenu = document.getElementById("langMenu");
const langFlag = document.getElementById("langFlag");

const options = document.querySelectorAll(".lang-option");

/* OPEN / CLOSE */

langBtn.addEventListener("click", () => {
    langMenu.classList.toggle("active");
});

/* CHANGE LANGUAGE */

options.forEach(option => {

    option.addEventListener("click", () => {

        const lang = option.dataset.lang;

        if (lang === "RO") {
            langFlag.src = "images/flag-romania.svg";
        } else {
            langFlag.src = "images/flag-russia.svg";
        }

        langMenu.classList.remove("active");

    });

});

/* CLOSE OUTSIDE */

document.addEventListener("click", (e) => {

    if (!e.target.closest(".lang-dropdown")) {
        langMenu.classList.remove("active");
    }

});