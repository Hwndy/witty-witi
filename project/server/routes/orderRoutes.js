import express from 'express';
import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { auth, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.post('/', auth, createOrder);
router.get('/', auth, getOrders);
router.get('/:id', auth, getOrderById);
router.put('/:id/status', auth, adminOnly, updateOrderStatus);
router.put('/:id/payment', auth, adminOnly, updatePaymentStatus);
router.put('/:id/cancel', auth, cancelOrder);

export default router;