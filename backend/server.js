const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { Pool } = require("pg");

dotenv.config();
const app = express();
app.use(express.json());
// app.use(cors({
//   origin: "https://expensetracker.sanjeevantech.com",
//   credentials: true
// }));

app.use(cors());

app.use(cookieParser());


function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // for Bearer token

    // OR if using cookies
    const cookieToken = req.cookies?.jwt_token;
    const finalToken = token || cookieToken;

    if (!finalToken) return res.status(401).json({ message: "Access denied. No token provided." });

    jwt.verify(finalToken, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token." });
        req.user = user; // attach user details to request
        next();
    });
}


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

        const jwt_token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "90d" });
        res.status(200).json({ message: "Login successful", jwt_token });
    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

// API dashboard
app.get("/dashboard", async (req, res) => {
    const { email, filterType, startDate, endDate, days, months } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const userResult = await pool.query("SELECT username FROM users_autho WHERE email = $1", [email]);
        if (userResult.rows.length === 0) return res.status(404).json({ message: "User not found" });
        const username = userResult.rows[0].username;

        let query = "SELECT * FROM expense_data WHERE email = $1 ORDER BY user_expense_id ASC";
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
app.post("/add-expense", async (req, res) => {
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
app.put("/update-expense", async (req, res) => {
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
// app.delete("/delete-expense", async (req, res) => {
//     const { email, ids } = req.body;
//     if (!email || !ids || !Array.isArray(ids) || ids.length === 0)
//         return res.status(400).json({ message: "Invalid input" });

//     try {
//         const placeholders = ids.map((_, i) => `$${i + 2}`).join(",");
//         const query = `DELETE FROM expense_data WHERE email=$1 AND user_expense_id IN (${placeholders})`;
//         const result = await pool.query(query, [email, ...ids]);

//         if (result.rowCount === 0) return res.status(404).json({ message: "No matching expenses found" });

//         res.json({ message: `${result.rowCount} expenses deleted successfully` });
//     } catch (err) {
//         console.error("❌ Error deleting expense:", err);
//         res.status(500).json({ message: "Database error", error: err.message });
//     }
// });

app.delete("/delete-expense", async (req, res) => {
    const { email, ids } = req.body;
    if (!email || !ids || !Array.isArray(ids) || ids.length === 0)
        return res.status(400).json({ message: "Invalid input" });

    try {
        // Delete the selected records
        const placeholders = ids.map((_, i) => `$${i + 2}`).join(",");
        const deleteQuery = `DELETE FROM expense_data WHERE email=$1 AND user_expense_id IN (${placeholders})`;
        const result = await pool.query(deleteQuery, [email, ...ids]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "No matching expenses found" });
        }

        // ✅ Reorder user_expense_id for remaining records of that user
        // Step 1: Select all remaining rows for the user, ordered by user_expense_id
        const selectQuery = `SELECT id FROM expense_data WHERE email=$1 ORDER BY user_expense_id ASC`;
        const remaining = await pool.query(selectQuery, [email]);

        // Step 2: Loop and reassign new user_expense_id values (1, 2, 3, ...)
        for (let i = 0; i < remaining.rows.length; i++) {
            await pool.query(
                `UPDATE expense_data SET user_expense_id=$1 WHERE id=$2`,
                [i + 1, remaining.rows[i].id]
            );
        }

        res.json({
            message: `${result.rowCount} expenses deleted successfully`,
            reordered: true
        });
    } catch (err) {
        console.error("❌ Error deleting expense:", err);
        res.status(500).json({ message: "Database error", error: err.message });
    }
});

// API get PDF data
app.get("/get-pdf", async (req, res) => {
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

app.use(["/dashboard", "/add-expense", "/update-expense", "/delete-expense", "/get-pdf"], authenticateToken);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
