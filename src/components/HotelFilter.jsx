import { useState } from 'react';
import { Search, X } from 'lucide-react';

function HotelFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    location: '',
    priceMin: '',
    priceMax: '',
    rating: '',
    amenities: []
  });

  const amenitiesList = [
    'Free WiFi', 
    'Swimming Pool', 
    'Gym', 
    'Restaurant', 
    'Spa', 
    'Parking',
    'Air Conditioning',
    'Room Service'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => {
      const amenities = [...prev.amenities];
      if (amenities.includes(amenity)) {
        return {
          ...prev,
          amenities: amenities.filter(a => a !== amenity)
        };
      } else {
        return {
          ...prev,
          amenities: [...amenities, amenity]
        };
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      priceMin: '',
      priceMax: '',
      rating: '',
      amenities: []
    });
    onFilter({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary-800">Filter Hotels</h2>
        {(filters.location || filters.priceMin || filters.priceMax || filters.rating || filters.amenities.length > 0) && (
          <button 
            onClick={clearFilters}
            className="flex items-center text-sm text-gray-600 hover:text-primary-700"
          >
            <X size={16} className="mr-1" />
            Clear All
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="Any location"
              className="input-field"
            />
          </div>
          
          {/* Price Range */}
          <div>
            <label htmlFor="priceMin" className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                id="priceMin"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleChange}
                placeholder="Min"
                className="input-field w-1/2"
                min="0"
              />
              <input
                type="number"
                id="priceMax"
                name="priceMax"
                value={filters.priceMax}
                onChange={handleChange}
                placeholder="Max"
                className="input-field w-1/2"
                min="0"
              />
            </div>
          </div>
          
          {/* Rating */}
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Rating
            </label>
            <select
              id="rating"
              name="rating"
              value={filters.rating}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Any Rating</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          
          {/* Submit Button */}
          <div className="flex items-end">
            <button 
              type="submit" 
              className="btn-primary w-full flex items-center justify-center"
            >
              <Search size={18} className="mr-2" />
              Search Hotels
            </button>
          </div>
        </div>
        
        {/* Amenities */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {amenitiesList.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => handleAmenityToggle(amenity)}
                className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                  filters.amenities.includes(amenity)
                    ? 'bg-primary-100 text-primary-700 border-primary-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

export default HotelFilter;