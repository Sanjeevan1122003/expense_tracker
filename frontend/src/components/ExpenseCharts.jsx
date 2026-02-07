import { useMemo, useState } from "react";
import {
  Tooltip,
  Legend,
  Cell,
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
  const [groupBy, setGroupBy] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const pad2 = (n) => String(n).padStart(2, "0");

  const normalizeType = (value) => {
    const t = String(value || "").trim().toLowerCase();
    if (t === "income") return "Income";
    if (t === "expense") return "Expense";
    return null;
  };

  const toAmount = (value) => {
    const n = Number(String(value || "0").replace(/,/g, "").trim());
    return Number.isFinite(n) ? n : 0;
  };

  const extractYmd = (value) => {
    if (!value) return null;
    const s = String(value).trim();
    // If we got a full timestamp, use local date parts to avoid UTC shifting
    if (s.includes("T")) {
      const d = new Date(s);
      if (!Number.isNaN(d.getTime())) {
        return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() };
      }
    }
    const iso = s.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (iso) {
      const [, yyyy, mm, dd] = iso;
      return { y: Number(yyyy), m: Number(mm), d: Number(dd) };
    }
    const dmy = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    if (dmy) {
      const [, dd, mm, yyyy] = dmy;
      return { y: Number(yyyy), m: Number(mm), d: Number(dd) };
    }
    return null;
  };

  const toUtcDateFromYmd = (ymd) => new Date(Date.UTC(ymd.y, ymd.m - 1, ymd.d));

  const startOfWeekUTC = (dateUtc) => {
    const d = new Date(Date.UTC(dateUtc.getUTCFullYear(), dateUtc.getUTCMonth(), dateUtc.getUTCDate()));
    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() - (day - 1));
    return d;
  };

  const getIsoWeek = (dateUtc) => {
    const d = new Date(Date.UTC(dateUtc.getUTCFullYear(), dateUtc.getUTCMonth(), dateUtc.getUTCDate()));
    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    const year = d.getUTCFullYear();
    const week1 = new Date(Date.UTC(year, 0, 4));
    const week1Day = week1.getUTCDay() || 7;
    week1.setUTCDate(week1.getUTCDate() + 1 - week1Day);
    const week = Math.ceil(((d - week1) / 86400000 + 1) / 7);
    return { year, week };
  };

  const getBucketKeyLabel = (dateUtc) => {
    const y = dateUtc.getUTCFullYear();
    const m = dateUtc.getUTCMonth() + 1;
    const d = dateUtc.getUTCDate();

    if (groupBy === "day") {
      const key = `${y}-${pad2(m)}-${pad2(d)}`;
      return { key, label: String(d) };
    }

    if (groupBy === "week") {
      const weekStart = startOfWeekUTC(dateUtc);
      const key = `${weekStart.getUTCFullYear()}-${pad2(weekStart.getUTCMonth() + 1)}-${pad2(weekStart.getUTCDate())}`;
      const label = "";
      return { key, label };
    }

    if (groupBy === "year") {
      const key = String(y);
      const label = String(y);
      return { key, label };
    }

    const key = `${y}-${pad2(m)}`;
    const labelDate = new Date(Date.UTC(y, m - 1, 1));
    const label = labelDate.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
    return { key, label };
  };

  const startOfPeriodUTC = (dateUtc) => {
    if (groupBy === "day") return new Date(Date.UTC(dateUtc.getUTCFullYear(), dateUtc.getUTCMonth(), dateUtc.getUTCDate()));
    if (groupBy === "week") return startOfWeekUTC(dateUtc);
    if (groupBy === "year") return new Date(Date.UTC(dateUtc.getUTCFullYear(), 0, 1));
    return new Date(Date.UTC(dateUtc.getUTCFullYear(), dateUtc.getUTCMonth(), 1));
  };

  const addPeriodUTC = (dateUtc) => {
    const d = new Date(dateUtc);
    if (groupBy === "day") {
      d.setUTCDate(d.getUTCDate() + 1);
      return d;
    }
    if (groupBy === "week") {
      d.setUTCDate(d.getUTCDate() + 7);
      return d;
    }
    if (groupBy === "year") {
      d.setUTCFullYear(d.getUTCFullYear() + 1, 0, 1);
      return d;
    }
    d.setUTCMonth(d.getUTCMonth() + 1, 1);
    return d;
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const availableMonths = useMemo(() => {
    const set = new Set();
    expenses.forEach((e) => {
      const ymd = extractYmd(e.date);
      if (!ymd) return;
      set.add(ymd.m);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [expenses]);

  const availableYears = useMemo(() => {
    const set = new Set();
    expenses.forEach((e) => {
      const ymd = extractYmd(e.date);
      if (!ymd) return;
      set.add(ymd.y);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [expenses]);

  const defaultMonth = useMemo(() => {
    const current = new Date().getMonth() + 1;
    if (availableMonths.includes(current)) return current;
    return availableMonths[0] || current;
  }, [availableMonths]);

  const defaultYear = useMemo(() => {
    const current = new Date().getFullYear();
    if (availableYears.includes(current)) return current;
    return availableYears[0] || current;
  }, [availableYears]);

  // ✅ Filter by Income/Expense/All and optional month
  const filtered = useMemo(() => {
    let data =
      typeFilter === "All"
        ? expenses
        : expenses.filter((e) => normalizeType(e.type) === typeFilter);

    if ((groupBy === "day" || groupBy === "week") && (selectedMonth || defaultMonth)) {
      const monthValue = Number(selectedMonth || defaultMonth);
      data = data.filter((e) => {
        const ymd = extractYmd(e.date);
        return ymd && ymd.m === monthValue;
      });
    }

    if (groupBy === "year" && (selectedYear || defaultYear)) {
      const yearValue = Number(selectedYear || defaultYear);
      data = data.filter((e) => {
        const ymd = extractYmd(e.date);
        return ymd && ymd.y === yearValue;
      });
    }

    return data;
  }, [expenses, typeFilter, groupBy, selectedMonth, defaultMonth, selectedYear, defaultYear]);

  // ✅ Group by category (Horizontal Bar)
  const categoryData = useMemo(() => {
    const map = new Map();
    filtered.forEach((e) => {
      map.set(e.category, (map.get(e.category) || 0) + Number(e.amount));
    });
    return Array.from(map, ([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [filtered]);

  const categoryChartHeight = Math.max(360, categoryData.length * 28 + 80);

  // ✅ Group by selected period & type (Bar + Line)
  const seriesByPeriod = useMemo(() => {
    const map = new Map();
    let minTime = null;
    let maxTime = null;

    filtered.forEach((e) => {
      const typeKey = normalizeType(e.type);
      if (!typeKey) return;
      const ymd = extractYmd(e.date);
      if (!ymd) return;
      const dateUtc = toUtcDateFromYmd(ymd);

      const { key, label } = getBucketKeyLabel(dateUtc);
      const row = map.get(key) || { key, label, Income: 0, Expense: 0 };
      row[typeKey] += toAmount(e.amount);
      map.set(key, row);

      const t = dateUtc.getTime();
      if (minTime === null || t < minTime) minTime = t;
      if (maxTime === null || t > maxTime) maxTime = t;
    });

    if (minTime === null || maxTime === null) return [];

    if (groupBy === "week") {
      const rows = Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));
      return rows.map((row, idx) => ({ ...row, label: `Week ${idx + 1}` }));
    }

    if (groupBy === "day") {
      return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));
    }

    let start = startOfPeriodUTC(new Date(minTime));
    let end = startOfPeriodUTC(new Date(maxTime));

    if (groupBy === "day") {
      const monthValue = Number(selectedMonth || defaultMonth);
      const years = filtered
        .map((e) => extractYmd(e.date))
        .filter(Boolean)
        .map((ymd) => ymd.y);
      const yearValue = years.length ? Math.max(...years) : new Date().getFullYear();
      const monthStart = new Date(Date.UTC(yearValue, monthValue - 1, 1));
      const monthEnd = new Date(Date.UTC(yearValue, monthValue, 0));
      start = monthStart;
      end = monthEnd;
    }

    const buckets = [];
    for (let cursor = new Date(start); cursor <= end; cursor = addPeriodUTC(cursor)) {
      const { key, label } = getBucketKeyLabel(cursor);
      const row = map.get(key) || { key, label, Income: 0, Expense: 0 };
      buckets.push(row);
    }

    const shouldCap = groupBy === "month" || groupBy === "year";
    return shouldCap ? buckets.slice(Math.max(buckets.length - 12, 0)) : buckets;
  }, [filtered, groupBy]);

  const seriesByPeriodLineIndexed = useMemo(() => {
    const basePoint = { x: 0, label: "0", Income: 0, Expense: 0 };
    const points = seriesByPeriod.map((row, idx) => ({ ...row, x: idx + 1 }));
    return [basePoint, ...points];
  }, [seriesByPeriod]);

  const lineIndexLabelMap = useMemo(() => {
    const map = new Map();
    seriesByPeriodLineIndexed.forEach((row) => {
      map.set(row.x, row.label || "");
    });
    return map;
  }, [seriesByPeriodLineIndexed]);

  // Debug logs removed after verification

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

  const groupByLabelMap = {
    day: "Daily",
    week: "Weekly",
    month: "Monthly",
    year: "Yearly",
  };
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
        <div className="flex flex-wrap items-center justify-start gap-2">
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
          {/* ✅ Group By */}
          <Select value={groupBy} onValueChange={(v) => setGroupBy(v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>

          {(groupBy === "day" || groupBy === "week") && (
            <Select
              value={selectedMonth || String(defaultMonth)}
              onValueChange={(v) => setSelectedMonth(v)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.length === 0
                  ? monthNames.map((label, idx) => (
                    <SelectItem key={label} value={String(idx + 1)}>
                      {label}
                    </SelectItem>
                  ))
                  : availableMonths.map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      {monthNames[m - 1]}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}

          {groupBy === "year" && (
            <Select
              value={selectedYear || String(defaultYear)}
              onValueChange={(v) => setSelectedYear(v)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.length === 0
                  ? [new Date().getFullYear()].map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))
                  : availableYears.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* ✅ Category Bar Chart */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-center">By Category</h3>
        <div id="category-bar-chart" className="min-h-[360px]">
          <ResponsiveContainer width="100%" height={categoryChartHeight}>
            <BarChart
              data={categoryData}
              layout="vertical"
              margin={{ top: 10, right: 40, bottom: 10, left: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(v) => `₹${Number(v).toFixed(0)}`}
              />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip formatter={(v) => `₹${Number(v).toFixed(2)}`} />
              <Bar dataKey="amount" radius={[6, 6, 6, 6]}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ✅ Bar Chart */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-center">
          {groupByLabelMap[groupBy]} Income vs Expense (Bar)
        </h3>
        <div id="bar-chart">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={seriesByPeriod}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={(v) => `₹${Number(v).toFixed(2)}`} />
              <Legend />
              <Bar
                dataKey="Income"
                fill="hsl(142 76% 36%)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="Expense"
                fill="hsl(0 84% 60%)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ✅ Line Chart */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-center">
          {groupByLabelMap[groupBy]} Trend (Line)
        </h3>
        <div id="line-chart">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={seriesByPeriodLineIndexed}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="x"
                domain={[0, "dataMax"]}
                allowDecimals={false}
                ticks={seriesByPeriodLineIndexed.map((d) => d.x)}
                tickFormatter={(value) => lineIndexLabelMap.get(value) || ""}
              />
              <YAxis domain={[0, "auto"]} />
              <Tooltip
                formatter={(v) => `₹${Number(v).toFixed(2)}`}
                labelFormatter={(value) => lineIndexLabelMap.get(value) || ""}
              />
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
