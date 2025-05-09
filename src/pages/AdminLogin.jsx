import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await adminLogin(formData);
      toast.success('Admin login successful!');
      navigate('/admin');
    } catch (error) {
      console.error('Admin login error:', error);
      // Error toast is handled by API interceptor
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center py-8 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary-800 text-white p-6 text-center">
            <div className="flex justify-center mb-2">
              <Shield size={36} />
            </div>
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-primary-100">Access the hotel management dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="admin@luxstay.com"
              />
            </div>
            
            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-xs text-primary-700 hover:text-primary-800">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="••••••••"
              />
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="bg-primary-800 text-white w-full py-2 rounded-md font-medium hover:bg-primary-900 transition-colors flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  Sign In as Admin
                </>
              )}
            </button>
            
            <div className="text-center mt-4 text-gray-600">
              <p>
                Don't have an admin account?{' '}
                <Link to="/admin/register" className="text-primary-700 hover:text-primary-800">
                  Register as Admin
                </Link>
              </p>
              <p className="mt-2">
                Return to{' '}
                <Link to="/login" className="text-primary-700 hover:text-primary-800">
                  User Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;