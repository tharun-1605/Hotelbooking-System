import { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus } from '../../services/bookingService';
import AdminLayout from './components/AdminLayout';
import { Calendar, Filter, Search, CheckCircle, X, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  
  useEffect(() => {
    fetchBookings();
  }, []);
  
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookings();
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [filters, bookings]);
  
  const applyFilters = () => {
    let results = [...bookings];
    
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(booking => 
        booking.user.name.toLowerCase().includes(searchTerm) ||
        booking.user.email.toLowerCase().includes(searchTerm) ||
        booking.hotel.name.toLowerCase().includes(searchTerm)
      );
    }
    
    // Status filter
    if (filters.status) {
      results = results.filter(booking => booking.status === filters.status);
    }
    
    // Date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      results = results.filter(booking => new Date(booking.checkIn) >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      results = results.filter(booking => new Date(booking.checkOut) <= toDate);
    }
    
    setFilteredBookings(results);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    });
  };
  
  const updateStatus = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));
      
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
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
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-800 mb-2">Manage Bookings</h1>
        <p className="text-gray-600">View and manage all hotel bookings</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <p>{error}</p>
        </div>
      )}
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary-800 flex items-center">
            <Filter size={18} className="mr-2" />
            Filter Bookings
          </h2>
          {(filters.search || filters.status || filters.dateFrom || filters.dateTo) && (
            <button 
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-primary-700 flex items-center"
            >
              <X size={14} className="mr-1" />
              Clear Filters
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input 
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search guest or hotel"
              className="input-field pl-10"
            />
          </div>
          
          {/* Status */}
          <div>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          {/* Date Range */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar size={16} className="text-gray-400" />
            </div>
            <input 
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              placeholder="From Date"
              className="input-field pl-10"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar size={16} className="text-gray-400" />
            </div>
            <input 
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              placeholder="To Date"
              className="input-field pl-10"
            />
          </div>
        </div>
      </div>
      
      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Bookings Found</h3>
            <p className="text-gray-500">
              {bookings.length > 0 
                ? 'Try adjusting your filters to see more results' 
                : 'There are no bookings in the system yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hotel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-in / Check-out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.hotel.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${booking.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        value={booking.status}
                        onChange={(e) => updateStatus(booking._id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                        disabled={booking.status === 'cancelled'}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default Bookings;