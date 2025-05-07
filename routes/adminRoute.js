import express from 'express';
import { loginAdmin, registerAdmin } from '../controllers/adminController.js';

const adminRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin authentication routes
 */

/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Admin User
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Admin registered successfully
 *       400:
 *         description: Bad request
 */
adminRouter.post("/register", registerAdmin);

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Login an existing admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       401:
 *         description: Unauthorized
 */
adminRouter.post("/login", loginAdmin);

export default adminRouter;
