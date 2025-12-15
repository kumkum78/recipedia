import React, { useState, useEffect } from "react";
import { Heart, Bookmark, Clock, User, X } from "lucide-react";
import { useRecipeContext } from "../hooks/useRecipeContext";
import { useAuth } from "../hooks/useAuth";

const categories = [
  "All Recipes",
  "Appetizers",
  "Main Dishes",
  "Desserts",
  "Drinks",
  "Healthy",
  "Other Recipes",
];

const categoryMap = {
  "Appetizers": "Side",
  "Main Dishes": "Beef",
  "Desserts": "Dessert",
  "Drinks": "Ordinary Drink",
  "Healthy": "Vegetarian",
  "Other Recipes": "Miscellaneous",
};

const randomTime = () => {
  const mins = ["30 min", "35 min", "40 min", "45 min", "50 min", "55 min", "60 min"];
  return mins[Math.floor(Math.random() * mins.length)];
};
const randomDifficulty = () => {
  const diffs = ["Beginner", "Easy", "Intermediate", "Advanced"];
  return diffs[Math.floor(Math.random() * diffs.length)];
};

const fallbackRecipes = [
  {
    id: 1,
    category: "Pasta",
    title: "Creamy Garlic Mushroom Penne Pasta",
    image: "/images/recipe-2-630x785.jpg",
    rating: 4.8,
    time: "5 min",
    difficulty: "Beginner",
    cuisine: "Lebanese",
    liked: false,
    bookmarked: false,
  },
  {
    id: 2,
    category: "Salads",
    title: "Zesty Lemon Quinoa with Fresh Herbs",
    image: "/images/recipe-3-630x785.jpg",
    rating: 4.5,
    time: "60 min",
    difficulty: "Beginner",
    cuisine: "Moroccan",
    liked: true,
    bookmarked: false,
  },
  {
    id: 3,
    category: "Meat",
    title: "Smoky Barbecue Pulled Beef Sandwiches",
    image: "/images/recipe-4-550x690.jpg",
    rating: 4.8,
    time: "15 min",
    difficulty: "Easy",
    cuisine: "French",
    liked: false,
    bookmarked: false,
  },
  {
    id: 4,
    category: "Breakfasts",
    title: "Fluffy Banana Pancakes with Maple Syrup",
    image: "/images/recipe-5-630x785.jpg",
    rating: 4.8,
    time: "60 min",
    difficulty: "Advanced",
    cuisine: "Thai",
    liked: false,
    bookmarked: false,
  },
  {
    id: 5,
    category: "Desserts",
    title: "Molten Chocolate Lava Cake Dessert",
    image: "/images/recipe-6-630x785.jpg",
    rating: 4.9,
    time: "80 min",
    difficulty: "Advanced",
    cuisine: "Ethiopian",
    liked: false,
    bookmarked: false,
  },
  {
    id: 6,
    category: "Side Dishes",
    title: "Crispy Parmesan Garlic Zucchini Sticks",
    image: "/images/recipe-7-630x785.jpg",
    rating: 4.4,
    time: "100 min",
    difficulty: "Advanced",
    cuisine: "Korean",
    liked: false,
    bookmarked: false,
  },
  {
    id: 7,
    category: "Drinks",
    title: "Mango Pineapple Smoothie with Coconut",
    image: "/images/recipe-8-630x785.jpg",
    rating: 4.9,
    time: "30 min",
    difficulty: "Easy",
    cuisine: "Thai",
    liked: false,
    bookmarked: false,
  },
  {
    id: 8,
    category: "Gluten-Free",
    title: "Gluten-Free Almond Waffles with Berries",
    image: "/images/recipe-9-630x785.jpg",
    rating: 4.8,
    time: "20 min",
    difficulty: "Advanced",
    cuisine: "Lebanese",
    liked: false,
    bookmarked: false,
  },
];

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

const NewRecipe = () => {
  const [activeCategory, setActiveCategory] = useState("All Recipes");
  const [recipesState, setRecipesState] = useState(fallbackRecipes);
  const [loading, setLoading] = useState(false);
  // Removed local state - using context instead
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRecipe, setModalRecipe] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function fetchRecipes() {
      setLoading(true);
      if (activeCategory === "All Recipes") {
        try {
          const res = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
          const data = await res.json();
          if (!ignore && data.meals && data.meals.length > 0) {
            // Add random time and difficulty to each recipe
            const recipesWithRandomData = data.meals.slice(0, 8).map(meal => ({
              ...meal,
              time: randomTime(),
              difficulty: randomDifficulty()
            }));
            setRecipesState(recipesWithRandomData);
          } else if (!ignore) {
            setRecipesState(fallbackRecipes);
          }
        } catch {
          if (!ignore) setRecipesState(fallbackRecipes);
        }
      } else if (activeCategory === "Drinks") {
        // Fetch from TheCocktailDB
        try {
          const res = await fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Ordinary_Drink");
          const data = await res.json();
          if (data.drinks && data.drinks.length > 0) {
            // Add random time and difficulty to each drink
            const drinksWithRandomData = data.drinks.slice(0, 8).map(drink => ({
              ...drink,
              time: randomTime(),
              difficulty: randomDifficulty()
            }));
            setRecipesState(drinksWithRandomData);
          } else if (!ignore) {
            setRecipesState(fallbackRecipes);
          }
        } catch {
          if (!ignore) setRecipesState(fallbackRecipes);
        }
      } else {
        // Map to valid category
        const apiCategory = categoryMap[activeCategory];
        if (!apiCategory) {
          setRecipesState(fallbackRecipes);
          setLoading(false);
          return;
        }
        try {
          const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(apiCategory)}`);
          const data = await res.json();
          if (data.meals && data.meals.length > 0) {
            // Fetch full details for first 8 meals
            const detailPromises = data.meals.slice(0, 8).map(async (meal) => {
              const detailRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
              const detailData = await detailRes.json();
              const fullMeal = detailData.meals && detailData.meals[0] ? detailData.meals[0] : meal;
              // Add random time and difficulty to each recipe
              return {
                ...fullMeal,
                time: randomTime(),
                difficulty: randomDifficulty()
              };
            });
            const detailedMeals = await Promise.all(detailPromises);
            if (!ignore) setRecipesState(detailedMeals);
          } else if (!ignore) {
            setRecipesState(fallbackRecipes);
          }
        } catch {
          if (!ignore) setRecipesState(fallbackRecipes);
        }
      }
      setLoading(false);
    }
    fetchRecipes();
    return () => { ignore = true; };
  }, [activeCategory]);

  // Use shared context for likes and bookmarks
  const { toggleLike, toggleBookmark, isLiked, isBookmarked, refreshUserPreferences } = useRecipeContext();
  const { isAuthenticated } = useAuth();

  // Refresh user preferences when component mounts (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      refreshUserPreferences();
    }
  }, [refreshUserPreferences, isAuthenticated]);

  const handleOpenRecipeModal = async (recipe) => {
    setModalOpen(true);
    setModalRecipe(null);
    setModalLoading(true);
    // Drinks from TheCocktailDB
    if (recipe.idDrink) {
      try {
        const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${recipe.idDrink}`);
        const data = await res.json();
        if (data.drinks && data.drinks.length > 0) {
          setModalRecipe(data.drinks[0]);
        } else {
          setModalRecipe(null);
        }
      } catch {
        setModalRecipe(null);
      }
      setModalLoading(false);
      return;
    }
    // Meals from TheMealDB
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

  return (
    <div id="new-recipe-section" className="max-w-[88%] mx-auto px-4 py-4">
      {/* New Recipes Section */}
      <div className="relative flex flex-col items-center mb-10 py-6">
        <span className="absolute text-[8rem] opacity-15 z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
          🍴
        </span>
        <h2 className="text-5xl font-semibold tracking-tighter text-gray-900 z-10 mb-4">
          New Recipes
        </h2>
        <p className="text-lg text-black z-10 text-center max-w-2xl tracking-tighter">
          Explore our latest recipes, from quick snacks to hearty meals and
          indulgent desserts.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-3 text-base font-semibold rounded-full transition-colors duration-200 border focus:outline-none ${
              activeCategory === cat
                ? "bg-red-500 text-white border-red-500 hover:cursor-pointer"
                : "bg-white text-black border-gray-200 hover:cursor-pointer hover:bg-red-500 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="text-3xl animate-spin">🍴</span>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {recipesState.map((recipe, idx) => (
          <div
              key={recipe.idMeal || recipe.idDrink || recipe.id || idx}
            className="bg-white rounded-xl overflow-hidden"
          >
            {/* Image Container */}
            <div className="relative group cursor-pointer">
              <img
                  src={recipe.strMealThumb || recipe.strDrinkThumb || recipe.image}
                  alt={recipe.strMeal || recipe.strDrink || recipe.title}
                className="w-full h-94 object-cover"
              />
              {/* Top Overlay Icons */}
              <div className="absolute top-3 left-3">
                <div className="bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center space-x-1">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-xs font-medium text-gray-800">
                      {recipe.rating || "4.8"}
                  </span>
                </div>
              </div>
              <div className="absolute top-3 right-3 flex flex-col space-y-2">
                <button
                    onClick={() => toggleLike(`external_${recipe.idMeal || recipe.idDrink || recipe.id || idx}`)}
                  className={`p-2 rounded-full transition-colors duration-200 focus:outline-none ${
                      isLiked(`external_${recipe.idMeal || recipe.idDrink || recipe.id || idx}`)
                      ? "bg-red-500 text-white hover:cursor-pointer"
                      : "bg-white text-red-500 hover:bg-gray-50 hover:cursor-pointer hover:bg-red-500 hover:text-white"
                  }`}
                >
                  <Heart
                    size={22}
                      fill={isLiked(`external_${recipe.idMeal || recipe.idDrink || recipe.id || idx}`) ? "currentColor" : "none"}
                  />
                </button>
                <button
                    onClick={() => toggleBookmark(`external_${recipe.idMeal || recipe.idDrink || recipe.id || idx}`)}
                  className={`p-2 rounded-full transition-colors duration-200 focus:outline-none ${
                      isBookmarked(`external_${recipe.idMeal || recipe.idDrink || recipe.id || idx}`)
                      ? "bg-red-500 text-white hover:cursor-pointer"
                      : "bg-white text-red-500 hover:bg-gray-50 hover:cursor-pointer hover:bg-red-500 hover:text-white"
                  }`}
                >
                  <Bookmark
                    size={22}
                      fill={isBookmarked(`external_${recipe.idMeal || recipe.idDrink || recipe.id || idx}`) ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>
            {/* Content */}
            <div className="p-5">
              {/* Category */}
              <div className="mb-2">
                <span className="text-md font-bold text-red-500 tracking-wide">
                    {recipe.strCategory || recipe.strDrink || recipe.category}
                </span>
              </div>
              {/* Title */}
                <h3
                  className="text-xl font-bold text-black mb-3 leading-tight tracking-tight hover:text-red-500 hover:cursor-pointer"
                  onClick={() => handleOpenRecipeModal(recipe)}
                >
                  {recipe.strMeal || recipe.strDrink || recipe.title}
              </h3>
              {/* Meta Information */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center justify-center text-sm space-x-1 hover:text-red-500 hover:cursor-pointer">
                  <Clock size={16} />
                    <span>{recipe.time}</span>
                </div>
                <div className="flex items-center justify-center text-sm space-x-1 hover:text-red-500 hover:cursor-pointer">
                    <span>{recipe.strArea || recipe.cuisine || ""}</span>
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500" onClick={handleCloseRecipeModal}>×</button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">Recipe Details</h2>
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <span className="text-3xl animate-spin">🍴</span>
                  <div className="text-gray-600">Loading recipe...</div>
                </div>
              ) : modalRecipe ? (
                <>
                  <img src={modalRecipe.strMealThumb || modalRecipe.strDrinkThumb} alt={modalRecipe.strMeal || modalRecipe.strDrink} className="w-full h-64 object-cover rounded mb-4" />
                  <h3 className="text-xl font-bold mb-2">{modalRecipe.strMeal || modalRecipe.strDrink}</h3>
                  <div className="mb-4">
                    <span className="font-semibold">Category:</span> {modalRecipe.strCategory || modalRecipe.strDrink} <span className="ml-4 font-semibold">Area:</span> {modalRecipe.strArea || ""}
                  </div>
                  {/* Ingredients for meals */}
                  {modalRecipe.strMeal && (
                    <div className="mb-4">
                      <span className="font-semibold">Ingredients:</span>
                      <ul className="list-disc list-inside ml-4">
                        {getIngredientsList(modalRecipe).map((ing, idx) => (
                          <li key={idx}>{ing}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Ingredients for drinks */}
                  {modalRecipe.strDrink && (
                    <div className="mb-4">
                      <span className="font-semibold">Ingredients:</span>
                      <ul className="list-disc list-inside ml-4">
                        {Array.from({ length: 15 }, (_, i) => i + 1)
                          .map(i => {
                            const ing = modalRecipe[`strIngredient${i}`];
                            const measure = modalRecipe[`strMeasure${i}`];
                            return ing && ing.trim() ? `${measure ? measure.trim() + ' ' : ''}${ing.trim()}` : null;
                          })
                          .filter(Boolean)
                          .map((ing, idx) => <li key={idx}>{ing}</li>)}
                      </ul>
                    </div>
                  )}
                  <div className="mb-4">
                    <span className="font-semibold">Instructions:</span>
                    <p className="whitespace-pre-line mt-1">{modalRecipe.strInstructions}</p>
                  </div>
                  {/* YouTube for meals */}
                  {modalRecipe.strYoutube && (
                    <div className="mb-2">
                      <a href={modalRecipe.strYoutube} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Watch on YouTube</a>
                    </div>
                  )}
                  {/* Video for drinks */}
                  {modalRecipe.strVideo && (
                    <div className="mb-2">
                      <a href={modalRecipe.strVideo} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Watch Video</a>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center text-gray-500">No recipe details found.</div>
              )}
            </div>
          </div>
      </div>
      )}
    </div>
  );
};

export default NewRecipe;
