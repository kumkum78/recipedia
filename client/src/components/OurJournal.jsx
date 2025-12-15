
import { MessageCircle, Clock } from 'lucide-react';
import React, { useState } from 'react';

export default function OurJournal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalRecipes, setModalRecipes] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [dishModalOpen, setDishModalOpen] = useState(false);
  const [dishRecipe, setDishRecipe] = useState(null);
  const [dishLoading, setDishLoading] = useState(false);

  const handleArticleClick = async (type) => {
    setModalOpen(true);
    setModalLoading(true);
    setModalError("");
    setModalRecipes([]);
    let url = "";
    let title = "";
    if (type === 'quick-healthy') {
      url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Chicken';
      title = 'Quick and Wholesome Recipes for Everyday Cooking';
    } else if (type === 'beginners') {
      url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Side';
      title = 'Made for Beginners — Perfect for Young Cooks';
    } else if (type === 'kid-friendly') {
      url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert';
      title = 'Kid-Friendly Recipes That Are Fun and Simple';
    } else if (type === 'junk-food') {
      title = 'Treat Yourself — It’s Cheat Day!';
      try {
        setModalTitle(title);
        setModalLoading(true);
        setModalError("");
        setModalRecipes([]);
        // Fetch junk food from Beef, Pork, and Dessert categories
        const beefRes = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Beef');
        const beefData = await beefRes.json();
        let beefMeals = beefData.meals || [];
        const porkRes = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Pork');
        const porkData = await porkRes.json();
        let porkMeals = porkData.meals || [];
        const dessertRes = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert');
        const dessertData = await dessertRes.json();
        let dessertMeals = dessertData.meals || [];
        // Merge and deduplicate by idMeal
        const allMealsMap = {};
        beefMeals.forEach(m => { if (m.idMeal) allMealsMap[m.idMeal] = m; });
        porkMeals.forEach(m => { if (m.idMeal) allMealsMap[m.idMeal] = m; });
        dessertMeals.forEach(m => { if (m.idMeal) allMealsMap[m.idMeal] = m; });
        const allMeals = Object.values(allMealsMap);
        if (allMeals.length > 0) {
          setModalRecipes(allMeals.slice(0, 24));
        } else {
          setModalError("No recipes found.");
        }
      } catch {
        setModalError("Failed to fetch recipes.");
      }
      setModalLoading(false);
      return;
    }
    setModalTitle(title);
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.meals && data.meals.length > 0) {
        setModalRecipes(data.meals.slice(0, 16));
      } else {
        setModalError("No recipes found.");
      }
    } catch {
      setModalError("Failed to fetch recipes.");
    }
    setModalLoading(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalTitle("");
    setModalRecipes([]);
    setModalError("");
  };

  const handleOpenDishModal = async (recipe) => {
    setDishModalOpen(true);
    setDishRecipe(null);
    setDishLoading(true);
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`);
      const data = await res.json();
      if (data.meals && data.meals.length > 0) {
        setDishRecipe(data.meals[0]);
      } else {
        setDishRecipe(null);
      }
    } catch {
      setDishRecipe(null);
    }
    setDishLoading(false);
  };

  const handleCloseDishModal = () => {
    setDishModalOpen(false);
    setDishRecipe(null);
  };

  const articles = [
    {
      id: 1,
      category: 'HEALTH',
      categoryColor: 'bg-red-500',
      title: 'Power Up Your Mornings: 5 Quick and Healthy Breakfast Ideas',
      author: 'Olivia Thompson',
      timeAgo: '7 months Ago',
      date: '7 months Ago',
      readTime: '5 Min Read',
      comments: '4',
      image: '/images/post-1-800x520.jpg'
    },
    {
      id: 2,
      category: 'Kitchen Moments',
      categoryColor: 'bg-red-500',
      title: 'Made for Beginners — Perfect for Young Cooks',
      author: 'Olivia Thompson',
      timeAgo: '7 months Ago',
      date: '7 months Ago',
      readTime: '5 Min Read',
      comments: '4',
      image: '/images/post-2-800x520.jpg'
    },
    {
      id: 3,
      category: 'Mood Meals',
      categoryColor: 'bg-red-500',
      title: 'Cravings Welcome: It’s Junk Food Time!',
      author: 'Olivia Thompson',
      timeAgo: '7 months Ago',
      date: '7 months Ago',
      readTime: '5 Min Read',
      comments: '4',
      image: '/images/post-5-800x520.jpg'
    }
  ];

  return (
    <div className="max-w-[88%] mx-auto px-4 pt-12 pb-6">
      {/* Header Section */}
      <div className="relative flex flex-col items-center text-center mb-18">
        <span className="absolute text-[8rem] opacity-15 z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">🍴</span>
        <h2 className="text-5xl font-semibold tracking-tighter text-gray-900 z-10 mb-4">Featured Recipes</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto tracking-tighter">
        Hand-picked recipe collections for every taste, skill level, and craving!
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => {
          // Map titles to modal types (case-insensitive)
          let onClick = undefined;
          const title = article.title || '';
          if (title.toLowerCase().startsWith('power up your mornings')) {
            onClick = () => handleArticleClick('quick-healthy');
          } else if (title.toLowerCase().startsWith('made for beginners')) {
            onClick = () => handleArticleClick('beginners');
          } else if (title.toLowerCase().startsWith('cravings welcome')) {
            onClick = () => handleArticleClick('junk-food');
          }
          return (
            <div key={article.id} className="bg-white overflow-hidden">
            {/* Article Image */}
            <div className="relative h-64 overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title}
                  className="w-full h-full object-cover rounded-lg hover:cursor-pointer"
              />
              {/* Category Badge */}
                <div className="absolute top-4 left-4 hover:cursor-pointer">
                  <span className={`${article.categoryColor} text-white text-xs font-bold px-3 py-2 rounded-md`}>
                  {article.category}
                </span>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-6 pb-4">
              <h3
                className="text-xl tracking-tighter font-bold mb-4 leading-snug text-black hover:text-red-500 hover:cursor-pointer"
                onClick={onClick}
                style={onClick ? { cursor: 'pointer' } : {}}
              >
                {article.title}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-black text-sm gap-y-1">
              </div>
              <div className="text-gray-500 text-bold text-xs mt-2 flex items-center gap-2">
              </div>
            </div>
          </div>
        );
        })}
      </div>
      {/* Modal for Article Recipes */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500" onClick={handleCloseModal}>×</button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">{modalTitle}</h2>
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <span className="text-3xl animate-spin">🍴</span>
                  <div className="text-gray-600">Loading recipes...</div>
                </div>
              ) : modalError ? (
                <div className="p-8 text-center text-gray-500">{modalError}</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {modalRecipes.map((recipe) => (
                    <div
                      key={recipe.idMeal}
                      className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
                      onClick={() => handleOpenDishModal(recipe)}
                    >
                      <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <div className="text-md font-bold text-red-500 mb-1">{recipe.strCategory}</div>
                        <div className="text-lg font-semibold text-black mb-2 hover:text-red-500">{recipe.strMeal}</div>
                        <div className="text-xs text-gray-400">{recipe.strArea}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Dish Modal */}
      {dishModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500" onClick={handleCloseDishModal}>×</button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">Recipe Details</h2>
              {dishLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <span className="text-3xl animate-spin">🍴</span>
                  <div className="text-gray-600">Loading recipe...</div>
                </div>
              ) : dishRecipe ? (
                <>
                  <img src={dishRecipe.strMealThumb} alt={dishRecipe.strMeal} className="w-full h-64 object-cover rounded mb-4" />
                  <h3 className="text-xl font-bold mb-2">{dishRecipe.strMeal}</h3>
                  <div className="mb-4">
                    <span className="font-semibold">Category:</span> {dishRecipe.strCategory} <span className="ml-4 font-semibold">Area:</span> {dishRecipe.strArea}
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold">Ingredients:</span>
                    <ul className="list-disc list-inside ml-4">
                      {Array.from({ length: 20 }, (_, i) => i + 1)
                        .map(i => {
                          const ing = dishRecipe[`strIngredient${i}`];
                          const measure = dishRecipe[`strMeasure${i}`];
                          return ing && ing.trim() ? `${measure ? measure.trim() + ' ' : ''}${ing.trim()}` : null;
                        })
                        .filter(Boolean)
                        .map((ing, idx) => <li key={idx}>{ing}</li>)}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold">Instructions:</span>
                    <p className="whitespace-pre-line mt-1">{dishRecipe.strInstructions}</p>
                  </div>
                  {dishRecipe.strYoutube && (
                    <div className="mb-2">
                      <a href={dishRecipe.strYoutube} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Watch on YouTube</a>
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
}