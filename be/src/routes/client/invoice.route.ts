import { Router } from "express";
import {
  createInvoice,
  getInvoicesByUserId,
  getInvoiceByNumber,
  cancelInvoice,
} from "../../controllers/invoice.controller";

const router: Router = Router();

router.post("/", createInvoice);
router.get("/user/:userId", getInvoicesByUserId);
router.get("/:invoiceNumber", getInvoiceByNumber);
router.patch("/:invoiceNumber/cancel", cancelInvoice);

export default router;
