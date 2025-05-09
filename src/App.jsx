import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import HotelDetails from './pages/HotelDetails';
import AdminDashboard from './pages/admin/Dashboard';
import AdminHotels from './pages/admin/Hotels';
import AdminBookings from './pages/admin/Bookings';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Protected route component
const ProtectedRoute = ({ children, adminRequired = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  
  if (!user) return <Navigate to="/login" />;
  if (adminRequired && !user.isAdmin) return <Navigate to="/" />;
  
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin/register" element={<AdminRegister />} />
        <Route path="hotels/:id" element={<HotelDetails />} />
        
        {/* Protected user routes */}
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* Protected admin routes */}
        <Route path="admin" element={
          <ProtectedRoute adminRequired={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="admin/hotels" element={
          <ProtectedRoute adminRequired={true}>
            <AdminHotels />
          </ProtectedRoute>
        } />
        <Route path="admin/bookings" element={
          <ProtectedRoute adminRequired={true}>
            <AdminBookings />
          </ProtectedRoute>
        } />
        
        {/* Not found route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;