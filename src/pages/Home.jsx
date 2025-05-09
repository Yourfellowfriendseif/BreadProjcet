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
          <option value="offer">Offers</option>
          <option value="request">Requests</option>
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
        <div className="home-loading">
          <LoadingSpinner />
        </div>
      ) : posts.length === 0 ? (
        <div className="home-empty">
          <p className="home-empty-title">No posts found</p>
          <p className="home-empty-text">Try adjusting your filters or create a new post</p>
        </div>
      ) : (
        <div className="home-posts-grid">
          {posts.map((post) => (
            <BreadListing
              key={post._id}
              post={post}
              onUpdate={() => loadPosts(userLocation)}
            />
          ))}
        </div>
      )}
    </div>
  );
}