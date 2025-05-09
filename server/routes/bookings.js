import express from 'express';
import { 
  createBooking, 
  getAllBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getBookingStats
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Get booking stats (admin only)
router.get('/stats', protect, admin, getBookingStats);

// Get user bookings
router.get('/user', protect, getUserBookings);

// Create a new booking
router.post('/', protect, createBooking);

// Get all bookings (admin only)
router.get('/', protect, admin, getAllBookings);

// Get a single booking
router.get('/:id', protect, getBookingById);

// Update booking status (admin only)
router.put('/:id/status', protect, admin, updateBookingStatus);

// Cancel booking
router.put('/:id/cancel', protect, cancelBooking);

export default router;