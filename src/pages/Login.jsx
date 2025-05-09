import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Hotel } from 'lucide-react';
import toast from 'react-hot-toast';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  
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
      await login(formData);
      toast.success('Login successful!');
      navigate(from);
    } catch (error) {
      console.error('Login error:', error);
      // Error toast is handled by API interceptor
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center py-8 animate-fade-in bg-gray-100 min-h-screen">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary-700 text-white p-6 text-center">
            <div className="flex justify-center mb-2">
              <Hotel size={36} />
            </div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-primary-100">Login to your LuxStay account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="your@email.com"
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
                minLength={6}
              />
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <span>Logging in...</span>
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  Login
                </>
              )}
            </button>
            
            <div className="text-center mt-4 text-gray-600">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-700 hover:text-primary-800">
                  Register
                </Link>
              </p>
              <p className="mt-2 text-sm">
                Are you an admin?{' '}
                <Link to="/admin/login" className="text-primary-700 hover:text-primary-800">
                  Admin Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;