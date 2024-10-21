// controllers/stockController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { stockQuantity } = req.body;

    if (stockQuantity < 0) {
      res.status(400).json({ error: "Stock quantity cannot be negative" });
      return;
    }

    const updatedProduct = await prisma.baseProduct.update({
      where: { productId: productId },
      data: { stockQuantity: stockQuantity },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product stock:", error);
    res.status(500).json({ error: "Failed to update product stock" });
  }
};
