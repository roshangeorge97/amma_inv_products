import { Router } from "express";
import { getDashboardMetrics, getCategoryMetrics } from "../controllers/dashboardController";

const router = Router();

// Main dashboard metrics
router.get("/", getDashboardMetrics);

// Get metrics for a specific category
router.get("/category/:category", getCategoryMetrics); 

export default router;
