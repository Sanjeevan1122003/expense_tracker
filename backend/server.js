const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Create PostgreSQL pool for Supabase
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // e.g., postgresql://postgres:<password>@aws-1-us-east-1.pooler.supabase.com:6543/postgres
    ssl: { rejectUnauthorized: false }
});

// API register user
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: "All fields are required" });

    try {
        const existingUser = await pool.query("SELECT email FROM users_autho WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) return res.status(200).json({ message: "User already exists. Please login." });

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query("INSERT INTO users_autho (username, email, password) VALUES ($1, $2, $3)", [username, email, hashedPassword]);

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("❌ Registration Error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    const token = authHeader.substring(7);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token." });
    }
};

// API login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields are required" });

    try {
        const result = await pool.query("SELECT * FROM users_autho WHERE email = $1", [email]);
        if (result.rows.length === 0) return res.status(401).json({ message: "Invalid email or password" });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        const jwt_token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET);

        // Store JWT in database
        await pool.query("UPDATE users_autho SET user_auth0_token = $1 WHERE email = $2", [jwt_token, email]);

        res.status(200).json({ message: "Login successful", jwt_token });
    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

// API dashboard
app.get("/dashboard", verifyToken, async (req, res) => {
    const { email, filterType, startDate, endDate, days, months } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const userResult = await pool.query("SELECT username FROM users_autho WHERE email = $1", [email]);
        if (userResult.rows.length === 0) return res.status(404).json({ message: "User not found" });
        const username = userResult.rows[0].username;

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

        const expensesResult = await pool.query(query, params);
        const expenses = expensesResult.rows;

        const totalIncome = expenses.filter(e => e.type === "Income").reduce((sum, e) => sum + parseFloat(e.amount), 0);
        const totalExpense = expenses.filter(e => e.type === "Expense").reduce((sum, e) => sum + parseFloat(e.amount), 0);

        res.json({ username, expenses, totalIncome, totalExpense });
    } catch (err) {
        console.error("❌ Database error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

// API add expense
app.post("/add-expense", verifyToken, async (req, res) => {
    const { email, amount, type, category, date } = req.body;
    if (!email || !amount || !type || !category || !date)
        return res.status(400).json({ message: "Missing required fields" });

    try {
        // Get next expense ID for user
        const nextIdResult = await pool.query("SELECT COALESCE(MAX(user_expense_id),0)+1 AS next_id FROM expense_data WHERE email = $1", [email]);
        const nextExpenseId = nextIdResult.rows[0].next_id;

        await pool.query(
            "INSERT INTO expense_data (email, user_expense_id, amount, type, category, date) VALUES ($1, $2, $3, $4, $5, $6)",
            [email, nextExpenseId, amount, type, category, date]
        );

        res.json({ message: "Expense added successfully" });
    } catch (err) {
        console.error("❌ Error inserting expense:", err);
        res.status(500).json({ message: "Database error", error: err.message });
    }
});

// API update expense
app.put("/update-expense", verifyToken, async (req, res) => {
    const { email, user_expense_id, amount, type, category, date } = req.body;
    if (!email || !user_expense_id || !amount || !type || !category || !date)
        return res.status(400).json({ message: "Missing required fields" });

    try {
        const result = await pool.query(
            "UPDATE expense_data SET amount=$1, type=$2, category=$3, date=$4 WHERE email=$5 AND user_expense_id=$6",
            [amount, type, category, date, email, user_expense_id]
        );

        if (result.rowCount === 0) return res.status(404).json({ message: "No matching expense found" });

        res.json({ message: "Expense updated successfully" });
    } catch (err) {
        console.error("❌ Error updating expense:", err);
        res.status(500).json({ message: "Database error", error: err.message });
    }
});

// API delete expense
app.delete("/delete-expense", verifyToken, async (req, res) => {
    const { email, ids } = req.body;
    if (!email || !ids || !Array.isArray(ids) || ids.length === 0)
        return res.status(400).json({ message: "Invalid input" });

    try {
        const placeholders = ids.map((_, i) => `$${i + 2}`).join(",");
        const query = `DELETE FROM expense_data WHERE email=$1 AND user_expense_id IN (${placeholders})`;
        const result = await pool.query(query, [email, ...ids]);

        if (result.rowCount === 0) return res.status(404).json({ message: "No matching expenses found" });

        res.json({ message: `${result.rowCount} expenses deleted successfully` });
    } catch (err) {
        console.error("❌ Error deleting expense:", err);
        res.status(500).json({ message: "Database error", error: err.message });
    }
});

// API get PDF data
app.get("/get-pdf", verifyToken, async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    try {
        const result = await pool.query("SELECT * FROM expense_data WHERE email=$1", [email]);
        if (result.rows.length === 0) return res.status(404).json({ message: "No expenses found" });

        res.json(result.rows);
    } catch (err) {
        console.error("❌ Error fetching expenses:", err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
