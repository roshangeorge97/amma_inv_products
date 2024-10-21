import { Router } from "express";
import { createProduct, getProducts } from "../controllers/productController";
import { updateStock } from "../controllers/stockController";

const router = Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.patch("/:productId/stock", updateStock);

export default router;