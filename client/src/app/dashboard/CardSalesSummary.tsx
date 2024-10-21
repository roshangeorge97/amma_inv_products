"use client";

import React, { useMemo, useState } from "react";
import { useGetTransactionsQuery } from "@/state/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const CardTransactionSummary = () => {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
  const [startDate, setStartDate] = useState("2024-03-01");
  const [endDate, setEndDate] = useState("2024-03-06");

  const { data: transactions = [], isLoading, error } = useGetTransactionsQuery({
    startDate,
    endDate,
  });

  const groupedTransactionData = useMemo(() => {
    if (!transactions.length) return [];

    const transactionGroups: Record<string, number> = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.timestamp);
      let key = "";

      switch (timeframe) {
        case "daily":
          key = date.toLocaleDateString("en-US");
          break;
        case "weekly":
          const startOfWeek = new Date(date);
          startOfWeek.setDate(date.getDate() - date.getDay());
          key = startOfWeek.toLocaleDateString("en-US");
          break;
        case "monthly":
          key = `${date.getMonth() + 1}/${date.getFullYear()}`;
          break;
        case "yearly":
          key = `${date.getFullYear()}`;
          break;
      }

      if (!transactionGroups[key]) {
        transactionGroups[key] = 0;
      }
      transactionGroups[key] += transaction.amount;
    });

    return Object.entries(transactionGroups).map(([key, total]) => ({
      date: key,
      amount: total,
    }));
  }, [transactions, timeframe]);

  if (isLoading) return <div className="text-[#B10F56]">Loading transactions...</div>;
  if (error) return <div className="text-red-500">Error loading transactions</div>;

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl flex flex-col justify-between border border-[#B10F56]/20">
      <div>
        <h2 className="text-lg font-semibold mb-2 px-7 pt-5 text-[#B10F56]">
          Transaction Summary
        </h2>
        <hr className="border-[#B10F56]/10" />
      </div>

      {/* Timeframe Selection */}
      <div className="flex justify-between items-center mb-6 px-7 mt-5">
        <div className="text-lg font-medium">
          <p className="text-xs text-[#B10F56]/60">Total Transactions</p>
          <span className="text-2xl font-extrabold text-[#B10F56]">
            ₹{groupedTransactionData.reduce((acc, item) => acc + item.amount, 0).toLocaleString("en")}
          </span>
        </div>
        <select
          className="shadow-sm border border-[#B10F56]/20 bg-white p-2 rounded text-[#B10F56] 
                     focus:outline-none focus:ring-2 focus:ring-[#B10F56]/20 focus:border-[#B10F56]
                     hover:border-[#B10F56]/40 transition-colors"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as "daily" | "weekly" | "monthly" | "yearly")}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={350} className="px-7">
        <BarChart data={groupedTransactionData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#B10F56" opacity={0.1} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#B10F56' }} 
            axisLine={{ stroke: '#B10F56', opacity: 0.2 }}
          />
          <YAxis 
            tick={{ fill: '#B10F56' }}
            axisLine={{ stroke: '#B10F56', opacity: 0.2 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid rgba(177, 15, 86, 0.2)',
              borderRadius: '8px',
              color: '#B10F56'
            }}
          />
          <Bar 
            dataKey="amount" 
            fill="#B10F56" 
            barSize={10} 
            radius={[10, 10, 0, 0]}
            opacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CardTransactionSummary;