# Anti-Wast: Bread Marketplace Platform

![Project Banner](https://example.com/path-to-your-banner.jpg) <!-- Add your banner image later -->

A platform connecting bakeries and consumers to reduce bread waste by selling or donating day-old bread.

## Features

### Enhanced User Authentication

- Secure JWT-based login/logout with automatic token refresh
- Detailed error handling for registration (duplicate email/username)
- Phone number and profile photo support
- Role-based access (buyers/sellers/both)
- Improved parameter validation and error messaging in login form

### Advanced Bread Listings

- Create/list bread posts with freshness status
- **Interactive Leaflet map for location selection**
- **Comprehensive search and filtering system**
- **Multiple image upload support**
- Quantity management with additional validations
- Post type differentiation (sell/request)
- Conditional rendering for empty listings and enhanced logging
- **Post reservation system**

### New Implemented Features

- **Geolocation Services**
  - Interactive map interface using Leaflet
  - Click-to-select location functionality
  - Coordinate validation and display
  - Nearby posts functionality

- **Enhanced Search System**
  - Real-time filtering of bread listings
  - Case-insensitive search across multiple fields
  - Combined with sorting for powerful discovery
  - Location-based filtering

- **Image Management**
  - Multiple image upload support
  - Image preview functionality
  - Responsive image display

### Core Improvements

- Comprehensive error handling system
- Type-safe JavaScript with JSDoc
- Responsive Tailwind CSS design
- Optimized API service layer with consistent request formatting
- Refactored to match backend API structure
- Improved form validation and user feedback

## Tech Stack

### Frontend

- React 18 + Vite
- Tailwind CSS with `@tailwindcss/forms` plugin
- React Router 6 (Protected routes using Outlet)
- Axios with enhanced interceptors
- React-Leaflet for interactive maps
- JSDoc type checking

### Backend Integration

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- GeoJSON location handling
- RESTful API endpoints
- Multer for image uploads

## Project Structure

PROJECTFINAL/
├── .dist/ # Production build
├── node_modules/ # Dependencies
├── public/ # Static assets
│ └── images/ # Image storage
├── src/
│ ├── api/ # API handlers
│ │ ├── apiClient.js # Enhanced Axios instance
│ │ ├── breadAPI.js # Updated bread endpoints
│ │ └── userAPI.js # User endpoints
│ ├── assets/ # Static assets
│ ├── components/
│ │ ├── auth/
│ │ │ ├── LoginForm.jsx
│ │ │ └── RegisterForm.jsx
│ │ ├── bread/
│ │ │ ├── BreadListing.jsx # Updated with new post structure
│ │ │ ├── CreateBreadForm.jsx # With multi-image upload
│ │ │ ├── SearchBar.jsx
│ │ │ └── SortDropdown.jsx
│ │ ├── common/
│ │ │ └── LocationPicker.jsx
│ │ ├── ProtectedRoute.jsx
│ │ └── UserProfile.jsx
│ ├── context/
│ │ └── AppContext.jsx
│ ├── mocks/
│ │ └── data.js
│ ├── pages/
│ │ ├── About.jsx
│ │ ├── Home.jsx
│ │ └── NotFound.jsx
│ ├── types/
│ │ └── schema.js # Updated type definitions
│ ├── App.jsx
│ ├── App.css
│ ├── index.css
│ └── main.jsx
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
└── vite.config.js

## Setup Instructions

1. **Clone and install**
   ```bash
   git clone https://github.com/Yourfellowfriendseif/BreadProjcet.git
   cd BreadProjcet
   npm install
   npm run dev
   npm install leaflet react-leaflet
   ```

## Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Create production build
- `npm run lint` - Run ESLint checks
- `npm run preview` - Preview production build locally

## API Documentation

### Authentication

| Endpoint         | Method | Request Body                                           | Success Response               | Error Responses                               |
|------------------|--------|-------------------------------------------------------|---------------------------------|----------------------------------------------|
| `/auth/register` | POST   | `{username, email, password, phone_number, photo_url}` | `{token, user}`                | 400: Validation errors<br>409: Duplicate data |
| `/auth/login`    | POST   | `{email, password}`                                   | `{token, user}`                | 401: Invalid credentials                     |
| `/auth/logout`   | POST   | -                                                     | `{message}`                    | 401: Unauthorized                            |

### User Management

| Endpoint          | Method | Request Body                     | Success Response | Error Responses          |
|-------------------|--------|----------------------------------|------------------|--------------------------|
| `/user/me`        | GET    | -                                | `{user}`         | 401: Unauthorized        |
| `/user/profile`   | PUT    | `{name, email, phone, photoUrl}` | `{user}`         | 400: Validation errors   |
| `/user/password`  | PUT    | `{currentPassword, newPassword}` | `{message}`      | 401: Wrong password      |

### Image Management

| Endpoint               | Method | Content-Type           | Response                          | Error Responses          |
|------------------------|--------|------------------------|-----------------------------------|--------------------------|
| `/api/upload`          | POST   | multipart/form-data    | `{status, data: {image}}`         | 400: Invalid file type   |
| `/api/upload/multiple` | POST   | multipart/form-data    | `{status, data: {images: []}}`    | 413: File too large      |
| `/api/upload/:filename`| DELETE | -                      | `{status, message}`               | 404: File not found      |

### Post Management

| Endpoint                  | Method | Request Body                                                                 | Success Response               | Error Responses                     |
|---------------------------|--------|------------------------------------------------------------------------------|---------------------------------|-------------------------------------|
| `/api/posts/create`       | POST   | `{post_type, status, category, description, quantity, location, imageIds}` | `{post}`                       | 422: Validation errors              |
| `/api/posts/all`          | GET    | -                                                                            | `{posts: [], pagination: {}}`  | -                                   |
| `/api/posts/nearby`       | POST   | `{location: {coordinates}, maxDistance}`                                    | `{posts: []}`                  | 400: Invalid location               |
| `/api/posts/reserve/:id`  | PUT    | -                                                                            | `{post}`                       | 409: Already reserved               |
| `/api/posts/search`       | GET    | Query params: `q, status, post_type, lat, lng, radius`                     | `{posts: [], pagination: {}}`  | -                                   |

## Recent Changes

### Frontend Updates

- **Post Structure Revamp**
  - Changed from `bread_status` to `status` field
  - Added `category` and `description` fields
  - Replaced single `photo_url` with multiple `imageIds`
  - Updated all forms and displays accordingly

- **Enhanced Image Handling**
  - Implemented multi-image upload interface
  - Added image preview functionality
  - Created responsive image galleries
  - Improved error handling for uploads

- **Location Services**
  - Standardized coordinate handling [lng, lat]
  - Added better map interaction feedback
  - Implemented address validation

- **UI/UX Improvements**
  - Consistent form styling across components
  - Better error visualization
  - Responsive design refinements
  - Improved loading states

### Backend Coordination

- **API Endpoint Alignment**
  - Updated all endpoints to `/api/` prefix
  - Standardized success/error responses
  - Implemented proper status codes

- **New Features Integration**
  - Post reservation system
  - Location-based post filtering
  - Advanced search functionality
  - Multi-image support

- **Performance Optimizations**
  - Reduced unnecessary API calls
  - Improved data caching
  - Better error recovery flows

## Next Steps

### Immediate Priorities

1. **Real-time Notifications System**
   - Implement socket.io for live updates
   - Notify users about reservations
   - Alert for new nearby posts

2. **User Rating System**
   - Post-collection feedback
   - User reputation scores
   - Review moderation tools

3. **In-app Messaging**
   - Direct user-to-user chat
   - Message notifications
   - Conversation history

### Near-term Roadmap

- **Admin Dashboard**
  - User management
  - Content moderation
  - Analytics reporting

- **Enhanced Search**
  - Saved searches
  - Search history
  - Advanced filters

- **Mobile Optimization**
  - PWA support
  - Offline capabilities
  - Camera upload integration

### Future Considerations

- Social sharing features
- Subscription model for bakeries
- Food safety guidelines integration
- Multi-language support