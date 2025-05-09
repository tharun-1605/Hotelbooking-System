import api from './api';

// Get user bookings
export const getUserBookings = async () => {
  const { data } = await api.get('/api/bookings/user');
  return data;
};

// Get all bookings (admin only)
export const getAllBookings = async () => {
  const { data } = await api.get('/api/bookings');
  return data;
};

// Create new booking
export const createBooking = async (bookingData) => {
  const { data } = await api.post('/api/bookings', bookingData);
  return data;
};

// Update booking status (admin only)
export const updateBookingStatus = async (id, status) => {
  const { data } = await api.put(`/api/bookings/${id}/status`, { status });
  return data;
};

// Cancel booking
export const cancelBooking = async (id) => {
  const { data } = await api.put(`/api/bookings/${id}/cancel`);
  return data;
};

// Get booking stats (admin only)
export const getBookingStats = async () => {
  const { data } = await api.get('/api/bookings/stats');
  return data;
};