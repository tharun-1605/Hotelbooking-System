import { useState, useEffect } from 'react';
import { getHotels } from '../services/hotelService';
import HotelCard from '../components/HotelCard';
import HotelFilter from '../components/HotelFilter';
import { Hotel } from 'lucide-react';

function Home() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});

  // Fetch hotels on component mount
  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const data = await getHotels();
      setHotels(data);
      setFilteredHotels(data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setError('Failed to load hotels. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to hotels
  const handleFilter = (filters) => {
    setActiveFilters(filters);
    
    let results = [...hotels];
    
    // Filter by location
    if (filters.location) {
      results = results.filter(hotel => 
        hotel.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Filter by price range
    if (filters.priceMin) {
      results = results.filter(hotel => hotel.price >= parseInt(filters.priceMin));
    }
    
    if (filters.priceMax) {
      results = results.filter(hotel => hotel.price <= parseInt(filters.priceMax));
    }
    
    // Filter by rating
    if (filters.rating) {
      results = results.filter(hotel => hotel.rating >= parseInt(filters.rating));
    }
    
    // Filter by amenities
    if (filters.amenities && filters.amenities.length > 0) {
      results = results.filter(hotel => 
        filters.amenities.every(amenity => 
          hotel.amenities && hotel.amenities.includes(amenity)
        )
      );
    }
    
    setFilteredHotels(results);
  };

  // Render loading state
  if (loading) {
    return (
      <div>
        <div className="mb-8 shimmer h-32 rounded-lg"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="shimmer rounded-lg h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <p>{error}</p>
        <button 
          onClick={fetchHotels}
          className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 py-1 px-3 rounded transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary-800 text-white p-8 rounded-lg mb-8 animate-fade-in">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Find Your Perfect Stay
          </h1>
          <p className="text-primary-100 text-lg mb-6">
            Discover handpicked luxury hotels and accommodations for your next adventure
          </p>
        </div>
      </div>
      
      {/* Filter Section */}
      <HotelFilter onFilter={handleFilter} />
      
      {/* Results Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-primary-800 flex items-center">
            <Hotel size={24} className="mr-2" />
            {filteredHotels.length > 0 ? 'Available Hotels' : 'No Hotels Found'}
          </h2>
          {filteredHotels.length > 0 && (
            <p className="text-gray-600">
              Showing {filteredHotels.length} {filteredHotels.length === 1 ? 'hotel' : 'hotels'}
            </p>
          )}
        </div>
        
        {filteredHotels.length === 0 && Object.keys(activeFilters).length > 0 ? (
          <div className="bg-gray-50 p-8 text-center rounded-lg">
            <p className="text-gray-600 mb-4">No hotels match your current filters.</p>
            <button 
              onClick={() => handleFilter({})}
              className="btn-outline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHotels.map(hotel => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;