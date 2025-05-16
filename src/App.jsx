import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { userAPI } from "./api/userAPI";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import CreatePost from "./components/bread/CreatePost";
import UserProfile from "./components/UserProfile";
import NotFound from "./pages/NotFound";
import SearchResults from "./pages/SearchResults";
import NotificationsList from "./components/notifications/NotificationsList";
import Navbar from "./components/NavBar";
import PostDetail from "./components/bread/PostDetail";
import MessagesPage from "./pages/MessagesPage";
import EditPost from "./pages/EditPost";
import ReservedPosts from "./pages/ReservedPosts";
import "./App.css";
import MapLinkGenerator from "./pages/testLocation/MapLinkGenerator";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      userAPI
        .getProfile()
        .then((userData) => {
          setUser(userData);
        })
        .catch((error) => {
          if (error.status === 401) {
            localStorage.removeItem("token");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <AppProvider value={{ user, setUser }}>
      <Router>
        <div id="webcrumbs" className="min-h-screen bg-gray-50">
          <div className="w-full max-w-[1280px] mx-auto p-6">
            <Navbar />
            <main className="container mx-auto px-4 py-6">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/bread/:id" element={<PostDetail />} />
                <Route path="/map" element={<MapLinkGenerator />} />
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/posts/create" element={<CreatePost />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/user/:userId" element={<UserProfile />} />
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/posts/edit/:id" element={<EditPost />} />
                  <Route path="/posts/update/:id" element={<EditPost />} />
                  <Route path="/reserved-posts" element={<ReservedPosts />} />
                  <Route
                    path="/notifications"
                    element={
                      <div className="container mx-auto px-4 py-8">
                        <NotificationsList />
                      </div>
                    }
                  />
                </Route>

                {/* 404 Handling */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
