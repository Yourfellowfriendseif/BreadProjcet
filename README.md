# Anti-Wast: Bread Marketplace Platform

A platform connecting bakeries and consumers to reduce bread waste by selling or donating day-old bread.

## Features

### Core Features

- User Authentication and Authorization
- Bread Listings Management
- Real-time Chat System
- Push Notifications
- Advanced Search and Filtering
- Location-based Services
- Multi-image Upload Support
- User Profiles

### Enhanced User Experience

- Real-time Updates via WebSocket
- Responsive Design with Tailwind CSS
- Debounced Search Functionality
- Protected Routes
- Loading States and Spinners
- Error Handling and Validation

## Tech Stack

- React + Vite
- Tailwind CSS for styling
- Socket.io for real-time features
- Axios for API calls
- React Context for state management

## Project Structure

```
├── public/              # Static assets
│   └── vite.svg
├── src/
│   ├── api/            # API integration
│   │   ├── apiClient.js        # Axios instance
│   │   ├── breadAPI.js         # Bread endpoints
│   │   ├── chatAPI.js          # Chat endpoints
│   │   ├── notificationAPI.js  # Notification endpoints
│   │   ├── socketService.js    # WebSocket handling
│   │   └── userAPI.js          # User endpoints
│   ├── assets/         # Static resources
│   ├── components/
│   │   ├── LoadingSpinner.jsx
│   │   ├── NavBar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── UserProfile.jsx
│   │   ├── auth/      # Authentication components
│   │   ├── bread/     # Bread listing components
│   │   ├── chat/      # Chat system components
│   │   ├── common/    # Reusable components
│   │   ├── notifications/ # Notification components
│   │   ├── search/    # Search related components
│   │   └── user/      # User related components
│   ├── context/
│   │   └── AppContext.jsx  # Global state management
│   ├── hooks/
│   │   └── useDebounce.js  # Custom hooks
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── Home.jsx
│   │   ├── MessagesPage.jsx
│   │   └── NotFound.jsx
│   ├── types/         # TypeScript/PropTypes definitions
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env               # Environment variables
├── eslint.config.js   # ESLint configuration
├── index.html
├── package.json
├── tailwind.config.js # Tailwind CSS configuration
└── vite.config.js     # Vite configuration
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with required environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests (if configured)

## Recent Changes

### New Features

- Implemented real-time chat system
- Added push notifications
- Enhanced image upload with multi-image support
- Added location-based services
- Implemented debounced search functionality

### Technical Improvements

- Added WebSocket integration for real-time features
- Improved error handling and validation
- Enhanced state management with Context API
- Added loading states and spinners
- Implemented protected routes

## Next Steps

- Implement advanced filtering options
- Add user preferences
- Enhance chat features
- Implement social sharing
- Add analytics and reporting
- Optimize performance and loading times

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License.
