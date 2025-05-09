import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHotelById } from '../services/hotelService';
import BookingForm from '../components/BookingForm';
import { MapPin, Star, Calendar, Wifi, Coffee, Utensils, Car, DumbbellIcon, Waves, ArrowLeft } from 'lucide-react';

function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const data = await getHotelById(id);
        setHotel(data);
      } catch (error) {
        console.error('Error fetching hotel details:', error);
        setError('Failed to load hotel details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  // Map amenity names to icons
  const amenityIcons = {
    'Free WiFi': <Wifi size={18} />,
    'Breakfast': <Coffee size={18} />,
    'Restaurant': <Utensils size={18} />,
    'Parking': <Car size={18} />,
    'Gym': <DumbbellIcon size={18} />,
    'Swimming Pool': <Waves size={18} />,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <Link to="/" className="flex items-center text-primary-700 hover:text-primary-800 mr-4">
            <ArrowLeft size={20} className="mr-1" />
            <span>Back to Hotels</span>
          </Link>
        </div>
        <div className="shimmer h-80 rounded-lg mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="shimmer h-10 w-3/4 rounded mb-3"></div>
            <div className="shimmer h-6 w-1/2 rounded mb-6"></div>
            <div className="shimmer h-32 rounded mb-4"></div>
            <div className="shimmer h-48 rounded"></div>
          </div>
          <div className="shimmer h-96 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <p>{error}</p>
        <Link to="/" className="mt-4 inline-block bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-800 transition-colors">
          Return to Hotels
        </Link>
      </div>
    );
  }

  if (!hotel) return null;

  // Placeholder for when we don't have multiple images
  const hotelImages = hotel.images?.length > 0 
    ? hotel.images 
    : [hotel.image, hotel.image, hotel.image];

  // Placeholder data if certain fields are missing
  const description = hotel.description || "Experience luxury and comfort at this exceptional property. This hotel offers a perfect blend of elegance, modern amenities, and exceptional service to ensure a memorable stay for all guests.";
  const amenities = hotel.amenities || ['Free WiFi', 'Breakfast', 'Parking', 'Swimming Pool', 'Gym'];
  const policies = hotel.policies || {
    checkIn: '2:00 PM',
    checkOut: '12:00 PM',
    cancellation: 'Free cancellation up to 24 hours before check-in',
    pets: 'Pets not allowed',
    children: 'Children of all ages are welcome'
  };

  return (
    <div className="animate-fade-in">
      {/* Back Navigation */}
      <div className="flex items-center mb-4">
        <Link to="/" className="flex items-center text-primary-700 hover:text-primary-800 transition-colors">
          <ArrowLeft size={20} className="mr-1" />
          <span>Back to Hotels</span>
        </Link>
      </div>
      
      {/* Main Photo Gallery */}
      <div className="mb-8">
        <div className="relative h-80 rounded-lg overflow-hidden">
          <img 
            src={hotelImages[activeImage]} 
            alt={hotel.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h1 className="text-white text-3xl font-bold">{hotel.name}</h1>
            <div className="flex items-center text-white mt-2">
              <MapPin size={16} className="mr-1" />
              <span>{hotel.location}</span>
              <div className="flex items-center ml-4">
                <Star size={16} className="text-yellow-400 mr-1" />
                <span>{hotel.rating} Rating</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Thumbnail Navigation */}
        <div className="flex space-x-2 mt-2">
          {hotelImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`h-16 w-24 rounded-md overflow-hidden transition-opacity ${
                activeImage === index ? 'ring-2 ring-primary-500' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img 
                src={image} 
                alt={`${hotel.name} thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hotel Details */}
        <div className="lg:col-span-2">
          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-primary-800 mb-4">About this hotel</h2>
            <p className="text-gray-700">{description}</p>
            
            {/* Amenities */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-primary-800 mb-3">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <span className="mr-2 text-primary-700">
                      {amenityIcons[amenity] || <Calendar size={18} />}
                    </span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Policies */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-primary-800 mb-4">Hotel Policies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold text-gray-800 mb-2">Check-in / Check-out</h3>
                <div className="space-y-1 text-gray-700">
                  <p>Check-in: {policies.checkIn}</p>
                  <p>Check-out: {policies.checkOut}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold text-gray-800 mb-2">Cancellation</h3>
                <p className="text-gray-700">{policies.cancellation}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold text-gray-800 mb-2">Pets</h3>
                <p className="text-gray-700">{policies.pets}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold text-gray-800 mb-2">Children</h3>
                <p className="text-gray-700">{policies.children}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Booking Form */}
        <div>
          <BookingForm hotel={hotel} />
        </div>
      </div>
    </div>
  );
}

export default HotelDetails;