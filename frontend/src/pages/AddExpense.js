import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AddExpense = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: "",
    type: "Expense",
    category: "",
    date: "",
  });

  const token = Cookies.get("jwt_token");
  const email = token ? jwtDecode(token).email : null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dateToSend = formData.date || new Date().toISOString().split('T')[0];
      await axios.post("https://expense-tracker-wheat-six-61.vercel.app/add-expense", {
        email,
        amount: formData.amount,
        type: formData.type,
        category: formData.category,
        date: dateToSend,
      });
      alert("Expense added successfully!");
      setFormData({ amount: "", type: "Expense", category: "", date: "" });
      onSuccess(); // Refresh data
    } catch (err) {
      console.error(err);
      alert("Failed to add expense.");
    }
  };

  return (
    <div className="expense-card">
      <p className="expense-card-title">Add Expense</p>
      <div className="expense-card-from">
        <form onSubmit={handleSubmit}>
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
            <button type="submit">Add Expense</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
