import React, { useState } from 'react';
import { X } from 'lucide-react';
import API from '../api';

const ProfileImage = ({ src, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('view');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleProfileImage = (viewMode) => {
    setMode(viewMode);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSubmit = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', selectedFile);

      const response = await API.post('/users/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.imageUrl) {
        onUpdate(response.data.imageUrl);
      }
      handleModalClose();
    } catch (error) {
      console.error('Failed to update profile image:', error);
      alert('Failed to update profile image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
          <img 
            src={src || '/images/icon.png'} 
            alt="Profile" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/images/icon.png';
              e.target.onerror = null;
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black bg-opacity-50 text-white rounded-full w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center space-y-1">
              <button onClick={() => handleProfileImage('view')} className="text-sm hover:text-red-400 transition">View</button>
              <button onClick={() => handleProfileImage('edit')} className="text-sm hover:text-red-400 transition">Edit</button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              onClick={handleModalClose}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">
              {mode === 'view' ? 'Profile Picture' : 'Update Profile Picture'}
            </h2>

            <div className="flex flex-col items-center space-y-6">
              <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={previewUrl || src || '/images/icon.png'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/icon.png';
                    e.target.onerror = null;
                  }}
                />
              </div>

              {mode === 'edit' && (
                <div className="w-full space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose New Profile Picture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: JPG, PNG, GIF (Max 5MB)
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleImageSubmit}
                      disabled={!selectedFile || isUploading}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      {isUploading ? 'Updating...' : 'Update Picture'}
                    </button>
                    <button
                      onClick={handleModalClose}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileImage;
