import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Email/OTP-based authentication routes
 */

/**
 * @swagger
 * /auth/sendOtp:
 *   post:
 *     summary: Send OTP to email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Email sending failed
 */
router.post('/sendOtp', authController.sendOtp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in with email and OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid OTP
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *     responses:
 *       200:
 *         description: Registered successfully
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/register:
 *   get:
 *     summary: Show register page (if using views)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Returns the registration view
 */
router.get('/register', authController.showregister);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out the user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /auth/verify/{token}:
 *   get:
 *     summary: Verify user email using token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.get('/verify/:token', authController.verifyEmail);

export default router;
