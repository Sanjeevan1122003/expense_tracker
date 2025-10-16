import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const UpdateExpense = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: "",
    type: "Expense",
    category: "",
    date: "",
    user_expense_id: "",
  });
  const [expenses, setExpenses] = useState([]);

  const token = Cookies.get("jwt_token");
  const email = token ? jwtDecode(token).email : null;

  // Fetch expenses for update selection
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/dashboard?email=${email}`);
        setExpenses(res.data.expenses || []);
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };
    if (email) fetchExpenses();
  }, [email]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectExpense = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      const selectedExpense = expenses.find(exp => exp.user_expense_id === selectedId);
      if (selectedExpense) {
        setFormData({
          amount: selectedExpense.amount,
          type: selectedExpense.type,
          category: selectedExpense.category,
          date: selectedExpense.date,
          user_expense_id: selectedExpense.user_expense_id,
        });
      }
    } else {
      setFormData({
        amount: "",
        type: "Expense",
        category: "",
        user_expense_id: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.user_expense_id) {
      alert("Please select an expense to update.");
      return;
    }
    try {
      await axios.put("http://localhost:5000/update-expense", {
        email,
        user_expense_id: formData.user_expense_id,
        amount: formData.amount,
        type: formData.type,
        category: formData.category,
        date: formData.date,
      });
      alert("Expense updated successfully!");
      setFormData({ amount: "", type: "Expense", category: "", user_expense_id: "" });
      onSuccess(); // Refresh data
    } catch (err) {
      console.error(err);
      alert("Failed to update expense.");
    }
  };

  return (
    <div className="expense-card">
      <p className="expense-card-title">Update Expense</p>
      <div className="expense-card-from">
        <form onSubmit={handleSubmit}>
          {expenses.length > 0 && (
            <>
              <label htmlFor="user_expense_id">Select Expense to Update:</label><br />
              <select name="user_expense_id" required value={formData.user_expense_id} onChange={handleSelectExpense}>
                <option value="">Select Expense</option>
                {expenses.map((exp) => (
                  <option key={exp.user_expense_id} value={exp.user_expense_id}>
                    ID {exp.user_expense_id}: {exp.type} - {exp.category} - ₹{exp.amount}
                  </option>
                ))}
              </select><br />
            </>
          )}
          <label htmlFor="amount">Enter the cost(amount): </label><br />
          <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            required
            value={formData.amount}
            onChange={handleChange}
          />
          <label htmlFor="type">Type (Income / Expense): </label><br />
          <select name="type" required value={formData.type} onChange={handleChange}>
            <option value="">Select Type</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select><br />
          <label htmlFor="category">Category (e.g., Food, Transport): </label><br />
          <input
            type="text"
            name="category"
            placeholder="Enter category"
            required
            value={formData.category}
            onChange={handleChange}
          />
          <p><strong className="highlights">Note:</strong> Fill the details carefully</p>
          <div className="button-container button-add">
            <button type="submit">Update Expense</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateExpense;
