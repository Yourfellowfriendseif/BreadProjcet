import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI } from '../../api/userAPI';
import { useApp } from '../../context/AppContext';
import { socketService } from '../../api/socketService';

export default function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validations, setValidations] = useState({
    emailOrUsername: { isValid: true, message: '' },
    password: { isValid: true, message: '' }
  });

  // Email format validation
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    const newValidations = { ...validations };

    // Validate email/username field
    if (!formData.emailOrUsername) {
      newValidations.emailOrUsername = { isValid: false, message: 'Email or username is required' };
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      newValidations.password = { isValid: false, message: 'Password is required' };
      isValid = false;
    }

    setValidations(newValidations);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset validation messages when user starts typing
    setValidations(prev => ({
      ...prev,
      [name]: { isValid: true, message: '' }
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Determine if input is email or username
      const isEmail = isValidEmail(formData.emailOrUsername);
      const loginData = {
        [isEmail ? 'email' : 'username']: formData.emailOrUsername,
        password: formData.password
      };

      // Attempt login
      const response = await userAPI.login(loginData.email || loginData.username, formData.password);
      
      if (!response || !response.token) {
        throw new Error('Invalid response from server');
      }

      // Store token
      localStorage.setItem('token', response.token);
      
      // Set user in context
      setUser(response.user);
      
      // Connect socket
      socketService.connect(response.token);

      // Success - redirect to home page
      navigate('/', { replace: true });
      
    } catch (err) {
      if (err.status === 404) {
        setValidations(prev => ({
          ...prev,
          emailOrUsername: { isValid: false, message: 'Account not found' }
        }));
      } else if (err.status === 401) {
        setValidations(prev => ({
          ...prev,
          password: { isValid: false, message: 'Incorrect password' }
        }));
      } else {
        setError('Failed to login. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700">
                Email or Username <span className="text-red-500">*</span>
              </label>
              <input
                id="emailOrUsername"
                name="emailOrUsername"
                type="text"
                required
                value={formData.emailOrUsername}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  !validations.emailOrUsername.isValid ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Enter your email or username"
              />
              {!validations.emailOrUsername.isValid && (
                <p className="mt-1 text-sm text-red-600">{validations.emailOrUsername.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  !validations.password.isValid ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Enter your password"
              />
              {!validations.password.isValid && (
                <p className="mt-1 text-sm text-red-600">{validations.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !formData.emailOrUsername || !formData.password}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
