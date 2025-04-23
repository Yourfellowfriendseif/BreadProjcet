import { Link } from 'react-router-dom';
import SearchBar from './search/SearchBar';

export default function Navbar({ user }) {
  return (
    <nav className="bg-amber-600 p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-4">
        {/* Brand Logo */}
        <Link to="/" className="text-white font-bold text-xl">
          Anti-Wast
        </Link>
        
        {/* Search Bar - Only shown when user is logged in */}
        {user && (
          <div className="flex-grow max-w-xl">
            <SearchBar />
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex gap-4 items-center">
          <Link to="/about" className="text-white hover:underline">
            About
          </Link>
          
          {/* Conditional rendering based on auth status */}
          {user ? (
            <>
              <Link to="/bread" className="text-white hover:underline">
                Browse Bread
              </Link>
              <Link to="/bread/new" className="text-white hover:underline">
                Create Post
              </Link>
              <Link to="/profile" className="text-white hover:underline">
                My Profile
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:underline">
                Login
              </Link>
              <Link to="/register" className="text-white hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}