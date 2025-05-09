import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  try {
    const { hotel: hotelId, checkIn, checkOut, guests, roomType, price, specialRequests } = req.body;
    
    // Validate hotel exists
    const hotel = await Hotel.findById(hotelId);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }
    
    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      hotel: hotelId,
      checkIn,
      checkOut,
      guests,
      roomType,
      price,
      specialRequests,
      status: 'pending'
    });
    
    // Populate user and hotel details
    await booking.populate('user', 'name email');
    await booking.populate('hotel', 'name location image');
    
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (admin only)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('hotel', 'name location image')
      .sort({ createdAt: -1 });
    
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user
// @access  Private
export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('hotel', 'name location image rating')
      .sort({ createdAt: -1 });
    
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('hotel', 'name location image price');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if the booking belongs to the logged in user or the user is an admin
    if (booking.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    booking.status = status;
    await booking.save();
    
    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if the booking belongs to the logged in user
    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }
    
    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }
    
    // Check if booking is completed
    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed booking'
      });
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private/Admin
export const getBookingStats = async (req, res, next) => {
  try {
    // Get total bookings
    const totalBookings = await Booking.countDocuments();
    
    // Get bookings by status
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    
    // Get total revenue
    const totalRevenue = await Booking.aggregate([
      {
        $match: { 
          status: { $in: ['confirmed', 'completed'] } 
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$price' }
        }
      }
    ]);
    
    // Get recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('hotel', 'name');
    
    res.status(200).json({
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      completedBookings,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].revenue : 0,
      recentBookings
    });
  } catch (error) {
    next(error);
  }
};