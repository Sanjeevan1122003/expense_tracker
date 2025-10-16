const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());


//Create a MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Convert connection to a promise-based one
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL Database");
    }
});

// API register user
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Ensure db is using .promise()
        const [existingUser] = await db.promise().execute(
            "SELECT email FROM users_autho WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(200).json({ message: "User already exists. Please login." });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert User
        await db.promise().execute(
            "INSERT INTO users_autho (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        console.error("❌ Registration Error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

//API to login user
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Find user by email
        const [results] = await db.promise().execute(
            "SELECT * FROM users_autho WHERE email = ?",
            [email]
        );

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = results[0];

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate a JWT token
        const jwt_token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET);
        res.status(200).json({ message: "Login successful", jwt_token });
    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

//API to load data
app.get("/dashboard", async (req, res) => {
    const { email, filterType, startDate, endDate, days, months } = req.query;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const [userResults] = await db.promise().execute(
            "SELECT username FROM users_autho WHERE email = ?",
            [email]
        );

        if (userResults.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const username = userResults[0].username;

        let expenseQuery = "SELECT * FROM expense_data WHERE email = ?";
        let expenseParams = [email];

        // Apply filters based on filterType
        if (filterType && filterType !== 'all') {
            if (filterType === 'specificDate' && startDate) {
                expenseQuery += " AND DATE(date) = ?";
                expenseParams.push(startDate);
            } else if (filterType === 'month' && startDate) {
                // startDate should be YYYY-MM
                expenseQuery += " AND DATE_FORMAT(date, '%Y-%m') = ?";
                expenseParams.push(startDate);
            } else if (filterType === 'year' && startDate) {
                // startDate should be YYYY
                expenseQuery += " AND YEAR(date) = ?";
                expenseParams.push(startDate);
            } else if (filterType === 'lastDays' && days) {
                expenseQuery += " AND date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)";
                expenseParams.push(parseInt(days));
            } else if (filterType === 'lastMonths' && months) {
                expenseQuery += " AND date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)";
                expenseParams.push(parseInt(months));
            } else if (filterType === 'dateRange' && startDate && endDate) {
                expenseQuery += " AND date BETWEEN ? AND ?";
                expenseParams.push(startDate, endDate);
            }
        }

        // Fetch expense details with filters
        const [expenses] = await db.promise().execute(expenseQuery, expenseParams);

        // Calculate totals based on filtered expenses
        const totalIncome = expenses.filter(exp => exp.type === 'Income').reduce((sum, exp) => sum + Number(exp.amount), 0);
        const totalExpense = expenses.filter(exp => exp.type === 'Expense').reduce((sum, exp) => sum + Number(exp.amount), 0);

        res.json({ username, expenses, totalIncome, totalExpense });

    } catch (err) {
        console.error("❌ Database error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

//API to add data
app.post("/add-expense", (req, res) => {
    const { email, amount, type, category, date } = req.body;

    if (!email || !amount || !type || !category || !date) {
        return res.status(400).json({ message: "Missing required fields: email, amount, type, category, date" });
    }

    // Get the next sequential expense_id for this user (based on email)
    const query = `
        SELECT COALESCE(MAX(user_expense_id), 0) + 1 AS next_id FROM expense_data WHERE email = ?
    `;

    db.query(query, [email], (err, result) => {
        if (err) {
            console.error("❌ Error fetching next user_expense_id:", err);
            return res.status(500).json({ message: "Database error", error: err.message });
        }

        const nextExpenseId = result[0].next_id;

        // Insert the expense with the calculated expense_id
        db.query(
            "INSERT INTO expense_data (email, user_expense_id, amount, type, category, date) VALUES (?, ?, ?, ?, ?, ?)",
            [email, nextExpenseId, amount, type, category, date],
            (err) => {
                if (err) {
                    console.error("❌ Error inserting expense:", err);
                    return res.status(500).json({ message: "Error inserting expense", error: err.message });
                }

                res.json({ message: "Expense added successfully" });
            }
        );
    });
});

//API to update data
app.put("/update-expense", (req, res) => {
    const { email, user_expense_id, amount, type, category, date } = req.body;

    if (!email || !user_expense_id || !amount || !type || !category || !date) {
        return res.status(400).json({ message: "Missing required fields: email, user_expense_id, amount, type, category, date" });
    }

    const updateQuery = `
        UPDATE expense_data
        SET amount = ?, type = ?, category = ?, date = ?
        WHERE email = ? AND user_expense_id = ?
    `;

    db.query(updateQuery, [amount, type, category, date, email, user_expense_id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No matching expense found for update" });
        }

        res.json({ message: "Expense updated successfully" });
    });
});

//API to delete data
app.delete("/delete-expense", (req, res) => {
    const { email, ids } = req.body;

    if (!email || !ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Invalid input. Provide email and an array of expense IDs." });
    }

    const placeholders = ids.map(() => "?").join(",");
    const deleteQuery = `DELETE FROM expense_data WHERE email = ? AND user_expense_id IN (${placeholders})`;

    db.query(deleteQuery, [email, ...ids], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No matching expenses found for deletion" });
        }

        // Run two queries separately
        const setVarQuery = `SET @num = 0;`;
        const reorderQuery = `
            UPDATE expense_data
            SET user_expense_id = (@num := @num + 1)
            WHERE email = ?
            ORDER BY user_expense_id;
        `;

        db.query(setVarQuery, (err) => {
            if (err) {
                console.error("Error setting variable:", err);
                return res.status(500).json({ message: "Error initializing variable" });
            }

            db.query(reorderQuery, [email], (err) => {
                if (err) {
                    console.error("Error reordering IDs:", err);
                    return res.status(500).json({ message: "Error reordering IDs" });
                }

                res.json({ message: `${result.affectedRows} expenses deleted successfully` });
            });
        });
    });
});

//API to download pdf
app.get("/get-pdf", async (req, res) => {
    const { email } = req.query; // Use req.query instead of req.params

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    const query = "SELECT * FROM expense_data WHERE email = ?";

    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No expenses found for this email" });
        }
        res.json(results);
    });
});



//Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));