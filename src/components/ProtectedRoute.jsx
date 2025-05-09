// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';
import './ProtectedRoute.css';

export default function ProtectedRoute() {
  const { user, loading } = useApp();

  if (loading) {
    return (
      <div className="protected-route-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
