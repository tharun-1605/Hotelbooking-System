import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hotel name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 4
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  images: {
    type: [String],
    default: []
  },
  amenities: {
    type: [String],
    default: []
  },
  policies: {
    checkIn: {
      type: String,
      default: '2:00 PM'
    },
    checkOut: {
      type: String,
      default: '12:00 PM'
    },
    cancellation: {
      type: String,
      default: 'Free cancellation up to 24 hours before check-in'
    },
    pets: {
      type: String,
      default: 'Pets not allowed'
    },
    children: {
      type: String,
      default: 'Children of all ages are welcome'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;