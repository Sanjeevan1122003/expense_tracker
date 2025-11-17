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

  // ✅ Handle sorting toggle
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return null; // toggle off
    });
  };

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
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort(key)}
                    className={`h-8 px-2 ${key === "amount" ? "ml-auto" : ""
                      }`}
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
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No expenses found
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((exp) => (
                <tr
                  key={exp.id}
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
                    >
                      {exp.type}
                    </span>
                  </td>
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
