import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import apiClient from "../../api/client";
import ManagerLayout from "../../components/ManagerLayout";

export default function ManagerDashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    apiClient
      .get("/dashboard/budget")
      .then((res) => setDashboardData(res.data))
      .catch((err) =>
        console.error("Failed to load budget dashboard:", err)
      );
  }, []);

  if (!dashboardData) {
    return (
      <ManagerLayout>
        <p className="text-mbzuai-navy/60">Loading dashboard...</p>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div>
        <p className="text-sm uppercase tracking-wide text-mbzuai-gold font-medium">
          Manager
        </p>

        <h1 className="mt-2 text-4xl font-semibold text-mbzuai-navy">
          Budget Dashboard
        </h1>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-mbzuai-navy/10 bg-white p-6">
          <p className="text-sm text-mbzuai-navy/50">Annual Budget</p>
          <p className="mt-2 text-3xl font-semibold text-mbzuai-navy">
            AED {dashboardData.summary.annualBudget.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-mbzuai-navy/10 bg-white p-6">
          <p className="text-sm text-mbzuai-navy/50">Annual Expenditure</p>
          <p className="mt-2 text-3xl font-semibold text-mbzuai-navy">
            AED {dashboardData.summary.annualExpenditure.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-mbzuai-navy/10 bg-white p-6">
          <p className="text-sm text-mbzuai-navy/50">Annual Remaining</p>
          <p className="mt-2 text-3xl font-semibold text-mbzuai-navy">
            AED {dashboardData.summary.annualRemaining.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-mbzuai-navy/10 bg-white p-6">
          <p className="text-sm text-mbzuai-navy/50">Budget Used</p>
          <p className="mt-2 text-3xl font-semibold text-mbzuai-navy">
            {dashboardData.summary.percentageSpent.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-mbzuai-navy">
          Current Month
        </h2>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-mbzuai-navy/10 bg-white p-6">
            <p className="text-sm text-mbzuai-navy/50">
              Monthly Planned
            </p>
            <p className="mt-2 text-3xl font-semibold text-mbzuai-navy">
              AED {dashboardData.summary.monthlyPlanned.toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-mbzuai-navy/10 bg-white p-6">
            <p className="text-sm text-mbzuai-navy/50">
              Monthly Actual
            </p>
            <p className="mt-2 text-3xl font-semibold text-mbzuai-navy">
              AED {dashboardData.summary.monthlyActual.toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-mbzuai-navy/10 bg-white p-6">
            <p className="text-sm text-mbzuai-navy/50">
              Monthly Variance
            </p>
            <p className="mt-2 text-3xl font-semibold text-mbzuai-navy">
              AED {dashboardData.summary.monthlyVariance.toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-mbzuai-navy/10 bg-white p-6">
            <p className="text-sm text-mbzuai-navy/50">
              Monthly Remaining
            </p>
            <p className="mt-2 text-3xl font-semibold text-mbzuai-navy">
              AED {dashboardData.summary.monthlyRemaining.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-mbzuai-navy/10 bg-white p-6">
        <h2 className="text-lg font-semibold text-mbzuai-navy">
          Spending by Category
        </h2>

        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboardData.spendingByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#173B70" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-mbzuai-navy/10 bg-white p-6">
        <h2 className="text-lg font-semibold text-mbzuai-navy">
          Spending by Purchase For
        </h2>

        <div className="mt-6 h-[700px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dashboardData.spendingByBudgetItem}
              layout="vertical"
              margin={{ left: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis type="number" />

              <YAxis
                type="category"
                dataKey="itemName"
                width={260}
                interval={0}
              />

              <Tooltip />

              <Bar dataKey="total" fill="#173B70" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-mbzuai-navy/10 bg-white p-6">
        <h2 className="text-lg font-semibold text-mbzuai-navy">
          Spending by Cardholder
        </h2>

        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboardData.spendingByCardholder}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cardholderName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#173B70" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </ManagerLayout>
  );
}