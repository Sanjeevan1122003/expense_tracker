// src/pages/Welcome.jsx
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  PieChart,
  Wallet,
  Shield,
  Download,
  BarChart3,
  CheckCircle,
  ChevronRight,
  Sparkles,
  Zap,
  Globe,
  Clock,
  FileText,
  CalendarDays,
  LineChart,
  ListFilter,
  Table2,
  Tags,
  IndianRupee,
  ArrowUpDown,
  Facebook,
  Instagram,
  Twitter,
  Mail,
} from "lucide-react";
import { getToken } from "../lib/auth";

const Welcome = () => {
  const navigate = useNavigate();
  const token = getToken();

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ========== NAVBAR ========== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="w-full px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Expense<span className="text-primary">Tracker</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#showcase" className="hover:text-foreground transition-colors">Showcase</a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="text-muted-foreground hover:text-foreground"
            >
              Log In
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/register")}
              className="bg-primary hover:opacity-90 text-primary-foreground shadow-soft"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl landing-float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/30 rounded-full blur-3xl landing-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="landing-fade-up inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
            <Sparkles className="w-4 h-4" />
            Smart Finance Management
          </div>

          {/* Heading */}
          <h1 className="landing-fade-up text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Take Control of
            <br />
            <span className="bg-gradient-to-r from-primary to-[hsl(186,100%,55%)] bg-clip-text text-transparent">
              Your Finances
            </span>
          </h1>

          {/* Subheading */}
          <p className="landing-fade-up max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            Track expenses, visualize spending patterns, and make smarter
            financial decisions — all in one beautiful, intuitive dashboard.
          </p>

          {/* CTA Buttons */}
          <div className="landing-fade-up flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              className="bg-primary hover:opacity-90 text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-medium hover:shadow-large transition-all duration-300 group w-full sm:w-auto"
            >
              Start Tracking Today
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
              className="px-8 py-6 text-lg rounded-xl border-border hover:bg-muted/50 transition-all duration-300 w-full sm:w-auto"
            >
              Sign In
              <ChevronRight className="ml-1 w-5 h-5" />
            </Button>
          </div>

          {/* Trust badges */}
          <div className="landing-fade-up flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Bank-level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <span>Access Anywhere</span>
            </div>
          </div>
        </div>

        {/* Hero visual / Dashboard preview */}
        <div className="relative max-w-4xl mx-auto mt-16 landing-fade-up">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="bg-card border border-border/50 rounded-2xl shadow-large overflow-hidden">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-background/80 rounded-md px-4 py-1 text-xs text-muted-foreground w-64 text-center">
                  expensetracker.sanjeevantech.com
                </div>
              </div>
            </div>
            {/* Dashboard mockup */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Balance", value: "12,450.00", color: "text-primary" },
                  { label: "Income", value: "28,350.00", color: "text-green-600" },
                  { label: "Expenses", value: "15,900.00", color: "text-red-500" },
                  { label: "Transactions", value: "142", color: "text-purple-600" },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="bg-muted/30 rounded-xl p-4 border border-border/30"
                  >
                    <div className="text-xs text-muted-foreground">{card.label}</div>
                    <div className={`text-lg font-bold ${card.color} mt-1`}>
                      {card.label !== "Transactions" ? `₹${card.value}` : card.value}
                    </div>
                  </div>
                ))}
              </div>
              {/* Chart bars placeholder */}
              <div className="flex items-end justify-between gap-2 h-32 px-2 pt-4">
                {[40, 65, 45, 80, 55, 70, 60, 90, 50, 75, 85, 45].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md"
                    style={{
                      height: `${h}%`,
                      background:
                        i % 2 === 0
                          ? "hsl(195 100% 39% / 0.7)"
                          : "hsl(142 76% 36% / 0.5)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section id="features" className="py-20 md:py-28 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <p className="text-primary font-semibold text-sm tracking-wider uppercase">
              Features
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Powerful tools designed to help you understand, manage, and grow
              your money effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Real-time Tracking",
                desc: "Add income and expenses instantly. See your balance update in real-time with every transaction.",
              },
              {
                icon: BarChart3,
                title: "Visual Analytics",
                desc: "Beautiful bar, line, and category charts that reveal your spending patterns at a glance.",
              },
              {
                icon: PieChart,
                title: "Category Insights",
                desc: "Categorize every transaction. Know exactly where your money goes each month.",
              },
              {
                icon: Download,
                title: "PDF Export",
                desc: "Export professional expense reports as PDFs anytime — perfect for records and sharing.",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                desc: "Your data is protected with JWT authentication, encrypted cookies, and HTTPS.",
              },
              {
                icon: Clock,
                title: "Flexible Filters",
                desc: "Filter by date ranges, months, years, or custom periods to analyze any timeframe.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group bg-card p-8 rounded-2xl border border-border/50 shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all duration-300"
              >
                <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <p className="text-primary font-semibold text-sm tracking-wider uppercase">
              How It Works
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Three Simple Steps
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Get started in under a minute. No credit card required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Account",
                desc: "Sign up with your email in seconds. No complicated setup or verification needed.",
              },
              {
                step: "02",
                title: "Add Transactions",
                desc: "Log your income and expenses with category, description, date and amount.",
              },
              {
                step: "03",
                title: "Track & Analyze",
                desc: "View charts, filter by date, export PDFs, and make smarter financial decisions.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground text-2xl font-bold mb-6 shadow-medium">
                  {step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURE SHOWCASE ========== */}
      <section id="showcase" className="py-20 md:py-28 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <p className="text-primary font-semibold text-sm tracking-wider uppercase">
              Feature Showcase
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              See What's Inside
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A closer look at the powerful tools that make managing your money simple and insightful.
            </p>
          </div>

          {/* Showcase Row 1 — Charts & Graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Interactive Charts & Graphs</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Visualize your finances with bar charts for category-wise spending, grouped income vs expense comparisons, and trend line charts that show how your money flows over time.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Bar Charts", "Line Charts", "Category Breakdown", "Income vs Expense"].map((tag) => (
                    <span key={tag} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{tag}</span>
                  ))}
                </div>
              </div>
              {/* Mini chart mockup */}
              <div className="px-8 pb-6">
                <div className="bg-muted/30 rounded-xl p-4 border border-border/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground">Monthly Overview</span>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block" /> Expense</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Income</span>
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-1.5 h-24">
                    {[
                      { e: 45, i: 60 }, { e: 55, i: 70 }, { e: 35, i: 65 },
                      { e: 70, i: 80 }, { e: 50, i: 75 }, { e: 65, i: 90 },
                    ].map((m, idx) => (
                      <div key={idx} className="flex-1 flex items-end gap-0.5">
                        <div className="flex-1 rounded-t-sm bg-primary/70" style={{ height: `${m.e}%` }} />
                        <div className="flex-1 rounded-t-sm bg-green-500/60" style={{ height: `${m.i}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
                      <span key={m} className="flex-1 text-center">{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* PDF Export */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-500/10 w-10 h-10 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold">PDF Report Export</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Generate professional, well-formatted PDF reports of your expenses with a single click. Includes transaction details, amounts, categories, dates, and timestamps — ready to share or keep for your records.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["One-Click Export", "Formatted Tables", "Date & Time", "Category Labels"].map((tag) => (
                    <span key={tag} className="text-xs bg-red-500/10 text-red-500 px-3 py-1 rounded-full font-medium">{tag}</span>
                  ))}
                </div>
              </div>
              {/* PDF mockup */}
              <div className="px-8 pb-6">
                <div className="bg-muted/30 rounded-xl p-5 border border-border/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Download className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-medium">expense-report-2026.pdf</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { cat: "Food", amt: "₹2,450", type: "Expense" },
                      { cat: "Salary", amt: "₹45,000", type: "Income" },
                      { cat: "Transport", amt: "₹1,200", type: "Expense" },
                      { cat: "Freelance", amt: "₹8,500", type: "Income" },
                    ].map((row) => (
                      <div key={row.cat} className="flex items-center justify-between text-xs py-1.5 px-2 rounded-md bg-background/50">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${row.type === "Income" ? "bg-green-500" : "bg-red-400"}`} />
                          <span className="text-muted-foreground">{row.cat}</span>
                        </div>
                        <span className={`font-medium ${row.type === "Income" ? "text-green-600" : "text-red-500"}`}>{row.amt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Showcase Row 2 — Filters & Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Advanced Filters */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-soft p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-500/10 w-10 h-10 rounded-xl flex items-center justify-center">
                  <ListFilter className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold">Smart Filters</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                Filter transactions by this month, last month, this year, or set a custom date range. Instantly see the data that matters.
              </p>
              <div className="space-y-2">
                {[
                  { icon: CalendarDays, label: "This Month", active: true },
                  { icon: CalendarDays, label: "Last Month", active: false },
                  { icon: CalendarDays, label: "This Year", active: false },
                  { icon: CalendarDays, label: "Custom Range", active: false },
                ].map(({ icon: Icon, label, active }) => (
                  <div key={label} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted/50"}`}>
                    <Icon className="w-4 h-4" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-soft p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-500/10 w-10 h-10 rounded-xl flex items-center justify-center">
                  <Tags className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold">Expense & Income Categories</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                Organize every transaction with built-in categories for both expenses and income. Get clear breakdowns of where your money goes.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Food", color: "bg-orange-500/10 text-orange-600" },
                  { label: "Transport", color: "bg-blue-500/10 text-blue-600" },
                  { label: "Shopping", color: "bg-pink-500/10 text-pink-600" },
                  { label: "Salary", color: "bg-green-500/10 text-green-600" },
                  { label: "Rent", color: "bg-red-500/10 text-red-500" },
                  { label: "Freelance", color: "bg-purple-500/10 text-purple-600" },
                  { label: "Bills", color: "bg-yellow-500/10 text-yellow-600" },
                  { label: "Other", color: "bg-gray-500/10 text-gray-600" },
                ].map(({ label, color }) => (
                  <div key={label} className={`${color} text-xs font-medium px-3 py-2 rounded-lg text-center`}>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-soft p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-cyan-500/10 w-10 h-10 rounded-xl flex items-center justify-center">
                  <Table2 className="w-5 h-5 text-cyan-500" />
                </div>
                <h3 className="text-lg font-semibold">Detailed Expense Table</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                View all transactions in a sortable, scrollable table with amount, type, category, description, date, and time columns.
              </p>
              <div className="space-y-1.5">
                {/* Table header */}
                <div className="grid grid-cols-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pb-1.5 border-b border-border/50">
                  <span>Category</span>
                  <span className="text-center">Type</span>
                  <span className="text-right">Amount</span>
                </div>
                {[
                  { cat: "Food", type: "Expense", amt: "₹850", color: "text-red-500" },
                  { cat: "Salary", type: "Income", amt: "₹45,000", color: "text-green-600" },
                  { cat: "Transport", type: "Expense", amt: "₹320", color: "text-red-500" },
                  { cat: "Freelance", type: "Income", amt: "₹8,500", color: "text-green-600" },
                  { cat: "Shopping", type: "Expense", amt: "₹2,100", color: "text-red-500" },
                ].map((row) => (
                  <div key={row.cat} className="grid grid-cols-3 text-xs py-1.5">
                    <span className="font-medium">{row.cat}</span>
                    <span className={`text-center ${row.type === "Income" ? "text-green-600" : "text-red-500"}`}>{row.type}</span>
                    <span className={`text-right font-semibold ${row.color}`}>{row.amt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-card border border-border/50 rounded-3xl p-10 md:p-16 shadow-large relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 pointer-events-none" />

            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Get Started Now
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Ready to Take Control?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Join hundreds of users who are already managing their finances
                smarter. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/register")}
                  className="bg-primary hover:opacity-90 text-primary-foreground px-10 py-6 text-lg rounded-xl shadow-medium hover:shadow-large transition-all duration-300 group w-full sm:w-auto"
                >
                  Create Your Account
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-border/50 bg-card/50">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          {/* Top row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-14">
            {/* Brand column */}
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary p-2 rounded-xl">
                  <Wallet className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold tracking-tight">
                  Expense<span className="text-primary">Tracker</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your personal finance companion. Track, analyze, and take control of your money with ease.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-sm mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#showcase" className="hover:text-foreground transition-colors">Feature Showcase</a></li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><span className="flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Charts & Analytics</span></li>
                <li><span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> PDF Export</span></li>
                <li><span className="flex items-center gap-1.5"><ListFilter className="w-3.5 h-3.5" /> Smart Filters</span></li>
                <li><span className="flex items-center gap-1.5"><Tags className="w-3.5 h-3.5" /> Categories</span></li>
              </ul>
            </div>

            {/* Get Started */}
            <div>
              <h4 className="font-semibold text-sm mb-4">Get Started</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <button onClick={() => navigate("/register")} className="hover:text-foreground transition-colors">
                    Create Account
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/login")} className="hover:text-foreground transition-colors">
                    Sign In
                  </button>
                </li>
              </ul>
              <div className="mt-5 flex items-center gap-2">
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                {/* <a
                  href="mailto:info@expensetracker.com"
                  className="w-9 h-9 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Gmail"
                >
                  <Mail className="w-4 h-4" />
                </a> */}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/50" />

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} ExpenseTracker. Built by{" "}
              <a
                href="https://portfolio.sanjeevantech.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Sanjeevan Thangaraj
              </a>
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Made with</span>
              <span className="text-red-500">&#9829;</span>
              <span>using React, Node.js & PostgreSQL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
