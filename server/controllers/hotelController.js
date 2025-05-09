import Hotel from '../models/Hotel.js';
import Booking from '../models/Booking.js';

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
export const getHotels = async (req, res, next) => {
  try {
    // Build filter object
    const filter = {};
    
    // Location filter
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: 'i' };
    }
    
    // Price range filter
    if (req.query.priceMin || req.query.priceMax) {
      filter.price = {};
      if (req.query.priceMin) filter.price.$gte = Number(req.query.priceMin);
      if (req.query.priceMax) filter.price.$lte = Number(req.query.priceMax);
    }
    
    // Rating filter
    if (req.query.rating) {
      filter.rating = { $gte: Number(req.query.rating) };
    }
    
    // Amenities filter
    if (req.query.amenities) {
      const amenities = Array.isArray(req.query.amenities) 
        ? req.query.amenities 
        : [req.query.amenities];
      filter.amenities = { $all: amenities };
    }
    
    const hotels = await Hotel.find(filter);
    res.status(200).json(hotels);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single hotel
// @route   GET /api/hotels/:id
// @access  Public
export const getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }
    
    res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new hotel
// @route   POST /api/hotels
// @access  Private/Admin
export const createHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json(hotel);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
export const updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }
    
    res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
export const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }
    
    // Check if hotel has bookings
    const bookings = await Booking.find({ hotel: req.params.id });
    
    if (bookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete hotel with existing bookings'
      });
    }
    
    await hotel.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get hotel statistics
// @route   GET /api/hotels/stats
// @access  Private/Admin
export const getHotelStats = async (req, res, next) => {
  try {
    const totalHotels = await Hotel.countDocuments();
    
    // Get average price
    const priceStats = await Hotel.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);
    
    // Get rating distribution
    const ratingStats = await Hotel.aggregate([
      {
        $group: {
          _id: { $round: ['$rating'] },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);
    
    res.status(200).json({
      totalHotels,
      priceStats: priceStats[0] || {},
      ratingStats
    });
  } catch (error) {
    next(error);
  }
};