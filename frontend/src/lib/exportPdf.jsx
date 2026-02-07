// src/lib/exportPdf.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "./api";

// ❌ DO NOT register manually (this causes the error)
// autoTable(jsPDF);

// Format date
const fmtDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const fmtTime = (timeStr) => {
    if (!timeStr) return "";
    const d = new Date(`1970-01-01T${timeStr}`);
    if (Number.isNaN(d.getTime())) return timeStr;
    return d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};
const pad2 = (n) => String(n).padStart(2, "0");

export default async function exportPdf({ email, period = "all", range = {} }) {
    if (!email) throw new Error("Email is required");

    // Build filter params like Dashboard
    const params = { email };

    if (period === "all") {
        params.filterType = "all";
    } else if (period === "custom" && range?.start && range?.end) {
        params.filterType = "dateRange";
        params.startDate = range.start;
        params.endDate = range.end;
    } else {
        const map = { "1m": 1, "3m": 3, "6m": 6, "1y": 12, "3y": 36 };
        const months = map[period];
        if (months) {
            params.filterType = "lastMonths";
            params.months = months;
        }
    }

    // Fetch filtered data
    const res = await api.get("/dashboard", { params });

    const payload = res.data || {};
    const expenses = Array.isArray(payload.expenses) ? payload.expenses : [];
    const username = payload.username || "";

    const totalIncome = payload.totalIncome || 0;
    const totalExpense = payload.totalExpense || 0;
    const balance = Number((totalIncome - totalExpense).toFixed(2));

    let periodLabel = "All time";
    if (params.filterType !== "all") {
        if (params.filterType === "dateRange") {
            periodLabel = `From ${params.startDate} to ${params.endDate}`;
        } else if (params.filterType === "lastMonths") {
            periodLabel = `Last ${params.months} months`;
        }
    }

    // Create PDF
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.width;
    const margin = 40;

    const primary = "#24c2ee";
    const incomeColor = "#2f9e44";
    const expenseColor = "#ef4444";

    // ===== HEADER =====
    doc.setFontSize(18);
    doc.text("Expense Tracker Report", pageWidth / 2, margin, {
        align: "center",
    });

    doc.setFontSize(11);
    doc.text(`Name: ${username}`, margin, margin + 25);
    doc.text(`Email: ${email}`, margin, margin + 40);
    doc.text(`Period: ${periodLabel}`, margin, margin + 60);

    doc.text(`Total Income: Rs: ${totalIncome.toFixed(2)}`, margin, margin + 80);
    doc.text(`Total Expense: Rs: ${totalExpense.toFixed(2)}`, margin, margin + 95);
    doc.text(`Balance: Rs: ${balance.toFixed(2)}`, margin, margin + 110);

    // ===== TABLE =====
    autoTable(doc, {
        startY: margin + 140,
        head: [["ID", "Date", "Time", "Category", "Description", "Amount"]],
        body: expenses.map((e) => [
            e.user_expense_id,
            fmtDate(e.date),
            fmtTime(e.time),
            e.category,
            e.description || "",
            Number(e.amount).toFixed(2),
        ]),
        theme: "striped",
        headStyles: {
            fillColor: primary,
            color: "#000000",
            fontStyle: "bold",
        },
        styles: {
            fontSize: 10,
            textColor: "#000000",
            cellPadding: 6,
        },

        // Color rows dynamically
        didParseCell: function (data) {
            if (data.section !== "body") return;
            const row = expenses[data.row.index];
            if (!row) return;
            data.cell.styles.textColor =
                row.type === "Income" ? incomeColor : expenseColor;
        },
    });

    // ===== FOOTER =====
    const now = new Date();
    const footer = `Generated: ${now.toLocaleString()}`;

    doc.setFontSize(10);
    doc.text(
        footer,
        margin,
        doc.internal.pageSize.height - 20
    );

    const fileName = `${email.replace(/[@.]/g, "_")}_expenses_${now.getFullYear()}-${pad2(
        now.getMonth() + 1
    )}-${pad2(now.getDate())}_${pad2(now.getHours())}-${pad2(
        now.getMinutes()
    )}-${pad2(now.getSeconds())}.pdf`;

    doc.save(fileName);

    return true;
}
