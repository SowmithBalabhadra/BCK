import express from 'express';
import shopOwnerController from '../controllers/shopOwnerController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ShopOwner
 *   description: Endpoints for shop owners to manage shop rentals
 */

/**
 * @swagger
 * /shopOwner/welcome:
 *   get:
 *     summary: Welcome route for shop owners
 *     tags: [ShopOwner]
 *     responses:
 *       200:
 *         description: Returns a welcome message
 */
router.get('/welcome', shopOwnerController.welcome);

/**
 * @swagger
 * /shopOwner/rentInfos:
 *   get:
 *     summary: Get detailed rent information
 *     tags: [ShopOwner]
 *     responses:
 *       200:
 *         description: Returns a list of rent infos
 */
router.get('/rentInfos', shopOwnerController.fetchRentInfos);

/**
 * @swagger
 * /shopOwner/rents:
 *   get:
 *     summary: Get all rent entries posted by the shop owner
 *     tags: [ShopOwner]
 *     responses:
 *       200:
 *         description: List of rents
 */
router.get('/rents', shopOwnerController.fetchRents);

/**
 * @swagger
 * /shopOwner/rentMyShop:
 *   get:
 *     summary: Get form or data to rent a shop
 *     tags: [ShopOwner]
 *     responses:
 *       200:
 *         description: Data to render or process rent form
 * 
 *   post:
 *     summary: Submit shop rental details
 *     tags: [ShopOwner]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               shopName: ABC Store
 *               area: 200
 *               location: Hyderabad
 *               rent: 10000
 *     responses:
 *       200:
 *         description: Shop listed for rent successfully
 */
router.route('/rentMyShop')
  .get(shopOwnerController.rentMyShop)
  .post(shopOwnerController.rentMyShop);

/**
 * @swagger
 * /shopOwner/deleteRent/{rent_id}:
 *   post:
 *     summary: Delete a rent entry by ID
 *     tags: [ShopOwner]
 *     parameters:
 *       - in: path
 *         name: rent_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rent ID to be deleted
 *     responses:
 *       200:
 *         description: Rent deleted successfully
 *       404:
 *         description: Rent not found
 */
router.post('/deleteRent/:rent_id', shopOwnerController.deleteRent);

/**
 * @swagger
 * /shopOwner/analyzeRentals:
 *   get:
 *     summary: Analyze rental trends and statistics
 *     tags: [ShopOwner]
 *     responses:
 *       200:
 *         description: Returns rental analytics
 */
router.get('/analyzeRentals', shopOwnerController.analyzeRentals);

export default router;
