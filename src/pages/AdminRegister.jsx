import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

function AdminRegister() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: ''
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
  
  const validateForm = () => {
    const newErrors = {};
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.adminCode) {
      newErrors.adminCode = 'Admin registration code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const { confirmPassword, ...registerData } = formData;
      const { data } = await api.post('/api/auth/admin/register', registerData);
      
      // Set token and redirect
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      toast.success('Admin registration successful!');
      navigate('/admin');
    } catch (error) {
      console.error('Registration error:', error);
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
            <h1 className="text-2xl font-bold">Admin Registration</h1>
            <p className="text-primary-100">Create an admin account for LuxStay</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="John Doe"
              />
            </div>
            
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
                placeholder="admin@luxstay.com"
              />
            </div>
            
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
                minLength={6}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            
            {/* Admin Code */}
            <div>
              <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Registration Code
              </label>
              <input
                type="text"
                id="adminCode"
                name="adminCode"
                value={formData.adminCode}
                onChange={handleChange}
                required
                className={`input-field ${errors.adminCode ? 'border-red-500' : ''}`}
                placeholder="Enter admin code"
              />
              {errors.adminCode && (
                <p className="text-red-500 text-xs mt-1">{errors.adminCode}</p>
              )}
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <UserPlus size={18} className="mr-2" />
                  Register as Admin
                </>
              )}
            </button>
            
            <div className="text-center mt-4 text-gray-600">
              <p>
                Already have an admin account?{' '}
                <Link to="/admin/login" className="text-primary-700 hover:text-primary-800">
                  Login as Admin
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;