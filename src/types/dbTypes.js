// User type
export const User = {
  _id: String,
  username: String,
  email: String,
  phone_number: String,
  photo_url: String,
  createdAt: String
};

// Bread type
export const BreadPost = {
  _id: String,
  post_type: String, // 'sell' or 'request'
  bread_status: String, // 'fresh', 'day_old', 'stale'
  photo_url: String,
  quantity: Number,
  location: {
    type: String,
    coordinates: [Number, Number]
  },
  user: User, // Embedded user data
  createdAt: String
};

// For forms
export const BreadFormValues = {
  post_type: 'sell',
  bread_status: 'day_old',
  photo_url: '',
  quantity: 1,
  location: {
    lng: 0,
    lat: 0
  }
};