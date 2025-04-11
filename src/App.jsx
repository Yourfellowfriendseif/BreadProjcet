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

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm onLogin={setUser} />} />
        <Route path="/register" element={<RegisterForm onRegister={setUser} />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/bread" element={<BreadList />} />
          <Route path="/bread/new" element={<CreateBreadForm />} />
          <Route path="/profile" element={<UserProfile user={user} />} />
        </Route>
        
        {/* 404 Handling */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;