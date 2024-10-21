"use client";

import { useEffect, useState } from 'react';
import {
  CheckCircle, Package, Tag, TrendingDown, TrendingUp, Box,
  BookOpen, Camera, Sandwich
} from "lucide-react";
import CardPopularProducts from "./CardPopularProducts";
import CardSalesSummary from "./CardSalesSummary";
import StatCard from "./StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetDashboardMetricsQuery,
  useGetExpensesByCategoryQuery,
  useGetProductsQuery,
} from '@/state/api';

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
  const { data: metrics, isLoading, isError } = useGetDashboardMetricsQuery();

  if (isLoading) return <div className="flex items-center justify-center h-screen text-[#B10F56]">Loading...</div>;
  if (isError) return <div className="flex items-center justify-center h-screen text-red-500">Error loading dashboard metrics</div>;

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
                // products={metrics?.popularProducts || []} 
                // getPrice={getPrice}
                // className="h-full border-[#B10F56]/20 hover:border-[#B10F56]/50 transition-colors"
              />
            </div>
            <div className="lg:col-span-1 space-y-4">
              <CardSalesSummary 
                // data={metrics?.salesSummary || []}
                // className="h-full border-[#B10F56]/20 hover:border-[#B10F56]/50 transition-colors" 
              />
            </div>
          </div> 
        </TabsContent>

        {Object.entries(categoryIcons).map(([category, Icon]) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-min">
              <div className="lg:col-span-1">
                <CardPopularProducts 
                  // products={metrics?.popularProducts?.find(p => p.category === category)?.products || []}
                  // category={category}
                  // getPrice={getPrice}
                  // className="h-full border-[#B10F56]/20 hover:border-[#B10F56]/50 transition-colors"
                />
              </div>
              <div className="lg:col-span-1 space-y-4">
                <CardSalesSummary 
                  // data={metrics?.salesSummary || []}
                  // category={category}
                  // className="h-full border-[#B10F56]/20 hover:border-[#B10F56]/50 transition-colors"
                />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Dashboard;
