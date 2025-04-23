import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import BreadList from './components/bread/BreadListing';
import CreateBreadForm from './components/bread/CreateBreadForm';
import UserProfile from './components/UserProfile';
import NotFound from './pages/NotFound';
import SearchResults from './pages/SearchResults';
import Navbar from './components/Navbar'; // Add this import

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Navbar user={user} />  
      <div className="container mx-auto px-4 py-6">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm onLogin={setUser} />} />
          <Route path="/register" element={<RegisterForm onRegister={setUser} />} />
        
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/bread" element={<BreadList />} />
            <Route path="/bread/new" element={<CreateBreadForm />} />
            <Route path="/profile" element={<UserProfile user={user} />} />
            <Route path="/user/:userId" element={<UserProfile />} />
          </Route>
        
          {/* 404 Handling */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;