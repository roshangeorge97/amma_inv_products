// controllers/paymentController.ts
import { Request, Response } from "express";
import { PrismaClient, ProductCategory } from "@prisma/client";

const prisma = new PrismaClient();

interface PaymentUpdateBody {
  productId: string;
  quantity: number;
  totalAmount: number;
  isSingleSided?: boolean;
}

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await prisma.baseProduct.findMany({
      where: {
        stockQuantity: {
          gt: 0
        }
      },
      include: {
        LifeProduct: true,
        StationaryProduct: true,
        PhotographyService: true,
        Publication: true,
      }
    });
    
    res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const updatePayment = async (
  req: Request<{}, {}, PaymentUpdateBody>,
  res: Response
): Promise<void> => {
  try {
    const { productId, quantity, totalAmount, isSingleSided } = req.body;

    await prisma.$transaction(async (tx) => {
      // Update product stock
      const updatedProduct = await tx.baseProduct.update({
        where: { productId },
        data: {
          stockQuantity: {
            decrement: quantity,
          },
        },
        include: {
          LifeProduct: true,
          StationaryProduct: true,
          PhotographyService: true,
          Publication: true,
        },
      });

      // Determine the unit price based on the product type
      let unitPrice = 0;
      if (updatedProduct.LifeProduct?.[0]) {
        unitPrice = updatedProduct.LifeProduct[0].price;
      } else if (updatedProduct.StationaryProduct?.[0]) {
        unitPrice = updatedProduct.StationaryProduct[0].price;
      } else if (updatedProduct.PhotographyService?.[0]) {
        unitPrice = isSingleSided
          ? updatedProduct.PhotographyService[0].singleSidePrice
          : updatedProduct.PhotographyService[0].doubleSidePrice;
      } else if (updatedProduct.Publication?.[0]) {
        unitPrice = updatedProduct.Publication[0].price;
      }

      // Create sales record
      const saleRecord = await tx.sales.create({
        data: {
          saleId: `SALE_${Date.now()}`,
          productId,
          quantity,
          unitPrice,
          totalAmount,
          timestamp: new Date(),
          isSingleSided:
            updatedProduct.category === ProductCategory.PHOTOGRAPHY ? isSingleSided : null,
        },
      });

      // Create transaction record for the payment
      await tx.transaction.create({
        data: {
          transactionId: `TRANS_${Date.now()}`,
          productId: updatedProduct.productId,
          productCategory: updatedProduct.category,
          amount: totalAmount,
          quantity: quantity,
          description: `Sale of ${quantity} units of product ${productId}`,
          timestamp: new Date(),
          type: 'INCOME',
        },
      });
    });

    res.status(200).json({ message: "Payment updated successfully" });
  } catch (error) {
    console.error("Payment update error:", error);
    res.status(500).json({ message: "Error updating payment" });
  }
};