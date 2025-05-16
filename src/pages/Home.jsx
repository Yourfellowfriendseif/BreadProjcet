import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { breadAPI } from "../api/breadAPI";
import BreadListing from "../components/bread/BreadListing";
import LoadingSpinner from "../components/LoadingSpinner";
import FilterSection from '../components/FilterSection';
import "./Home.css";

export default function Home() {
  const { user } = useApp();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    province: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          loadPosts(location);
        },
        () => {
          loadPosts();
        }
      );
    } else {
      loadPosts();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    loadPosts(userLocation);
    // eslint-disable-next-line
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

      Object.keys(searchFilters).forEach(
        (key) => !searchFilters[key] && delete searchFilters[key]
      );

      const response = await breadAPI.searchPosts(searchFilters);
      const postsData =
        response?.data?.data?.posts ||
        response?.data?.posts ||
        response?.posts ||
        [];
      setPosts(postsData);
    } catch (error) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (action, post) => {
    if (action === 'deleted') {
      // Remove the deleted post from the state
      setPosts(currentPosts => currentPosts.filter(p => p._id !== post._id));
    }
  };

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, posts.length]);

  return (
    <div className="home home-bg">
      <div className="home-header modern-header">
        <h1 className="home-title">Available Bread</h1>
        <Link to="/posts/create" className="home-create-button modern-btn">
          <span className="material-symbols-outlined">add_circle</span>
          Create Post
        </Link>
      </div>

      <FilterSection
        filters={filters}
        setFilters={setFilters}
        onApply={() => loadPosts(userLocation)}
        onReset={() => loadPosts(userLocation)}
        animated
      />

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
          <BreadListing posts={paginatedPosts} onUpdate={handlePostUpdate} />
        </div>
      )}

      {totalPages > 1 && (
        <div className="home-pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`home-pagination-btn${
                page === currentPage ? " home-pagination-btn-active" : ""
              }`}
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
