import express from 'express';
import jwt from 'jsonwebtoken';
import dashboardController from '../controllers/dashboardController.js';

const router = express.Router();

// ⚠️ Hardcoded Admin Login Only
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login Attempt:', { email, password }); // 👈 Add this

  if (email === 'sowmith@gmail.com' && password === 'Sowmith@123') {
    const token = jwt.sign({ role: 'admin' }, 'secret123', { expiresIn: '1d' });
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Lax',
    });
    return res.json({ success: true, message: 'Admin logged in' });
  }

  return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});




// ---------- USERS ----------
router.get('/users', dashboardController.getAllUsers);
router.post('/users', dashboardController.createUser);
router.put('/users/:id', dashboardController.updateUser);
router.delete('/users/:id', dashboardController.deleteUser);

// ---------- ITEMS ----------
router.get('/items', dashboardController.getAllItems);
router.post('/items', dashboardController.createItem);
router.put('/items/:id', dashboardController.updateItem);
router.delete('/items/:id', dashboardController.deleteItem);

// ---------- ORDERS ----------
router.get('/orders', dashboardController.getAllOrders);
router.delete('/orders/:id', dashboardController.deleteOrder);

// ---------- ADMINS ----------
router.get('/admins', dashboardController.getAllAdmins);
router.post('/admins', dashboardController.createAdmin);
router.delete('/admins/:id', dashboardController.deleteAdmin);

// ---------- SHOP OWNERS ----------
router.get('/shop-owners', dashboardController.getAllShopOwners);
router.delete('/shop-owners/:id', dashboardController.deleteShopOwner);

// ---------- SHOP TAKERS ----------
router.get('/shop-takers', dashboardController.getAllShopTakers);
router.delete('/shop-takers/:id', dashboardController.deleteShopTaker);

// ---------- RENTS ----------
router.get('/rents', dashboardController.getAllRents);
router.delete('/rents/:id', dashboardController.deleteRent);

export default router;
