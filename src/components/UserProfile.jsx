// src/components/UserProfile.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserCard from './user/UserCard';
import api from '../api/apiClient';

export default function UserProfile({ user: currentUser }) {
  const { userId } = useParams();
  const [viewedUser, setViewedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // If no userId param, it's the current user's profile
        const userToFetch = userId || currentUser?._id;
        if (!userToFetch) return;
        
        const response = await api.get(`/user/${userToFetch}`);
        setViewedUser(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, currentUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!viewedUser) return <div>User not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <UserCard user={viewedUser} showDetails={true} />
        
        {/* Additional user-specific content can go here */}
        {userId === currentUser?._id && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h3 className="font-medium text-lg mb-2">Your Account Settings</h3>
            {/* Add settings/actions here */}
          </div>
        )}
      </div>
    </div>
  );
}