// src/pages/Welcome.jsx
import { Navigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import Cookies from "js-cookie";
import { ArrowRight, TrendingUp, PieChart, Wallet } from "lucide-react";

const Welcome = () => {

  const token = Cookies.get("jwt_token")
  if(token !== null){
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8 animate-in fade-in duration-1000">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="relative bg-primary p-8 rounded-3xl shadow-large">
              <Wallet className="w-16 h-16 text-primary-foreground" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
            Expense Tracker
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Take control of your finances with smart tracking and insightful analytics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
          <div className="bg-card p-6 rounded-2xl shadow-soft border border-border hover:shadow-medium transition-all duration-300">
            <TrendingUp className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-card-foreground mb-2">Track Expenses</h3>
            <p className="text-sm text-muted-foreground">Monitor your spending in real-time</p>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-soft border border-border hover:shadow-medium transition-all duration-300">
            <PieChart className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-card-foreground mb-2">Visual Analytics</h3>
            <p className="text-sm text-muted-foreground">Understand spending patterns</p>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-soft border border-border hover:shadow-medium transition-all duration-300">
            <Wallet className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-card-foreground mb-2">Manage Budget</h3>
            <p className="text-sm text-muted-foreground">Stay on top of your finances</p>
          </div>
        </div>

        <div className="pt-8">
          <Button
            size="lg"
            className="bg-primary hover:opacity-90 text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-medium hover:shadow-large transition-all duration-300 group"
            onClick={() => window.location.href = "/register"}
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="mt-4 text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline font-medium">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
