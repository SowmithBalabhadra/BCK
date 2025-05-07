import itemModel from "../models/itemModel.js";
import fs from 'fs';

// ✅ Get all items
const listFood = async (req, res) => {
  try {
    const foods = await itemModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error('❌ listFood error:', error);
    res.status(500).json({ success: false, message: "Failed to fetch food items." });
  }
};

// ✅ Add new item
const addFood = async (req, res) => {
  try {
    console.log('📥 Incoming addFood request');
    console.log('📝 req.body:', req.body);
    console.log('📷 req.file:', req.file);

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required." });
    }

    const { name, description, price, category } = req.body;

    // ✅ Basic validation
    if (!name || !price || !category || !description) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const food = new itemModel({
      name,
      description,
      price,
      category,
      image: req.file.filename,
    });

    await food.save();

    res.status(200).json({ success: true, message: "Item added successfully." });

  } catch (error) {
    console.error('❌ addFood error:', error);
    res.status(500).json({ success: false, message: "Failed to add food item." });
  }
};

// ✅ Delete item
const removeFood = async (req, res) => {
  try {
    const food = await itemModel.findById(req.body.id);

    if (!food) {
      return res.status(404).json({ success: false, message: "Item not found." });
    }

    // Delete the image file
    fs.unlink(`uploads/${food.image}`, (err) => {
      if (err) console.error('❌ Failed to delete image:', err);
    });

    await itemModel.findByIdAndDelete(req.body.id);

    res.status(200).json({ success: true, message: "Item removed successfully." });

  } catch (error) {
    console.error('❌ removeFood error:', error);
    res.status(500).json({ success: false, message: "Failed to remove food item." });
  }
};

export { listFood, addFood, removeFood };
