// routes/paymentRoutes.ts
import { Router } from "express";
import { getProducts, updatePayment } from "../controllers/paymentController";

const router = Router();

router.get("/products", getProducts as any);  // Type assertion to fix router type error
router.post("/update", updatePayment as any); // Type assertion to fix router type error

export default router;