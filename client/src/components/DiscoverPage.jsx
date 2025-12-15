import React from 'react';
import Discover from './Discover';

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              This Week's Recipes
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover fresh and easy recipes to inspire your meals every day.
            </p>
          </div>
        </div>
      </div>
      
      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Discover />
      </div>
    </div>
  );
} 