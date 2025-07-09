import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Budgets from "./components/Budgets";
import Goals from "./components/Goals";
import Analytics from "./components/Analytics";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading...
      </div>
    );
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    if (user && token) {
      const fetchData = async () => {
        try {
          const config = {
            headers: { Authorization: `Bearer ${token}` },
          };
          const [transactionsRes, budgetsRes, goalsRes, notificationsRes] =
            await Promise.all([
              axios.get("http://localhost:5000/api/transactions", config),
              axios.get("http://localhost:5000/api/budgets", config),
              axios.get("http://localhost:5000/api/goals", config),
              axios.get("http://localhost:5000/api/notifications", config),
            ]);

          setTransactions(transactionsRes.data);

          setBudgets(budgetsRes.data);
          setGoals(goalsRes.data);
          setNotifications(notificationsRes.data);
        } catch (error) {
          console.error(
            "Error fetching data:",
            error.response?.data?.error || error.message
          );
          setNotifications([
            ...notifications,
            {
              id: Date.now(),
              message: "Failed to fetch data. Please try again.",
            },
          ]);
        }
      };
      fetchData();
    }
  }, [user, token, notifications]);

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalSavings = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "savings")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const netWorth = totalIncome - totalExpenses + totalSavings;
  const savingsRate =
    totalIncome > 0 ? ((totalSavings / totalIncome) * 100).toFixed(1) : 0;

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {user && <Header notifications={notifications} />}
        {user && (
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register></Register>} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard
                    transactions={transactions}
                    setTransactions={setTransactions}
                    totalIncome={totalIncome}
                    totalExpenses={totalExpenses}
                    netWorth={netWorth}
                    savingsRate={savingsRate}
                    showAddTransaction={showAddTransaction}
                    setShowAddTransaction={setShowAddTransaction}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions
                    transactions={transactions}
                    setTransactions={setTransactions}
                    showAddTransaction={showAddTransaction}
                    setShowAddTransaction={setShowAddTransaction}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/budgets"
              element={
                <ProtectedRoute>
                  <Budgets budgets={budgets} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <Goals
                    goals={goals}
                    setGoals={setGoals}
                    showAddGoal={showAddGoal}
                    setShowAddGoal={setShowAddGoal}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics transactions={transactions} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
