import User from '../models/userModel.js';
import Item from '../models/itemModel.js';
import Order from '../models/orderModel.js';
import Admin from '../models/adminModel.js';
import ShopOwner from '../rent_folder/models/UserRent.js';
import ShopTaker from '../rent_folder/models/UserRent.js';

import Rent from '../rent_folder/models/RentInfo.js'; // ✅ uses the rentinfos collection
// instead of Rent.js

const dashboardController = {
  // ---------- USERS ----------
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json({ success: true, data: users });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  createUser: async (req, res) => {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res.json({ success: true, data: newUser });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ success: true, data: updatedUser });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'User deleted' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // ---------- ITEMS ----------
  getAllItems: async (req, res) => {
    try {
      const items = await Item.find();
      res.json({ success: true, data: items });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  createItem: async (req, res) => {
    try {
      const newItem = new Item(req.body);
      await newItem.save();
      res.json({ success: true, data: newItem });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
  updateItem: async (req, res) => {
    try {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ success: true, data: updatedItem });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
  deleteItem: async (req, res) => {
    try {
      await Item.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Item deleted' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // ---------- ORDERS ----------
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find();
      res.json({ success: true, data: orders });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  deleteOrder: async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Order deleted' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // ---------- ADMINS ----------
  getAllAdmins: async (req, res) => {
    try {
      const admins = await Admin.find();
      res.json({ success: true, data: admins });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  createAdmin: async (req, res) => {
    try {
      const newAdmin = new Admin(req.body);
      await newAdmin.save();
      res.json({ success: true, data: newAdmin });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
  deleteAdmin: async (req, res) => {
    try {
      await Admin.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Admin deleted' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // ---------- SHOP OWNERS & TAKERS ----------
// ---------- SHOP OWNERS ----------
getAllShopOwners: async (req, res) => {
  try {
    const owners = await ShopOwner.find({ typeOfCustomer: "ShopOwner" });
    res.json({ success: true, data: owners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
},

// ---------- SHOP TAKERS ----------
getAllShopTakers: async (req, res) => {
  try {
    const takers = await ShopTaker.find({ typeOfCustomer: "Shoptaker" });
    res.json({ success: true, data: takers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
},

  deleteShopOwner: async (req, res) => {
    try {
      await ShopOwner.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Shop owner deleted' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
  deleteShopTaker: async (req, res) => {
    try {
      await ShopTaker.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Shop taker deleted' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // ---------- RENTS ----------
  getAllRents: async (req, res) => {
    try {
      const rents = await Rent.find(); // from rentinfos collection
      res.json({ success: true, data: rents });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  
  deleteRent: async (req, res) => {
    try {
      await Rent.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Rent entry deleted' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};

export default dashboardController;
