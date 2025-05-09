import api from './api';

// Get all hotels with optional filters
export const getHotels = async (filters = {}) => {
  const { data } = await api.get('/api/hotels', { params: filters });
  return data;
};

// Get hotel by ID
export const getHotelById = async (id) => {
  const { data } = await api.get(`/api/hotels/${id}`);
  return data;
};

// Create new hotel (admin only)
export const createHotel = async (hotelData) => {
  const { data } = await api.post('/api/hotels', hotelData);
  return data;
};

// Update hotel (admin only)
export const updateHotel = async (id, hotelData) => {
  const { data } = await api.put(`/api/hotels/${id}`, hotelData);
  return data;
};

// Delete hotel (admin only)
export const deleteHotel = async (id) => {
  const { data } = await api.delete(`/api/hotels/${id}`);
  return data;
};

// Get hotel stats (admin only)
export const getHotelStats = async () => {
  const { data } = await api.get('/api/hotels/stats');
  return data;
};