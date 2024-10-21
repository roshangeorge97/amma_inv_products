import { Request, Response } from "express";
import { PrismaClient, ProductCategory } from "@prisma/client";

const prisma = new PrismaClient();
export const getCategoryMetrics = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { category } = req.params;

  // Ensure the category is valid
  if (!Object.values(ProductCategory).includes(category as ProductCategory)) {
    res.status(400).json({ message: "Invalid product category" });
    return;
  }

  try {
    // Fetch products from the specified category
    const products = await prisma.baseProduct.findMany({
      where: { category: category as ProductCategory },
      take: 5,
      orderBy: {
        stockQuantity: "desc",
      },
      include: {
        LifeProduct: true,
        StationaryProduct: true,
        PhotographyService: true,
        Publication: true,
      },
    });

    // Return the products with their prices calculated
    res.json({
      category,
      products: products.map((product) => ({
        ...product,
        price: getProductPrice(product),
      })),
    });
  } catch (error) {
    console.error("Error fetching category metrics:", error);
    res.status(500).json({ message: "Error retrieving category metrics" });
  }
};

// function getProductPrice(product: any): number | { single: number; double: number } {
//   if (product.LifeProduct) return product.LifeProduct.price;
//   if (product.StationaryProduct) return product.StationaryProduct.price;
//   if (product.PhotographyService)
//     return {
//       single: product.PhotographyService.singleSidePrice,
//       double: product.PhotographyService.doubleSidePrice,
//     };
//   if (product.Publication) return product.Publication.price;
//   return 0;
// }

export const getDashboardMetrics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get popular products by category
    const popularProducts = await Promise.all(
      Object.values(ProductCategory).map(async (category) => {
        const products = await prisma.baseProduct.findMany({
          take: 5,
          where: {
            category,
          },
          orderBy: {
            stockQuantity: "desc",
          },
          include: {
            LifeProduct: true,
            StationaryProduct: true,
            PhotographyService: true,
            Publication: true,
          },
        });
        return {
          category,
          products: products.map((product) => ({
            ...product,
            price: getProductPrice(product),
          })),
        };
      })
    );

    const salesSummary = await prisma.salesSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });

    const purchaseSummary = await prisma.purchaseSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });

    // const expenseSummary = await prisma.expenseSummary.findMany({
    //   take: 5,
    //   orderBy: {
    //     date: "desc",
    //   },
    //   include: {
    //     ExpenseByCategory: true,
    //   },
    // });

    // const expenseByCategorySummary = await prisma.expenseByCategory.findMany({
    //   take: 5,
    //   orderBy: {
    //     date: "desc",
    //   },
    // });

    res.json({
      popularProducts,
      salesSummary,
      purchaseSummary,
      // expenseSummary,
      // expenseByCategorySummary: expenseByCategorySummary.map((item) => ({
      //   ...item,
      //   amount: item.amount.toString(),
      // })),
    });
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    res.status(500).json({ message: "Error retrieving dashboard metrics" });
  }
};

function getProductPrice(product: any): number | { single: number; double: number } {
  if (product.LifeProduct) return product.LifeProduct.price;
  if (product.StationaryProduct) return product.StationaryProduct.price;
  if (product.PhotographyService) 
    return {
      single: product.PhotographyService.singleSidePrice,
      double: product.PhotographyService.doubleSidePrice,
    };
  if (product.Publication) return product.Publication.price;
  return 0;
}