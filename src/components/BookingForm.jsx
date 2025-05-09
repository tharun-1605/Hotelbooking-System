import { useState } from 'react';
import { Calendar, Users, CreditCard } from 'lucide-react';
import { createBooking } from '../services/bookingService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function BookingForm({ hotel }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: 'standard',
    specialRequests: ''
  });

  const roomTypes = {
    standard: { name: 'Standard Room', price: hotel.price },
    deluxe: { name: 'Deluxe Room', price: hotel.price * 1.5 },
    suite: { name: 'Suite', price: hotel.price * 2 }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate number of nights between check-in and check-out
  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    
    // Calculate difference in days
    const differenceInTime = checkOut.getTime() - checkIn.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    
    return Math.max(1, Math.round(differenceInDays));
  };

  // Calculate total price based on room type and nights
  const calculateTotalPrice = () => {
    const nights = calculateNights();
    const roomPrice = roomTypes[bookingData.roomType].price;
    return roomPrice * nights;
  };

  // Get tomorrow's date in YYYY-MM-DD format for min check-in date
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get min check-out date based on check-in date
  const getMinCheckOut = () => {
    if (!bookingData.checkIn) return getTomorrow();
    
    const checkIn = new Date(bookingData.checkIn);
    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!bookingData.checkIn || !bookingData.checkOut) {
      return toast.error('Please select check-in and check-out dates');
    }
    
    if (!user) {
      toast.error('Please login to book a hotel');
      return navigate('/login');
    }
    
    const nights = calculateNights();
    if (nights < 1) {
      return toast.error('Check-out date must be after check-in date');
    }

    try {
      setIsLoading(true);
      
      // Create booking with all required data
      const bookingPayload = {
        hotel: hotel._id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: parseInt(bookingData.guests),
        roomType: bookingData.roomType,
        price: calculateTotalPrice(),
        specialRequests: bookingData.specialRequests
      };
      
      await createBooking(bookingPayload);
      
      toast.success('Booking confirmed successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-primary-700 text-white p-4">
        <h3 className="text-xl font-semibold">Book Your Stay</h3>
        <p className="text-primary-100">Fill in the details to reserve your room</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {/* Check-in / Check-out dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
              Check-in Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="checkIn"
                name="checkIn"
                value={bookingData.checkIn}
                onChange={handleChange}
                min={getTomorrow()}
                className="input-field pl-10"
                required
              />
              <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          
          <div>
            <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
              Check-out Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="checkOut"
                name="checkOut"
                value={bookingData.checkOut}
                onChange={handleChange}
                min={getMinCheckOut()}
                className="input-field pl-10"
                required
                disabled={!bookingData.checkIn}
              />
              <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>
        
        {/* Guests and Room Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Guests
            </label>
            <div className="relative">
              <select
                id="guests"
                name="guests"
                value={bookingData.guests}
                onChange={handleChange}
                className="input-field pl-10"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
              <Users size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          
          <div>
            <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-1">
              Room Type
            </label>
            <select
              id="roomType"
              name="roomType"
              value={bookingData.roomType}
              onChange={handleChange}
              className="input-field"
            >
              {Object.entries(roomTypes).map(([key, { name, price }]) => (
                <option key={key} value={key}>
                  {name} - ${price}/night
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Special Requests */}
        <div className="mb-6">
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests (optional)
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={bookingData.specialRequests}
            onChange={handleChange}
            rows={3}
            placeholder="Any special requests or requirements..."
            className="input-field"
          ></textarea>
        </div>
        
        {/* Price Summary */}
        {bookingData.checkIn && bookingData.checkOut && (
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h4 className="font-medium text-gray-800 mb-2">Booking Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Room Type:</span>
                <span>{roomTypes[bookingData.roomType].name}</span>
              </div>
              <div className="flex justify-between">
                <span>Price per night:</span>
                <span>${roomTypes[bookingData.roomType].price}</span>
              </div>
              <div className="flex justify-between">
                <span>Nights:</span>
                <span>{calculateNights()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t mt-2 font-semibold">
                <span>Total:</span>
                <span>${calculateTotalPrice()}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn-primary w-full flex items-center justify-center"
          disabled={isLoading || !user}
        >
          {isLoading ? (
            <span>Processing...</span>
          ) : (
            <>
              <CreditCard size={18} className="mr-2" />
              Book Now
            </>
          )}
        </button>
        
        {!user && (
          <p className="text-center text-sm text-gray-600 mt-2">
            Please <a href="/login" className="text-primary-700 hover:underline">login</a> to book a room
          </p>
        )}
      </form>
    </div>
  );
}

export default BookingForm;