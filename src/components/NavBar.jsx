import { Link } from 'react-router-dom';
import SearchBar from './search/SearchBar';

export default function Navbar() {
  return (
    <nav className="bg-amber-600 p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-4">
        <Link to="/" className="text-white font-bold text-xl">
          Anti-Wast
        </Link>
        
        <div className="flex-grow max-w-xl">
          <SearchBar />
        </div>

        <div className="flex gap-4">
          <Link to="/about" className="text-white hover:underline">
            About
          </Link>
          {/* Add other navigation links as needed */}
        </div>
      </div>
    </nav>
  );
}