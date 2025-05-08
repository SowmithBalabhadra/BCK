import express from "express";
import cors from 'cors';
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import itemRouter from "./routes/itemRoute.js";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";
import authRoutes from './rent_folder/routes/auth.js';
import shopOwnerRoutes from './rent_folder/routes/shopOwner.js';
import shoptakerRoutes from './rent_folder/routes/shoptaker.js';
import { performanceLogger } from "./middleware/performanceLogger.js";
import redisClient from "./utils/redisClient.js";
import dashboardRoutes from './routes/dashboardRoute.js';
// ✅ Swagger
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swaggerConfig.js";

// App config
const app = express();
const port = 4000;

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174','http://localhost:5175','https://customershopspher.netlify.app/'],
  credentials: true,
}));

// Connect DB
connectDB();

// Middleware
app.use(performanceLogger);

// ✅ Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/food", itemRouter);
app.use("/images", express.static('uploads'));
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use('/auth', authRoutes);
app.use('/shopOwner', shopOwnerRoutes);
app.use('/shoptaker', shoptakerRoutes);
app.use('/api/dashboard', dashboardRoutes);
// Root route
app.get("/", (req, res) => {
  res.send("Working");
});

// Start server
app.listen(port, () => console.log(`🚀 Server started on http://localhost:${port}`));
