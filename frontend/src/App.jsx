import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { getToken } from "./lib/auth";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  const token = getToken();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={token ? <Navigate to="/dashboard" replace /> : <Welcome />}
            />

            <Route
              path="/login"
              element={
               <Login />
              }
            />

            <Route
              path="/register"
              element={
                <Register />
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
