import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFF", "#FF6699"];

const ExpenseCharts = ({ expenses, chartType = 'combined' }) => {
  if (!expenses || expenses.length === 0) {
    return <p>No expense data available to display charts.</p>;
  }

  // Filter expenses based on chartType
  const filteredExpenses = chartType === 'combined' ? expenses : expenses.filter(exp => exp.type.toLowerCase() === chartType);

  // 🧾 Aggregate total amount by category or type for charts
  const categoryData = Object.values(
    filteredExpenses.reduce((acc, exp) => {
      const key = chartType === 'combined' ? exp.type : exp.category;
      if (!acc[key]) {
        acc[key] = { name: key, amount: 0 };
      }
      acc[key].amount += Number(exp.amount);
      return acc;
    }, {})
  );

  // 📅 Prepare data for line/bar chart (by date)
  const dateData = Object.values(
    filteredExpenses.reduce((acc, exp) => {
      if (!acc[exp.date]) {
        acc[exp.date] = { date: exp.date, total: 0 };
      }
      acc[exp.date].total += Number(exp.amount);
      return acc;
    }, {})
  );

  const getChartTitle = (type) => {
    switch (chartType) {
      case 'income':
        return 'Income';
      case 'expense':
        return 'Expense';
      default:
        return 'Income & Expense';
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        gap: "50px",
        width: "100%",
        height:"100%",
        marginTop:"-40px"
      }}
    >
      <div style={{ flex: "1 1 300px", height: "300px", minWidth: "300px"  }}>
        <h3 style={{ textAlign: "center" }}>{getChartTitle(chartType)} by Category</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={categoryData} dataKey="amount" nameKey="name" outerRadius={100} label>
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ flex: "1 1 300px", height: "300px", minWidth: "300px"  }}>
        <h3 style={{ textAlign: "center" }}>{getChartTitle(chartType)} by Date</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dateData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ flex: "1 1 300px", height: "300px", minWidth: "300px"  }}>
        <h3 style={{ textAlign: "center" }}>Daily {getChartTitle(chartType)} Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dateData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default React.memo(ExpenseCharts);
