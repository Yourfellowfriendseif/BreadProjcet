import { useState } from 'react';
import { userAPI } from '../../api/userAPI';
import { Link } from 'react-router-dom';

/**
 * @typedef {import('../../types/schema').User} User
 * @typedef {import('../../types/schema').ApiError} ApiError
 */

export default function RegisterForm() {
  /** @type {[{
   *   username: string,
   *   email: string,
   *   password: string,
   *   phone_number: string,
   *   photo_url: string
   * }, function]} */
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
    photo_url: ''
  });

  /** @type {[{
   *   username: string,
   *   email: string,
   *   general: string
   * }, function]} */
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    general: ''
  });

  /**
   * Handles form submission
   * @param {React.FormEvent} e 
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await userAPI.register(formData);
      localStorage.setItem('token', token);
      window.location.href = '/';
    } catch (error) {
      /** @type {ApiError} */
      const apiError = error;
      
      if (apiError.conflictField === 'username') {
        setErrors({...errors, username: apiError.message});
      } else if (apiError.conflictField === 'email') {
        setErrors({...errors, email: apiError.message});
      } else if (apiError.errors) {
        const newErrors = {username: '', email: '', general: ''};
        apiError.errors.forEach(err => {
          if (err.field === 'username') newErrors.username = err.message;
          if (err.field === 'email') newErrors.email = err.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({...errors, general: apiError.message});
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      {errors.general && (
        <div className="text-red-500 mb-4">{errors.general}</div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            className={`w-full p-2 border rounded ${errors.username ? 'border-red-500' : ''}`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            value={formData.phone_number}
            onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
            className="w-full p-2 border rounded"
            pattern="[0-9]{10}"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Profile Photo URL</label>
          <input
            type="url"
            value={formData.photo_url}
            onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>

      <div className="mt-4 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-500">Login</Link>
      </div>
    </div>
  );
}