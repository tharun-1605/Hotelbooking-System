import express from 'express';
import { 
  getHotels, 
  getHotelById, 
  createHotel, 
  updateHotel, 
  deleteHotel,
  getHotelStats
} from '../controllers/hotelController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Get hotel stats (admin only)
router.get('/stats', protect, admin, getHotelStats);

// Get all hotels
router.get('/', getHotels);

// Get a single hotel
router.get('/:id', getHotelById);

// Create a new hotel (admin only)
router.post('/', protect, admin, createHotel);

// Update a hotel (admin only)
router.put('/:id', protect, admin, updateHotel);

// Delete a hotel (admin only)
router.delete('/:id', protect, admin, deleteHotel);

export default router;