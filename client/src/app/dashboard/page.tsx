"use client";

import { useEffect, useState, useMemo } from 'react';
import {
  CheckCircle, Package, Tag, TrendingDown, TrendingUp, Box,
  BookOpen, Camera, Sandwich
} from "lucide-react";
import CardPopularProducts from "./CardPopularProducts";
import StatCard from "./StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetDashboardMetricsQuery,
  useGetExpensesByCategoryQuery,
  useGetProductsQuery,
  useGetTransactionsQuery,
} from '@/state/api';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const categoryIcons = {
  LIFE_PRODUCTS: Sandwich,
  STATIONARY: Box,
  PHOTOGRAPHY: Camera,
  PUBLICATIONS: BookOpen,
};

const getPrice = (product: { LifeProduct: { price: any; }[]; StationaryProduct: { price: any; }[]; Publication: { price: any; }[]; }) => {
  if (product.LifeProduct?.[0]) return `Rs.${product.LifeProduct[0].price}`;
  if (product.StationaryProduct?.[0]) return `Rs.${product.StationaryProduct[0].price}`;
  if (product.Publication?.[0]) return `Rs.${product.Publication[0].price}`;
  return "N/A";
};

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
  const { data: metrics, isLoading: isMetricsLoading, isError: isMetricsError } = useGetDashboardMetricsQuery();
  const { data: transactions = [], isLoading: isTransactionsLoading, error: transactionsError } = useGetTransactionsQuery();

  // Grouping transactions for the bar chart similar to CardTransactionSummary
  const groupedTransactionData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

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

  if (isMetricsLoading || isTransactionsLoading) {
    return <div className="flex items-center justify-center h-screen text-[#B10F56]">Loading...</div>;
  }

  if (isMetricsError || transactionsError) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error loading data</div>;
  }

  return (
    <div className="p-4 bg-white">
      <Tabs defaultValue="ALL" className="w-full space-y-4" onValueChange={setSelectedCategory}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#B10F56]">Dashboard Overview</h1>
        </div>

        <TabsContent value="ALL">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-min">
            <div className="lg:col-span-1">
              <CardPopularProducts 
                products={metrics?.popularProducts?.flatMap(p => p.products) || []}
                category="ALL"
                getPrice={getPrice}
                className="h-full border-[#B10F56]/20 hover:border-[#B10F56]/50 transition-colors"
              />
            </div>
            <div className="lg:col-span-1 space-y-4">
              {/* Transaction Summary Chart */}
              <div className="bg-white shadow-md rounded-2xl flex flex-col justify-between border border-[#B10F56]/20">
                <div>
                  <h2 className="text-lg font-semibold mb-2 px-7 pt-5 text-[#B10F56]">Transaction Summary</h2>
                  <hr className="border-[#B10F56]/10" />
                </div>
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
                <ResponsiveContainer width="100%" height={350} className="px-7">
                  <BarChart data={groupedTransactionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#B10F56" opacity={0.1} />
                    <XAxis dataKey="date" tick={{ fill: '#B10F56' }} axisLine={{ stroke: '#B10F56', opacity: 0.2 }} />
                    <YAxis tick={{ fill: '#B10F56' }} axisLine={{ stroke: '#B10F56', opacity: 0.2 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: '1px solid rgba(177, 15, 86, 0.2)',
                        borderRadius: '8px',
                        color: '#B10F56'
                      }}
                    />
                    <Bar dataKey="amount" fill="#B10F56" barSize={10} radius={[10, 10, 0, 0]} opacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div> 
        </TabsContent>

        {Object.entries(categoryIcons).map(([category, Icon]) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-min">
              <div className="lg:col-span-1">
                <CardPopularProducts 
                  products={metrics?.popularProducts?.find(p => p.category === category)?.products || []}
                  category={category}
                  getPrice={getPrice}
                  className="h-full border-[#B10F56]/20 hover:border-[#B10F56]/50 transition-colors"
                />
              </div>
              <div className="lg:col-span-1 space-y-4">
                {/* Reuse the same transaction summary chart */}
                <div className="bg-white shadow-md rounded-2xl flex flex-col justify-between border border-[#B10F56]/20">
                  <h2 className="text-lg font-semibold mb-2 px-7 pt-5 text-[#B10F56]">Transaction Summary</h2>
                  {/* Transaction chart as per selected category can be placed here if needed */}
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Dashboard;
