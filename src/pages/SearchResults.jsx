// src/pages/SearchResults.jsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BreadListing from '../components/bread/BreadListing';
import UserCard from '../components/user/UserCard';
import api from '../api/apiClient';

export default function SearchResults() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'bread';

    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/search?q=${query}&type=${type}`);
        setResults(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Search failed');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [location.search]);

  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type') || 'bread';

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">
            Search Results for "{searchParams.get('q')}"
          </h2>
          
          {type === 'bread' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((bread) => (
                <BreadListing key={bread._id} bread={bread} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {results.map((user) => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}