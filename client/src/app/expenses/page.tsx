"use client";

import React, { useMemo, useState } from "react";
import Header from "@/app/(components)/Header";
import { useGetTransactionsQuery } from '@/state/api';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Updated CATEGORY_COLORS with the new pink theme
const CATEGORY_COLORS = {
  LIFE_PRODUCTS: "#B10F56", // Pink color
  STATIONARY: "#181818", // Light gray as a variant of white
  PHOTOGRAPHY: "#ff4666", // Light pink
  PUBLICATIONS: "#FFD1DC", // Very light pink
  UNCATEGORIZED: "#FFB6C1", // Light pink shade for uncategorized items
};

const TransactionsPage = () => {
  type Category = "ALL" | "LIFE_PRODUCTS" | "STATIONARY" | "PHOTOGRAPHY" | "PUBLICATIONS";
  
  const [selectedCategory, setSelectedCategory] = useState<Category>("ALL");
  const [startDate, setStartDate] = useState("2024-03-01");
  const [endDate, setEndDate] = useState("2024-03-06");
  const [viewType, setViewType] = useState<"pie" | "bar">("pie");

  // Fetch transactions from the API using Redux Toolkit Query
  const { data: transactions = [], isLoading, error } = useGetTransactionsQuery({
    startDate,
    endDate,
    category: selectedCategory !== "ALL" ? selectedCategory : undefined,
  });

  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    if (selectedCategory === "ALL") {
      // Group by product categories
      const categoryTotals = transactions.reduce((acc: Record<string, number>, transaction) => {
        const category = transaction.productCategory || "UNCATEGORIZED";
        if (!acc[category]) acc[category] = 0;
        acc[category] += transaction.amount;
        return acc;
      }, {});

      // Format data for chart
      return Object.entries(categoryTotals).map(([category, total]) => ({
        name: category.replace(/_/g, " "),
        value: Math.abs(total),
        color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.UNCATEGORIZED,
      }));
    } else {
      // Group by products within the selected category
      const productTotals = transactions.reduce((acc: Record<string, number>, transaction) => {
        const productId = transaction.productId;
        if (productId) {
          if (!acc[productId]) acc[productId] = 0;
          acc[productId] += transaction.amount;
        }
        return acc;
      }, {});

      // Format data for chart
      return Object.entries(productTotals).map(([productId, total]) => {
        const product = transactions.find((t) => t.productId === productId)?.product;
        const productName = product ? product.name : "Unknown Product";

        return {
          name: productName,
          value: Math.abs(total),
          color: CATEGORY_COLORS[selectedCategory as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.UNCATEGORIZED,
        };
      });
    }
  }, [transactions, selectedCategory]);

  // Filter transactions for the table
  const filteredTransactionsForTable = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.timestamp);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      return (
        transactionDate >= start &&
        transactionDate <= end &&
        (selectedCategory === "ALL" || transaction.productCategory === selectedCategory)
      );
    });
  }, [transactions, selectedCategory, startDate, endDate]);

  if (isLoading) return <div>Loading transactions...</div>;
  if (error) return <div>Error loading transactions</div>;

  return (
    <div style={{ backgroundColor: "#F5F5F5", color: "#B10F56", padding: "20px", fontFamily: "'Roboto', sans-serif" }}>
      <Header name="" title="Transactions Dashboard" />

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        {/* Input Controls */}
        <div style={{ flex: "1", marginRight: "20px" }}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ padding: "10px", border: "1px solid #B10F56", borderRadius: "5px", width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ padding: "10px", border: "1px solid #B10F56", borderRadius: "5px", width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Category)}
              style={{ padding: "10px", border: "1px solid #B10F56", borderRadius: "5px", width: "100%" }}
            >
              <option value="ALL">All Categories</option>
              <option value="LIFE_PRODUCTS">Life Products</option>
              <option value="STATIONARY">Stationary</option>
              <option value="PHOTOGRAPHY">Photography</option>
              <option value="PUBLICATIONS">Publications</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>View Type:</label>
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value as "pie" | "bar")}
              style={{ padding: "10px", border: "1px solid #B10F56", borderRadius: "5px", width: "100%" }}
            >
              <option value="pie">Pie Chart</option>
              <option value="bar">Bar Chart</option>
            </select>
          </div>
        </div>

        {/* Chart Section */}
        <div style={{ flex: "2" }}>
          {viewType === "pie" ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#B10F56" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Render Transaction Table */}
      <div>
        <h3 style={{ marginBottom: "10px" }}>Transactions Table</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #B10F56" }}>
          <thead style={{ backgroundColor: "#FFD1DC" }}>
            <tr>
              <th style={{ padding: "10px", border: "1px solid #B10F56" }}>Transaction ID</th>
              <th style={{ padding: "10px", border: "1px solid #B10F56" }}>Product</th>
              <th style={{ padding: "10px", border: "1px solid #B10F56" }}>Category</th>
              <th style={{ padding: "10px", border: "1px solid #B10F56" }}>Amount</th>
              <th style={{ padding: "10px", border: "1px solid #B10F56" }}>Date</th>
              <th style={{ padding: "10px", border: "1px solid #B10F56" }}>Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactionsForTable.map((transaction) => (
              <tr key={transaction.transactionId}>
                <td style={{ padding: "10px", border: "1px solid #B10F56" }}>{transaction.transactionId}</td>
                <td style={{ padding: "10px", border: "1px solid #B10F56" }}>{transaction.product?.name || "Unknown Product"}</td>
                <td style={{ padding: "10px", border: "1px solid #B10F56" }}>{transaction.productCategory?.replace(/_/g, " ") || "Uncategorized"}</td>
                <td style={{ padding: "10px", border: "1px solid #B10F56" }}>{transaction.amount}</td>
                <td style={{ padding: "10px", border: "1px solid #B10F56" }}>{new Date(transaction.timestamp).toLocaleDateString()}</td>
                <td style={{ padding: "10px", border: "1px solid #B10F56" }}>{transaction.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage;
