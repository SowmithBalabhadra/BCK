import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder } from '../controllers/orderController.js';
import cookieParser from "cookie-parser";
// app.use(cookieParser());

const orderRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order processing and tracking
 */

/**
 * @swagger
 * /api/order/list:
 *   get:
 *     summary: List all orders (Admin/Backend use)
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Returns a list of all orders
 */
orderRouter.get("/list", listOrders);

/**
 * @swagger
 * /api/order/userorders:
 *   post:
 *     summary: Get current user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user's orders
 *       401:
 *         description: Unauthorized
 */
orderRouter.post("/userorders", authMiddleware, userOrders);

/**
 * @swagger
 * /api/order/place:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               cartItems: { "661ba109efcd48c16546cd15": 2 }
 *               total: 199.98
 *     responses:
 *       200:
 *         description: Order placed successfully
 *       400:
 *         description: Invalid input
 */
orderRouter.post("/place", authMiddleware, placeOrder);

/**
 * @swagger
 * /api/order/status:
 *   post:
 *     summary: Update order status
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - status
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: 661ba109efcd48c16546cd15
 *               status:
 *                 type: string
 *                 example: Delivered
 *     responses:
 *       200:
 *         description: Order status updated
 */
orderRouter.post("/status", updateStatus);

/**
 * @swagger
 * /api/order/verify:
 *   post:
 *     summary: Verify an order (e.g., payment confirmation)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: 661ba109efcd48c16546cd15
 *               verificationCode:
 *                 type: string
 *                 example: ABC123XYZ
 *     responses:
 *       200:
 *         description: Order verified
 *       400:
 *         description: Verification failed
 */
orderRouter.post("/verify", verifyOrder);

export default orderRouter;
