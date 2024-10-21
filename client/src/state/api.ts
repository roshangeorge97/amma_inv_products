import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
  Publication: any;
  PhotographyService: any;
  StationaryProduct: any;
  LifeProduct: any;
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

export interface UpdateStockRequest {
  productId: string;
  stockQuantity: number;
}

export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

export interface DashboardProduct {
  productId: string;
  name: string;
  price: number | { single: number; double: number };
  rating: number | null;
  stockQuantity: number;
  category: string;
}

export interface CategoryProducts {
  category: string;
  products: DashboardProduct[];
}

export interface SalesSummary {
  salesSummaryId: string;
  totalValue: number;
  changePercentage?: number;
  date: string;
}

export interface PurchaseSummary {
  purchaseSummaryId: string;
  totalPurchased: number;
  changePercentage?: number;
  date: string;
}

export interface ExpenseSummary {
  expenseSummaryId: string;
  totalExpenses: number;
  date: string;
}

export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}

export interface DashboardMetrics {
  popularProducts: CategoryProducts[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

export interface User {
  userId: string;
  name: string;
  email: string;
}

export interface UpdatePaymentRequest {
  productId: string;
  quantity: number;
  totalAmount: number;
}

export interface UpdatePaymentResponse {
  message: string;
}
export interface Transaction {
  transactionId: string;
  productId?: string;
  productCategory?: 'LIFE_PRODUCTS' | 'STATIONARY' | 'PHOTOGRAPHY' | 'PUBLICATIONS';
  amount: number;
  quantity: number;
  description?: string;
  timestamp: string;
  type: 'INCOME' | 'EXPENSE';
  product?: {
    productId: string;
    name: string;
    category: 'LIFE_PRODUCTS' | 'STATIONARY' | 'PHOTOGRAPHY' | 'PUBLICATIONS';
    stockQuantity: number;
    rating?: number;
  };
}

// Update the category colors object in the TransactionsPage component
const CATEGORY_COLORS = {
  LIFE_PRODUCTS: "#FF6B6B",
  STATIONARY: "#4ECDC4",
  PHOTOGRAPHY: "#45B7D1",
  PUBLICATIONS: "#96CEB4",
  UNCATEGORIZED: "#C06C84",
};

// Updated TransactionQueryParams interface
export interface TransactionQueryParams {
  startDate?: string;
  endDate?: string;
  category?: 'LIFE_PRODUCTS' | 'STATIONARY' | 'PHOTOGRAPHY' | 'PUBLICATIONS';
  type?: 'INCOME' | 'EXPENSE';
}

export interface ExpenseQueryParams {
  startDate?: string;
  endDate?: string;
  category?: string;
}

export interface TransactionSummary {
  summaryId: string;
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  date: string;
  categoryBreakdown?: {
    [key: string]: {
      income: number;
      expense: number;
    };
  };
}

export interface TransactionQueryParams {
  startDate?: string;
  endDate?: string;
  category?: 'LIFE_PRODUCTS' | 'STATIONARY' | 'PHOTOGRAPHY' | 'PUBLICATIONS';
  type?: 'INCOME' | 'EXPENSE';
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Products", "Users", "Expenses","Transactions"],
  endpoints: (build) => ({
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),
    getCategoryMetrics: build.query<CategoryProducts, string>({
      query: (category) => `/dashboard/category/${category}`,
      providesTags: ["DashboardMetrics"],
    }),
    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),
    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    getUsers: build.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    getAvailableProducts: build.query<Product[], void>({
      query: () => "/payments/products",
      providesTags: ["Products"],
    }),
    updatePayment: build.mutation<UpdatePaymentResponse, UpdatePaymentRequest>({
      query: (payment) => ({
        url: "/payments/update",
        method: "POST",
        body: payment,
      }),
      invalidatesTags: ["Products", "DashboardMetrics", "Expenses"],
    }),
    updateProductStock: build.mutation<void, UpdateStockRequest>({
      query: ({ productId, stockQuantity }) => ({
        url: `/products/${productId}/stock`,
        method: "PATCH",
        body: { stockQuantity },
      }),
      invalidatesTags: ["Products", "DashboardMetrics"],
    }),
    getExpensesByCategory: build.query<ExpenseByCategorySummary[], ExpenseQueryParams | void>({
      query: (params) => ({
        url: "/expenses",
        params: params || {},
      }),
      providesTags: ["Expenses"],
    }),
    getTransactions: build.query<Transaction[], TransactionQueryParams | void>({
      query: (params) => ({
        url: "/transactions",
        params: params || undefined,
      }),
      providesTags: ["Transactions"],
    }),

    getTransactionSummary: build.query<TransactionSummary, TransactionQueryParams | void>({
      query: (params) => ({
        url: "/transactions/summary",
        params: params || undefined,
      }),
      providesTags: ["Transactions"],
    }),

    addTransaction: build.mutation<Transaction, Omit<Transaction, 'transactionId'>>({
      query: (transaction) => ({
        url: "/transactions",
        method: "POST",
        body: transaction,
      }),
      invalidatesTags: ["Transactions", "DashboardMetrics"],
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetCategoryMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useGetUsersQuery,
  useGetAvailableProductsQuery,
  useUpdatePaymentMutation,
  useUpdateProductStockMutation,
  useGetExpensesByCategoryQuery,
  useGetTransactionsQuery,
  useGetTransactionSummaryQuery,
  useAddTransactionMutation,
} = api;
