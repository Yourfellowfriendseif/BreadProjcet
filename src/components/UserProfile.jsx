import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserCard from "./user/UserCard";
import { apiClient } from "../api/apiClient";
import BreadList from "./bread/BreadListing";

export default function UserProfile({ user: currentUser }) {
  const { userId } = useParams();
  const [viewedUser, setViewedUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState({
    user: true,
    posts: true
  });
  const [error, setError] = useState({
    user: null,
    posts: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // If no userId param, show the current user's profile
        if (!userId && currentUser) {
          setViewedUser(currentUser);
          setLoading(prev => ({ ...prev, user: false }));
          return;
        }

        // Fetch user profile if needed
        const userToFetch = userId || currentUser?._id;
        if (!userToFetch) return;

        // Fetch user data
        const userResponse = await apiClient.get(`/api/user/${userToFetch}`);
        setViewedUser(userResponse.data);

        // Fetch user's posts
        const postsResponse = await apiClient.get(`/api/posts/user/${userToFetch}`);
        setUserPosts(postsResponse.data.posts);
      } catch (err) {
        setError({
          user: err.message,
          posts: err.message
        });
      } finally {
        setLoading({
          user: false,
          posts: false
        });
      }
    };

    fetchData();
  }, [userId, currentUser]);

  if (loading.user)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );

  if (error.user)
    return (
      <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
        Error: {error.user}
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
      <div className="max-w-4xl mx-auto">
        <UserCard user={viewedUser} showDetails={true} />

        {/* User Posts Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            {userId ? `${viewedUser.username}'s Listings` : "Your Listings"}
          </h2>
          
          {loading.posts ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : error.posts ? (
            <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
              Error loading posts: {error.posts}
            </div>
          ) : (
            <BreadList breads={userPosts} showOwner={false} />
          )}
        </div>

        {/* Show settings section only on own profile */}
        {(!userId || userId === currentUser?._id) && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Account Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="py-2 px-4 bg-amber-600 text-white rounded hover:bg-amber-700 transition">
                Edit Profile
              </button>
              <button className="py-2 px-4 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition">
                Change Password
              </button>
              <button className="py-2 px-4 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
                View Reservations
              </button>
              <button className="py-2 px-4 bg-red-100 text-red-700 rounded hover:bg-red-200 transition">
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}