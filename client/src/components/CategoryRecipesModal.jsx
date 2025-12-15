import { useState, useEffect } from 'react';
import { X, Clock, Users } from 'lucide-react';

const CategoryRecipesModal = ({ title, category, onClose, type = 'category' }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [fullRecipe, setFullRecipe] = useState(null);
  const [fullRecipeLoading, setFullRecipeLoading] = useState(false);
  const [fullRecipeError, setFullRecipeError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        let url;
        if (type === 'area') {
          url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${category}`;
        } else {
          url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        setRecipes(data.meals || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (category) {
      fetchRecipes();
    }
  }, [category, type]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleViewRecipe = async (idMeal) => {
    setFullRecipeLoading(true);
    setFullRecipeError(null);
    setFullRecipe(null);
    setSelectedRecipe(idMeal);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
      if (!response.ok) throw new Error('Failed to fetch full recipe');
      const data = await response.json();
      setFullRecipe(data.meals ? data.meals[0] : null);
    } catch (err) {
      setFullRecipeError(err.message);
    } finally {
      setFullRecipeLoading(false);
    }
  };

  const handleCloseFullRecipe = () => {
    setSelectedRecipe(null);
    setFullRecipe(null);
    setFullRecipeError(null);
    setFullRecipeLoading(false);
  };

  // Helper to get ingredients list
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

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{title} Recipes</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              <span className="ml-3 text-gray-600">Loading recipes...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-2">Error loading recipes</div>
              <div className="text-gray-600">{error}</div>
            </div>
          )}

          {!loading && !error && recipes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No recipes found for this category</div>
            </div>
          )}

          {!loading && !error && recipes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div
                  key={recipe.idMeal}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border"
                >
                  <div className="relative">
                    <img
                      src={recipe.strMealThumb}
                      alt={recipe.strMeal}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      {category}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {recipe.strMeal}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        <span>30 mins</span>
                      </div>
                      <div className="flex items-center">
                        <Users size={16} className="mr-1" />
                        <span>4 servings</span>
                      </div>
                    </div>
                    
                    <button
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors duration-200"
                      onClick={() => handleViewRecipe(recipe.idMeal)}
                    >
                      View Recipe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Full Recipe Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={handleCloseFullRecipe}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500" onClick={handleCloseFullRecipe}><X size={24} /></button>
            {fullRecipeLoading && <div className="p-8 text-center">Loading...</div>}
            {fullRecipeError && <div className="p-8 text-center text-red-500">{fullRecipeError}</div>}
            {fullRecipe && (
              <div className="p-6">
                <img src={fullRecipe.strMealThumb} alt={fullRecipe.strMeal} className="w-full h-64 object-cover rounded mb-4" />
                <h2 className="text-2xl font-bold mb-2">{fullRecipe.strMeal}</h2>
                <div className="mb-2 text-gray-600">{fullRecipe.strArea} | {fullRecipe.strCategory}</div>
                <div className="mb-4">
                  <span className="font-semibold">Ingredients:</span>
                  <ul className="list-disc list-inside ml-4">
                    {getIngredientsList(fullRecipe).map((ing, idx) => (
                      <li key={idx}>{ing}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <span className="font-semibold">Instructions:</span>
                  <p className="whitespace-pre-line mt-1">{fullRecipe.strInstructions}</p>
                </div>
                {fullRecipe.strYoutube && (
                  <div className="mb-2">
                    <a href={fullRecipe.strYoutube} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Watch on YouTube</a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryRecipesModal;