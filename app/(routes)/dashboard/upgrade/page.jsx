"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectItem } from "@/components/ui/select";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function UpgradePage() {
  const [timeframe, setTimeframe] = useState("monthly");
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ total: 0, byCategory: {} });

  useEffect(() => {
    // Simulate fetching expenses from API or database
    const mockExpenses = [
      { amount: 1200, date: "2025-04-01", category: "Food" },
      { amount: 800, date: "2025-04-02", category: "Travel" },
      { amount: 200, date: "2025-04-03", category: "Entertainment" },
      { amount: 500, date: "2025-03-15", category: "Food" },
      { amount: 700, date: "2025-03-20", category: "Utilities" },
    ];
    setExpenses(mockExpenses);
  }, []);

  useEffect(() => {
    const filtered = filterExpensesByTimeframe(expenses, timeframe);
    const total = filtered.reduce((acc, curr) => acc + curr.amount, 0);
    const byCategory = {};
    filtered.forEach((exp) => {
      byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
    });
    setSummary({ total, byCategory });
  }, [expenses, timeframe]);

  const filterExpensesByTimeframe = (expenses, range) => {
    const now = new Date();
    return expenses.filter((e) => {
      const date = new Date(e.date);
      if (range === "weekly") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return date >= oneWeekAgo && date <= now;
      }
      if (range === "monthly") {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }
      if (range === "yearly") {
        return date.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const pieData = {
    labels: Object.keys(summary.byCategory),
    datasets: [
      {
        data: Object.values(summary.byCategory),
        backgroundColor: ["#f87171", "#60a5fa", "#34d399", "#facc15", "#a78bfa"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upgrade Page</h1>
      <p className="mb-6 text-gray-600">Unlock premium features by upgrading your account.</p>

      <h2 className="text-xl font-semibold mb-4">Your Expense Summary</h2>

      <Select value={timeframe} onValueChange={setTimeframe} className="mb-4 w-48">
        <SelectItem value="weekly">Weekly</SelectItem>
        <SelectItem value="monthly">Monthly</SelectItem>
        <SelectItem value="yearly">Yearly</SelectItem>
      </Select>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-2">Total Spent ({timeframe}): ₹{summary.total}</h2>
          <div className="max-w-xs">
            <Pie data={pieData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UpgradePage;
