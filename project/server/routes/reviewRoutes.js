import express from 'express';
import { 
  createReview, 
  getProductReviews, 
  updateReview, 
  deleteReview,
  getUserReviews
} from '../controllers/reviewController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new review
router.post('/', auth, createReview);

// Get all reviews for a product
router.get('/product/:productId', getProductReviews);

// Get user's reviews
router.get('/user', auth, getUserReviews);

// Update a review
router.put('/:id', auth, updateReview);

// Delete a review
router.delete('/:id', auth, deleteReview);

export default router;