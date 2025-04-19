# Anti-Wast: Bread Marketplace Platform

![Project Banner](https://example.com/path-to-your-banner.jpg) <!-- Add your banner image later -->

A platform connecting bakeries and consumers to reduce bread waste by selling or donating day-old bread.

## Features

- **Enhanced User Authentication**

  - Secure JWT-based login/logout with automatic token refresh
  - Detailed error handling for registration (duplicate email/username)
  - Phone number and profile photo support
  - Role-based access (buyers/sellers/both)
  - _Improved parameter validation and error messaging in login form_

- **Advanced Bread Listings**

  - Create/list bread posts with freshness status
  - GeoJSON location support with [longitude, latitude]
  - Quantity management with additional validations
  - Post type differentiation (sell/request)
  - _Conditional rendering for empty listings and enhanced logging_

- **Core Improvements**
  - Comprehensive error handling system
  - Type-safe JavaScript with JSDoc
  - Responsive Tailwind CSS design
  - Optimized API service layer with consistent request formatting
  - _Refactored API endpoints (e.g. updated profile endpoint to `/user/me`)_

## Tech Stack

### Frontend

- React 18 + Vite
- Tailwind CSS with `@tailwindcss/forms` plugin
- React Router 6 (Protected routes now using Outlet)
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
│ │ ├── breadAPI.js # Bread endpoints (default photo URL & logging added)
│ │ └── userAPI.js # User endpoints (profile endpoint updated to `/user/me`)
│ ├── assets/ # Static assets
│ ├── components/
│ │ ├── auth/
│ │ │ ├── LoginForm.jsx # Improved parameter handling and error messaging
│ │ │ └── RegisterForm.jsx # Phone/photo support
│ │ ├── bread/
│ │ │ ├── BreadListing.jsx # Now supports empty list rendering and enhanced logging
│ │ │ └── CreateBreadForm.jsx # Refined coordinate validations and error messaging
│ │ ├── ProtectedRoute.jsx # Refactored to use Outlet for routing
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

- Updated **breadAPI**:
  - Default photo URL set.
  - Enhanced logging in the getAll endpoint.
- Modified **userAPI**:
  - Profile endpoint updated from `/users/me` to `/user/me`.
  - Standardized request formatting.
- Refactored **ProtectedRoute.jsx** to use Outlet for improved routing.
- Enhanced **LoginForm.jsx**, **BreadListing.jsx**, and **CreateBreadForm.jsx** with improved state handling, validations, and error messaging.
