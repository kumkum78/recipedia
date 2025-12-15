import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useRecipeContext } from '../hooks/useRecipeContext';
import { useAuth } from '../hooks/useAuth';
import ForgotPassword from './ForgotPassword';

const Login = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    rememberMe: false
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [serverError, setServerError] = useState(false);
  const navigate = useNavigate();
  const { loadUserPreferences } = useRecipeContext();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'file') {
      setProfileImage(e.target.files[0]);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const testServerConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000');
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password || (isSignUp && !formData.username)) {
      setMessage('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setMessage('');
    setServerError(false);
    
    // Set up form data for registration
    const formDataToSend = new FormData();
    if (isSignUp) {
      formDataToSend.append('name', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      if (profileImage) {
        formDataToSend.append('profileIcon', profileImage);
      }
    }
    
    // Test server connection first
    const serverConnected = await testServerConnection();
    if (!serverConnected) {
      setLoading(false);
      setServerError(true);
      setMessage('Cannot connect to server. Please ensure the backend is running on port 5000.');
      return;
    }

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setMessage('Request timed out. Please check your connection and try again.');
    }, 10000); // 10 second timeout

    try {
      console.log('Attempting to', isSignUp ? 'register' : 'login', 'with:', { email: formData.email });
      
      if (isSignUp) {
        // Registration logic
        console.log('Making registration API call...');
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.username);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        if (profileImage) {
          formDataToSend.append('profileIcon', profileImage);
        }

        const res = await API.post('/auth/register', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        });
        console.log('Registration response:', res.data);
        
        login(res.data.user, res.data.token);
        await loadUserPreferences();
        setMessage('Registration successful! Redirecting to home...');
        clearTimeout(timeoutId);
        setTimeout(() => {
          setLoading(false);
          onClose();
          navigate('/');
        }, 1500);
      } else {
        // Login logic
        console.log('Making login API call...');
        const res = await API.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        console.log('Login response:', res.data);
        
        login(res.data.user, res.data.token);
        await loadUserPreferences();
        setMessage('Login successful! Redirecting to home...');
        clearTimeout(timeoutId);
        setTimeout(() => {
          setLoading(false);
          onClose();
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      console.error('Auth error:', err);
      clearTimeout(timeoutId);
      
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setMessage('Cannot connect to server. Please ensure the backend is running.');
        setServerError(true);
      } else if (err.response?.status === 400) {
        setMessage(err.response.data.message || 'Invalid credentials');
      } else if (err.response?.status === 500) {
        setMessage('Server error. Please try again later.');
      } else {
        setMessage(err.response?.data?.message || (isSignUp ? 'Registration failed' : 'Login failed'));
      }
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      username: '',
      email: '',
      password: '',
      rememberMe: false
    });
    setMessage('');
    setServerError(false);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  if (!isOpen) return null;

  // Show forgot password modal if needed
  if (showForgotPassword) {
    return (
      <ForgotPassword
        isOpen={showForgotPassword}
        onClose={onClose}
        onBackToLogin={handleBackToLogin}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative w-full max-w-4xl h-[600px] bg-white rounded-lg overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-gray-600 hover:text-black"
        >
          <X size={24} />
        </button>

        <div className="flex h-full">
          {/* Left Side - Food Background */}
          <div 
            className="w-1/2 bg-cover bg-center relative"
            style={{
              backgroundImage: "url('/images/logbg.webp')",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <h2 className="text-4xl font-bold mb-4">
                  {isSignUp ? 'Already have an account?' : 'Create an account?'}
                </h2>
                <button
                  onClick={switchMode}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded transition-colors duration-200"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-1/2 p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {isSignUp ? 'Create Account' : 'Sign in to Recipedia'}
            </h2>

            <div className="space-y-6">
              {isSignUp && (
                <div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder={isSignUp ? "Email Address" : "Username or Email Address"}
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {isSignUp && (
                <div>
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Choose a profile picture (Optional)
                  </p>
                </div>
              )}

              {!isSignUp && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="mr-3 w-4 h-4"
                  />
                  <label htmlFor="rememberMe" className="text-gray-600">
                    Remember Me
                  </label>
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (isSignUp ? 'Registering...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign in')}
              </button>

              {message && (
                <div className={`text-sm text-center p-2 rounded ${message.includes('successful') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                  {message}
                  {serverError && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-2">To fix this:</p>
                      <ol className="text-xs text-gray-600 text-left list-decimal list-inside space-y-1">
                        <li>Open a terminal in the server folder</li>
                        <li>Run: npm install</li>
                        <li>Run: npm start</li>
                        <li>Ensure MongoDB is running</li>
                      </ol>
                    </div>
                  )}
                </div>
              )}

              <div className="text-center space-x-4">
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-gray-600 hover:text-red-500 transition-colors duration-200"
                  >
                    Lost Your Password?
                  </button>
                )}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-gray-600 hover:text-red-500 transition-colors duration-200"
                >
                  {isSignUp ? 'Have an Account?' : 'Create Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;