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
- **Comprehensive search functionality**
- Quantity management with additional validations
- Post type differentiation (sell/request)
- Conditional rendering for empty listings and enhanced logging

### New Implemented Features

- **Geolocation Integration**
  - Interactive map interface using Leaflet
  - Click-to-select location functionality
  - Coordinate display and validation
- **Search System**
  - Real-time filtering of bread listings
  - Case-insensitive search across bread attributes
  - Combined with sorting for powerful discovery

### Core Improvements

- Comprehensive error handling system
- Type-safe JavaScript with JSDoc
- Responsive Tailwind CSS design
- Optimized API service layer with consistent request formatting
- Refactored API endpoints (e.g. updated profile endpoint to `/user/me`)

## Tech Stack

### Frontend

- React 18 + Vite
- Tailwind CSS with `@tailwindcss/forms` plugin
- React Router 6 (Protected routes using Outlet)
- Axios with enhanced interceptors
- **React-Leaflet** for interactive maps
- JSDoc type checking

### Backend Integration

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- GeoJSON location handling
- RESTful API endpoints

## Project Structure

PROJECTFINAL/
├── .dist/ # Production build
├── node_modules/ # Dependencies
├── public/ # Static assets
│ └── images/ # Image storage
├── src/
│ ├── api/ # API handlers
│ │ ├── apiClient.js # Enhanced Axios instance
│ │ ├── breadAPI.js # Bread endpoints (default photo URL & logging added)
│ │ └── userAPI.js # User endpoints (profile endpoint updated to /user/me)
│ ├── assets/ # Static assets
│ ├── components/
│ │ ├── auth/
│ │ │ ├── LoginForm.jsx # Improved parameter handling
│ │ │ └── RegisterForm.jsx # Phone/photo support
│ │ ├── bread/
│ │ │ ├── BreadListing.jsx # Now with search and sorting
│ │ │ ├── CreateBreadForm.jsx # With Leaflet map integration
│ │ │ └── SearchBar.jsx # New search component
│ │ ├── common/
│ │ │ └── LocationPicker.jsx # New Leaflet map component
│ │ ├── ProtectedRoute.jsx # Refactored to use Outlet
│ │ └── UserProfile.jsx
│ ├── context/
│ │ └── AppContext.jsx # Global state
│ ├── mocks/
│ │ └── data.js # Mock data
│ ├── pages/
│ │ ├── About.jsx
│ │ ├── Home.jsx
│ │ └── NotFound.jsx
│ ├── types/
│ │ └── schema.js # Consolidated type definitions
│ ├── App.jsx # Root component
│ ├── App.css # Global styles
│ ├── index.css # Base styles
│ └── main.jsx # Entry point
├── .env # Environment vars
├── .gitignore
├── eslint.config.js # ESLint config
├── index.html # HTML template
├── package.json
├── package-lock.json
├── tailwind.config.js # Tailwind config
└── vite.config.js # Vite config

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

#### Authentication

| Endpoint         | Method | Request Body                                           | Success Response | Error Responses                               |
| ---------------- | ------ | ------------------------------------------------------ | ---------------- | --------------------------------------------- |
| `/auth/register` | POST   | `{username, email, password, phone_number, photo_url}` | `{token}`        | 400: Validation errors<br>409: Duplicate data |
| `/auth/login`    | POST   | `{email, password}`                                    | `{token, user}`  | 401: Invalid credentials                      |
| `/auth/logout`   | POST   | -                                                      | `{message}`      | -                                             |

#### User Profile

| Endpoint   | Method | Request Body | Success Response           | Error Responses   |
| ---------- | ------ | ------------ | -------------------------- | ----------------- |
| `/user/me` | GET    | -            | `User` profile information | 401: Unauthorized |

#### Bread Posts

| Endpoint            | Method | Request Body                                                                    | Success Response       | Error Responses                             |
| ------------------- | ------ | ------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------- |
| `/bread/create`     | POST   | `{post_type, bread_status, photo_url, quantity, location: {type, coordinates}}` | `{message, breadPost}` | 401: Unauthorized<br>422: Validation errors |
| `/bread/all`        | GET    | -                                                                               | `Array<BreadPost>`     | -                                           |
| `/bread/delete/:id` | DELETE | -                                                                               | `{message}`            | 404: Not found<br>403: Forbidden            |

## API Documentation Details

- **Authentication:** Secure endpoints for registration, login, logout, and fetching user profile with updated userAPI integration.
- **Bread Posts:** Endpoints to create, view, and delete bread posts with enhanced validations and logging.

## Recent Changes

## Recent Changes

### Frontend Updates

#### Added Leaflet Map Integration

- Interactive location selection in CreateBreadForm
- Visual feedback for selected coordinates
- Proper marker icons and tile layers
- Mobile-responsive map container
- Coordinate validation system

#### Implemented Search Functionality

- Dedicated `SearchBar` component
- Real-time filtering of bread listings
- Case-insensitive search across:
  - Bread type
  - Description
  - Location names
- Preserves active sorting during searches

#### UI Improvements

- Enhanced form layouts with Tailwind CSS
- Improved error display components
- Responsive design for all map components
- Animated transitions for search results
- Accessible form labels and controls

### Backend Coordination

- Added `/bread/search` endpoint documentation
- Verified GeoJSON compatibility with Leaflet
- Standardized coordinate handling as `[longitude, latitude]`
- Updated error handling for location validation
- Optimized search query performance
