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

const incomeInputs = document.querySelectorAll(".income-input");

incomeInputs.forEach((input) => {
    input.addEventListener("input", (e) => {

        // remove everything except digits
        let value = e.target.value.replace(/\D/g, "");

        // limit to 6 digits
        value = value.slice(0, 6);

        // format with commas
        if (value) {
            value = Number(value).toLocaleString("en-US");
        }

        e.target.value = value;
    });
});

document.querySelectorAll(".income-input").forEach((input) => {

    let isFirstInput = true;

    input.addEventListener("focus", () => {
        if (input.value === "0") {
            input.value = "";
        }
    });

    input.addEventListener("input", (e) => {

        let value = e.target.value.replace(/\D/g, "");
        value = value.slice(0, 6);

        if (value === "") {
            e.target.value = "0";
            return;
        }

        value = Number(value).toLocaleString("en-US");

        e.target.value = value;
    });
});