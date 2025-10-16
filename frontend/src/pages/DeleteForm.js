import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const DeleteForm = ({ onSuccess }) => {
  const [deleteIds, setDeleteIds] = useState("");

  const token = Cookies.get("jwt_token");
  const email = token ? jwtDecode(token).email : null;

  const handleDeleteExpense = async (e) => {
    e.preventDefault();
    const idsArray = deleteIds
      .toString()
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id !== "");
    if (idsArray.length === 0) {
      alert("Please enter valid IDs to delete.");
      return;
    }
    try {
      await axios.delete("http://localhost:5000/delete-expense", {
        data: { email, ids: idsArray },
        headers: { "Content-Type": "application/json" },
      });
      alert("Expenses deleted successfully!");
      setDeleteIds("");
      onSuccess(); // Refresh data
    } catch (err) {
      console.error(err);
      alert("Failed to delete expenses.");
    }
  };

  return (
    <div className="expense-card">
      <p className="expense-card-title">Delete Expense</p>
      <div className="expense-card-from">
        <form onSubmit={handleDeleteExpense}>
          <label htmlFor="id">Enter Expense ID(s):</label><br />
          <input
            type="text"
            name="id"
            placeholder="Enter Expense ID(s) e.g., 1,2,3"
            required
            value={deleteIds}
            onChange={(e) => setDeleteIds(e.target.value)}
          />
          <p>You can see your data in the table below and enter IDs for the records you want to delete.</p>
          <p><strong className="highlights">Note:</strong> Once you delete the data, it cannot be recovered.</p>
          <div className="button-container button-delete">
            <button type="submit">Delete Expenses</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteForm;
