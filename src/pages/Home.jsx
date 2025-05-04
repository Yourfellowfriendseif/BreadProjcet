import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { breadAPI } from '../api/breadAPI';
import BreadListing from '../components/bread/BreadListing';
import LoadingSpinner from '../components/LoadingSpinner';

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
          loadNearbyPosts(location);
        },
        () => {
          // Fallback to loading all posts if location is not available
          loadAllPosts();
        }
      );
    } else {
      loadAllPosts();
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      loadNearbyPosts(userLocation);
    } else {
      loadAllPosts();
    }
  }, [filters]);

  const loadAllPosts = async () => {
    try {
      setLoading(true);
      const response = await breadAPI.getAll(filters);
      setPosts(response.data || []);
    } catch (error) {
      setError('Failed to load posts');
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyPosts = async (location) => {
    try {
      setLoading(true);
      const response = await breadAPI.getNearbyPosts({
        location: {
          type: "Point",
          coordinates: [location.lng, location.lat]
        },
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
      loadAllPosts();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Bread</h1>
        <Link
          to="/bread/new"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create Post
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Status</option>
          <option value="fresh">Fresh</option>
          <option value="day_old">Day Old</option>
          <option value="expired">Expired</option>
        </select>

        <select
          value={filters.post_type}
          onChange={(e) => setFilters(prev => ({ ...prev, post_type: e.target.value }))}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Types</option>
          <option value="sell">For Sale</option>
          <option value="request">Requests</option>
        </select>

        {userLocation && (
          <select
            value={filters.maxDistance}
            onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: Number(e.target.value) }))}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="5000">Within 5km</option>
            <option value="10000">Within 10km</option>
            <option value="20000">Within 20km</option>
            <option value="50000">Within 50km</option>
          </select>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="text-xl">No posts found</p>
          <p className="mt-2">Try adjusting your filters or create a new post</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BreadListing
              key={post._id}
              post={post}
              onUpdate={handlePostUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}