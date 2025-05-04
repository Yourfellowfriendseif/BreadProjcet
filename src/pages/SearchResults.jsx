// src/pages/SearchResults.jsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { breadAPI } from '../api/breadAPI';
import BreadListing from '../components/bread/BreadListing';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SearchResults() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    loadResults(Object.fromEntries(searchParams));
  }, [location.search]);

  const loadResults = async (params) => {
    try {
      setLoading(true);
      setError(null);
      const response = await breadAPI.search(params);
      setResults(response.data);
    } catch (error) {
      setError(error.message || 'Failed to load search results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-700">No Results Found</h2>
        <p className="mt-2 text-gray-500">
          Try adjusting your search filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Search Results ({results.length})
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((post) => (
          <BreadListing
            key={post._id}
            post={post}
            onUpdate={() => loadResults(
              Object.fromEntries(new URLSearchParams(location.search))
            )}
          />
        ))}
      </div>
    </div>
  );
}
