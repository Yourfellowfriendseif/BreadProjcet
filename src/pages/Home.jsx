import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { breadAPI } from '../api/breadAPI';
import BreadListing from '../components/bread/BreadListing';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css';

export default function Home() {
  const { user } = useApp();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    post_type: '',
    maxDistance: 10000
  });
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    // Get user's location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          loadPosts(location);
        },
        () => {
          // Fallback to loading all posts if location is not available
          loadPosts();
        }
      );
    } else {
      loadPosts();
    }
  }, []);

  useEffect(() => {
    loadPosts(userLocation);
  }, [filters]);

  const loadPosts = async (location = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const searchFilters = { ...filters };
      if (location) {
        searchFilters.location = location;
        searchFilters.radius = filters.radius;
      }

      // Remove empty filters
      Object.keys(searchFilters).forEach(key => 
        !searchFilters[key] && delete searchFilters[key]
      );

      const response = await breadAPI.searchPosts(searchFilters);
      setPosts(response.posts || []);
    } catch (error) {
      setError("Failed to load posts");
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyPosts = async (location) => {
    try {
      setLoading(true);
      const response = await breadAPI.getNearbyPosts({
        lat: location.lat,
        lng: location.lng,
        maxDistance: filters.maxDistance,
        ...filters
      });
      setPosts(response.data || []);
    } catch (error) {
      setError('Failed to load nearby posts');
      console.error('Error loading nearby posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = () => {
    if (userLocation) {
      loadNearbyPosts(userLocation);
    } else {
      loadPosts();
    }
  };

  // Calculate paginated posts
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const paginatedPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when filters or posts change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, posts.length]);

  return (
    <div className="home">
      <div className="home-header">
        <h1 className="home-title">Available Bread</h1>
        <Link
          to="/posts/create"
          className="home-create-button"
        >
          Create Post
        </Link>
      </div>

      <div className="home-filters">
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="home-filter-select"
        >
          <option value="">All Status</option>
          <option value="fresh">Fresh</option>
          <option value="day_old">Day Old</option>
          <option value="expired">Expired</option>
        </select>

        <select
          value={filters.post_type}
          onChange={(e) => setFilters(prev => ({ ...prev, post_type: e.target.value }))}
          className="home-filter-select"
        >
          <option value="">All Types</option>
          <option value="sell">Sell</option>
          <option value="request">Request</option>
        </select>

        {userLocation && (
          <select
            value={filters.maxDistance}
            onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: Number(e.target.value) }))}
            className="home-filter-select"
          >
            <option value="5000">Within 5km</option>
            <option value="10000">Within 10km</option>
            <option value="20000">Within 20km</option>
            <option value="50000">Within 50km</option>
          </select>
        )}
      </div>

      {error && (
        <div className="home-error">
          <p className="home-error-text">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="home-posts-loading">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="home-posts-error">{error}</div>
      ) : (
        <div className="home-posts-grid">
          <BreadListing posts={paginatedPosts} />
        </div>
      )}
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="home-pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`home-pagination-btn${page === currentPage ? ' home-pagination-btn-active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}