import { useMemo, useState } from "react";
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
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import Spinner from "../components/loaders/Spinner";

const COLORS = [
  "hsl(195 100% 39%)",
  "hsl(186 100% 55%)",
  "hsl(142 76% 36%)",
  "hsl(0 84% 60%)",
  "hsl(270 76% 48%)",
  "hsl(30 100% 50%)",
];

const ExpenseCharts = ({ expenses, isLoading = false, periodLabel }) => {
  const [typeFilter, setTypeFilter] = useState("All");

  // ✅ Filter by Income/Expense/All
  const filtered = useMemo(() => {
    return typeFilter === "All"
      ? expenses
      : expenses.filter((e) => e.type === typeFilter);
  }, [expenses, typeFilter]);

  // ✅ Group by category (Pie Chart)
  const pieData = useMemo(() => {
    const map = new Map();
    filtered.forEach((e) => {
      map.set(e.category, (map.get(e.category) || 0) + Number(e.amount));
    });
    return Array.from(map, ([name, amount]) => ({ name, amount }));
  }, [filtered]);

  // ✅ Group by date & type (Bar + Line)
  const seriesByDate = useMemo(() => {
    const map = new Map();
    filtered.forEach((e) => {
      const date = e.date;
      const row = map.get(date) || { date, Income: 0, Expense: 0 };
      row[e.type] += Number(e.amount);
      map.set(date, row);
    });
    return Array.from(map.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }, [filtered]);

  // ✅ Loading state
  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-3">
        <Spinner size={28} />
        <p className="text-sm text-muted-foreground">Loading charts...</p>
      </div>
    );
  }

  // ✅ No data case
  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No expense data available to display charts.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Financial Overview</h2>
          {periodLabel && (
            <p className="text-xs text-muted-foreground mt-1">{periodLabel}</p>
          )}
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Income">Income</SelectItem>
            <SelectItem value="Expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ✅ Pie Chart */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-center">By Category</h3>
        <div id="pie-chart">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => `₹${Number(v).toFixed(2)}`}
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ✅ Bar Chart */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-center">
          Daily Income vs Expense (Bar)
        </h3>
        <div id="bar-chart">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={seriesByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(v) => `₹${Number(v).toFixed(2)}`} />
              <Legend />
              <Bar
                dataKey="Income"
                stackId="a"
                fill="hsl(142 76% 36%)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="Expense"
                stackId="a"
                fill="hsl(0 84% 60%)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ✅ Line Chart */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-center">Daily Trend (Line)</h3>
        <div id="line-chart">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={seriesByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(v) => `₹${Number(v).toFixed(2)}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="Income"
                stroke="hsl(142 76% 36%)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="Expense"
                stroke="hsl(0 84% 60%)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCharts;
