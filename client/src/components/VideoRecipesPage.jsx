import React from 'react';
import Vedios from './Vedios';

const VideoRecipesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Video Recipes</h1>
        <Vedios />
      </div>
    </div>
  );
};

export default VideoRecipesPage; 