import express from 'express';
import { 
  getUsers, 
  getUserById, 
  updateUserRole, 
  deleteUser,
  getUserOrders,
  getUserStats
} from '../controllers/userController.js';
import { auth, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes
router.get('/', auth, adminOnly, getUsers);
router.get('/stats', auth, adminOnly, getUserStats);
router.get('/:id', auth, adminOnly, getUserById);
router.put('/:id/role', auth, adminOnly, updateUserRole);
router.delete('/:id', auth, adminOnly, deleteUser);

// User routes
router.get('/:id/orders', auth, getUserOrders);
router.get('/orders', auth, getUserOrders); // Get current user's orders

export default router;