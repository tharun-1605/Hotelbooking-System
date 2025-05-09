import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHotelStats } from '../../services/hotelService';
import { getBookingStats } from '../../services/bookingService';
import AdminLayout from './components/AdminLayout';
import { Hotel, Users, CreditCard, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState({
    hotels: 0,
    bookings: {
      total: 0,
      confirmed: 0,
      pending: 0,
      cancelled: 0
    },
    revenue: 0,
    recentBookings: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [hotelStats, bookingStats] = await Promise.all([
          getHotelStats(),
          getBookingStats()
        ]);
        
        setStats({
          hotels: hotelStats.totalHotels,
          bookings: {
            total: bookingStats.totalBookings,
            confirmed: bookingStats.confirmedBookings,
            pending: bookingStats.pendingBookings,
            cancelled: bookingStats.cancelledBookings
          },
          revenue: bookingStats.totalRevenue,
          recentBookings: bookingStats.recentBookings
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 flex items-center ${loading ? 'animate-pulse' : ''}`}>
      <div className={`${color} p-4 rounded-lg mr-4`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            value
          )}
        </p>
      </div>
    </div>
  );
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to the admin dashboard. View and manage your hotel system.</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <p>{error}</p>
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Hotels" 
          value={stats.hotels}
          icon={<Hotel size={24} className="text-blue-600" />}
          color="bg-blue-100"
        />
        <StatCard 
          title="Total Bookings" 
          value={stats.bookings.total}
          icon={<Calendar size={24} className="text-green-600" />}
          color="bg-green-100"
        />
        <StatCard 
          title="Active Users" 
          value="250"
          icon={<Users size={24} className="text-purple-600" />}
          color="bg-purple-100"
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.revenue.toLocaleString()}`}
          icon={<TrendingUp size={24} className="text-amber-600" />}
          color="bg-amber-100"
        />
      </div>
      
      {/* Booking Status Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-primary-800 mb-4">Booking Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-primary-900">Confirmed</h3>
              <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded-full">
                {loading ? '...' : `${Math.round((stats.bookings.confirmed / stats.bookings.total) * 100)}%`}
              </span>
            </div>
            <p className="text-3xl font-bold text-primary-700">
              {loading ? (
                <div className="h-8 w-16 bg-primary-200 rounded animate-pulse"></div>
              ) : (
                stats.bookings.confirmed
              )}
            </p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-yellow-900">Pending</h3>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
                {loading ? '...' : `${Math.round((stats.bookings.pending / stats.bookings.total) * 100)}%`}
              </span>
            </div>
            <p className="text-3xl font-bold text-yellow-700">
              {loading ? (
                <div className="h-8 w-16 bg-yellow-200 rounded animate-pulse"></div>
              ) : (
                stats.bookings.pending
              )}
            </p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-red-900">Cancelled</h3>
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                {loading ? '...' : `${Math.round((stats.bookings.cancelled / stats.bookings.total) * 100)}%`}
              </span>
            </div>
            <p className="text-3xl font-bold text-red-700">
              {loading ? (
                <div className="h-8 w-16 bg-red-200 rounded animate-pulse"></div>
              ) : (
                stats.bookings.cancelled
              )}
            </p>
          </div>
        </div>
      </div>
      
      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-primary-800">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-primary-700 hover:text-primary-800 text-sm font-medium">
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        ) : stats.recentBookings.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No recent bookings found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hotel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentBookings.map((booking) => (
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${booking.price}
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

export default Dashboard;