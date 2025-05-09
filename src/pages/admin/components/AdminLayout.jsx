import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Hotel, LayoutDashboard, BedDouble, CalendarCheck, UserCircle, LogOut, Menu, X } from 'lucide-react';

function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  
  const isActiveRoute = (path) => location.pathname === path;
  
  const sidebarItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard size={20} />
    },
    {
      name: 'Hotels',
      path: '/admin/hotels',
      icon: <BedDouble size={20} />
    },
    {
      name: 'Bookings',
      path: '/admin/bookings',
      icon: <CalendarCheck size={20} />
    }
  ];
  
  return (
    <div className="flex flex-col lg:flex-row min-h-[80vh]">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden p-4 border-b">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Sidebar */}
      <div className={`
        lg:flex flex-col w-full lg:w-64 bg-white border-r border-gray-200
        ${sidebarOpen ? 'flex' : 'hidden'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b">
          <Link to="/admin" className="flex items-center space-x-2">
            <Hotel size={24} className="text-primary-700" />
            <span className="text-xl font-bold text-primary-800">Admin Panel</span>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="flex-grow p-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActiveRoute(item.path)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User Profile */}
        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserCircle size={32} className="text-gray-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="mt-3 flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;