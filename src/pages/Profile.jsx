import { useState, useEffect } from 'react';
import { getUserBookings, cancelBooking } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, Clock, X, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function Profile() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        setLoading(true);
        const data = await getUserBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load your bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserBookings();
  }, []);
  
  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await cancelBooking(bookingId);
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
      toast.success('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status badge component based on booking status
  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle size={14} className="mr-1" />
      },
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock size={14} className="mr-1" />
      },
      cancelled: {
        color: 'bg-red-100 text-red-800',
        icon: <X size={14} className="mr-1" />
      },
      completed: {
        color: 'bg-blue-100 text-blue-800',
        icon: <CheckCircle size={14} className="mr-1" />
      }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded ${config.color}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  // Filter out future bookings (active) and past bookings (history)
  const activeBookings = bookings.filter(booking => 
    new Date(booking.checkOut) >= new Date() && booking.status !== 'cancelled'
  );
  
  const bookingHistory = bookings.filter(booking => 
    new Date(booking.checkOut) < new Date() || booking.status === 'cancelled'
  );
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="shimmer h-24 rounded-lg mb-6"></div>
        {[...Array(3)].map((_, index) => (
          <div key={index} className="shimmer h-40 rounded-lg mb-4"></div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-lg flex items-center">
        <AlertCircle size={24} className="mr-2" />
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      {/* User Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="bg-primary-100 text-primary-700 rounded-full w-24 h-24 flex justify-center items-center text-3xl font-semibold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-800 mb-2">{user?.name}</h1>
            <p className="text-gray-600 mb-1">{user?.email}</p>
            <p className="text-gray-500 text-sm">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
          </div>
        </div>
      </div>
      
      {/* Active Bookings */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-primary-800 mb-4">
          Upcoming Stays ({activeBookings.length})
        </h2>
        
        {activeBookings.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">You don't have any upcoming stays.</p>
            <a href="/" className="btn-primary inline-block">Browse Hotels</a>
          </div>
        ) : (
          <div className="space-y-4">
            {activeBookings.map(booking => (
              <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Hotel Image */}
                  <div className="md:w-1/4 h-48 md:h-auto">
                    <img 
                      src={booking.hotel.image} 
                      alt={booking.hotel.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Booking Details */}
                  <div className="p-5 md:w-2/4 flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-primary-800">
                        {booking.hotel.name}
                      </h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    
                    <div className="space-y-2 text-gray-700">
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2 text-gray-500" />
                        <span>{booking.hotel.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-gray-500" />
                        <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                      </div>
                      <div className="flex items-center">
                        <Users size={16} className="mr-2 text-gray-500" />
                        <span>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Booking Actions */}
                  <div className="bg-gray-50 p-5 md:w-1/4 flex flex-col justify-between">
                    <div>
                      <div className="text-primary-700 font-bold text-lg mb-1">
                        ${booking.price}
                      </div>
                      <div className="text-gray-500 text-sm mb-4">
                        {booking.roomType.charAt(0).toUpperCase() + booking.roomType.slice(1)} Room
                      </div>
                    </div>
                    
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="btn border border-red-500 text-red-500 hover:bg-red-50 w-full"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Booking History */}
      {bookingHistory.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-primary-800 mb-4">
            Booking History ({bookingHistory.length})
          </h2>
          
          <div className="space-y-4">
            {bookingHistory.map(booking => (
              <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden opacity-80">
                <div className="flex flex-col md:flex-row">
                  {/* Hotel Image */}
                  <div className="md:w-1/4 h-32 md:h-auto">
                    <img 
                      src={booking.hotel.image} 
                      alt={booking.hotel.name} 
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  
                  {/* Booking Details */}
                  <div className="p-4 md:w-3/4 flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-700">
                        {booking.hotel.name}
                      </h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-gray-600 text-sm">
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1 text-gray-500" />
                        <span>{booking.hotel.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1 text-gray-500" />
                        <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                      </div>
                      <div className="flex justify-end items-center">
                        <span className="font-medium">${booking.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;