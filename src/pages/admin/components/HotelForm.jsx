import { useState } from 'react';
import { createHotel, updateHotel } from '../../../services/hotelService';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

function HotelForm({ hotel, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: hotel?.name || '',
    location: hotel?.location || '',
    description: hotel?.description || '',
    price: hotel?.price || '',
    rating: hotel?.rating || '4.0',
    image: hotel?.image || '',
    amenities: hotel?.amenities || ['Free WiFi', 'Breakfast'],
    newAmenity: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleAddAmenity = () => {
    if (!formData.newAmenity.trim()) return;
    
    if (!formData.amenities.includes(formData.newAmenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, formData.newAmenity],
        newAmenity: ''
      }));
    } else {
      // Amenity already exists
      toast.error('This amenity is already in the list');
    }
  };
  
  const handleRemoveAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Hotel name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    
    if (formData.rating && (formData.rating < 1 || formData.rating > 5)) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }
    
    if (formData.amenities.length === 0) {
      newErrors.amenities = 'At least one amenity is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Prepare the hotel data
      const hotelData = {
        name: formData.name,
        location: formData.location,
        description: formData.description,
        price: Number(formData.price),
        rating: parseFloat(formData.rating),
        image: formData.image,
        amenities: formData.amenities
      };
      
      let result;
      
      if (hotel?._id) {
        // Update existing hotel
        result = await updateHotel(hotel._id, hotelData);
        toast.success('Hotel updated successfully');
      } else {
        // Create new hotel
        result = await createHotel(hotelData);
        toast.success('Hotel added successfully');
      }
      
      onSuccess(result);
    } catch (error) {
      console.error('Error saving hotel:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Hotel Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Hotel Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`input-field ${errors.name ? 'border-red-500' : ''}`}
          placeholder="Luxury Palace Hotel"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>
      
      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location *
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={`input-field ${errors.location ? 'border-red-500' : ''}`}
          placeholder="New York, USA"
        />
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location}</p>
        )}
      </div>
      
      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="input-field"
          placeholder="Describe the hotel, its features and ambiance..."
        ></textarea>
      </div>
      
      {/* Price and Rating */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price per Night ($) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="1"
            step="0.01"
            className={`input-field ${errors.price ? 'border-red-500' : ''}`}
            placeholder="199.99"
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
            Rating (1-5) *
          </label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="1"
            max="5"
            step="0.1"
            className={`input-field ${errors.rating ? 'border-red-500' : ''}`}
            placeholder="4.5"
          />
          {errors.rating && (
            <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
          )}
        </div>
      </div>
      
      {/* Image URL */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Image URL *
        </label>
        <input
          type="url"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className={`input-field ${errors.image ? 'border-red-500' : ''}`}
          placeholder="https://example.com/hotel-image.jpg"
        />
        {errors.image && (
          <p className="text-red-500 text-xs mt-1">{errors.image}</p>
        )}
        
        {formData.image && (
          <div className="mt-2">
            <img 
              src={formData.image} 
              alt="Hotel preview" 
              className="h-24 object-cover rounded-md"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
              }}
            />
          </div>
        )}
      </div>
      
      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amenities *
        </label>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.amenities.map((amenity, index) => (
            <div 
              key={index}
              className="bg-primary-50 text-primary-700 py-1 px-2 rounded-md flex items-center"
            >
              <span>{amenity}</span>
              <button 
                type="button"
                onClick={() => handleRemoveAmenity(amenity)}
                className="ml-2 text-primary-500 hover:text-primary-700"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex">
          <input
            type="text"
            name="newAmenity"
            value={formData.newAmenity}
            onChange={handleChange}
            className="input-field rounded-r-none"
            placeholder="Add new amenity"
          />
          <button
            type="button"
            onClick={handleAddAmenity}
            className="bg-primary-700 text-white px-4 py-2 rounded-r-md hover:bg-primary-800 transition-colors"
          >
            Add
          </button>
        </div>
        
        {errors.amenities && (
          <p className="text-red-500 text-xs mt-1">{errors.amenities}</p>
        )}
        
        <div className="mt-2 text-xs text-gray-500">
          Suggested: Free WiFi, Breakfast, Swimming Pool, Gym, Parking, Restaurant, Room Service, Air Conditioning, Spa
        </div>
      </div>
      
      {/* Form Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : (hotel ? 'Update Hotel' : 'Add Hotel')}
        </button>
      </div>
    </form>
  );
}

export default HotelForm;