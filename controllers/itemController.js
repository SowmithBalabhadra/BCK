import itemModel from "../models/itemModel.js";
import userModel from "../models/adminModel.js";
import fs from 'fs';
import jwt from 'jsonwebtoken';

// 🔒 Middleware to verify seller from cookie
const verifySeller = async (req) => {
  const token = req.cookies.seller_token;
  if (!token) throw new Error("Unauthorized: No token");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const seller = await userModel.findById(decoded.id);
  console.log("before");
  if (!seller) throw new Error("Unauthorized: Invalid seller");
      console.log("After")
  return seller.email;
};



const listFood = async (req, res) => {
  try {
    // Exclude 'owner_email' field using .select('-owner_email')
    const foods = await itemModel.find({}).select('-owner_email');
    
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error('❌ listFood error:', error);
    res.status(500).json({ success: false, message: "Failed to fetch food items." });
  }
};




const listFood1 = async (req, res) => {
  try {
    const sellerEmail = await verifySeller(req);
    const foods = await itemModel.find({ owner_email: sellerEmail });
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error('❌ listFood error:', error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};

// ✅ Add new item by seller
const addFood = async (req, res) => {
  try {
    console.log("Food Added");
    const sellerEmail = await verifySeller(req);

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required." });
    }

    const { name, description, price, category } = req.body;

    if (!name || !price || !category || !description) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const food = new itemModel({
      name,
      description,
      price,
      category,
      image: req.file.filename,
      owner_email: sellerEmail
    });

    await food.save();
    res.status(200).json({ success: true, message: "Item added successfully." });

  } catch (error) {
    console.error('❌ addFood error:', error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};

// ✅ Delete item (only by its owner)
const removeFood = async (req, res) => {
  try {
    const sellerEmail = await verifySeller(req);
    const food = await itemModel.findById(req.body.id);

    if (!food) {
      return res.status(404).json({ success: false, message: "Item not found." });
    }

    if (food.owner_email !== sellerEmail) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this item." });
    }

    fs.unlink(`uploads/${food.image}`, (err) => {
      if (err) console.error('❌ Failed to delete image:', err);
    });

    await itemModel.findByIdAndDelete(req.body.id);
    res.status(200).json({ success: true, message: "Item removed successfully." });

  } catch (error) {
    console.error('❌ removeFood error:', error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};

export { listFood,listFood1, addFood, removeFood };
