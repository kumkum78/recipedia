import React from "react";
import { X } from 'lucide-react';
import { useState } from 'react';

const Hero = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

   React.useEffect(() => {
    if (showResults || selectedMeal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showResults, selectedMeal]);


   const searchMeals = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    setShowResults(true);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const data = await response.json();
      setSearchResults(data.meals || []);
    } catch (error) {
      console.error('Error searching meals:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };



  const handleSearch = () => {
    searchMeals(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const showMealDetails = (meal) => {
    setSelectedMeal(meal);
  };

  const closeMealDetails = () => {
    setSelectedMeal(null);
  };

  const closeResults = () => {
    setShowResults(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  const getIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure?.trim() || ''} ${ingredient.trim()}`);
      }
    }
    return ingredients;
  };



  return (
    <section
      id="hero-section"
      className="w-full sm:w-[95%] lg:w-[98%] mx-auto min-h-[50vh] sm:min-h-[60vh] lg:min-h-screen bg-cover bg-center flex items-center justify-center px-4 sm:px-6 lg:px-6 py-2 sm:py-3 lg:py-12 rounded-none sm:rounded-2xl lg:rounded-3xl relative"
      style={{
        backgroundImage: `url('/images/search-hero-2.jpg')`,
      }}
    >
      {/* Overlay for better text readability */}
      {/* <div className="absolute inset-0 bg-black/20 rounded-none sm:rounded-2xl lg:rounded-3xl"></div> */}
      
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-4 sm:gap-5 lg:gap-12 relative z-10">
        {/* Left Section - Text and Search */}
        <div className="flex-1 text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-2 sm:mb-2 lg:mb-6">
             You don't know how to make
            <span className="lg:block inline"> the dish you have in mind?</span>
          </h1>
          
          <p className="text-md sm:text-base lg:text-lg text-black leading-relaxed lg:max-w-2xl max-w-xl mb-2 sm:mb-2 lg:mb-6">
            Feed your imagination and spark your creativity. From cravings to creations, let your ideas flourish and uncover the perfect recipe waiting to be discovered.
          </p>
          
          <div className="relative max-w-2xl mb-1 sm:mb-1 lg:mb-4">
        <div className="flex items-center bg-white rounded-lg sm:rounded-xl lg:rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center px-3 sm:px-4 lg:px-6 py-3 sm:py-3.5 lg:py-4">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Find what do you want to cook today"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow px-2 sm:px-3 lg:px-4 py-3 sm:py-3.5 lg:py-4 outline-none text-gray-700 placeholder:text-gray-600 text-sm sm:text-base lg:text-md"
          />
          <button 
            onClick={handleSearch}
            className="bg-red-500 text-white hover:cursor-pointer p-3 sm:p-3.5 lg:p-4 rounded-lg sm:rounded-xl lg:rounded-xl hover:bg-black transition-colors mr-1"
          >
            <svg
              className="w-5 h-5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
          
          <p className="text-xs sm:text-sm lg:text-base tracking-tighter text-gray-600 max-w-2xl">
            Type a keyword and discover recipes that turn your cravings into delicious reality!
          </p>
        </div>
      </div>
      {showResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">
                Search Results for "{searchQuery}"
              </h2>
              <button 
                onClick={closeResults}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
              {loading && (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                </div>
              )}

              {!loading && searchResults.length === 0 && (
                <div className="text-center p-8 text-gray-500">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="text-lg font-semibold mb-2">No recipes found</h3>
                  <p>Try searching for something else like "pasta", "chicken", or "cake"</p>
                </div>
              )}

              {!loading && searchResults.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                  {searchResults.map((meal) => (
                    <div 
                      key={meal.idMeal} 
                      className="bg-white border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                      onClick={() => showMealDetails(meal)}
                    >
                      <div className="relative">
                        <img 
                          src={meal.strMealThumb} 
                          alt={meal.strMeal}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                          {meal.strCategory}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{meal.strMeal}</h3>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="flex items-center">
                            🌍 {meal.strArea}
                          </span>
                          <span className="text-red-500 font-medium">View Recipe →</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Meal Details Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{selectedMeal.strMeal}</h2>
              <button 
                onClick={closeMealDetails}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Image and Basic Info */}
                <div>
                  <div className="relative">
                    <img 
                      src={selectedMeal.strMealThumb} 
                      alt={selectedMeal.strMeal}
                      className="w-full rounded-xl shadow-lg"
                    />
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full">
                      {selectedMeal.strCategory}
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Cuisine:</span>
                        <p className="text-gray-600">{selectedMeal.strArea}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Category:</span>
                        <p className="text-gray-600">{selectedMeal.strCategory}</p>
                      </div>
                      {selectedMeal.strTags && (
                        <div className="col-span-2">
                          <span className="font-semibold text-gray-700">Tags:</span>
                          <p className="text-gray-600">{selectedMeal.strTags}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedMeal.strYoutube && (
                    <div className="mt-6">
                      <a 
                        href={selectedMeal.strYoutube} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        📺 Watch Video Tutorial
                      </a>
                    </div>
                  )}
                </div>
                
                {/* Right Column - Ingredients */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Ingredients</h3>
                  <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
                    <ul className="space-y-2">
                      {getIngredients(selectedMeal).map((ingredient, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700 py-1 border-b border-gray-100 last:border-b-0">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></span>
                          <span>{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Instructions */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Instructions</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedMeal.strInstructions}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;



