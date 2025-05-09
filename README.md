# Bread Project

A web application for managing and sharing bread-related information, built with React and modern web technologies.

## Features

- User authentication and authorization
- Bread management (create, read, update, delete)
- Location-based bread sharing
- Image upload and management
- Real-time notifications
- Responsive design
- Modern UI components

## Tech Stack

- **Frontend:**

  - React 18
  - React Router v6
  - CSS Modules
  - Leaflet (for maps)
  - React Hot Toast (for notifications)
  - Date-fns (for date formatting)

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication
  - Multer (for file uploads)

## Project Structure

```
src/
├── api/              # API integration
├── assets/           # Static assets
├── components/       # React components
│   ├── common/       # Reusable components
│   ├── layout/       # Layout components
│   └── pages/        # Page components
├── context/          # React context
├── hooks/            # Custom hooks
├── styles/           # Global styles
└── utils/            # Utility functions
```

## Component Library

The project includes a comprehensive set of reusable components:

### Common Components

- **Avatar**: User avatar with fallback to initials
- **Badge**: Status indicators with multiple variants
- **Button**: Action buttons with loading states
- **ConfirmDialog**: Confirmation dialogs
- **ErrorMessage**: Error message display
- **FormGroup**: Form field wrapper with label and error handling
- **ImageUpload**: Image upload with preview
- **LocationPicker**: Map-based location selection
- **Modal**: Modal dialog
- **NoResults**: Empty state display
- **TimeAgo**: Relative time display
- **Toast**: Notification system
- **ValidationError**: Form validation error display

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/bread-project.git
   cd bread-project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

### Code Style

- Follow the existing component structure
- Use CSS modules for component-specific styles
- Maintain consistent naming conventions
- Write meaningful component and function names

### Component Guidelines

- Keep components focused and single-responsibility
- Use prop-types for type checking
- Implement proper error handling
- Follow accessibility best practices
- Use semantic HTML elements

### CSS Guidelines

- Use CSS modules for component-specific styles
- Follow BEM naming convention
- Maintain consistent spacing and colors
- Use CSS variables for theming
- Implement responsive design patterns

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
