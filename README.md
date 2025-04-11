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
breadProject/
├── dist/                   # Production build (auto-generated)
├── node_modules/           # Dependencies (auto-generated)
├── public/                 # Static assets
│   ├── images/             # Store all images here
│   └── favicon.ico         # Website icon
├── src/
│   ├── api/                # API service layer
│   │   ├── apiClient.js    # Axios instance
│   │   ├── breadAPI.js     # Bread endpoints
│   │   └── userAPI.js      # Auth endpoints
│   ├── assets/             # Generated assets (fonts, etc.)
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── bread/
│   │   │   ├── BreadCard.jsx
│   │   │   └── CreateForm.jsx
│   │   └── layout/
│   │       ├── Header.jsx
│   │       └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   └── NotFound.jsx
│   ├── styles/
│   │   ├── main.css        # Tailwind imports
│   │   └── animations.css  # Custom animations
│   ├── App.jsx
│   └── main.jsx            # Entry point
├── .env                    # Environment variables
├── .eslintrc.js            # ESLint config
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js      # Tailwind configuration
└── vite.config.js          # Vite configuration

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/anti-wast.git
   cd breadproject$
   npm install
   npm run dev 

## Available Scripts
npm run dev - Start Vite dev server
npm run build - Production build
npm run lint - Run ESLint
npm run preview - Preview production build 

## API Documentation
  Authentication
Endpoint	Method	Description
/auth/register	POST	User registration
/auth/login	POST	User login
/auth/logout	POST	User logout
  Bread Posts
Endpoint	Method	Description
/bread/create	POST	Create new bread post
/bread/all	GET	Get all bread posts
/bread/delete/:id	DELETE	Delete a bread post