import React from 'react';
import { Star, Pizza, Cake, Martini, HeartPulse, Drumstick, Leaf, Fish, Soup, Sprout, PiggyBank } from 'lucide-react';
import { useState } from 'react';

const categories = [
  { icon: <Pizza className="w-7 h-7" />, label: 'Appetizers', count: 4 },
  { icon: <Cake className="w-7 h-7" />, label: 'Desserts', count: 12 },
  { icon: <Martini className="w-7 h-7" />, label: 'Drinks', count: 12 },
  { icon: <HeartPulse className="w-7 h-7" />, label: 'Healthy', count: 12 },
  { icon: <Drumstick className="w-7 h-7" />, label: 'Meat', count: 12 },
  { icon: <PiggyBank className="w-7 h-7" />, label: 'Pork', count: 12 },
  { icon: <Fish className="w-7 h-7" />, label: 'Seafood', count: 12 },
  { icon: <Soup className="w-7 h-7" />, label: 'Addons', count: 12 },
  { icon: <Sprout className="w-7 h-7" />, label: 'Vegan', count: 3 },
];

// Map category label to TheMealDB or TheCocktailDB API
const categoryApiMap = {
  'Appetizers': { type: 'meal', endpoint: 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Starter' },
  'Desserts': { type: 'meal', endpoint: 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert' },
  'Drinks': { type: 'drink', endpoint: 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Ordinary_Drink' },
  'Healthy': { type: 'meal', endpoint: 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian' },
  'Meat': { type: 'meal', endpoint: 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Beef' },
  'Pork': { type: 'meal', endpoint: 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Pork' },
  'Seafood': { type: 'meal', endpoint: 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood' },
  'Addons': { type: 'meal', endpoint: 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Side' },
  'Vegan': { type: 'meal', endpoint: 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegan' },
};

const AboutUs=() => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalRecipes, setModalRecipes] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [recipeError, setRecipeError] = useState('');
  const [fullRecipe, setFullRecipe] = useState(null);

  const handleCategoryClick = async (label) => {
    setModalTitle(label);
    setModalOpen(true);
    setModalLoading(true);
    setModalError('');
    setModalRecipes([]);
    setSelectedRecipe(null);
    setFullRecipe(null);
    const api = categoryApiMap[label];
    if (!api) {
      setModalError('No recipes found.');
      setModalLoading(false);
      return;
    }
    try {
      const res = await fetch(api.endpoint);
      const data = await res.json();
      let recipes = [];
      if (api.type === 'meal') {
        recipes = data.meals || [];
      } else if (api.type === 'drink') {
        recipes = data.drinks || [];
      }
      if (recipes.length === 0) {
        setModalError('No recipes found.');
      } else {
        setModalRecipes(recipes.slice(0, 12));
      }
    } catch {
      setModalError('Failed to fetch recipes.');
    }
    setModalLoading(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalRecipes([]);
    setModalError('');
    setSelectedRecipe(null);
    setFullRecipe(null);
  };

  const handleRecipeClick = async (recipe) => {
    setSelectedRecipe(recipe);
    setRecipeLoading(true);
    setRecipeError('');
    setFullRecipe(null);
    try {
      let url = '';
      if (recipe.idMeal) {
        url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`;
      } else if (recipe.idDrink) {
        url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${recipe.idDrink}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (recipe.idMeal && data.meals && data.meals[0]) {
        setFullRecipe(data.meals[0]);
      } else if (recipe.idDrink && data.drinks && data.drinks[0]) {
        setFullRecipe(data.drinks[0]);
      } else {
        setRecipeError('No recipe details found.');
      }
    } catch {
      setRecipeError('Failed to fetch recipe details.');
    }
    setRecipeLoading(false);
  };

  const handleCloseRecipeModal = () => {
    setSelectedRecipe(null);
    setFullRecipe(null);
    setRecipeError('');
  };

  const handleIndianRecipesClick = async () => {
    setModalTitle('Home-Cooked Indian Comfort Food');
    setModalOpen(true);
    setModalLoading(true);
    setModalError('');
    setModalRecipes([]);
    setSelectedRecipe(null);
    setFullRecipe(null);
    try {
      // Fetch Indian area recipes
      const res = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?a=Indian');
      const data = await res.json();
      let recipes = data.meals || [];
      if (recipes.length === 0) {
        setModalError('No recipes found.');
      } else {
        setModalRecipes(recipes.slice(0, 20));
      }
    } catch {
      setModalError('Failed to fetch recipes.');
    }
    setModalLoading(false);
  };

  const handleCreativeRecipesClick = async () => {
    setModalTitle('A Fusion of Creativity, Innovation, and Taste');
    setModalOpen(true);
    setModalLoading(true);
    setModalError('');
    setModalRecipes([]);
    setSelectedRecipe(null);
    setFullRecipe(null);
    try {
      // Fetch creative/innovative dishes from multiple categories
      const fusionRes = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Fusion');
      const fusionData = await fusionRes.json();
      let fusionMeals = fusionData.meals || [];
      const miscRes = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Miscellaneous');
      const miscData = await miscRes.json();
      let miscMeals = miscData.meals || [];
      const pastaRes = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Pasta');
      const pastaData = await pastaRes.json();
      let pastaMeals = pastaData.meals || [];
      // Merge and deduplicate by idMeal
      const allMealsMap = {};
      fusionMeals.forEach(m => { if (m.idMeal) allMealsMap[m.idMeal] = m; });
      miscMeals.forEach(m => { if (m.idMeal) allMealsMap[m.idMeal] = m; });
      pastaMeals.forEach(m => { if (m.idMeal) allMealsMap[m.idMeal] = m; });
      const allMeals = Object.values(allMealsMap);
      if (allMeals.length > 0) {
        setModalRecipes(allMeals.slice(0, 20));
      } else {
        setModalError('No recipes found.');
      }
    } catch {
      setModalError('Failed to fetch recipes.');
    }
    setModalLoading(false);
  };

  return (
    <div className="max-w-[88%] mx-auto px-4 py-4">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
        {/* Left Card */}
        <div className="pl-2 rounded-xl overflow-hidden shadow bg-black relative flex flex-col justify-between min-h-[400px] md:min-h-[700px]">
          {/* Background image */}
          <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-70" style={{backgroundImage: "url('/images/section-bg-02.jpg')"}} />
          <div className="relative z-10 flex flex-col h-full justify-between p-4 md:p-8">
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-6 md:mb-14">
              <span className="flex items-center space-x-1 bg-white px-3 py-1.5 rounded-full shadow text-sm font-semibold">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-gray-900">5.0</span>
              </span>
              <span className="text-white font-semibold text-sm">score from 10,000 rating</span>
            </div>
            {/* Content */}
            <div className="flex-1 flex flex-col">
              <h2 className="text-xl md:text-2xl md:text-4xl font-bold text-white mb-6 md:mb-14 pr-4 md:pr-18">Learn from the best and create culinary magic at home.</h2>
              <p className="text-white text-md md:text-md pr-4 md:pr-16 mb-6 md:mb-22 max-w-md">Get inspired by expert tips and techniques to perfect your skills. Explore recipes that help you master new dishes, adding confidence and creativity to your home cooking experience.</p>
              <button className="bg-red-500 text-white px-3 py-2 rounded-lg font-semibold shadow hover:bg-black hover:cursor-pointer transition w-fit" onClick={handleIndianRecipesClick}>View Recipes</button>
            </div>
          </div>
        </div>
        {/* Right Card */}
        <div className="rounded-xl overflow-hidden shadow bg-black relative flex flex-col justify-between min-h-[400px] md:min-h-[700px]">
          {/* Chef image as background */}
          <div className="absolute right-0 bottom-0 h-full w-full bg-cover bg-center opacity-50 rounded-r-xl  md:block" style={{backgroundImage: "url('/images/section-bg-03.jpg')", objectPosition: 'right'}} />
          <div className="relative z-10 flex flex-col h-full justify-between p-4 md:p-8">
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-6 md:mb-14">
              <span className="flex items-center space-x-1 bg-white px-3 py-1.5 rounded-full shadow text-sm font-semibold">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-gray-900">5.0</span>
              </span>
              <span className="text-gray-900 font-semibold text-sm">score from 10,000 rating</span>
            </div>
            {/* Content */}
            <div className="flex-1 flex flex-col ">
              <h2 className="text-xl md:text-2xl tracking-tight md:text-4xl font-bold text-black mb-6 md:mb-12 pr-8 md:pr-40">Add flavor, flair, and a touch of creativity to your meals.</h2>
              <p className="text-black font-semibold text-md md:text-md tracking-tight mb-6 md:mb-8 max-w-md pr-4 md:pr-12 md:mb-22">Elevate your dishes with bold flavors and creative twists. From vibrant ingredients to expert techniques, discover recipes that transform your everyday cooking into something extraordinary.</p>
              <button className="bg-red-500 text-white px-3 py-2 rounded-lg font-semibold shadow hover:bg-black hover:cursor-pointer transition w-fit" onClick={handleCreativeRecipesClick}>View Recipes</button>
            </div>
          </div>
        </div>
      </div>
      {/* Category Row */}
      <div className="flex flex-wrap justify-center gap-[14px]">
        {categories.map((cat) => (
          <div key={cat.label} className="flex flex-col items-center bg-white border border-gray-100 rounded-xl px-8 py-6 min-w-[120px] hover:cursor-pointer hover:bg-gray-100" onClick={() => handleCategoryClick(cat.label)}>
            <div className="mb-2 text-gray-900">{cat.icon}</div>
            <div className="font-semibold text-base text-gray-900 mb-1">{cat.label}</div>
            <div className="text-gray-400 text-sm">{cat.count} Recipes</div>
          </div>
        ))}
      </div>
      {/* Modal for recipes */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-6">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500" onClick={handleCloseModal}>✕</button>
            <h2 className="text-2xl font-bold mb-4 text-center">{modalTitle} Recipes</h2>
            {modalLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : modalError ? (
              <div className="text-center text-red-500 py-8">{modalError}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modalRecipes.map((r) => (
                  <div key={r.idMeal || r.idDrink} className="border rounded-lg p-3 flex flex-col items-center hover:bg-gray-100 cursor-pointer" onClick={() => handleRecipeClick(r)}>
                    <img src={r.strMealThumb || r.strDrinkThumb} alt={r.strMeal || r.strDrink} className="w-28 h-28 object-cover rounded mb-2" />
                    <div className="font-semibold text-center">{r.strMeal || r.strDrink}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Modal for full recipe */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto relative p-6">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500" onClick={handleCloseRecipeModal}>✕</button>
            {recipeLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : recipeError ? (
              <div className="text-center text-red-500 py-8">{recipeError}</div>
            ) : fullRecipe ? (
              <div>
                <h2 className="text-2xl font-bold mb-2 text-center">{fullRecipe.strMeal || fullRecipe.strDrink}</h2>
                <img src={fullRecipe.strMealThumb || fullRecipe.strDrinkThumb} alt={fullRecipe.strMeal || fullRecipe.strDrink} className="w-40 h-40 object-cover rounded mx-auto mb-4" />
                {fullRecipe.strCategory && <div className="mb-2 text-center"><span className="font-semibold">Category:</span> {fullRecipe.strCategory}</div>}
                {fullRecipe.strArea && <div className="mb-2 text-center"><span className="font-semibold">Area:</span> {fullRecipe.strArea}</div>}
                {fullRecipe.strAlcoholic && <div className="mb-2 text-center"><span className="font-semibold">Type:</span> {fullRecipe.strAlcoholic}</div>}
                {fullRecipe.strTags && <div className="mb-2 text-center"><span className="font-semibold">Tags:</span> {fullRecipe.strTags}</div>}
                <div className="mb-2 font-semibold">Ingredients:</div>
                <ul className="mb-2 list-disc list-inside">
                  {Array.from({length: 20}, (_, i) => i+1).map(i => {
                    const ing = fullRecipe[`strIngredient${i}`];
                    const measure = fullRecipe[`strMeasure${i}`];
                    return ing && ing.trim() ? (
                      <li key={i}>{ing}{measure && measure.trim() ? ` - ${measure}` : ''}</li>
                    ) : null;
                  })}
                </ul>
                {fullRecipe.strInstructions && <div className="mb-2"><span className="font-semibold">Instructions:</span> <div className="whitespace-pre-line">{fullRecipe.strInstructions}</div></div>}
                {fullRecipe.strYoutube && (
                  <div className="mt-2 text-center">
                    <a href={fullRecipe.strYoutube} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Watch on YouTube</a>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default AboutUs;


