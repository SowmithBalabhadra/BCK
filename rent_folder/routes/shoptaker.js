import express from 'express';
import shoptakerController from '../controllers/shoptakerController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ShopTaker
 *   description: Endpoints for shop takers to browse and book rentals
 */

/**
 * @swagger
 * /shoptaker/welcome:
 *   get:
 *     summary: Welcome route for shop takers
 *     tags: [ShopTaker]
 *     responses:
 *       200:
 *         description: Returns a welcome message
 */
router.get('/welcome', shoptakerController.welcome);

/**
 * @swagger
 * /shoptaker/dashboard:
 *   get:
 *     summary: Shop taker's dashboard data
 *     tags: [ShopTaker]
 *     responses:
 *       200:
 *         description: Returns dashboard stats for the shop taker
 */
router.get('/dashboard', shoptakerController.dashboard);

/**
 * @swagger
 * /shoptaker/surfRent:
 *   get:
 *     summary: Browse available shop rents
 *     tags: [ShopTaker]
 *     responses:
 *       200:
 *         description: Returns list of available rents
 */
router.get('/surfRent', shoptakerController.surfRent);

/**
 * @swagger
 * /shoptaker/bookRent/{id}:
 *   post:
 *     summary: Book a rent using the rent ID
 *     tags: [ShopTaker]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rent ID to book
 *     responses:
 *       200:
 *         description: Rent booked successfully
 *       404:
 *         description: Rent not found
 */
router.post('/bookRent/:id', shoptakerController.bookRent);

/**
 * @swagger
 * /shoptaker/analyzeBookings:
 *   get:
 *     summary: Analyze booking trends/statistics
 *     tags: [ShopTaker]
 *     responses:
 *       200:
 *         description: Returns booking analytics
 */
router.get('/analyzeBookings', shoptakerController.analyzeBookings);

/**
 * @swagger
 * /shoptaker/updatestatus:
 *   post:
 *     summary: Update the status of a booking
 *     tags: [ShopTaker]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: 661ba109efcd48c16546cd15
 *               status:
 *                 type: string
 *                 example: Confirmed
 *     responses:
 *       200:
 *         description: Status updated
 *       400:
 *         description: Invalid request
 */
router.post('/updatestatus', shoptakerController.updateStatus);

export default router;
