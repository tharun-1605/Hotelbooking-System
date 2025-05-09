import express from 'express';
import { getCurrentUser, updateProfile, getUsers } from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Get current user profile
router.get('/me', protect, getCurrentUser);

// Update user profile
router.put('/profile', protect, updateProfile);

// Get all users (admin only)
router.get('/', protect, admin, getUsers);

export default router;