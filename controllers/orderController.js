import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import redisClient from "../utils/redisClient.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Config variables
const currency = "inr";
const deliveryCharge = 50;
const frontend_URL = 'http://localhost:5173/myorders';

// Place Order with Stripe (online)
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Invalidate userOrders cache
        await redisClient.del(`userOrders:${req.body.userId}`);

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: { name: item.name },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: { name: "Delivery Charge" },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Place Order with COD
const placeOrderCod = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: true,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Invalidate userOrders cache
        await redisClient.del(`userOrders:${req.body.userId}`);

        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// List all orders (Admin)
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// User order history with Redis cache
const userOrders = async (req, res) => {
    const userId = req.body.userId;
    const cacheKey = `userOrders:${userId}`;

    try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json({ success: true, fromCache: true, data: JSON.parse(cached) });
        }

        const orders = await orderModel.find({ userId });
        await redisClient.set(cacheKey, JSON.stringify(orders), { EX: 600 }); // 10 minutes

        res.json({ success: true, fromCache: false, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Update order status
const updateStatus = async (req, res) => {
    console.log(req.body);
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });

        // Optional: invalidate cache if needed
        await redisClient.del(`userOrders:${req.body.userId}`);

        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
};

// Verify payment status
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        res.json({ success: false, message: "Not Verified" });
    }
};

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod };
