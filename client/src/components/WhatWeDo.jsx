import React, { useState, useEffect } from "react";
import { ChefHat, Heart, Bookmark, Clock, User, X } from "lucide-react";
import { useRecipeContext } from "../hooks/useRecipeContext";
import { useAuth } from "../hooks/useAuth";

const tabApiMap = {
  "Latest Recipes": async () => {
    // Get latest meals (search with empty string returns a list)
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
    const data = await res.json();
    return data.meals ? data.meals.slice(0, 5) : [];
  },
  "Most Popular Recipes": async () => {
    // Use Beef as a popular category
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Beef");
    const data = await res.json();
    return data.meals ? data.meals.slice(0, 5) : [];
  },
  "Fastest Recipes": async () => {
    // Use Chicken as a fast category
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Chicken");
    const data = await res.json();
    return data.meals ? data.meals.slice(0, 5) : [];
  },
  "Editor's Choice": async () => {
    // Use Dessert as editor's choice
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert");
    const data = await res.json();
    return data.meals ? data.meals.slice(0, 5) : [];
  },
};

// Update randomTime to only return values between 30 and 60 mins (in 5 min increments)
const randomTime = () => {
  const mins = ["30 min", "35 min", "40 min", "45 min", "50 min", "55 min", "60 min"];
  return mins[Math.floor(Math.random() * mins.length)];
};
const randomDifficulty = () => {
  const diffs = ["Beginner", "Easy", "Intermediate", "Advanced"];
  return diffs[Math.floor(Math.random() * diffs.length)];
};

const WhatWeDo = () => {
  const [activeTab, setActiveTab] = useState("Latest Recipes");
  const [recipesState, setRecipesState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRecipe, setModalRecipe] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function fetchRecipes() {
      setLoading(true);
      if (tabApiMap[activeTab]) {
        const meals = await tabApiMap[activeTab]();
        if (!ignore) {
          // Add random time and difficulty to each recipe
          const mealsWithRandomData = meals.map(meal => ({
            ...meal,
            time: randomTime(),
            difficulty: randomDifficulty()
          }));
          setRecipesState(mealsWithRandomData);
        }
      } else {
        setRecipesState([]);
      }
      setLoading(false);
    }
    fetchRecipes();
    return () => { ignore = true; };
  }, [activeTab]);

  // Use shared context for likes and bookmarks
  const { toggleLike, toggleBookmark, isLiked, isBookmarked, refreshUserPreferences } = useRecipeContext();
  const { isAuthenticated } = useAuth();

  // Refresh user preferences when component mounts (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      refreshUserPreferences();
    }
  }, [refreshUserPreferences, isAuthenticated]);

  // Fetch full recipe details by idMeal
  const handleOpenRecipeModal = async (recipe) => {
    setModalOpen(true);
    setModalRecipe(null);
    setModalLoading(true);
    const id = recipe.idMeal || recipe.id;
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      const data = await res.json();
      if (data.meals && data.meals.length > 0) {
        setModalRecipe(data.meals[0]);
      } else {
        setModalRecipe(null);
      }
    } catch {
      setModalRecipe(null);
    }
    setModalLoading(false);
  };
  const handleCloseRecipeModal = () => {
    setModalOpen(false);
    setModalRecipe(null);
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
    <div className="max-w-8xl mx-auto px-4 py-14">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 w-full sm:w-auto">
          {["Latest Recipes", "Most Popular Recipes", "Fastest Recipes", "Editor's Choice"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-5 text-lg sm:text-2xl font-semibold text-center sm:text-left ${
                activeTab === tab
                  ? "text-gray-900 lg:border-b-1 lg:border-gray-900"
                  : "text-gray-400 hover:text-gray-900 lg:hover:border-b-1 lg:hover:border-gray-900 hover:cursor-pointer"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <ChefHat className="animate-spin text-red-500" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {recipesState.map((recipe) => (
            <div
              key={recipe.idMeal || recipe.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer transform hover:scale-105 transition-transform duration-200"
              onClick={() => handleOpenRecipeModal(recipe)}
            >
              {/* Image Container */}
              <div className="relative group cursor-pointer">
                <img
                  src={recipe.strMealThumb || recipe.image}
                  alt={recipe.strMeal || recipe.title}
                  className="w-full h-94 object-cover"
                />
                {/* Top Overlay Icons */}
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <div className="bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center space-x-1">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-xs font-medium text-gray-800">4.8</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3 flex flex-col space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(`external_${recipe.idMeal || recipe.id}`);
                    }}
                    className={`p-2 rounded-full transition-colors duration-200 focus:outline-none ${
                      isLiked(`external_${recipe.idMeal || recipe.id}`)
                        ? "bg-red-500 text-white hover:cursor-pointer"
                        : "bg-white text-red-500 hover:bg-gray-50 hover:cursor-pointer hover:bg-red-500 hover:text-white"
                    }`}
                  >
                    <Heart
                      size={22}
                      fill={isLiked(`external_${recipe.idMeal || recipe.id}`) ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(`external_${recipe.idMeal || recipe.id}`);
                    }}
                    className={`p-2 rounded-full transition-colors duration-200 focus:outline-none ${
                      isBookmarked(`external_${recipe.idMeal || recipe.id}`)
                        ? "bg-red-500 text-white hover:cursor-pointer"
                        : "bg-white text-red-500 hover:bg-gray-50 hover:cursor-pointer hover:bg-red-500 hover:text-white"
                    }`}
                  >
                    <Bookmark
                      size={22}
                      fill={isBookmarked(`external_${recipe.idMeal || recipe.id}`) ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              </div>
              {/* Content */}
              <div className="p-5">
                {/* Category */}
                <div className="mb-2">
                  <span className="text-md font-bold text-red-500 tracking-wide">
                    {recipe.strCategory || recipe.category}
                  </span>
                </div>
                {/* Title */}
                <h3
                  className="text-xl font-bold text-black mb-3 leading-tight tracking-tight hover:text-red-500 hover:cursor-pointer transition-colors duration-200"
                  onClick={() => handleOpenRecipeModal(recipe)}
                >
                  {recipe.strMeal || recipe.title}
                </h3>
                {/* Meta Information */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center justify-center text-sm space-x-1 hover:text-red-500 hover:cursor-pointer">
                    <Clock size={16} />
                    <span>{recipe.time}</span>
                  </div>
                  <div className="flex items-center justify-center text-sm space-x-1 hover:text-red-500 hover:cursor-pointer">
                    <User size={16} />
                    <span>{recipe.difficulty}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recipe Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 z-10" 
              onClick={handleCloseRecipeModal}
            >
              <X size={24} />
            </button>
            
            {modalLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ChefHat className="animate-spin text-red-500 mb-4" size={48} />
                <div className="text-gray-600">Loading recipe details...</div>
              </div>
            ) : modalRecipe ? (
              <div className="p-6">
                {/* Recipe Image */}
                <div className="relative mb-6">
                  <img 
                    src={modalRecipe.strMealThumb} 
                    alt={modalRecipe.strMeal} 
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.src = '/images/recipe-2-550x690.jpg';
                      e.target.onerror = null;
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {modalRecipe.strCategory}
                  </div>
                </div>

                {/* Recipe Title and Meta */}
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{modalRecipe.strMeal}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>Prep Time: ~30 min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User size={16} />
                      <span>Cuisine: {modalRecipe.strArea}</span>
                    </div>
                  </div>
                </div>

                {/* Recipe Tags */}
                {modalRecipe.strTags && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {modalRecipe.strTags.split(',').map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ingredients */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <ChefHat size={20} className="mr-2" />
                    Ingredients
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getIngredientsList(modalRecipe).map((ingredient, index) => (
                      <div 
                        key={index} 
                        className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700">{ingredient}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Clock size={20} className="mr-2" />
                    Instructions
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {modalRecipe.strInstructions}
                    </div>
                  </div>
                </div>

                {/* YouTube Link */}
                {modalRecipe.strYoutube && (
                  <div className="mb-4">
                    <a 
                      href={modalRecipe.strYoutube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      <span className="mr-2">📺</span>
                      Watch on YouTube
                    </a>
                  </div>
                )}

                {/* Source Link */}
                {modalRecipe.strSource && (
                  <div className="mb-4">
                    <a 
                      href={modalRecipe.strSource} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View Original Recipe
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <ChefHat size={48} className="mx-auto mb-4 text-gray-400" />
                <p>No recipe details found.</p>
                <p className="text-sm mt-2">Please try again later.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatWeDo;
