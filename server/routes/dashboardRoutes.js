import express from 'express';
import { getDashboardStats, getSalesReport } from '../controllers/dashboardController.js';
import { auth, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes
router.get('/stats', auth, adminOnly, getDashboardStats);
router.get('/sales', auth, adminOnly, getSalesReport);

export default router;