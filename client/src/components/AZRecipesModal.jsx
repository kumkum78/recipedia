import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, Users, X, Loader2 } from 'lucide-react';

const AZRecipesModal = ({ isOpen, onClose }) => {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const alphabet = ['#', '0-9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  const fetchRecipes = async (letter) => {
    setLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
      const data = await response.json();
      
      if (data.meals) {
        setRecipes(data.meals);
      } else {
        setRecipes([]);
      }
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLetterClick = (letter) => {
    if (letter === '#' || letter === '0-9') return;
    setSelectedLetter(letter);
    fetchRecipes(letter.toLowerCase());
  };

  const getIngredientsList = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ingredient.trim()}`);
      }
    }
    return ingredients;
  };

  const RecipeCard = ({ recipe }) => {
    const [showIngredients, setShowIngredients] = useState(false);
    const ingredients = getIngredientsList(recipe);

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          <img 
            src={recipe.strMealThumb} 
            alt={recipe.strMeal}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            {recipe.strCategory}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{recipe.strMeal}</h3>
          
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              <span>{recipe.strArea}</span>
            </div>
            {recipe.strTags && (
              <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                {recipe.strTags.split(',')[0]}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setShowIngredients(!showIngredients)}
              className="w-full text-left text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              {showIngredients ? 'Hide' : 'Show'} Ingredients ({ingredients.length})
            </button>
            
            {showIngredients && (
              <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                <ul className="space-y-1">
                  {ingredients.map((ingredient, index) => (
                    <li key={index}>• {ingredient}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {recipe.strSource && (
            <div className="mt-3 pt-3 border-t">
              <a
                href={recipe.strSource}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-700 underline"
              >
                View Full Recipe
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  const resetState = () => {
    setSelectedLetter(null);
    setRecipes([]);
    setLoading(false);
    setError(null);
  };

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        // Close modal if clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose();
          resetState();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        
        {/* Header */}
        <div className="bg-red-500 text-white p-8 text-center relative">
          <button
            onClick={() => {
              onClose();
              resetState();
            }}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          <p className="text-sm font-medium mb-2 tracking-wider">RECIPES FROM A TO Z</p>
          <h1 className="text-4xl font-bold mb-4">A-Z Recipes</h1>
          <p className="text-lg opacity-90">
            Discover an alphabetical collection of recipes, making it easy to find your favorites or explore something new.
          </p>
          <p className="text-lg mt-2 opacity-90">Perfect for every craving and occasion!</p>
        </div>

        {/* Alphabet Navigation */}
        <div className="bg-gray-100 p-4 border-b">
          <div className="flex flex-wrap justify-center gap-2">
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                className={`w-10 h-10 flex items-center justify-center font-semibold border transition-all duration-200 ${
                  selectedLetter === letter
                    ? 'bg-red-500 text-white border-red-500 scale-110'
                    : letter === '#' || letter === '0-9'
                    ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 hover:scale-105'
                }`}
                disabled={letter === '#' || letter === '0-9' || loading}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 300px)' }}>
          {!selectedLetter ? (
            <div className="text-center py-12">
              <ChefHat size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Letter</h3>
              <p className="text-gray-500">Choose a letter above to browse recipes starting with that letter.</p>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Recipes starting with "{selectedLetter}"
                </h2>
                {!loading && !error && (
                  <p className="text-gray-600">
                    {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
                  </p>
                )}
              </div>

              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 size={48} className="animate-spin text-red-500 mb-4" />
                  <p className="text-gray-600">Loading delicious recipes...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">⚠️</div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Error Loading Recipes</h3>
                  <p className="text-gray-500 mb-4">{error}</p>
                  <button
                    onClick={() => fetchRecipes(selectedLetter.toLowerCase())}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!loading && !error && recipes.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe.idMeal} recipe={recipe} />
                  ))}
                </div>
              )}

              {!loading && !error && recipes.length === 0 && selectedLetter && (
                <div className="text-center py-12">
                  <ChefHat size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Recipes Found</h3>
                  <p className="text-gray-500">
                    We don't have any recipes starting with "{selectedLetter}" in our database yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AZRecipesModal;