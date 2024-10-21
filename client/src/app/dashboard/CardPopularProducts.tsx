import { useGetDashboardMetricsQuery, useGetCategoryMetricsQuery, DashboardProduct } from "@/state/api";
import { ShoppingBag, BookOpen, Box, Sandwich } from "lucide-react";
import React from "react";
import Rating from "../(components)/Rating";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categoryIcons = {
  LIFE_PRODUCTS: Sandwich,
  STATIONARY: Box,
  PUBLICATIONS: BookOpen,
};

const formatPrice = (product: { LifeProduct: { price: any; }[]; StationaryProduct: { price: any; }[]; PhotographyService: {
  singleSidePrice: any; doubleSidePrice: any; 
}[]; Publication: { price: any; }[]; }) => {
  if (product.LifeProduct?.[0]) {
    return `₹${product.LifeProduct[0].price}`;
  } else if (product.StationaryProduct?.[0]) {
    return `₹${product.StationaryProduct[0].price}`;
  } else if (product.PhotographyService?.[0]) {
    return `Single: ₹${product.PhotographyService[0].singleSidePrice} | Double: ₹${product.PhotographyService[0].doubleSidePrice}`;
  } else if (product.Publication?.[0]) {
    return `₹${product.Publication[0].price}`;
  }
  return 'Price Not Available';
};

const ProductCard = ({ product }: { product: any }) => (
  <div className="flex items-center justify-between gap-3 px-5 py-7 border-b border-[#B10F56]/10 hover:bg-[#B10F56]/5 transition-colors">
    <div className="flex items-center gap-3">
      <Image
        src="/logo.png"
        alt={product.name || "Product Image"}
        width={48}
        height={48}
        className="rounded-lg w-14 h-14"
      />
      <div className="flex flex-col justify-between gap-1">
        <div className="font-bold text-[#B10F56]">
          {product.name || "Unnamed Product"}
        </div>
        <div className="flex text-sm items-center">
          <span className="font-bold text-[#B10F56] text-xs">
            {formatPrice(product)}
          </span>
          <span className="mx-2 text-[#B10F56]/60">|</span>
          <Rating rating={product.rating || 0} />
        </div>
      </div>
    </div>

    <div className="text-xs flex items-center text-[#B10F56]">
      <button className="p-2 rounded-full bg-[#B10F56]/10 text-[#B10F56] mr-2 hover:bg-[#B10F56]/20 transition-colors">
        {getCategoryIcon(product.category)}
      </button>
      {product.stockQuantity ? `${Math.round(product.stockQuantity / 1000)}k Sold` : "Out of Stock"}
    </div>
  </div>
);


const getCategoryIcon = (category: string) => {
  const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
  return IconComponent ? <IconComponent className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />;
};

interface CardPopularProductsProps {
  products: DashboardProduct[];
  category: string;
  getPrice: (product: {
    LifeProduct: { price: any }[];
    StationaryProduct: { price: any }[];
    Publication: { price: any }[];
    PhotographyService?: { singleSidePrice: any; doubleSidePrice: any }[];
  }) => string;
  className: string;
}


const CardPopularProducts: React.FC<CardPopularProductsProps> = ({ products, category, getPrice, className }) => {
  return (
    <div className={`row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16 border border-[#B10F56]/20 ${className}`}>
      <div className="px-7 pt-5 pb-2">
        <h3 className="text-lg font-semibold mb-4 text-[#B10F56]">Popular Products - {category}</h3>
        <Tabs defaultValue="ALL" className="w-full">
          <TabsList className="mb-4 bg-[#B10F56]/10">
            <TabsTrigger 
              value="ALL" 
              className="data-[state=active]:bg-[#B10F56] data-[state=active]:text-white text-[#B10F56]"
            >
              All
            </TabsTrigger>
            {Object.keys(categoryIcons).map((cat) => (
              <TabsTrigger 
                key={cat} 
                value={cat}
                className="data-[state=active]:bg-[#B10F56] data-[state=active]:text-white text-[#B10F56]"
              >
                {cat.replace('_', ' ')}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="ALL">
            <div className="overflow-auto h-full">
              {products.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          </TabsContent>

          {Object.keys(categoryIcons).map((cat) => (
            <TabsContent key={cat} value={cat}>
              <div className="overflow-auto h-full">
                {products
                  .filter(product => product.category === cat)
                  .map((product) => (
                    <ProductCard key={product.productId} product={product} />
                  )) || (
                    <div className="text-center text-[#B10F56]/60 py-4">
                      No products found in this category
                    </div>
                  )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default CardPopularProducts;
