// controllers/productController.ts
import { Request, Response } from "express";
import { PrismaClient, ProductCategory } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.baseProduct.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      include: {
        LifeProduct: true,
        StationaryProduct: true,
        PhotographyService: true,
        Publication: true,
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      productId,
      name,
      category,
      stockQuantity,
      rating,
      // Category-specific fields
      price,
      type,
      manufacturer,
      expiryDate,
      singleSidePrice,
      doubleSidePrice,
      serviceType,
      author,
      publisher,
      isbn,
    } = req.body;

    // Create base product
    const baseProduct = await prisma.baseProduct.create({
      data: {
        productId,
        name,
        category,
        stockQuantity,
        rating,
      },
    });

    // Create category-specific product
    switch (category) {
      case ProductCategory.LIFE_PRODUCTS:
        await prisma.lifeProduct.create({
          data: {
            productId,
            price,
            type,
            manufacturer,
            expiryDate: expiryDate ? new Date(expiryDate) : null,
          },
        });
        break;

      case ProductCategory.STATIONARY:
        await prisma.stationaryProduct.create({
          data: {
            productId,
            price,
            type,
          },
        });
        break;

      case ProductCategory.PHOTOGRAPHY:
        await prisma.photographyService.create({
          data: {
            productId,
            singleSidePrice: singleSidePrice || 3.0,
            doubleSidePrice: doubleSidePrice || 2.0,
            serviceType,
          },
        });
        break;

      case ProductCategory.PUBLICATIONS:
        await prisma.publication.create({
          data: {
            productId,
            price,
            author,
            publisher,
            isbn,
          },
        });
        break;
    }

    res.status(201).json(baseProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product" });
  }
};
