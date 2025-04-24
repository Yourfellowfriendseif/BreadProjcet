// src/components/UserProfile.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserCard from "./user/UserCard";
import api from "../api/apiClient";

export default function UserProfile({ user: currentUser }) {
  const { userId } = useParams();
  const [viewedUser, setViewedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // If no userId param, show the current user's profile
        if (!userId && currentUser) {
          setViewedUser(currentUser);
          setLoading(false);
          return;
        }

        // Fetch user profile if needed
        const userToFetch = userId || currentUser?._id;
        if (!userToFetch) return;

        const response = await api.get(`/user/${userToFetch}`);
        // Handle nested data structure
        const userData = response.data?.user || response.user || response;
        setViewedUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, currentUser]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
        Error: {error}
      </div>
    );

  if (!viewedUser)
    return (
      <div className="text-center p-4 bg-gray-50 text-gray-600 rounded-lg">
        User not found
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <UserCard user={viewedUser} showDetails={true} />

        {/* Show settings section only on own profile */}
        {(!userId || userId === currentUser?._id) && (
          <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Account Settings
            </h3>
            <div className="space-y-4">
              <button className="w-full py-2 px-4 bg-amber-600 text-white rounded hover:bg-amber-700 transition">
                Edit Profile
              </button>
              <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition">
                Change Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
