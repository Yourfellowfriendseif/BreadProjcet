import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI } from '../../api/userAPI';
import { useApp } from '../../context/AppContext';
import { breadAPI } from '../../api/breadAPI';
import ImageUpload from '../common/ImageUpload';

export default function RegisterForm() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
  });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validations, setValidations] = useState({
    username: { isValid: true, message: '' },
    email: { isValid: true, message: '' },
    password: { isValid: true, message: '' },
    confirmPassword: { isValid: true, message: '' }
  });

  const isFormValid = () => {
    return (
      formData.username &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      validations.username.isValid &&
      validations.email.isValid
    );
  };

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        if (formData.username.length >= 3) {
          const response = await userAPI.register({ username: formData.username });
          setValidations(prev => ({
            ...prev,
            username: {
              isValid: true,
              message: ''
            }
          }));
        }
      } catch (err) {
        if (err.status === 409) {
          setValidations(prev => ({
            ...prev,
            username: {
              isValid: false,
              message: 'Username already exists'
            }
          }));
        }
      }
    };

    const timeoutId = setTimeout(() => {
      if (formData.username) {
        checkAvailability();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  useEffect(() => {
    const checkEmailAvailability = async () => {
      try {
        if (isValidEmail(formData.email)) {
          const response = await userAPI.register({ email: formData.email });
          setValidations(prev => ({
            ...prev,
            email: {
              isValid: true,
              message: ''
            }
          }));
        }
      } catch (err) {
        if (err.status === 409) {
          setValidations(prev => ({
            ...prev,
            email: {
              isValid: false,
              message: 'Email already exists'
            }
          }));
        }
      }
    };

    const timeoutId = setTimeout(() => {
      if (formData.email) {
        if (!isValidEmail(formData.email)) {
          setValidations(prev => ({
            ...prev,
            email: {
              isValid: false,
              message: 'Invalid email format'
            }
          }));
        } else {
          checkEmailAvailability();
        }
      }
    }, 50000);

    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  useEffect(() => {
    if (formData.password && formData.confirmPassword) {
      setValidations(prev => ({
        ...prev,
        confirmPassword: {
          isValid: formData.password === formData.confirmPassword,
          message: formData.password === formData.confirmPassword ? '' : 'Passwords do not match'
        }
      }));
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelected = (images) => {
    if (images && images.length > 0) {
      setPhoto(images[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setError('Please fill in all required fields correctly');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let photo_url = '';
      if (photo) {
        const uploadResponse = await breadAPI.uploadImage(photo);
        photo_url = uploadResponse.data.image;
      }

      await userAPI.register({
        ...formData,
        photo_url
      });

      // Show success message and redirect to login page
      setError(null);
      alert('Registration successful! Please login with your credentials.');
      navigate('/login');
      
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
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
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  !validations.username.isValid ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Username"
              />
              {!validations.username.isValid && (
                <p className="mt-1 text-sm text-red-600">{validations.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  !validations.email.isValid ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
              {!validations.email.isValid && (
                <p className="mt-1 text-sm text-red-600">{validations.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Phone number (optional)"
              />
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
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  !validations.confirmPassword.isValid ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Confirm password"
              />
              {!validations.confirmPassword.isValid && (
                <p className="mt-1 text-sm text-red-600">{validations.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Photo
              </label>
              <div className="mt-1 w-32 h-32 mx-auto">
                <ImageUpload 
                  onImagesSelected={handleImageSelected}
                  maxImages={1}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}