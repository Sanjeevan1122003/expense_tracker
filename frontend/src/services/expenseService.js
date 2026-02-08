import api from "../lib/api";

export const addExpense = (payload) => api.post("/add-expense", payload);

export const updateExpense = (payload) => api.put("/update-expense", payload);

export const deleteExpenses = (payload) =>
  api.delete("/delete-expense", { data: payload });
