import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import authMiddleware from '../middleware/auth.js';

const cartRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart operations
 */

/**
 * @swagger
 * /api/cart/get:
 *   post:
 *     summary: Get the user's cart items
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the cart items
 *       401:
 *         description: Unauthorized
 */
cartRouter.post("/get", authMiddleware, getCart);

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *             properties:
 *               itemId:
 *                 type: string
 *                 example: 661ba109efcd48c16546cd15
 *     responses:
 *       200:
 *         description: Item added to cart
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
cartRouter.post("/add", authMiddleware, addToCart);

/**
 * @swagger
 * /api/cart/remove:
 *   post:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *             properties:
 *               itemId:
 *                 type: string
 *                 example: 661ba109efcd48c16546cd15
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
cartRouter.post("/remove", authMiddleware, removeFromCart);

export default cartRouter;
