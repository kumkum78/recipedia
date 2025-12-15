import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import API from '../api';

const ForgotPassword = ({ isOpen, onClose, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await API.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
      setIsSuccess(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred. Please try again.');
      }
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setEmail('');
    setMessage('');
    setIsSuccess(false);
    onBackToLogin();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative w-full max-w-md bg-white rounded-lg overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-gray-600 hover:text-black"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          {/* Back Button */}
          <button
            onClick={handleBackToLogin}
            className="flex items-center text-gray-600 hover:text-red-500 mb-6 transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Sign In
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
            <p className="text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            {message && (
              <div className={`text-sm text-center p-3 rounded-lg ${
                isSuccess 
                  ? 'text-green-700 bg-green-50 border border-green-200' 
                  : 'text-red-700 bg-red-50 border border-red-200'
              }`}>
                {message}
                {isSuccess && (
                  <div className="mt-2 text-xs text-gray-600">
                    In development mode, check the server console for the reset link. 
                    <br />
                    <strong>Reset URL will be displayed in the server terminal.</strong>
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Remember your password?{' '}
              <button
                onClick={handleBackToLogin}
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 