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
   *   confirmPassword: string,
   *   phone_number: string,
   *   photo_url: string
   * }, function]} */
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    photo_url: ''
  });

  /** @type {[{
   *   username: string,
   *   email: string,
   *   password: string,
   *   confirmPassword: string,
   *   general: string
   * }, function]} */
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handles form submission
   * @param {React.FormEvent} e 
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setErrors({
        ...errors,
        confirmPassword: 'Passwords do not match',
        password: 'Passwords do not match'
      });
      return;
    }

    if (formData.password.length < 8) {
      setErrors({
        ...errors,
        password: 'Password must be at least 8 characters'
      });
      return;
    }

    try {
      // Only send necessary fields to the API
      const { confirmPassword, ...registrationData } = formData;
      const { token } = await userAPI.register(registrationData);
      
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
        const newErrors = {
          username: '', 
          email: '', 
          password: '',
          confirmPassword: '',
          general: ''
        };
        apiError.errors.forEach(err => {
          if (err.field === 'username') newErrors.username = err.message;
          if (err.field === 'email') newErrors.email = err.message;
          if (err.field === 'password') newErrors.password = err.message;
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
            required
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
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : ''}`}
              required
              minLength="8"
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )} show
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 8 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            className={`w-full p-2 border rounded ${errors.confirmPassword ? 'border-red-500' : ''}`}
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
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
            placeholder="1234567890"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Profile Photo URL</label>
          <input
            type="url"
            value={formData.photo_url}
            onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="https://example.com/profile.jpg"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        >
          Register
        </button>
      </form>

      <div className="mt-4 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
      </div>
    </div>
  );
}