// src/pages/SearchResults.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { breadAPI } from '../api/breadAPI';
import { userAPI } from '../api/userAPI';
import BreadListing from '../components/bread/BreadListing';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState({
    posts: [],
    users: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';

  useEffect(() => {
    performSearch();
  }, [query, type]);

  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      const [postsResponse, usersResponse] = await Promise.all([
        type !== 'users' ? breadAPI.searchPosts({ query }) : Promise.resolve([]),
        type !== 'posts' ? userAPI.searchUsers(query) : Promise.resolve([])
      ]);

      setResults({
        posts: postsResponse || [],
        users: usersResponse || []
      });
    } catch (err) {
      setError(err.message || 'Search failed');
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for "{query}"
      </h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === 'posts'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('posts')}
        >
          Posts ({results.posts.length})
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'users'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('users')}
        >
          Users ({results.users.length})
        </button>
      </div>

      {activeTab === 'posts' ? (
        results.posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.posts.map((post) => (
              <BreadListing
                key={post._id}
                post={post}
                onUpdate={performSearch}
              />
            ))}
          </div>
        )
      ) : (
        results.users.length === 0 ? (
          <p className="text-center text-gray-500">No users found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.users.map((user) => (
              <div
                key={user._id}
                className="flex items-center p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <img
                  src={user.avatar || '/default-avatar.png'}
                  alt={user.username}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-medium">{user.username}</h3>
                  {user.phone && (
                    <p className="text-sm text-gray-500">{user.phone}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
