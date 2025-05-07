import userModel from "../models/userModel.js";
import redisClient from "../utils/redisClient.js";

// Add item to user cart
const addToCart = async (req, res) => {
   try {
      let userData = await userModel.findOne({ _id: req.body.userId });
      let cartData = await userData.cartData;

      if (!cartData[req.body.itemId]) {
         cartData[req.body.itemId] = 1;
      } else {
         cartData[req.body.itemId] += 1;
      }

      await userModel.findByIdAndUpdate(req.body.userId, { cartData });

      // Invalidate Redis cache
      await redisClient.del(`cart:${req.body.userId}`);

      res.json({ success: true, message: "Added To Cart" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
   }
};

// Remove item from user cart
const removeFromCart = async (req, res) => {
   try {
      let userData = await userModel.findById(req.body.userId);
      let cartData = await userData.cartData;

      if (cartData[req.body.itemId] > 0) {
         cartData[req.body.itemId] -= 1;
      }

      await userModel.findByIdAndUpdate(req.body.userId, { cartData });

      // Invalidate Redis cache
      await redisClient.del(`cart:${req.body.userId}`);

      res.json({ success: true, message: "Removed From Cart" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
   }
};

// Get user cart (from Redis if available)
const getCart = async (req, res) => {
   const userId = req.body.userId;
   const cacheKey = `cart:${userId}`;

   try {
      const cachedCart = await redisClient.get(cacheKey);
      if (cachedCart) {
         return res.json({ success: true, fromCache: true, cartData: JSON.parse(cachedCart) });
      }

      let userData = await userModel.findById(userId);
      let cartData = userData.cartData;

      await redisClient.set(cacheKey, JSON.stringify(cartData), { EX: 300 }); // 5 minutes

      res.json({ success: true, fromCache: false, cartData });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
   }
};

export { addToCart, removeFromCart, getCart };