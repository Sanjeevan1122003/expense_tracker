// server.js (updated)
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { Pool } = require("pg");
const PDFDocument = require("pdfkit");

dotenv.config();
const app = express();
app.use(express.json());

// === CORS: allow your frontend at http://localhost:3000 and allow credentials ===
app.use(
    cors({
        // origin: "http://localhost:5173",
        origin: "https://expensetracker.sanjeevantech.com",
        credentials: true,
    })
);

app.use(cookieParser());

// Middleware: JWT Authentication
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const cookieToken = req.cookies?.jwt_token;
    const finalToken = token || cookieToken;

    if (!finalToken)
        return res.status(401).json({ message: "Access denied. No token provided." });

    jwt.verify(finalToken, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token." });
        req.user = user;
        next();
    });
}

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

// ========================== REGISTER ==========================
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
        return res.status(400).json({ message: "All fields are required" });

    try {
        const existingUser = await pool.query(
            "SELECT email FROM users_autho WHERE email = $1",
            [email]
        );
        if (existingUser.rows.length > 0)
            return res.status(200).json({ message: "User already exists. Please login." });

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            "INSERT INTO users_autho (username, email, password) VALUES ($1, $2, $3)",
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("❌ Registration Error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

// ========================== LOGIN ==========================
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "All fields are required" });

    try {
        const result = await pool.query("SELECT * FROM users_autho WHERE email = $1", [
            email,
        ]);
        if (result.rows.length === 0)
            return res.status(401).json({ message: "Invalid email or password" });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid email or password" });

        const jwt_token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "90d" }
        );

        // Set cookie (httpOnly) so browser sends it automatically on subsequent requests
        res.cookie("jwt_token", jwt_token, {
            httpOnly: true,
            secure: false, // change to true in production with HTTPS
            sameSite: "lax",
            maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
        });

        // Also return minimal user info (no token in body needed, but keeping message)
        res.status(200).json({ message: "Login successful", email: user.email, username: user.username });
    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

// ========================== LOGOUT ==========================
app.post("/logout", (req, res) => {
    // Clear the cookie
    res.clearCookie("jwt_token", { httpOnly: true, sameSite: "lax", secure: false });
    return res.json({ message: "Logged out" });
});

// ========================== DASHBOARD ==========================
app.get("/dashboard", async (req, res) => {
    const { email, filterType, startDate, endDate, days, months } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const userResult = await pool.query("SELECT username FROM users_autho WHERE email = $1", [email]);
        if (userResult.rows.length === 0)
            return res.status(404).json({ message: "User not found" });
        const username = userResult.rows[0].username;

<<<<<<< HEAD
        let query = "SELECT * FROM expense_data WHERE email = $1";
=======
        let query =
            "SELECT id, email, user_expense_id, amount, type, category, description, TO_CHAR(date, 'DD-MM-YYYY') AS date, time, created_at FROM expense_data WHERE email = $1";
>>>>>>> f8564ef (New updates)
        const params = [email];
        let paramIndex = 2;

        // 🔍 Add filters dynamically
        if (filterType && filterType !== "all") {
            if (filterType === "specificDate" && startDate) {
                query += ` AND date = $${paramIndex++}`;
                params.push(startDate);
            } else if (filterType === "month" && startDate) {
                query += ` AND TO_CHAR(date, 'YYYY-MM') = $${paramIndex++}`;
                params.push(startDate);
            } else if (filterType === "year" && startDate) {
                query += ` AND EXTRACT(YEAR FROM date) = $${paramIndex++}`;
                params.push(startDate);
            } else if (filterType === "lastDays" && days) {
                query += ` AND date >= CURRENT_DATE - INTERVAL '${parseInt(days)} days'`;
            } else if (filterType === "lastMonths" && months) {
                query += ` AND date >= CURRENT_DATE - INTERVAL '${parseInt(months)} months'`;
            } else if (filterType === "dateRange" && startDate && endDate) {
                query += ` AND date BETWEEN $${paramIndex++} AND $${paramIndex++}`;
                params.push(startDate, endDate);
            }
        }

        query += " ORDER BY user_expense_id ASC";

        const expensesResult = await pool.query(query, params);
        const expenses = expensesResult.rows;

        // ✅ Precision-safe totals
        function preciseSum(arr) {
            return parseFloat(arr.reduce((sum, e) => sum + Number(e.amount || 0), 0).toFixed(2));
        }

        const totalIncome = preciseSum(expenses.filter(e => e.type === "Income"));
        const totalExpense = preciseSum(expenses.filter(e => e.type === "Expense"));

        res.json({ username, expenses, totalIncome, totalExpense });
    } catch (err) {
        console.error("❌ Database error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

// ========================== ADD EXPENSE ==========================
app.post("/add-expense", async (req, res) => {
    const { email, amount, type, category, description, date, time, created_at } = req.body;
    if (!email || !amount || !type || !category || !date)
        return res.status(400).json({ message: "Missing required fields" });

    try {
        const nextIdResult = await pool.query(
            "SELECT COALESCE(MAX(user_expense_id),0)+1 AS next_id FROM expense_data WHERE email = $1",
            [email]
        );
        const nextExpenseId = nextIdResult.rows[0].next_id;

        await pool.query(
            "INSERT INTO expense_data (email, user_expense_id, amount, type, category, description, date, time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
<<<<<<< HEAD
            [email, nextExpenseId, amount, type, category, description, date, time]
=======
            [email, nextExpenseId, amount, type, category, description, date, time, created_at]
>>>>>>> f8564ef (New updates)
        );

        res.json({ message: "Expense added successfully" });
    } catch (err) {
        console.error("❌ Error inserting expense:", err);
        res.status(500).json({ message: "Database error", error: err.message });
    }
});

// ========================== UPDATE EXPENSE ==========================
app.put("/update-expense", async (req, res) => {
    const { email, user_expense_id, amount, type, category, description, date } = req.body;
    if (!email || !user_expense_id || !amount || !type || !category || !date)
        return res.status(400).json({ message: "Missing required fields" });

    try {
        const result = await pool.query(
            "UPDATE expense_data SET amount=$1, type=$2, category=$3, description=$4, date=$5 WHERE email=$6 AND user_expense_id=$7",
            [amount, type, category, description || "", date, email, user_expense_id]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ message: "No matching expense found" });

        res.json({ message: "Expense updated successfully" });
    } catch (err) {
        console.error("❌ Error updating expense:", err);
        res.status(500).json({ message: "Database error", error: err.message });
    }
});

// ========================== DELETE EXPENSE ==========================
app.delete("/delete-expense", async (req, res) => {
    const { email, ids } = req.body;
    if (!email || !ids || !Array.isArray(ids) || ids.length === 0)
        return res.status(400).json({ message: "Invalid input" });

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Step 1: Delete selected expenses
        const placeholders = ids.map((_, i) => `$${i + 2}`).join(",");
        const deleteQuery = `
            DELETE FROM expense_data 
            WHERE email=$1 AND user_expense_id IN (${placeholders})
        `;
        const result = await client.query(deleteQuery, [email, ...ids]);

        if (result.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "No matching expenses found" });
        }

        // Step 2: TEMPORARY SHIFT (avoid unique collisions)
        // Move all user_expense_id values +10000
        await client.query(
            `UPDATE expense_data 
             SET user_expense_id = user_expense_id + 10000
             WHERE email = $1`,
            [email]
        );

        // Step 3: Reassign user_expense_id cleanly from 1,2,3,...n
        const reorderQuery = `
            WITH ordered AS (
                SELECT id, 
                       ROW_NUMBER() OVER (ORDER BY date ASC, id ASC) AS new_id
                FROM expense_data
                WHERE email = $1
            )
            UPDATE expense_data e
            SET user_expense_id = o.new_id
            FROM ordered o
            WHERE e.id = o.id;
        `;
        await client.query(reorderQuery, [email]);

        await client.query("COMMIT");

        return res.json({
            message: `${result.rowCount} expenses deleted successfully`,
            reordered: true,
        });

    } catch (err) {
        await client.query("ROLLBACK");
        console.error("❌ Error deleting expense:", err);
        return res.status(500).json({ message: "Database error", error: err.message });
    } finally {
        client.release();
    }
});




// ========================== GET PDF DATA ==========================
app.get("/get-pdf", async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    try {
        const result = await pool.query("SELECT * FROM expense_data WHERE email=$1", [email]);
        if (result.rows.length === 0)
            return res.status(404).json({ message: "No expenses found" });

        res.json(result.rows);
    } catch (err) {
        console.error("❌ Error fetching expenses:", err);
        res.status(500).json({ error: err.message });
    }
});



// add this endpoint (copy/paste into server.js)
app.get("/download-pdf", authenticateToken, async (req, res) => {
    const { email, filterType, startDate, endDate, days, months } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        // get username
        const userResult = await pool.query("SELECT username FROM users_autho WHERE email = $1", [email]);
        if (userResult.rows.length === 0)
            return res.status(404).json({ message: "User not found" });
        const username = userResult.rows[0].username || "";

        // Build same query as /dashboard (re-use logic)
        let query = "SELECT * FROM expense_data WHERE email = $1";
        const params = [email];
        let paramIndex = 2;

        if (filterType && filterType !== "all") {
            if (filterType === "specificDate" && startDate) {
                query += ` AND date = $${paramIndex++}`;
                params.push(startDate);
            } else if (filterType === "month" && startDate) {
                query += ` AND TO_CHAR(date, 'YYYY-MM') = $${paramIndex++}`;
                params.push(startDate);
            } else if (filterType === "year" && startDate) {
                query += ` AND EXTRACT(YEAR FROM date) = $${paramIndex++}`;
                params.push(startDate);
            } else if (filterType === "lastDays" && days) {
                query += ` AND date >= CURRENT_DATE - INTERVAL '${parseInt(days)} days'`;
            } else if (filterType === "lastMonths" && months) {
                query += ` AND date >= CURRENT_DATE - INTERVAL '${parseInt(months)} months'`;
            } else if (filterType === "dateRange" && startDate && endDate) {
                query += ` AND date BETWEEN $${paramIndex++} AND $${paramIndex++}`;
                params.push(startDate, endDate);
            }
        }

        query += " ORDER BY user_expense_id ASC";

        const expensesResult = await pool.query(query, params);
        const expenses = expensesResult.rows || [];

        // compute totals
        const totalIncome = parseFloat(
            expenses.filter(e => e.type === "Income").reduce((s, r) => s + Number(r.amount || 0), 0).toFixed(2)
        );
        const totalExpense = parseFloat(
            expenses.filter(e => e.type === "Expense").reduce((s, r) => s + Number(r.amount || 0), 0).toFixed(2)
        );
        const balance = parseFloat((totalIncome - totalExpense).toFixed(2));

        // prepare period label
        let periodLabel = "All time";
        if (filterType && filterType !== "all") {
            if (filterType === "dateRange" && startDate && endDate) periodLabel = `From ${startDate} to ${endDate}`;
            else if (filterType === "lastMonths" && months) periodLabel = `Last ${months} months`;
            else if (filterType === "lastDays" && days) periodLabel = `Last ${days} days`;
            else if (filterType === "month" && startDate) periodLabel = `Month: ${startDate}`;
            else if (filterType === "year" && startDate) periodLabel = `Year: ${startDate}`;
        }

        // Start PDF stream
        const doc = new PDFDocument({ size: "A4", margin: 40 });

        // Headers to force download
        const filename = `expenses_${email.replace(/[@.]/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`;
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

        doc.pipe(res);

        // Title / header
        doc.fontSize(18).text("Expense Tracker Report", { align: "center" });
        doc.moveDown(0.4);

        // user details and totals on same line if possible
        doc.fontSize(10);
        doc.text(`Name: ${username}`, { continued: true, width: 200 });
        doc.text(`Email: ${email}`, { align: "right" });
        doc.moveDown(0.2);
        doc.text(`Period: ${periodLabel}`, { align: "left" });
        doc.moveDown(0.2);
        doc.text(`Total Income: ₹${totalIncome.toFixed(2)}`, { continued: true });
        doc.text(`  Total Expense: ₹${totalExpense.toFixed(2)}`, { continued: true, indent: 10 });
        doc.text(`  Balance: ₹${balance.toFixed(2)}`, { align: "right" });
        doc.moveDown(0.8);

        // Table header
        const tableTop = doc.y;
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        // column widths for [ID, Category, Type, Amount, Date]
        const colWidths = {
            id: 60,
            category: Math.floor(pageWidth * 0.35),
            type: Math.floor(pageWidth * 0.18),
            amount: Math.floor(pageWidth * 0.18),
            date: Math.floor(pageWidth * 0.22),
        };

        // Draw table header background
        doc.fontSize(10).fillColor("#000000").font("Helvetica-Bold");
        let x = doc.x;
        doc.text("ID", x, doc.y, { width: colWidths.id, align: "left" });
        x += colWidths.id;
        doc.text("Category", x, doc.y, { width: colWidths.category, align: "left" });
        x += colWidths.category;
        doc.text("Type", x, doc.y, { width: colWidths.type, align: "left" });
        x += colWidths.type;
        doc.text("Amount", x, doc.y, { width: colWidths.amount, align: "right" });
        x += colWidths.amount;
        doc.text("Date", x, doc.y, { width: colWidths.date, align: "right" });
        doc.moveDown(0.5);

        // Divider line
        doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();

        doc.font("Helvetica").fontSize(10);
        doc.fillColor("#000000");

        // table rows with simple pagination
        const rowHeight = 18;
        let y = doc.y + 4;

        for (let i = 0; i < expenses.length; i++) {
            const r = expenses[i];
            // page break check
            if (y + rowHeight > doc.page.height - doc.page.margins.bottom) {
                doc.addPage();
                y = doc.y;
            }

            x = doc.page.margins.left;
            doc.text(String(r.user_expense_id), x, y, { width: colWidths.id, align: "left" });
            x += colWidths.id;
            doc.text(String(r.category || ""), x, y, { width: colWidths.category, align: "left" });
            x += colWidths.category;
            doc.text(String(r.type || ""), x, y, { width: colWidths.type, align: "left" });
            x += colWidths.type;
            const amt = Number(r.amount || 0).toFixed(2);
            doc.text(`₹${amt}`, x, y, { width: colWidths.amount, align: "right" });
            x += colWidths.amount;
            const d = r.date ? (new Date(r.date)).toLocaleDateString('en-GB') : "";
            doc.text(d, x, y, { width: colWidths.date, align: "right" });

            y += rowHeight;
        }

        // If no rows, show a message
        if (expenses.length === 0) {
            doc.moveDown();
            doc.fontSize(11).text("No transactions for selected period", { align: "center" });
        }

        // Footer with totals
        doc.moveTo(doc.page.margins.left, doc.page.height - doc.page.margins.bottom - 60)
            .lineTo(doc.page.width - doc.page.margins.right, doc.page.height - doc.page.margins.bottom - 60).stroke();

        doc.fontSize(10).font("Helvetica-Bold");
        doc.text(`Total Income: ₹${totalIncome.toFixed(2)}`, { continued: true });
        doc.text(`   Total Expense: ₹${totalExpense.toFixed(2)}`, { continued: true, indent: 10 });
        doc.text(`   Balance: ₹${balance.toFixed(2)}`, { align: "right" });

        doc.end();

    } catch (err) {
        console.error("❌ Error generating PDF:", err);
        return res.status(500).json({ message: "Failed to generate PDF", error: err.message });
    }
});


// ========================== AUTH MIDDLEWARE PROTECTION ==========================
app.use(
    ["/dashboard", "/add-expense", "/update-expense", "/delete-expense", "/get-pdf"],
    authenticateToken
);

// ========================== SERVER START ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
