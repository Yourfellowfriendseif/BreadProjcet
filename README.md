# Anti-Wast: Bread Marketplace Platform

![Project Banner](https://example.com/path-to-your-banner.jpg) <!-- Add your banner image later -->

A platform connecting bakeries and consumers to reduce bread waste by selling or donating day-old bread.

## Features

- **User Authentication**
  - Secure JWT-based login/logout
  - Role-based access (buyers/sellers)
  - Protected routes

- **Bread Listings**
  - Create/list bread posts with freshness status
  - Geo-location based listings
  - Image upload support

- **Core Functionality**
  - Responsive Tailwind CSS design
  - MongoDB database integration
  - React Router navigation

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS with `@tailwindcss/forms` plugin
- React Router 6
- Axios for API calls
- React Hook Form (optional)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- GeoJSON location handling

## Project Structure
PROJECTFINAL/
.dist/ # Production build
node_modules/ # Dependencies
public/
  images/ # Image storage
src/
  api/
    apiClient.js # Axios configuration
    breadAPI.js # Bread endpoints
    userAPI.js # User endpoints
  assets/ # Static assets
  components/
    auth/
      LoginForm.jsx
      RegisterForm.jsx
    bread/
      BreadListing.jsx
      CreateBreadForm.jsx
    ProtectedRoute.jsx
    UserProfile.jsx
  context/
    AppContext.jsx # Global state
  mocks/
    data.js # Mock data
  pages/
    About.jsx
    Home.jsx
    NotFound.jsx
  types/
    dbTypes.js # Type definitions
    schema.js # Data schemas
  App.jsx # Root component
  App.css # Global styles
  index.css # Base styles
  main.jsx # Entry point
.env # Environment vars
.gitignore
eslint.config.js # ESLint config
index.html # HTML template
package.json
package-lock.json
tailwind.config.js # Tailwind config
vite.config.js # Vite config

## Setup Instructions
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/anti-wast.git
   cd breadproject$
   npm install
   npm run dev 

## Available Scripts
- `npm run dev` - Start Vite dev server
- `npm run build` - Create production build
- `npm run lint` - Run ESLint checks
- `npm run preview` - Preview production build locally

## API Documentation
#### Authentication
| Endpoint          | Method | Description          |
|-------------------|--------|----------------------|
| `/auth/register`  | POST   | User registration    |
| `/auth/login`     | POST   | User login           |
| `/auth/logout`    | POST   | User logout          |

#### Bread Posts
| Endpoint              | Method  | Description                |
|-----------------------|---------|----------------------------|
| `/bread/create`       | POST    | Create new bread post      |
| `/bread/all`          | GET     | Get all bread posts        |
| `/bread/delete/:id`   | DELETE  | Delete a bread post        |