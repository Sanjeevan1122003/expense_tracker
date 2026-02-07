import { useMemo, useState } from "react";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ArrowUpDown, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import TableSkeleton from "../components/loaders/TableSkeleton";

const ExpenseTable = ({ expenses, isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortConfig, setSortConfig] = useState(null);
<<<<<<< HEAD
=======
  const columns = useMemo(
    () => [
      { key: "user_expense_id", label: "ID", align: "left", widthClass: "w-16" },
      { key: "date", label: "Date", align: "left", widthClass: "w-28" },
      { key: "time", label: "Time", align: "left", widthClass: "w-24" },
      { key: "category", label: "Category", align: "left", widthClass: "w-48" },
      { key: "description", label: "Description", align: "left", widthClass: "w-64" },
      { key: "type", label: "Type", align: "left", widthClass: "w-28" },
      { key: "amount", label: "Amount", align: "right", widthClass: "w-28" },
    ],
    []
  );
>>>>>>> f8564ef (New updates)

  // ✅ Handle sorting toggle
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return null; // toggle off
    });
  };

<<<<<<< HEAD
=======

>>>>>>> f8564ef (New updates)
  // ✅ Apply filters, search, and sorting
  const filteredAndSorted = useMemo(() => {
    let result = [...expenses];

    // 🔍 Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (exp) =>
          exp.category.toLowerCase().includes(term) ||
          exp.type.toLowerCase().includes(term) ||
          String(exp.amount).includes(term)
      );
    }

    // ⚙️ Type Filter
    if (filterType !== "all") {
      result = result.filter(
        (exp) => exp.type.toLowerCase() === filterType
      );
    }

    // ↕️ Sorting
    if (sortConfig) {
      const { key, direction } = sortConfig;
      result.sort((a, b) => {
        const av = a[key];
        const bv = b[key];

        if (key === "amount") {
          return direction === "asc"
            ? Number(av) - Number(bv)
            : Number(bv) - Number(av);
        }

        return direction === "asc"
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }

    return result;
  }, [expenses, searchTerm, filterType, sortConfig]);

  // ✅ Format date
  const fmt = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

<<<<<<< HEAD
=======
  const fmtTime = (timeStr) => {
    if (!timeStr) return "";
    const d = new Date(`1970-01-01T${timeStr}`);
    if (Number.isNaN(d.getTime())) return timeStr;
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

>>>>>>> f8564ef (New updates)
  // ✅ Loading skeleton
  if (isLoading) return <TableSkeleton />;

  return (
    <div className="space-y-4">
      {/* 🔍 Filters */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by category, type, or amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-background"
            />
          </div>

          <Select value={filterType} onValueChange={(v) => setFilterType(v)}>
            <SelectTrigger className="w-full sm:w-44 h-10 bg-background">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 🧾 Table */}
      <div className="table-scroll">
<<<<<<< HEAD
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              {[
                { key: "user_expense_id", label: "ID" },
                { key: "date", label: "Date" },
                { key: "category", label: "Category" },
                { key: "type", label: "Type" },
                { key: "amount", label: "Amount" },
              ].map(({ key, label }) => (
                <TableHead
                  key={key}
                  className={`font-semibold ${key === "amount" ? "text-right" : ""
                    }`}
=======
        <Table className="table-fixed w-full min-w-[860px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              {columns.map(({ key, label, align, widthClass }) => (
                <TableHead
                  key={key}
                  className={`font-semibold bg-primary text-primary-foreground ${align === "right" ? "text-right" : "text-left"
                    } ${widthClass}`}
>>>>>>> f8564ef (New updates)
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort(key)}
<<<<<<< HEAD
                    className={`h-8 px-2 ${key === "amount" ? "ml-auto" : ""
                      }`}
=======
                    className={`h-8 px-2 ${align === "right" ? "ml-auto" : ""}`}
>>>>>>> f8564ef (New updates)
                  >
                    {label}
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* 🧍 Table Body */}
          <tbody className="tbody-scroll block">
            {filteredAndSorted.length === 0 ? (
              <tr className="table w-full">
                <td
<<<<<<< HEAD
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
=======
                  colSpan={columns.length}
                  className="text-center py-8 text-muted-foreground font-semibold"
>>>>>>> f8564ef (New updates)
                >
                  No expenses found
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((exp) => (
                <tr
                  key={exp.id}
<<<<<<< HEAD
                  className="table w-full border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="w-[20%] px-4 py-3">{exp.user_expense_id}</td>
                  <td className="w-[20%] px-4 py-3 text-muted-foreground">
                    {fmt(exp.date)}
                  </td>
                  <td className="w-[20%] px-4 py-3">{exp.category}</td>
                  <td className="w-[20%] px-4 py-3">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor:
                          exp.type === "Income"
                            ? "hsl(142 76% 90%)"
                            : "hsl(0 84% 90%)",
                        color:
                          exp.type === "Income"
                            ? "hsl(142 76% 36%)"
                            : "hsl(0 84% 60%)",
                      }}
=======
                  className={`table w-full border-b border-border hover:bg-muted/30 transition-colors ${exp.type === "Income" ? "text-green-600" : "text-red-500"
                    }`}
                >
                  <td className="px-4 py-3 w-16 text-muted-foreground font-semibold whitespace-nowrap">
                    <span
                      className={`px-4 py-3 font-semibold w-24 whitespace-nowrap ${exp.type === "Income"
                          ? "text-green-700"
                          : "text-red-600"
                        }`}
                    >
                      {exp.user_expense_id}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-semibold w-28 whitespace-nowrap">
                    <span
                      className={`px-4 py-3 font-semibold w-24 whitespace-nowrap ${exp.type === "Income"
                          ? "text-green-700"
                          : "text-red-600"
                        }`}
                    > {fmt(exp.date)}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-semibold w-24 whitespace-nowrap">
                    <span
                      className={`px-4 py-3  font-semibold w-24 whitespace-nowrap ${exp.type === "Income"
                          ? "text-green-700"
                          : "text-red-600"
                        }`}
                    > {fmtTime(exp.time)}</span>
                  </td>
                  <td className="px-4 py-3 w-48 text-muted-foreground font-semibold truncate" title={exp.category}>
                    <span
                      className={`px-4 py-3  font-semibold w-24 whitespace-nowrap ${exp.type === "Income"
                          ? "text-green-700"
                          : "text-red-600"
                        }`}
                    > {exp.category}</span>
                  </td>
                  <td className="px-4 py-3 w-64 text-muted-foreground font-semibold truncate" title={exp.description}>
                    <span
                      className={`px-4 py-3  font-semibold w-24 whitespace-nowrap ${exp.type === "Income"
                          ? "text-green-700"
                          : "text-red-600"
                        }`}
                    > {exp.description}</span>
                  </td>
                  <td className="px-4 py-3 w-28">
                    <span
                      className={`px-4 py-3  font-semibold w-24 whitespace-nowrap ${exp.type === "Income"
                          ? "text-green-700"
                          : "text-red-600"
                        }`}
>>>>>>> f8564ef (New updates)
                    >
                      {exp.type}
                    </span>
                  </td>
<<<<<<< HEAD
                  <td className="w-[20%] px-4 py-3 text-right font-semibold">
                    <span
                      style={{
                        color:
                          exp.type === "Income"
                            ? "hsl(142 76% 36%)"
                            : "hsl(0 84% 60%)",
                      }}
                    >
                      {exp.type === "Income" ? "" : "-"}₹
                      {Number(exp.amount).toFixed(2)}
                    </span>
=======
                  <td className="px-4 py-3 text-right font-semibold w-28 whitespace-nowrap">
                    {exp.type === "Income" ? "" : "-"}₹
                    {Number(exp.amount).toFixed(2)}
>>>>>>> f8564ef (New updates)
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <div className="px-4 pb-4 text-sm text-muted-foreground">
        Showing {filteredAndSorted.length} of {expenses.length} transactions
      </div>
    </div>
  );
};

export default ExpenseTable;
