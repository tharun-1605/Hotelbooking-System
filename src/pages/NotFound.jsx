import { Link } from 'react-router-dom';
import { Hotel, ArrowLeft } from 'lucide-react';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="text-primary-300 mb-4">
        <Hotel size={80} />
      </div>
      <h1 className="text-4xl font-bold text-primary-800 mb-2">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Page Not Found</p>
      <p className="text-gray-500 max-w-md text-center mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="btn-primary flex items-center"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;