/* =====================================================
   BUDGET EXPORT (calculator-de-buget.html only)
   - CSV button: downloads what is written in the calculator
   - PDF button: opens the print window with a clean summary
     (choose "Save as PDF" there)
   Self-contained: reads the values straight from the page,
   so it follows whatever currency / texts the page shows.
===================================================== */
(function () {
    const csvBtn = document.getElementById("csvBtn");
    const pdfBtn = document.getElementById("pdfBtn");
    const incomeInput = document.getElementById("amount");
    if (!csvBtn || !pdfBtn || !incomeInput) return;

    const ru = document.documentElement.lang === "ru";

    const T = ru ? {
        title: "Сводка бюджета", income: "Доход", expenses: "Расходы", needs: "Потребности", wants: "Желания",
        category: "Категория", group: "Группа", monthly: "Сумма в месяц", totalExp: "Всего расходов",
        split: "Распределение 50-30-20", percent: "Процент", amount: "Сумма", file: "budget"
    } : {
        title: "Rezumat buget", income: "Venit", expenses: "Cheltuieli", needs: "Nevoi", wants: "Dorințe",
        category: "Categorie", group: "Grup", monthly: "Sumă lunară", totalExp: "Total cheltuieli",
        split: "Împărțirea 50-30-20", percent: "Procent", amount: "Sumă", file: "buget"
    };

    /* ---------- helpers ---------- */

    const digits = (v) => Number(String(v).replace(/[^\d]/g, "")) || 0;
    const text = (el) => (el ? el.textContent.trim() : "");

    // currency written next to the income field (lei, €, ...)
    const cur = text(document.querySelector("#amount + .currency")) || (ru ? "л" : "lei");
    const sep = /^[A-Za-zА-Яа-я]/.test(cur) ? " " : "";

    const dots = (n) => {
        const s = String(Math.abs(Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ru ? "\u00A0" : ".");
        return (n < 0 ? "-" : "") + s;
    };
    const money = (n) => dots(n) + sep + cur;

    const today = new Date();
    const dateText = today.toLocaleDateString(ru ? "ru-RU" : "ro-RO");
    const dateIso = today.toISOString().slice(0, 10);

    const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

    /* ---------- read everything from the page ---------- */

    function collect() {
        const rows = [...document.querySelectorAll(".expense-input")].map((input) => ({
            label: text(input.closest(".income-row")?.querySelector(".body2")),
            group: input.dataset.group,
            value: digits(input.value)
        }));

        const income = digits(incomeInput.value);
        const sum = (g) => rows.filter((r) => r.group === g).reduce((a, r) => a + r.value, 0);
        const needs = sum("needs");
        const wants = sum("wants");
        const expenses = needs + wants;
        const balance = income - expenses;
        const pct = (id) => parseInt(text(document.getElementById(id)), 10) || 0;

        return {
            incomeLabel: text(incomeInput.closest(".income-row")?.querySelector(".body2")) || T.income,
            income, rows, needs, wants, expenses, balance,
            savings: Math.max(0, balance),
            balanceLabel: text(document.getElementById("glanceBalanceLabel")),
            pctNeeds: pct("needsPct"), pctWants: pct("wantsPct"), pctSavings: pct("savingsPct"),
            hintTitle: text(document.getElementById("hintTitle")),
            hintText: text(document.getElementById("hintText"))
        };
    }

    const groupName = (g) => (g === "needs" ? T.needs : T.wants);

    /* ---------- CSV ---------- */

    const csvCell = (v) => {
        const s = String(v);
        return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };

    csvBtn.addEventListener("click", () => {
        const d = collect();
        const lines = [
            [T.title, dateText],
            [],
            [T.category, T.group, `${T.monthly} (${cur})`],
            [d.incomeLabel, T.income, d.income],
            ...d.rows.map((r) => [r.label, groupName(r.group), r.value]),
            [],
            [T.totalExp, "", d.expenses],
            [d.balanceLabel, "", d.balance],
            [],
            [T.split, T.percent + " (%)", `${T.amount} (${cur})`],
            [T.needs, d.pctNeeds, d.needs],
            [T.wants, d.pctWants, d.wants],
            [d.balance < 0 ? d.balanceLabel : text(document.querySelector("#segSavings .rule-name")) || d.balanceLabel,
             d.pctSavings, d.savings]
        ];

        // ";" separator + BOM: Excel opens it correctly, with diacritics
        const csv = "\uFEFF" + lines.map((l) => l.map(csvCell).join(";")).join("\r\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));

        const a = document.createElement("a");
        a.href = url;
        a.download = `${T.file}-${dateIso}.csv`;
        document.body.append(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

    /* ---------- PDF (print window) ---------- */

    function buildSummary(d) {
        const line = (a, b, cls) => `<tr class="${cls || ""}"><td>${esc(a)}</td><td>${esc(b)}</td></tr>`;

        const part = (g, name, total) => {
            const items = d.rows.filter((r) => r.group === g && r.value > 0);
            return line(name, money(total), "ps-group") +
                (items.length ? items.map((r) => line(r.label, money(r.value), "ps-item")).join("") : "");
        };

        const savingsName = text(document.querySelector("#segSavings .rule-name")) || d.balanceLabel;

        return `
            <h1>${esc(T.title)}</h1>
            <p class="ps-meta">${esc(dateText)} · ${esc(location.host)}</p>

            <table>
                ${line(d.incomeLabel, money(d.income), "ps-group")}
            </table>

            <h2>${esc(T.expenses)}</h2>
            <table>
                ${part("needs", T.needs, d.needs)}
                ${part("wants", T.wants, d.wants)}
                ${line(T.totalExp, money(d.expenses), "ps-total")}
                ${line(d.balanceLabel, money(d.balance), "ps-total")}
            </table>

            <h2>${esc(T.split)}</h2>
            <table class="ps-split">
                <tr><th></th><th>${esc(T.percent)}</th><th>${esc(T.amount)}</th></tr>
                <tr><td>${esc(T.needs)}</td><td>${d.pctNeeds} %</td><td>${money(d.needs)}</td></tr>
                <tr><td>${esc(T.wants)}</td><td>${d.pctWants} %</td><td>${money(d.wants)}</td></tr>
                <tr><td>${esc(savingsName)}</td><td>${d.pctSavings} %</td><td>${money(d.savings)}</td></tr>
            </table>

            <div class="ps-hint">
                <strong>${esc(d.hintTitle)}</strong>
                <p>${esc(d.hintText)}</p>
            </div>`;
    }

    pdfBtn.addEventListener("click", () => {
        let box = document.getElementById("printSummary");
        if (!box) {
            box = document.createElement("div");
            box.id = "printSummary";
            box.className = "print-summary";
            document.body.append(box);
        }
        box.innerHTML = buildSummary(collect());

        // the browser suggests the page title as the PDF file name
        const oldTitle = document.title;
        document.title = `${T.title} ${dateIso}`;
        window.addEventListener("afterprint", () => { document.title = oldTitle; }, { once: true });

        window.print();
    });
})();
