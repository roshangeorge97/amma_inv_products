import { PrismaClient, ProductCategory, TransactionType } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

async function deleteAllData() {
  // Delete in reverse order of dependencies
  await prisma.sales.deleteMany({});
  await prisma.purchases.deleteMany({});
  await prisma.lifeProduct.deleteMany({});
  await prisma.stationaryProduct.deleteMany({});
  await prisma.photographyService.deleteMany({});
  await prisma.publication.deleteMany({});
  await prisma.baseProduct.deleteMany({});
  await prisma.transactionSummary.deleteMany({});
  await prisma.salesSummary.deleteMany({});
  await prisma.purchaseSummary.deleteMany({});
  await prisma.transaction.deleteMany({});
  // await prisma.users.deleteMany({});
  
  console.log('All data cleared');
}

async function createProduct(productData: any) {
  // First create the base product
  const baseProduct = await prisma.baseProduct.create({
    data: {
      productId: productData.productId,
      name: productData.name,
      category: productData.category as ProductCategory,
      stockQuantity: productData.stockQuantity,
      rating: productData.rating
    }
  });

  // Then create the specific product type based on category
  switch (productData.category) {
    case 'LIFE_PRODUCTS':
      await prisma.lifeProduct.create({
        data: {
          productId: productData.productId,
          price: productData.price,
          type: productData.type,
          manufacturer: productData.manufacturer,
          expiryDate: productData.expiryDate ? new Date(productData.expiryDate) : null
        }
      });
      break;
    case 'STATIONARY':
      await prisma.stationaryProduct.create({
        data: {
          productId: productData.productId,
          price: productData.price,
          type: productData.type
        }
      });
      break;
    case 'PHOTOGRAPHY':
      await prisma.photographyService.create({
        data: {
          productId: productData.productId,
          singleSidePrice: productData.singleSidePrice,
          doubleSidePrice: productData.doubleSidePrice,
          serviceType: productData.serviceType
        }
      });
      break;
    case 'PUBLICATIONS':
      await prisma.publication.create({
        data: {
          productId: productData.productId,
          price: productData.price,
          author: productData.author,
          publisher: productData.publisher,
          isbn: productData.isbn
        }
      });
      break;
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  // Clear all existing data
  await deleteAllData();

  // Order matters! Products must be created before sales/purchases/transactions
  const seedingOrder = [
    { file: "products.json", handler: createProduct },
    // { 
    //   file: "users.json", 
    //   handler: async (data: any) => await prisma.users.create({ data }) 
    // },
    { 
      file: "sales.json", 
      handler: async (data: any) => await prisma.sales.create({ data: {
        ...data,
        timestamp: new Date(data.timestamp)
      }}) 
    },
    { 
      file: "purchases.json", 
      handler: async (data: any) => await prisma.purchases.create({ data: {
        ...data,
        timestamp: new Date(data.timestamp)
      }}) 
    },
    { 
      file: "transactions.json", 
      handler: async (data: any) => await prisma.transaction.create({ data: {
        ...data,
        timestamp: new Date(data.timestamp),
        type: data.type as TransactionType,
        productCategory: data.productCategory as ProductCategory || null
      }}) 
    },
    { 
      file: "salesSummary.json", 
      handler: async (data: any) => await prisma.salesSummary.create({ data: {
        ...data,
        date: new Date(data.date)
      }}) 
    },
    { 
      file: "purchaseSummary.json", 
      handler: async (data: any) => await prisma.purchaseSummary.create({ data: {
        ...data,
        date: new Date(data.date)
      }}) 
    },
    { 
      file: "transactionSummary.json", 
      handler: async (data: any) => await prisma.transactionSummary.create({ data: {
        ...data,
        date: new Date(data.date)
      }}) 
    }
  ];

  for (const { file, handler } of seedingOrder) {
    const filePath = path.join(dataDirectory, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${file} - file not found`);
      continue;
    }

    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    console.log(`Seeding data from ${file}...`);
    
    for (const data of jsonData) {
      try {
        await handler(data);
      } catch (error) {
        console.error(`Error while processing ${file}:`, error);
        throw error; // Re-throw to stop the seeding process
      }
    }
    
    console.log(`Successfully seeded data from ${file}`);
  }
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });