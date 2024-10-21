import { Router } from "express";
import { getTransactionSummary, getTransactions } from "../controllers/transactionController";

const router = Router();

router.get("/summary", getTransactionSummary);
router.get("/", getTransactions);

export default router;