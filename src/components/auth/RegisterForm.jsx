// src/components/RegisterForm.jsx
import { useState } from 'react';
import { userAPI } from '../../api/userAPI';

/**
 * @typedef {import('../../types/dbTypes').User} User
 */

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
    photo_url: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await userAPI.register(formData);
      localStorage.setItem('token', token);
      window.location.href = '/';
    } catch (err) {
      setError(err.message.includes('exists') 
        ? 'Username or email already registered' 
        : 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.username}
        onChange={(e) => setFormData({...formData, username: e.target.value})}
        placeholder="Username"
        required
      />
      {/* Other fields... */}
      {error && <div className="error">{error}</div>}
      <button type="submit">Register</button>
    </form>
  );
}