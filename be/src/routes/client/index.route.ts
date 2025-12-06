import { getAllProducts, getProductById } from "../../controllers/product.controller";
import { login, register, updateUser, getWishlist, addToWishlist, removeFromWishlist } from "../../controllers/user.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import express from "express";
import invoiceRoute from "./invoice.route";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/products", getAllProducts)
router.get("/products/:id", getProductById)
router.patch("/profile/:id", requireAuth, updateUser);

// Wishlist routes
router.get("/wishlist", requireAuth, getWishlist);
router.post("/wishlist", requireAuth, addToWishlist);
router.delete("/wishlist/:productId", requireAuth, removeFromWishlist);

router.use("/invoices", invoiceRoute);

export default router;
