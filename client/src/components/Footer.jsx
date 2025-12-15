import React, { useState } from 'react';

const tags = [
  'COMFORT FOOD', 'DAIRY-FREE', 'DESSERTS', 'GLUTEN-FREE', 'HEALTHY', 'HIGH-PROTEIN', 'HOLIDAY', 'KID-FRIENDLY',
  'LOW-CARB', 'MEAL PREP', 'MEAT', 'ONE-POT', 'QUICK MEALS', 'SPICY', 'VEGETARIAN', 'VIDEO RECIPE'
];

const navLinks = [
  'All Recipes', 'Video Recipes', 'A-Z Recipes', 'Refund Policy', 'Terms and Conditions', 'Contact Us'
];

const socialIcons = [
  {
    name: 'Instagram',
    svg: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
    ),
    url: "https://www.instagram.com/homecookingshow/"
  },
  {
    name: 'X',
    svg: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
    ),
    url: "https://x.com/CookingChannel"
  },
  {
    name: 'YouTube',
    svg: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21.8 8.001a2.752 2.752 0 0 0-1.936-1.947C18.2 6 12 6 12 6s-6.2 0-7.864.054A2.752 2.752 0 0 0 2.2 8.001C2 9.664 2 12 2 12s0 2.336.2 3.999a2.752 2.752 0 0 0 1.936 1.947C5.8 18 12 18 12 18s6.2 0 7.864-.054A2.752 2.752 0 0 0 21.8 15.999C22 14.336 22 12 22 12s0-2.336-.2-3.999zM10 15.5v-7l6 3.5-6 3.5z"/></svg>
    ),
    url: "https://www.youtube.com/@CookingshookingIn"
  },
  {
    name: 'Pinterest',
    svg: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.084 2.438 7.563 6.188 8.938-.086-.76-.163-1.926.034-2.755.178-.76 1.145-4.84 1.145-4.84s-.292-.584-.292-1.447c0-1.355.786-2.368 1.765-2.368.832 0 1.234.624 1.234 1.372 0 .836-.532 2.086-.807 3.25-.23.97.487 1.76 1.444 1.76 1.733 0 2.899-2.227 2.899-4.86 0-2.01-1.357-3.513-3.83-3.513-2.788 0-4.522 2.09-4.522 4.42 0 .836.32 1.734.72 2.222.08.098.09.184.066.282-.072.29-.234.97-.266 1.104-.04.17-.13.207-.302.125-1.13-.526-1.836-2.176-1.836-3.502 0-2.857 2.41-6.285 7.18-6.285 3.84 0 6.37 2.783 6.37 5.775 0 3.95-2.195 6.89-5.45 6.89-1.09 0-2.116-.59-2.465-1.26l-.67 2.55c-.19.74-.56 1.67-.84 2.24.63.194 1.3.3 2 .3 5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
    ),
    url: "https://in.pinterest.com/search/pins/?q=cooking%20recipes&rs=ac&len=7&source_id=ac_vSBeYhIh&eq=cooking&etslf=1855"
  }
];

export default function Footer({ onShowAZModal, onShowContactModal, scrollToSection }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [tagModalTitle, setTagModalTitle] = useState("");
  const [tagModalRecipes, setTagModalRecipes] = useState([]);
  const [tagModalLoading, setTagModalLoading] = useState(false);
  const [tagModalError, setTagModalError] = useState("");
  const [dishModalOpen, setDishModalOpen] = useState(false);
  const [dishRecipe, setDishRecipe] = useState(null);
  const [dishLoading, setDishLoading] = useState(false);

  const handleOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType("");
  };

  const handleTagClick = async (tag) => {
    setTagModalOpen(true);
    setTagModalTitle(tag);
    setTagModalLoading(true);
    setTagModalError("");
    setTagModalRecipes([]);
    let url;
    // Try to use TheMealDB filter by category or by tag
    // If tag matches a category, use filter.php?c=...
    // Otherwise, try search.php?s=tag
    const categoryMap = {
      'DESSERTS': 'Dessert',
      'MEAT': 'Beef',
      'VEGETARIAN': 'Vegetarian',
      'HEALTHY': 'Vegetarian',
      'GLUTEN-FREE': 'Miscellaneous',
      'VIDEO RECIPE': 'Miscellaneous',
      'KID-FRIENDLY': 'Chicken',
      'SPICY': 'Lamb',
      'COMFORT FOOD': 'Pasta',
      'HIGH-PROTEIN': 'Pork',
      'HOLIDAY': 'Pasta',
      'DAIRY-FREE': 'Seafood',
      'LOW-CARB': 'Seafood',
      'MEAL PREP': 'Chicken',
      'ONE-POT': 'Pasta',
      'QUICK MEALS': 'Chicken',
    };
    const cat = categoryMap[tag.toUpperCase()];
    if (cat) {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(cat)}`;
    } else {
      url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(tag.split(' ')[0])}`;
    }
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.meals && data.meals.length > 0) {
        setTagModalRecipes(data.meals.slice(0, 16));
      } else {
        setTagModalError("No recipes found for this tag.");
      }
    } catch {
      setTagModalError("Failed to fetch recipes.");
    }
    setTagModalLoading(false);
  };

  const handleCloseTagModal = () => {
    setTagModalOpen(false);
    setTagModalTitle("");
    setTagModalRecipes([]);
    setTagModalError("");
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

  return (
    <footer className="bg-gray-100 pt-8 pb-0 lg:pt-14">
      {/* Popular Tags Section */}
      <div className="max-w-5xl mx-auto text-center mb-12 px-4 sm:px-6 lg:px-0 lg:mb-20">
        <h2 className="text-3xl sm:text-3xl lg:text-5xl font-semibold mb-3 lg:mb-4 text-black">Explore Popular Tags</h2>
        <p className="text-gray-500 text-semibold text-md mb-6 lg:mb-10 tracking-tight">From quick meals to healthy dishes, our popular tags make it easy to explore delicious options with one click.</p>
        <div className="flex flex-wrap justify-center gap-x-2 sm:gap-x-3 lg:gap-x-4 gap-y-2 mb-4">
          {tags.map(tag => {
            if (tag === 'VIDEO RECIPE') {
              return (
                <button
                  key={tag}
                  className="bg-white text-xs sm:text-sm lg:text-sm tracking-tighter text-black font-bold rounded-full px-3 sm:px-4 lg:px-4 py-2 lg:py-[10px] mb-2 inline-block whitespace-nowrap hover:bg-red-500 hover:text-white focus:outline-none cursor-pointer"
                  onClick={() => scrollToSection && scrollToSection('videos-section')}
                >
                  {tag}
                </button>
              );
            }
            return (
              <button
                key={tag}
                className="bg-white text-xs sm:text-sm lg:text-sm tracking-tighter text-black font-bold rounded-full px-3 sm:px-4 lg:px-4 py-2 lg:py-[10px] mb-2 inline-block whitespace-nowrap hover:bg-red-500 hover:text-white focus:outline-none cursor-pointer"
                onClick={() => handleTagClick(tag)}
              >
              {tag}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Footer Navigation and Socials */}
      <div className="bg-white pt-6 lg:pt-10 pb-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex flex-col lg:flex-row lg:gap-14 lg:items-center gap-6">
            {/* Social Icons */}
            <div className="flex justify-center lg:justify-start space-x-1 lg:mb-4 order-2 lg:order-1">
              {socialIcons.map(icon => (
                <a
                  key={icon.name}
                  href={icon.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-200 text-gray-800 text-bold rounded-full p-2 lg:p-4 flex items-center justify-center hover:bg-gray-300 transition cursor-pointer"
                  aria-label={icon.name}
                >
                  {icon.svg}
                </a>
              ))}
            </div>
            
            {/* Navigation Links */}
            <div className="flex flex-wrap justify-center lg:justify-center gap-x-4 sm:gap-x-6 lg:gap-x-10 gap-y-2 lg:mb-4 font-bold text-black text-xs sm:text-sm lg:text-sm order-1 lg:order-2">
              {navLinks.map(link => {
                if (link === 'Refund Policy') {
                  return (
                    <button
                      key={link}
                      className="hover:text-red-500 whitespace-nowrap bg-transparent border-none outline-none cursor-pointer font-bold text-black text-xs sm:text-sm lg:text-sm"
                      onClick={() => handleOpenModal('refund')}
                    >
                      {link}
                    </button>
                  );
                }
                if (link === 'Terms and Conditions') {
                  return (
                    <button
                      key={link}
                      className="hover:text-red-500 whitespace-nowrap bg-transparent border-none outline-none cursor-pointer font-bold text-black text-xs sm:text-sm lg:text-sm"
                      onClick={() => handleOpenModal('terms')}
                    >
                      {link}
                    </button>
                  );
                }
                if (link === 'All Recipes') {
                  return (
                    <button
                      key={link}
                      className="hover:text-red-500 whitespace-nowrap bg-transparent border-none outline-none cursor-pointer font-bold text-black text-xs sm:text-sm lg:text-sm"
                      onClick={() => scrollToSection && scrollToSection('new-recipe-section')}
                    >
                      {link}
                    </button>
                  );
                }
                if (link === 'Video Recipes') {
                  return (
                    <button
                      key={link}
                      className="hover:text-red-500 whitespace-nowrap bg-transparent border-none outline-none cursor-pointer font-bold text-black text-xs sm:text-sm lg:text-sm"
                      onClick={() => scrollToSection && scrollToSection('videos-section')}
                    >
                      {link}
                    </button>
                  );
                }
                if (link === 'A-Z Recipes') {
                  return (
                    <button
                      key={link}
                      className="hover:text-red-500 whitespace-nowrap bg-transparent border-none outline-none cursor-pointer font-bold text-black text-xs sm:text-sm lg:text-sm"
                      onClick={onShowAZModal}
                    >
                      {link}
                    </button>
                  );
                }
                if (link === 'Contact Us') {
                  return (
                    <button
                      key={link}
                      className="hover:text-red-500 whitespace-nowrap bg-transparent border-none outline-none cursor-pointer font-bold text-black text-xs sm:text-sm lg:text-sm"
                      onClick={onShowContactModal}
                    >
                      {link}
                    </button>
                  );
                }
                return (
                <a key={link} href="#" className="hover:text-red-500 whitespace-nowrap">
                  {link}
                </a>
                );
              })}
            </div>
          </div>
          
          {/* Copyright and Logo */}
          <div className="w-full border-t border-gray-200 mt-6 pt-7 text-center">
            <p className="text-gray-600 mb-4 text-md tracking-tighter lg:text-md text-semibold">
              Recipedia offers a world of delicious recipes, cooking inspiration, and culinary tips. Explore new flavors, master techniques, and bring your passion for cooking to life.
            </p>
            <p className="text-black text-semibold tracking-tighter text-md lg:text-md mb-4">
              © 2025 Recipedia. All rights reserved. Designed by <a href="#" className="hover:text-red-500">Kumkum Motwani</a>.
            </p>
            <div className="flex justify-center items-center mt-2">
              <div className="w-6 h-6 sm:w-6 sm:h-6 md:w-6 md:h-6 bg-red-500 rounded-md flex items-center justify-center mr-2">
                  <svg
                  className="w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 text-white hover:cursor-pointer"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
                </svg>
                </div>
              <span className="text-base lg:text-lg font-bold text-red-500 hover:cursor-pointer">Recipedia</span>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for Refund Policy and Terms and Conditions */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500" onClick={handleCloseModal}>×</button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">
                {modalType === 'refund' ? 'Refund Policy' : 'Terms and Conditions'}
              </h2>
              {modalType === 'refund' ? (
                <div className="text-gray-700 text-sm space-y-3">
                  <p>We want you to be completely satisfied with your experience. If you are not satisfied with your purchase, you may request a refund within 7 days of your transaction. To be eligible for a refund, your request must meet the following criteria:</p>
                  <ul className="list-disc list-inside ml-4">
                    <li>The request is made within 7 days of purchase.</li>
                    <li>The product or service has not been used extensively or abused.</li>
                    <li>Proof of purchase is provided.</li>
                  </ul>
                  <p>Refunds will be processed to the original payment method within 5-7 business days after approval. For any questions, please contact our support team.</p>
                </div>
              ) : (
                <div className="text-gray-700 text-sm space-y-3">
                  <p>By using Recipedia, you agree to the following terms and conditions:</p>
                  <ul className="list-disc list-inside ml-4">
                    <li>All content is for personal, non-commercial use only.</li>
                    <li>Do not redistribute or republish content without permission.</li>
                    <li>We reserve the right to update these terms at any time.</li>
                    <li>Use of this site is at your own risk. We are not liable for any damages or losses.</li>
                  </ul>
                  <p>For more information, please contact us through our support channels.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Tag Modal */}
      {tagModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500" onClick={handleCloseTagModal}>×</button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">{tagModalTitle} Recipes</h2>
              {tagModalLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <span className="text-3xl animate-spin">🍴</span>
                  <div className="text-gray-600">Loading recipes...</div>
                </div>
              ) : tagModalError ? (
                <div className="p-8 text-center text-gray-500">{tagModalError}</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {tagModalRecipes.map((recipe) => (
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
    </footer>
  );
}