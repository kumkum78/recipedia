import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

export default function Discover({ id }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleOpenModal = async () => {
    setModalOpen(true);
    setRecipe(null);
    setLoading(true);
    try {
      const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await res.json();
      if (data.meals && data.meals.length > 0) {
        setRecipe(data.meals[0]);
      }
    } catch {
      // Optionally handle error
    }
    setLoading(false);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setRecipe(null);
  };

  return (
    <div id={id} className="relative w-full sm:w-[90%] lg:w-[86%] rounded-none sm:rounded-2xl lg:rounded-3xl lg:mt-4 lg:mb-8 m-auto overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/section-bg.jpg')`
        }}
      ></div>
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 xl:py-24">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-xl space-y-6 sm:space-y-7 lg:space-y-8 text-center lg:text-left">
              {/* Rating Section */}
              <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3">
                <div className="flex items-center space-x-1 bg-white px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full shadow-sm">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-xs sm:text-sm text-gray-900">5.0</span>
                </div>
                <span className="text-gray-900 font-semibold text-sm sm:text-md">score from 10,000 rating</span>
              </div>
              {/* Title Section */}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-black leading-tight">
                  Discover fresh and easy recipes to inspire your meals every day.
                </h1>
              </div>
              {/* Description Section */}
              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                <p className="text-sm sm:text-md text-black leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Discover fresh and easy recipes for every meal. From quick breakfasts and light lunches to hearty dinners and indulgent desserts, find endless inspiration to make cooking simple, fun, and enjoyable for any occasion or gathering!
                </p>
              </div>
              {/* Button Section */}
              <div className="pt-2 sm:pt-3 lg:pt-4 flex justify-center lg:justify-start">
                <button
                  className="bg-white hover:bg-gray-50 text-black font-semibold px-6 py-3 sm:px-7 lg:px-8 rounded-lg tracking-tighter text-sm sm:text-base hover:cursor-pointer hover:bg-red-500 hover:text-white"
                  onClick={handleOpenModal}
                >
                  View Recipes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for Recipe of the Day */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500" onClick={handleCloseModal}><X size={24} /></button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">Recipe of the Day</h2>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Star className="animate-spin text-red-500 mb-4" size={48} />
                  <div className="text-gray-600">Loading recipe...</div>
                </div>
              ) : recipe ? (
                <>
                  <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-64 object-cover rounded mb-4" />
                  <h3 className="text-xl font-bold mb-2">{recipe.strMeal}</h3>
                  <div className="mb-4">
                    <span className="font-semibold">Category:</span> {recipe.strCategory} <span className="ml-4 font-semibold">Area:</span> {recipe.strArea}
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold">Ingredients:</span>
                    <ul className="list-disc list-inside ml-4">
                      {getIngredientsList(recipe).map((ing, idx) => (
                        <li key={idx}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold">Instructions:</span>
                    <p className="whitespace-pre-line mt-1">{recipe.strInstructions}</p>
                  </div>
                  {recipe.strYoutube && (
                    <div className="mb-2">
                      <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Watch on YouTube</a>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center text-gray-500">No recipe found.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}