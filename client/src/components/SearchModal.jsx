import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const searchMeals = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
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

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      searchMeals(query);
    }, 300);
  };

  const showMealDetails = (meal) => {
    setSelectedMeal(meal);
  };

  const closeMealDetails = () => {
    setSelectedMeal(null);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Search Recipes</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for a dish..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {loading && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {!loading && searchQuery && searchResults.length === 0 && (
            <div className="text-center p-8 text-gray-500">
              No recipes found for "{searchQuery}"
            </div>
          )}

          {!loading && searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {searchResults.map((meal) => (
                <div 
                  key={meal.idMeal} 
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => showMealDetails(meal)}
                >
                  <img 
                    src={meal.strMealThumb} 
                    alt={meal.strMeal}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-lg mb-1">{meal.strMeal}</h3>
                    <p className="text-sm text-gray-600">{meal.strCategory}</p>
                    <p className="text-sm text-gray-500">{meal.strArea} Cuisine</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Meal Details Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedMeal.strMeal}</h2>
              <button 
                onClick={closeMealDetails}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={selectedMeal.strMealThumb} 
                    alt={selectedMeal.strMeal}
                    className="w-full rounded-lg"
                  />
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">Category:</span> {selectedMeal.strCategory}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">Cuisine:</span> {selectedMeal.strArea}
                    </p>
                    {selectedMeal.strTags && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Tags:</span> {selectedMeal.strTags}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Ingredients</h3>
                  <ul className="space-y-1 mb-6">
                    {getIngredients(selectedMeal).map((ingredient, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        • {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Instructions</h3>
                <div className="text-gray-700 whitespace-pre-line">
                  {selectedMeal.strInstructions}
                </div>
              </div>
              
              {selectedMeal.strYoutube && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-3">Video Tutorial</h3>
                  <a 
                    href={selectedMeal.strYoutube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Watch on YouTube →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchModal;