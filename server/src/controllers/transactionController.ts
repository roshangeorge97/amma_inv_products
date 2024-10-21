// transactionController.ts
import { Request, Response } from "express";
import { PrismaClient, ProductCategory } from "@prisma/client";

const prisma = new PrismaClient();

export const getTransactionSummary = async (
  req: Request,
  res: Response
) => {
  try {
    const { startDate, endDate, category, type } = req.query;

    // Build where clause for filtering
    const whereClause: any = {};
    if (startDate && endDate) {
      whereClause.timestamp = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }
    if (category) {
      whereClause.productCategory = category as ProductCategory;
    }
    if (type) {
      whereClause.type = type;
    }

    // Get all transactions based on filters
    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        product: true,
      },
    });

    // Calculate summary
    const summary = transactions.reduce(
      (acc, curr) => {
        const amount = curr.amount;
        if (curr.type === 'INCOME') {
          acc.totalIncome += amount;
        } else {
          acc.totalExpense += Math.abs(amount);
        }

        // Category breakdown - use productCategory instead of category
        const category = curr.productCategory || 'UNCATEGORIZED';
        if (!acc.categoryBreakdown[category]) {
          acc.categoryBreakdown[category] = { income: 0, expense: 0 };
        }
        
        if (curr.type === 'INCOME') {
          acc.categoryBreakdown[category].income += amount;
        } else {
          acc.categoryBreakdown[category].expense += Math.abs(amount);
        }

        return acc;
      },
      {
        totalIncome: 0,
        totalExpense: 0,
        netAmount: 0,
        categoryBreakdown: {} as Record<string, { income: number; expense: number }>,
      }
    );

    summary.netAmount = summary.totalIncome - summary.totalExpense;

    res.json(summary);
  } catch (error) {
    console.error("Error in getTransactionSummary:", error);
    res.status(500).json({ message: "Error retrieving transaction summary" });
  }
};

export const getTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { startDate, endDate, category, type } = req.query;

    // Build where clause for filtering
    const whereClause: any = {};
    if (startDate && endDate) {
      whereClause.timestamp = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }
    if (category) {
      whereClause.productCategory = category as ProductCategory;
    }
    if (type) {
      whereClause.type = type;
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        product: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    res.json(transactions);
  } catch (error) {
    console.error("Error in getTransactions:", error);
    res.status(500).json({ message: "Error retrieving transactions" });
  }
};