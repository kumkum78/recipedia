import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Profile image URL helper
const formatProfileUrl = (profilePath) => {
  if (!profilePath) return null;
  if (profilePath.startsWith('http')) return profilePath;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${baseUrl}${profilePath}`;
};

const NavProfile = () => {
  const { user } = useAuth();

  return (
    <Link to="/profile" className="flex items-center">
      {user?.profilePicture ? (
        <img 
          src={formatProfileUrl(user.profilePicture)}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            e.target.src = '/images/icon.png';
            e.target.onerror = null;
          }}
        />
      ) : (
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-sm text-gray-500">
            {user?.email?.charAt(0)?.toUpperCase()}
          </span>
        </div>
      )}
    </Link>
  );
};

export default NavProfile;