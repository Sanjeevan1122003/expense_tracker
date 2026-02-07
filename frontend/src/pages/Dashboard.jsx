// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
<<<<<<< HEAD
=======
import { Input } from "../components/ui/input";
>>>>>>> f8564ef (New updates)
import { Wallet, LogOut, Plus, Pencil, Trash2, Download, BarChart3, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import ExpenseTable from "../components/ExpenseTable";
import ExpenseCharts from "../components/ExpenseCharts";
import ExpenseModal from "../components/ExpenseModal";
import { Card } from "../components/ui/card";
import api from "../lib/api";
import Cookies from "js-cookie";
import exportPdf from "../lib/exportPdf";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [expenses, setExpenses] = useState([]);
  const [username, setUsername] = useState("");
  const [modalType, setModalType] = useState(null);
  const [showCharts, setShowCharts] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // FILTER STATES
  const [period, setPeriod] = useState("all");
  const [range, setRange] = useState({ start: "", end: "" });
<<<<<<< HEAD
=======
  const [appliedRange, setAppliedRange] = useState({ start: "", end: "" });
>>>>>>> f8564ef (New updates)

  const email = Cookies.get("user_email");

  // Alerts
  const clearAuth = () => {
    Cookies.remove("user_email");
  };

  // 🔥 FETCH EXPENSES WITH FILTERS
  const loadExpenses = async () => {
    if (!email) return;
    setIsLoading(true);

    try {
      const params = {};

      if (period === "all") {
        params.filterType = "all";

<<<<<<< HEAD
      } else if (period === "custom" && range.start && range.end) {
        params.filterType = "dateRange";
        params.startDate = range.start;
        params.endDate = range.end;
=======
      } else if (period === "custom" && appliedRange.start && appliedRange.end) {
        if (appliedRange.start > appliedRange.end) {
          toast({
            title: "Invalid date range",
            description: "Start date must be before end date",
            className: "bg-red-600 text-white",
          });
          return;
        }
        params.filterType = "dateRange";
        params.startDate = appliedRange.start;
        params.endDate = appliedRange.end;
>>>>>>> f8564ef (New updates)

      } else {
        const periodMap = {
          "1m": 1,
          "3m": 3,
          "6m": 6,
          "1y": 12,
          "3y": 36,
        };

        const months = periodMap[period];

        if (months) {
          params.filterType = "lastMonths";
          params.months = months;
        }
      }

      const res = await api.get("/dashboard", {
        params: { email, ...params },
      });

      setExpenses(res.data?.expenses || []);
      setUsername(res.data?.username || "");

    } catch (err) {
      console.error("Fetch failed:", err);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        className: "bg-red-600 text-white",
      });

      if ([401, 403].includes(err?.response?.status)) {
        clearAuth();
        navigate("/login");
      }

    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
=======
  const handlePeriodChange = (value) => {
    setPeriod(value);
    if (value !== "custom") {
      setRange({ start: "", end: "" });
      setAppliedRange({ start: "", end: "" });
    }
  };

  const handleApplyRange = () => {
    if (!range.start || !range.end) return;
    if (range.start > range.end) {
      toast({
        title: "Invalid date range",
        description: "Start date must be before end date",
        className: "bg-red-600 text-white",
      });
      return;
    }
    setAppliedRange({ start: range.start, end: range.end });
  };

>>>>>>> f8564ef (New updates)
  useEffect(() => {
    if (!email) {
      clearAuth();
      navigate("/login");
      return;
    }
<<<<<<< HEAD
    loadExpenses();
  }, [email, period, range.start, range.end]);
=======
    if (period === "custom") {
      if (!appliedRange.start || !appliedRange.end) return;
    }
    loadExpenses();
  }, [email, period, appliedRange.start, appliedRange.end]);
>>>>>>> f8564ef (New updates)

  // 💰 Totals
  const totalIncome = expenses
    .filter((e) => e.type === "Income")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const totalExpense = expenses
    .filter((e) => e.type === "Expense")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const balance = totalIncome - totalExpense;

  // Label for UI (optional if you want later)
  const periodLabel = (() => {
    if (period === "all") return "All time";
<<<<<<< HEAD
    if (period === "custom" && range.start && range.end)
      return `From ${range.start} to ${range.end}`;
=======
    if (period === "custom" && appliedRange.start && appliedRange.end)
      return `From ${appliedRange.start} to ${appliedRange.end}`;
>>>>>>> f8564ef (New updates)
    const labels = {
      "1m": "Last 1 month",
      "3m": "Last 3 months",
      "6m": "Last 6 months",
      "1y": "Last 1 year",
      "3y": "Last 3 years",
    };
    return labels[period] || "All time";
  })();

  // Logout
  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch { }
    Cookies.remove("user_email");

    toast({
      title: "Logged out successfully",
      description: "See you soon!",
      className: "bg-green-600 text-white",
    });

    navigate("/");
  };

  // Export PDF
  const handleExportPDF = async () => {
  toast({
    title: "Exporting PDF",
    description: "Your expense report is being prepared...",
    className: "bg-white-600",
  });

  try {
    await exportPdf({ email, period, range });
    toast({
      title: "Downloaded",
      description: "Your PDF downloaded successfully",
      className: "bg-green-600 text-white",
    });
  } catch (err) {
    console.error("PDF Error:", err);
    toast({
      title: "Error",
      description: "Failed to generate PDF",
      className: "bg-red-600 text-white",
    });
  }
};

  return (
    <div className="min-h-screen bg-background">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-soft backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold hidden sm:inline">
                Expense Tracker
              </span>
            </div>

            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 space-y-6">

        {/* Filter Section */}
        <Card className="p-4 bg-gradient-card border-border/50 shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            {/* Left Label */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm text-muted-foreground">
                Filter transactions by period
              </span>
            </div>

            {/* Right Filters */}
            <div className="flex flex-wrap items-center gap-2">

              {/* PERIOD SELECT */}
<<<<<<< HEAD
              <Select value={period} onValueChange={setPeriod}>
=======
              <Select value={period} onValueChange={handlePeriodChange}>
>>>>>>> f8564ef (New updates)
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="1m">Last 1 month</SelectItem>
                  <SelectItem value="3m">Last 3 months</SelectItem>
                  <SelectItem value="6m">Last 6 months</SelectItem>
                  <SelectItem value="1y">Last 1 year</SelectItem>
                  <SelectItem value="3y">Last 3 years</SelectItem>
<<<<<<< HEAD
                  <SelectItem value="custom">Custom range</SelectItem>
=======
                  <SelectItem value="custom">Custom</SelectItem>
>>>>>>> f8564ef (New updates)
                </SelectContent>
              </Select>

              {/* CUSTOM DATE RANGE */}
              {period === "custom" && (
                <>
                  <Input
                    type="date"
<<<<<<< HEAD
=======
                    max={range.end || undefined}
>>>>>>> f8564ef (New updates)
                    value={range.start}
                    onChange={(e) =>
                      setRange((prev) => ({ ...prev, start: e.target.value }))
                    }
                    className="w-[140px]"
                  />

                  <Input
                    type="date"
<<<<<<< HEAD
=======
                    min={range.start || undefined}
>>>>>>> f8564ef (New updates)
                    value={range.end}
                    onChange={(e) =>
                      setRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                    className="w-[140px]"
                  />

                  <Button
                    size="sm"
<<<<<<< HEAD
                    onClick={loadExpenses}
=======
                    onClick={handleApplyRange}
>>>>>>> f8564ef (New updates)
                    disabled={!range.start || !range.end}
                    className="bg-primary hover:opacity-90"
                  >
                    Apply
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>


        {/* BALANCE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
            <div className="text-sm mb-1">Total Balance</div>
            <div className={`text-2xl sm:text-3xl font-bold text-primary`}>
              ₹{balance.toFixed(2)}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
            <div className="text-sm mb-1">Total Income</div>
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              ₹{totalIncome.toFixed(2)}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
            <div className="text-sm mb-1">Total Expense</div>
            <div className="text-2xl sm:text-3xl font-bold text-red-500">
              ₹{totalExpense.toFixed(2)}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
            <div className="text-sm mb-1">Transactions</div>
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">
              {expenses.length}
            </div>
          </Card>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setModalType("add")}>
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>

          <Button size="sm" variant="outline" onClick={() => setModalType("update")}>
            <Pencil className="w-4 h-4 mr-2" /> Update
          </Button>

          <Button size="sm" variant="outline" onClick={() => setModalType("delete")}>
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>

          <Button size="sm" variant="outline" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>

          <Button
            size="sm"
            variant="outline"
<<<<<<< HEAD
            className="ml-auto"
=======
            className="ml-auto hidden sm:inline-flex"
>>>>>>> f8564ef (New updates)
            onClick={() => setShowCharts(!showCharts)}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {showCharts ? "Hide" : "Show"} Charts
          </Button>
        </div>

        {/* CHARTS */}
        {showCharts && (
<<<<<<< HEAD
          <Card className="p-6 shadow-soft border-border/50 bg-gradient-card">
=======
          <Card className="hidden sm:block p-6 shadow-soft border-border/50 bg-gradient-card">
>>>>>>> f8564ef (New updates)
            <ExpenseCharts expenses={expenses} isLoading={isLoading} />
          </Card>
        )}

        {/* TABLE */}
        <Card className="shadow-soft border-border/50 bg-gradient-card overflow-hidden">
          <ExpenseTable expenses={expenses} isLoading={isLoading} />
        </Card>
      </div>

      {/* MODALS */}
      <ExpenseModal
        type={modalType}
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        expenses={expenses}
        onSuccess={(updated) => {
          setExpenses(updated);
          setModalType(null);
        }}
      />
    </div>
  );
};

export default Dashboard;
