# Anti-Wast: Bread Marketplace Platform

![Project Banner](https://example.com/path-to-your-banner.jpg) <!-- Add your banner image later -->

A platform connecting bakeries and consumers to reduce bread waste by selling or donating day-old bread.

## Features

- **Enhanced User Authentication**
  - Secure JWT-based login/logout with automatic token refresh
  - Detailed error handling for registration (duplicate email/username)
  - Phone number and profile photo support
  - Role-based access (buyers/sellers/both)

- **Advanced Bread Listings**
  - Create/list bread posts with freshness status
  - GeoJSON location support with [longitude, latitude]
  - Quantity management
  - Post type differentiation (sell/request)

- **Core Improvements**
  - Comprehensive error handling system
  - Type-safe JavaScript with JSDoc
  - Responsive Tailwind CSS design
  - Optimized API service layer

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS with `@tailwindcss/forms` plugin
- React Router 6
- Axios with enhanced interceptors
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
│ │ ├── breadAPI.js # Bread endpoints
│ │ └── userAPI.js # User endpoints
│ ├── assets/ # Static assets
│ ├── components/
│ │ ├── auth/
│ │ │ ├── LoginForm.jsx # Updated with error handling
│ │ │ └── RegisterForm.jsx # Phone/photo support
│ │ ├── bread/
│ │ │ ├── BreadListing.jsx
│ │ │ └── CreateBreadForm.jsx # GeoJSON support
│ │ ├── ProtectedRoute.jsx
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
   cd breadproject
   npm install
   npm run dev

## Available Scripts
- `npm run dev` - Start Vite dev server
- `npm run build` - Create production build
- `npm run lint` - Run ESLint checks
- `npm run preview` - Preview production build locally

## API Documentation
#### Authentication
| Endpoint            | Method | Request Body                              | Success Response       | Error Responses                     |
|---------------------|--------|-------------------------------------------|------------------------|-------------------------------------|
| `/auth/register`    | POST   | `{username, email, password, phone_number, photo_url}` | `{token}`             | 400: Validation errors<br>409: Duplicate data |
| `/auth/login`       | POST   | `{email, password}`                       | `{token, user}`       | 401: Invalid credentials           |
| `/auth/logout`      | POST   | -                                         | `{message}`           | -                                   |

#### Bread Posts
| Endpoint              | Method | Request Body                                                                 | Success Response               | Error Responses                     |
|-----------------------|--------|------------------------------------------------------------------------------|--------------------------------|-------------------------------------|
| `/bread/create`       | POST   | `{post_type, bread_status, photo_url, quantity, location: {type, coordinates}}` | `{message, breadPost}`         | 401: Unauthorized<br>422: Validation errors |
| `/bread/all`          | GET    | -                                                                           | `Array<BreadPost>`             | -                                   |
| `/bread/delete/:id`   | DELETE | -                                                                           | `{message}`                    | 404: Not found<br>403: Forbidden    |

## type definition 
- `User` - {_id, username, email, phone_number, photo_url, role, createdAt}
- `BreadPost` - {_id, post_type, bread_status, photo_url, quantity, location, sellerId, createdAt}
- `ApiError` - Standardized error format