import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

function HotelCard({ hotel }) {
  const { _id, name, location, price, rating, image, amenities } = hotel;
  
  return (
    <div className="card group animate-fade-in">
      <div className="relative overflow-hidden h-48">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-sm font-semibold flex items-center">
          <Star size={16} className="text-yellow-400 mr-1" />
          {rating}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-1 text-primary-800">{name}</h3>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{location}</span>
        </div>
        
        {amenities && amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {amenities.slice(0, 3).map((amenity, index) => (
              <span 
                key={index} 
                className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full">
                +{amenities.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-2">
          <div>
            <span className="text-xl font-bold text-primary-700">${price}</span>
            <span className="text-gray-500 text-sm"> / night</span>
          </div>
          <Link 
            to={`/hotels/${_id}`} 
            className="btn-outline text-sm px-3 py-1.5"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;