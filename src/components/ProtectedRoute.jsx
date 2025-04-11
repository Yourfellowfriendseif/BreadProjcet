// src/components/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { userAPI } from '../api/userAPI';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await userAPI.getProfile(); // Uses JWT via interceptor
        setVerified(true);
      } catch {
        navigate('/login');
      }
    };
    verifyToken();
  }, [navigate]);

  return verified ? children : <div>Verifying...</div>;
}