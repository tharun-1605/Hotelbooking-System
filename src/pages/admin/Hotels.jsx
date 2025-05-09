import { useState, useEffect } from 'react';
import { getHotels, deleteHotel } from '../../services/hotelService';
import AdminLayout from './components/AdminLayout';
import HotelForm from './components/HotelForm';
import { Plus, Edit, Trash2, Star, MapPin, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  
  useEffect(() => {
    fetchHotels();
  }, []);
  
  const fetchHotels = async () => {
    try {
      setLoading(true);
      const data = await getHotels();
      setHotels(data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setError('Failed to load hotels. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddHotel = () => {
    setEditingHotel(null);
    setShowForm(true);
  };
  
  const handleEditHotel = (hotel) => {
    setEditingHotel(hotel);
    setShowForm(true);
  };
  
  const handleDeleteHotel = async (id) => {
    if (!confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) return;
    
    try {
      await deleteHotel(id);
      setHotels(prev => prev.filter(hotel => hotel._id !== id));
      toast.success('Hotel deleted successfully');
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  };
  
  const handleFormSuccess = (hotel) => {
    if (editingHotel) {
      // Update existing hotel in the list
      setHotels(prev => prev.map(h => h._id === hotel._id ? hotel : h));
    } else {
      // Add new hotel to the list
      setHotels(prev => [...prev, hotel]);
    }
    setShowForm(false);
    setEditingHotel(null);
  };
  
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-800 mb-2">Manage Hotels</h1>
          <p className="text-gray-600">Add, edit or remove hotels from the system</p>
        </div>
        <button 
          onClick={handleAddHotel}
          className="btn-primary flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add New Hotel
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <p>{error}</p>
        </div>
      )}
      
      {/* Hotel Form Dialog */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-primary-800 mb-4">
                {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
              </h2>
              <HotelForm 
                hotel={editingHotel} 
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setShowForm(false);
                  setEditingHotel(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Hotels List */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : hotels.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Hotels Found</h3>
          <p className="text-gray-600 mb-6">Add your first hotel to get started</p>
          <button 
            onClick={handleAddHotel}
            className="btn-primary"
          >
            Add a Hotel
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hotel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hotels.map((hotel) => (
                  <tr key={hotel._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={hotel.image} 
                            alt={hotel.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {hotel.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {hotel.amenities && hotel.amenities.slice(0, 2).join(', ')}
                            {hotel.amenities && hotel.amenities.length > 2 && '...'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-700">
                        <MapPin size={14} className="mr-1 text-gray-400" />
                        {hotel.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${hotel.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm">
                        <Star size={14} className="text-yellow-400 mr-1" />
                        <span>{hotel.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditHotel(hotel)}
                          className="text-primary-600 hover:text-primary-900"
                          aria-label="Edit hotel"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteHotel(hotel._id)}
                          className="text-red-600 hover:text-red-900"
                          aria-label="Delete hotel"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default Hotels;