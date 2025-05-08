import express from 'express';
import { addFood, listFood,listFood1, removeFood } from '../controllers/itemController.js';
import multer from 'multer';
// import {listFoodUser} from '../controllers/userFunctionsController.js';

const itemRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Food
 *   description: Food item management routes
 */

// Image Storage Engine
const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/food/list:
 *   get:
 *     summary: Get all food items
 *     tags: [Food]
 *     responses:
 *       200:
 *         description: A list of food items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       price:
 *                         type: number
 *                       category:
 *                         type: string
 *                       image:
 *                         type: string
 */
itemRouter.get('/list1', (req, res, next) => {
  console.log("✅ /list1 route was accessed"); // Inline log in route
  next(); // Pass control to the actual controller
}, listFood1);
itemRouter.get("/list", listFood);
/**
 * @swagger
 * /api/food/add:
 *   post:
 *     summary: Add a new food item
 *     tags: [Food]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Burger
 *               description:
 *                 type: string
 *                 example: Tasty veg burger
 *               price:
 *                 type: number
 *                 example: 99.99
 *               category:
 *                 type: string
 *                 example: Snacks
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Item added successfully
 *       400:
 *         description: Invalid input
 */
itemRouter.post("/add", (req, res, next) => {
  console.log("🛬 /api/food/add route accessed");
  next(); // pass control to the next middleware (upload & addFood)
}, upload.single('image'), addFood);


/**
 * @swagger
 * /api/food/remove:
 *   post:
 *     summary: Remove a food item by ID
 *     tags: [Food]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 example: 661ba109efcd48c16546cd15
 *     responses:
 *       200:
 *         description: Item removed successfully
 *       404:
 *         description: Item not found
 */
itemRouter.post("/remove", removeFood);

export default itemRouter;
