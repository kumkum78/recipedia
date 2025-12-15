import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useRecipeContext } from "../hooks/useRecipeContext";
import { X, Clock, ChefHat, Trash2, Heart, Bookmark, Edit } from "lucide-react";
import ProfileImage from "./ProfileImage";
import { useAuth } from "../hooks/useAuth";

// Profile image URL helper
const formatProfileUrl = (profilePath) => {
  if (!profilePath) return null;
  if (profilePath.startsWith('http')) return profilePath;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${baseUrl}${profilePath}`;
};

export default function Profile({ onShowLogin }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [externalRecipeData, setExternalRecipeData] = useState({});
  const [loadingExternalData, setLoadingExternalData] = useState(false);
  const { loadUserPreferences } = useRecipeContext();
  const navigate = useNavigate();
  const { logout, updateUser } = useAuth();

  // Recipe modal state
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [recipeLoading, setRecipeLoading] = useState(false);

  // Success message state
  const [successMessage, setSuccessMessage] = useState("");

  // Function to fetch external recipe data
  const fetchExternalRecipeData = useCallback(async (recipeId) => {
    try {
      if (recipeId.startsWith('external_video_')) {
        // For video recipes, map to actual video data
        const videoId = recipeId.replace('external_video_', '');
        const videoData = getVideoDataById(parseInt(videoId));
        if (videoData) {
          return {
            title: videoData.title,
            description: `A delicious ${videoData.category} recipe from ${videoData.cuisine} cuisine`,
            image: videoData.image,
            category: videoData.category,
            cuisine: videoData.cuisine,
            time: videoData.time,
            difficulty: videoData.difficulty,
            rating: videoData.rating
          };
        }
        // Fallback if video data not found
        return {
          title: `Video Recipe ${videoId}`,
          description: 'A delicious video recipe tutorial',
          image: '/images/recipe-2-550x690.jpg',
          category: 'Video Recipe'
        };
      } else if (recipeId.startsWith('external_')) {
        // For TheMealDB recipes, fetch from API
        const mealId = recipeId.replace('external_', '');
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        
        if (data.meals && data.meals.length > 0) {
          const meal = data.meals[0];
          return {
            title: meal.strMeal,
            description: `A delicious ${meal.strCategory} recipe from ${meal.strArea}`,
            image: meal.strMealThumb,
            category: meal.strCategory,
            cuisine: meal.strArea
          };
        }
      }
      return null;
    } catch (error) {
      console.error(`Error fetching recipe ${recipeId}:`, error);
      return null;
    }
  }, []);

  // Function to get video data by ID (matching the videos array from Vedios component)
  const getVideoDataById = (id) => {
    const videos = [
      {
        id: 1,
        category: 'Desserts',
        title: 'Molten Chocolate Lava Cake Dessert',
        image: '/images/recipe-6-630x785.jpg',
        rating: 4.9,
        time: '80 min',
        difficulty: 'Advanced',
        cuisine: 'Ethiopian',
        flag: '🇪🇹',
        liked: false,
        bookmarked: false,
      },
      {
        id: 2,
        category: 'Vegetarian',
        title: 'Spinach Ricotta Stuffed Vegan Pasta Shells',
        image: '/images/recipe-21-630x785.jpg',
        rating: 4.8,
        time: '25 min',
        difficulty: 'Expert',
        cuisine: 'Italian',
        flag: '🇮🇹',
        liked: false,
        bookmarked: false,
      },
      {
        id: 3,
        category: 'Desserts',
        title: 'Apple Crumble with Cinnamon Oat Topping',
        image: '/images/recipe-20-630x785.jpg',
        rating: 5.0,
        time: '35 min',
        difficulty: 'Easy',
        cuisine: 'Korean',
        flag: '🇰🇷',
        liked: false,
        bookmarked: false,
      },
      {
        id: 4,
        category: 'Pasta',
        title: 'Creamy Garlic Mushroom Penne Pasta',
        image: '/images/recipe-2-550x690.jpg',
        rating: 4.8,
        time: '35 min',
        difficulty: 'Intermediate',
        cuisine: 'Italian',
        flag: '🇮🇹',
        liked: false,
        bookmarked: false,
      },
      {
        id: 5,
        category: 'Healthy',
        title: 'Chickpea and Kale Salad with Lemon Dressing',
        image: '/images/recipe-18-630x785.jpg',
        rating: 4.6,
        time: '5 min',
        difficulty: 'Intermediate',
        cuisine: 'Spanish',
        flag: '🇪🇸',
        liked: false,
        bookmarked: false,
      },
      {
        id: 6,
        category: 'Breads',
        title: 'Savory Garlic Herb Butter Dinner Rolls',
        image: '/images/recipe-13-630x785.jpg',
        rating: 4.8,
        time: '85 min',
        difficulty: 'Beginner',
        cuisine: 'Mexican',
        flag: '🇲🇽',
        liked: false,
        bookmarked: false,
      },
      {
        id: 7,
        category: 'Salads',
        title: 'Asian Sesame Noodles with Crunchy Veggies',
        image: '/images/recipe-28-630x785.jpg',
        rating: 4.5,
        time: '60 min',
        difficulty: 'Beginner',
        cuisine: 'Moroccan',
        flag: '🇲🇦',
        liked: false,
        bookmarked: false,
      },
      {
        id: 8,
        category: 'Pasta',
        title: 'Creamy Mushroom Risotto with Parmesan',
        image: '/images/recipe-2-550x690.jpg',
        rating: 4.7,
        time: '45 min',
        difficulty: 'Intermediate',
        cuisine: 'Italian',
        flag: '🇮🇹',
        liked: false,
        bookmarked: false,
      }
    ];
    
    return videos.find(video => video.id === id);
  };

  // Function to load external recipe data for all external recipes
  const loadExternalRecipeData = useCallback(async (recipes) => {
    const externalRecipes = recipes.filter(recipe => typeof recipe === 'string');
    if (externalRecipes.length === 0) return;
    
    setLoadingExternalData(true);
    const newExternalData = {};
    
    for (const recipeId of externalRecipes) {
      if (!externalRecipeData[recipeId]) {
        const recipeData = await fetchExternalRecipeData(recipeId);
        if (recipeData) {
          newExternalData[recipeId] = recipeData;
        }
      }
    }
    
    if (Object.keys(newExternalData).length > 0) {
      setExternalRecipeData(prev => ({ ...prev, ...newExternalData }));
    }
    setLoadingExternalData(false);
  }, [externalRecipeData, fetchExternalRecipeData]);

  // Keep only one fetchProfile function
  const fetchProfile = useCallback(async () => {
    if (loading || (profile && !error)) return;
    
    try {
      setLoading(true);
      setError("");
      
      const response = await API.get("/users/profile");
      const profileData = response.data;
      
      // Fetch liked and bookmarked recipes data
      const [likedRes, bookmarkedRes] = await Promise.all([
        API.get('/users/liked-recipes'),
        API.get('/users/bookmarked-recipes')
      ]);

      const updatedProfile = {
        ...profileData,
        likedRecipes: likedRes.data,
        bookmarkedRecipes: bookmarkedRes.data
      };

      setProfile(updatedProfile);
      
      // Update auth context with latest user data
      updateUser(updatedProfile);

      // Load external recipe data for liked and bookmarked recipes
      await loadExternalRecipeData(likedRes.data);
      await loadExternalRecipeData(bookmarkedRes.data);

      loadUserPreferences();
    } catch (error) {
      console.error("Profile fetch error:", error);
      if (error.response?.status === 401) {
        setError("Please login to view your profile.");
        if (onShowLogin) onShowLogin();
      } else {
        setError("Unable to load profile at the moment. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, [loading, profile, error, onShowLogin, loadUserPreferences, loadExternalRecipeData, updateUser]);

  // Use the fetchProfile in useEffect
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRecipeClick = async (recipe) => {
    setRecipeModalOpen(true);
    setRecipeDetails(null);
    setRecipeLoading(true);

    try {
      if (recipe._id && recipe._id.startsWith('external_video_')) {
        // Always use the same image as the card
        let img = recipe.image || recipe.strMealThumb;
        setRecipeDetails({
          title: recipe.title,
          image: img,
          category: recipe.category,
          cuisine: recipe.cuisine,
          instructions: `This is a video recipe for ${recipe.title}. Watch the video tutorial to learn how to make this delicious ${recipe.category} dish from ${recipe.cuisine} cuisine.`,
          ingredients: [`${recipe.title} - ${recipe.category} recipe`],
          youtube: null,
          isVideoRecipe: true,
          difficulty: recipe.difficulty || 'Intermediate',
          time: recipe.time || '30 min',
          rating: recipe.rating || 4.5
        });
      } else if (recipe._id && recipe._id.startsWith('external_')) {
        // Fetch from TheMealDB
        const recipeId = recipe._id.replace('external_', '');
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
        const data = await response.json();
        
        if (data.meals && data.meals.length > 0) {
          const meal = data.meals[0];
          setRecipeDetails({
            title: meal.strMeal,
            image: meal.strMealThumb,
            category: meal.strCategory,
            cuisine: meal.strArea,
            instructions: meal.strInstructions,
            ingredients: getIngredientsList(meal),
            youtube: meal.strYoutube
          });
        }
      } else {
        // Internal recipe - already has details
        console.log('Opening internal recipe modal for:', recipe);
        setRecipeDetails({
          title: recipe.title,
          image: recipe.image,
          description: recipe.description,
          category: recipe.category || 'Recipe',
          cuisine: recipe.cuisine || 'Home Cooking',
          instructions: recipe.steps ? recipe.steps.join('\n\n') : recipe.instructions,
          ingredients: recipe.ingredients || [],
          youtube: recipe.youtube
        });
      }
    } catch (error) {
      console.error('Failed to fetch recipe details:', error);
    } finally {
      setRecipeLoading(false);
    }
  };

  const handleExternalRecipeClick = async (recipeId) => {
    setRecipeModalOpen(true);
    setRecipeDetails(null);
    setRecipeLoading(true);

    try {
      if (recipeId.startsWith('external_video_')) {
        // For video recipes, use the video data
        const videoId = recipeId.replace('external_video_', '');
        const videoData = getVideoDataById(parseInt(videoId));
        
        if (videoData) {
          setRecipeDetails({
            title: videoData.title,
            image: videoData.image,
            category: videoData.category,
            cuisine: videoData.cuisine,
            instructions: `This is a video recipe for ${videoData.title}. Watch the video tutorial to learn how to make this delicious ${videoData.category} dish from ${videoData.cuisine} cuisine.`,
            ingredients: [`${videoData.title} - ${videoData.category} recipe`],
            youtube: null,
            isVideoRecipe: true,
            difficulty: videoData.difficulty,
            time: videoData.time,
            rating: videoData.rating
          });
        } else {
          // Fallback for unknown video recipes
          setRecipeDetails({
            title: `Video Recipe ${videoId}`,
            image: '/images/recipe-2-550x690.jpg',
            category: 'Video Recipe',
            cuisine: 'Video',
            instructions: `This is a video recipe tutorial. Watch the video to learn how to make this delicious dish.`,
            ingredients: [`Video Recipe ${videoId} - Video tutorial`],
            youtube: null,
            isVideoRecipe: true,
            difficulty: 'Intermediate',
            time: '30 min',
            rating: 4.5
          });
        }
      } else if (recipeId.startsWith('external_')) {
        const mealId = recipeId.replace('external_', '');
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        
        if (data.meals && data.meals.length > 0) {
          const meal = data.meals[0];
          setRecipeDetails({
            title: meal.strMeal,
            image: meal.strMealThumb,
            category: meal.strCategory,
            cuisine: meal.strArea,
            instructions: meal.strInstructions,
            ingredients: getIngredientsList(meal),
            youtube: meal.strYoutube
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch external recipe details:', error);
    } finally {
      setRecipeLoading(false);
    }
  };

  const getIngredientsList = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`.trim());
      }
    }
    return ingredients;
  };

  const closeRecipeModal = () => {
    setRecipeModalOpen(false);
    setRecipeDetails(null);
  };

  const handleDeleteRecipe = (recipeId) => {
    setRecipeToDelete(recipeId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteRecipe = async () => {
    if (!recipeToDelete) return;
    try {
      await API.delete(`/recipes/${recipeToDelete}`);
      setSuccessMessage("Recipe deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchProfile();
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      alert(error.response?.data?.message || "Failed to delete recipe");
    } finally {
      setDeleteModalOpen(false);
      setRecipeToDelete(null);
    }
  };

  const handleUnlikeRecipe = async (recipeId, e) => {
    e.stopPropagation(); // Prevent opening the recipe modal
    if (!window.confirm('Are you sure you want to unlike this recipe?')) {
      return;
    }
    try {
      await API.delete(`/users/like/${recipeId}`);
      setSuccessMessage("Recipe unliked successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      // Refresh profile to update the liked recipes list
      fetchProfile();
    } catch (error) {
      console.error("Failed to unlike recipe:", error);
      alert(error.response?.data?.message || "Failed to unlike recipe");
    }
  };

  const handleUnbookmarkRecipe = async (recipeId, e) => {
    e.stopPropagation(); // Prevent opening the recipe modal
    if (!window.confirm('Are you sure you want to remove this bookmark?')) {
      return;
    }
    try {
      await API.delete(`/users/bookmark/${recipeId}`);
      setSuccessMessage("Recipe unbookmarked successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      // Refresh profile to update the bookmarked recipes list
      fetchProfile();
    } catch (error) {
      console.error("Failed to unbookmark recipe:", error);
      alert(error.response?.data?.message || "Failed to unbookmark recipe");
    }
  };

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    image: ""
  });
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  // Edit recipe functionality
  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setEditForm({
      title: recipe.title || "",
      description: recipe.description || "",
      ingredients: recipe.ingredients ? recipe.ingredients.join(", ") : "",
      steps: recipe.steps ? recipe.steps.join(", ") : "",
      image: recipe.image || ""
    });
    setSelectedFile(null);
    setImagePreview(null);
    setEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    
    try {
      let imageUrl = editForm.image; // Keep URL if provided

      // If file is selected, upload it first
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        
        try {
          const uploadResponse = await API.post('/recipes/upload-image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          imageUrl = uploadResponse.data.imageUrl;
          console.log('New image uploaded successfully:', imageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          // Continue with existing image if upload fails
        }
      }

      const payload = {
        title: editForm.title,
        description: editForm.description,
        image: imageUrl,
        ingredients: editForm.ingredients.split(",").map(item => item.trim()).filter(item => item),
        steps: editForm.steps.split(",").map(item => item.trim()).filter(item => item)
      };
      
      console.log('Updating recipe with payload:', payload);
      await API.put(`/recipes/${editingRecipe._id}`, payload);
      
      setSuccessMessage("Recipe updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Close edit modal and refresh profile
      setEditModalOpen(false);
      setEditingRecipe(null);
      fetchProfile();
    } catch (err) {
      console.error('Recipe update error:', err);
      setSuccessMessage(err.response?.data?.message || "Failed to update recipe");
    } finally {
      setEditLoading(false);
    }
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingRecipe(null);
    setEditForm({
      title: "",
      description: "",
      ingredients: "",
      steps: "",
      image: ""
    });
    setSelectedFile(null);
    setImagePreview(null);
  };

  const removeEditImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setEditForm({ ...editForm, image: "" });
  };

  // Recipe display section
  const RecipeCard = ({ recipe }) => (
    <div className="recipe-card bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={recipe.image} 
        alt={recipe.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
        <p className="text-gray-600 text-sm">{recipe.cuisine}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={onShowLogin}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-6">
            <ProfileImage 
              src={formatProfileUrl(profile.profilePicture)} 
              onUpdate={(imageUrl) => {
                setProfile({...profile, profilePicture: imageUrl});
                setSuccessMessage('Profile picture updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                updateUser({ profilePicture: imageUrl }); // Update auth context
              }}
            />
            <div className="flex flex-1 justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}'s Profile</h1>
                <p className="text-gray-600">{profile.email}</p>
              </div>
              <div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liked Recipes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">❤️ Liked Recipes</h2>
            {profile.likedRecipes && profile.likedRecipes.length > 0 ? (
              <div className="space-y-3">
                {profile.likedRecipes.map((recipe) => {
                  // Handle string IDs (external recipes)
                  if (typeof recipe === 'string') {
                    const recipeData = externalRecipeData[recipe];
                    return (
                      <div 
                        key={recipe} 
                        className="border-b pb-3 last:border-b-0 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                        onClick={() => handleExternalRecipeClick(recipe)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            {recipeData && recipeData.image ? (
                              <img 
                                src={recipeData.image}
                                alt={recipeData.title} 
                                className="w-12 h-12 object-cover rounded-md"
                                onError={(e) => {
                                  e.target.src = '/images/recipe-2-550x690.jpg';
                                  e.target.onerror = null;
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                <span className="text-gray-500 text-xs">🍴</span>
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">
                                {recipeData ? recipeData.title : (
                                  recipe.startsWith('external_video_') 
                                    ? `Video Recipe ${recipe.replace('external_video_', '')}`
                                    : recipe.startsWith('external_')
                                      ? `Recipe ${recipe.replace('external_', '')}`
                                      : recipe
                                )}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {recipeData ? recipeData.description : (loadingExternalData ? 'Loading...' : 'Loading recipe details...')}
                              </p>
                              {recipeData && recipeData.category && (
                                <p className="text-xs text-red-500 mt-1">{recipeData.category}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleUnlikeRecipe(recipe, e)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors ml-2"
                            title="Unlike recipe"
                          >
                            <Heart size={16} fill="currentColor" />
                          </button>
                        </div>
                      </div>
                    );
                  }
                  
                  // Handle recipe objects (populated recipes)
                  return (
                  <div 
                    key={recipe._id} 
                    className="border-b pb-3 last:border-b-0 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                    onClick={() => handleRecipeClick(recipe)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {(() => {
                          // Always use correct fields for video recipes
                          let img = recipe.image;
                          let title = recipe.title;
                          if (recipe._id && recipe._id.startsWith('external_video_')) {
                            img = img || recipe.strMealThumb;
                            title = title || recipe.strMeal;
                          }
                          return img ? (
                            <img 
                              src={
                                img.startsWith('http')
                                  ? img
                                  : img.startsWith('/images/')
                                    ? img // Use directly for frontend public images
                                    : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img}`
                              }
                              alt={title} 
                              className="w-12 h-12 object-cover rounded-md"
                              onError={(e) => {
                                const fallbackImages = [
                                  '/images/recipe-2-550x690.jpg',
                                  '/images/recipe-6-630x785.jpg',
                                  '/images/recipe-18-630x785.jpg',
                                  '/images/recipe-20-630x785.jpg'
                                ];
                                const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
                                e.target.src = randomFallback;
                                e.target.onerror = null;
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                              <span className="text-gray-500 text-xs">🍴</span>
                            </div>
                          );
                        })()}
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{recipe._id && recipe._id.startsWith('external_video_') ? (recipe.title || recipe.strMeal) : recipe.title}</h3>
                          <p className="text-sm text-gray-600">{recipe.description}</p>
                          {(recipe._id && recipe._id.startsWith('external_video_') ? (recipe.category || recipe.strCategory) : recipe.category) && (
                            <p className="text-xs text-red-500 mt-1">{recipe._id && recipe._id.startsWith('external_video_') ? (recipe.category || recipe.strCategory) : recipe.category}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleUnlikeRecipe(recipe._id, e)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors ml-2"
                        title="Unlike recipe"
                      >
                        <Heart size={16} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No liked recipes yet.</p>
            )}
          </div>

          {/* Bookmarked Recipes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🔖 Bookmarked Recipes</h2>
            {profile.bookmarkedRecipes && profile.bookmarkedRecipes.length > 0 ? (
              <div className="space-y-3">
                {profile.bookmarkedRecipes.map((recipe) => {
                  // Handle string IDs (external recipes)
                  if (typeof recipe === 'string') {
                    const recipeData = externalRecipeData[recipe];
                    return (
                      <div 
                        key={recipe} 
                        className="border-b pb-3 last:border-b-0 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                        onClick={() => handleExternalRecipeClick(recipe)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            {recipeData && recipeData.image ? (
                              <img 
                                src={recipeData.image}
                                alt={recipeData.title} 
                                className="w-12 h-12 object-cover rounded-md"
                                onError={(e) => {
                                  e.target.src = '/images/recipe-2-550x690.jpg';
                                  e.target.onerror = null;
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                <span className="text-gray-500 text-xs">🍴</span>
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">
                                {recipeData ? recipeData.title : (
                                  recipe.startsWith('external_video_') 
                                    ? `Video Recipe ${recipe.replace('external_video_', '')}`
                                    : recipe.startsWith('external_')
                                      ? `Recipe ${recipe.replace('external_', '')}`
                                      : recipe
                                )}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {recipeData ? recipeData.description : (loadingExternalData ? 'Loading...' : 'Loading recipe details...')}
                              </p>
                              {recipeData && recipeData.category && (
                                <p className="text-xs text-red-500 mt-1">{recipeData.category}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleUnbookmarkRecipe(recipe, e)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors ml-2"
                            title="Remove bookmark"
                          >
                            <Bookmark size={16} fill="currentColor" />
                          </button>
                        </div>
                      </div>
                    );
                  }
                  
                  // Handle recipe objects (populated recipes)
                  return (
                  <div 
                    key={recipe._id} 
                    className="border-b pb-3 last:border-b-0 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                    onClick={() => handleRecipeClick(recipe)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {(() => {
                          // Always use correct fields for video recipes
                          let img = recipe.image;
                          let title = recipe.title;
                          if (recipe._id && recipe._id.startsWith('external_video_')) {
                            img = img || recipe.strMealThumb;
                            title = title || recipe.strMeal;
                          }
                          return img ? (
                            <img 
                              src={
                                img.startsWith('http')
                                  ? img
                                  : img.startsWith('/images/')
                                    ? img // Use directly for frontend public images
                                    : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img}`
                              }
                              alt={title} 
                              className="w-12 h-12 object-cover rounded-md"
                              onError={(e) => {
                                const fallbackImages = [
                                  '/images/recipe-2-550x690.jpg',
                                  '/images/recipe-6-630x785.jpg',
                                  '/images/recipe-18-630x785.jpg',
                                  '/images/recipe-20-630x785.jpg'
                                ];
                                const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
                                e.target.src = randomFallback;
                                e.target.onerror = null;
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                              <span className="text-gray-500 text-xs">🍴</span>
                            </div>
                          );
                        })()}
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{recipe._id && recipe._id.startsWith('external_video_') ? (recipe.title || recipe.strMeal) : recipe.title}</h3>
                          <p className="text-sm text-gray-600">{recipe.description}</p>
                          {(recipe._id && recipe._id.startsWith('external_video_') ? (recipe.category || recipe.strCategory) : recipe.category) && (
                            <p className="text-xs text-red-500 mt-1">{recipe._id && recipe._id.startsWith('external_video_') ? (recipe.category || recipe.strCategory) : recipe.category}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleUnbookmarkRecipe(recipe._id, e)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors ml-2"
                        title="Remove bookmark"
                      >
                        <Bookmark size={16} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No bookmarked recipes yet.</p>
            )}
          </div>

          {/* Uploaded Recipes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📝 My Recipes</h2>
            {profile.uploadedRecipes && profile.uploadedRecipes.length > 0 ? (
              <div className="space-y-3">
                {console.log("Rendering uploaded recipes:", profile.uploadedRecipes)}
                {profile.uploadedRecipes.map((recipe) => (
                  <div key={recipe._id} className="border-b pb-3 last:border-b-0">
                    <div className="flex items-start justify-between">
                      <div 
                        className="flex items-start space-x-3 flex-1 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                        onClick={() => handleRecipeClick(recipe)}
                      >
                        {recipe.image ? (
                          <img 
                            src={recipe.image.startsWith('http') ? recipe.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${recipe.image}`} 
                            alt={recipe.title} 
                            className="w-12 h-12 object-cover rounded-md"
                            onError={(e) => {
                              console.log('Image failed to load:', recipe.image);
                              // Hide the image and show a default placeholder
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', recipe.image);
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-500 text-xs">🍴</span>
                          </div>
                        )}
                        {/* Fallback placeholder - hidden by default */}
                        <div className="hidden w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-gray-500 text-xs">🍴</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{recipe.title}</h3>
                          <p className="text-sm text-gray-600">{recipe.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditRecipe(recipe);
                          }}
                          className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                          title="Edit recipe"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRecipe(recipe._id);
                          }}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete recipe"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No uploaded recipes yet.</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => navigate("/recipes")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            View All Recipes
          </button>
          <button
            onClick={() => navigate("/add-recipe")}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Add New Recipe
          </button>
        </div>
      </div>

      {/* Recipe Modal */}
      {recipeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 z-10" 
              onClick={closeRecipeModal}
            >
              <X size={24} />
            </button>
            
            {recipeLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ChefHat className="animate-spin text-red-500 mb-4" size={48} />
                <div className="text-gray-600">Loading recipe details...</div>
              </div>
            ) : recipeDetails ? (
              <div className="p-6">
                {/* Recipe Image */}
                {recipeDetails.image ? (
                  <img 
                    src={
                      recipeDetails.image.startsWith('http')
                        ? recipeDetails.image
                        : recipeDetails.image.startsWith('/images/')
                          ? recipeDetails.image
                          : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${recipeDetails.image}`
                    }
                    alt={recipeDetails.title} 
                    className="w-full h-64 object-cover rounded mb-4"
                    onError={(e) => {
                      e.target.src = '/images/recipe-6-630x785.jpg';
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-6xl text-gray-400">🍴</span>
                      <p className="text-gray-500 mt-2">No image available</p>
                    </div>
                  </div>
                )}
                
                {/* Recipe Title */}
                <h2 className="text-2xl font-bold mb-2">{recipeDetails.title}</h2>
                
                {/* Recipe Description */}
                {recipeDetails.description && (
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{recipeDetails.description}</p>
                  </div>
                )}
                
                {/* Recipe Meta */}
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                  {recipeDetails.category && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                      {recipeDetails.category}
                    </span>
                  )}
                  {recipeDetails.cuisine && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {recipeDetails.cuisine}
                    </span>
                  )}
                </div>
                
                {/* Ingredients */}
                {recipeDetails.ingredients && recipeDetails.ingredients.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <ChefHat size={20} className="mr-2" />
                      Ingredients
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {recipeDetails.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-gray-700">{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Instructions/Steps */}
                {(recipeDetails.instructions || recipeDetails.steps) && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Clock size={20} className="mr-2" />
                      {recipeDetails.steps ? 'Steps' : 'Instructions'}
                    </h3>
                    {recipeDetails.steps ? (
                      <ol className="list-decimal list-inside space-y-2">
                        {recipeDetails.steps.map((step, index) => (
                          <li key={index} className="text-gray-700">{step}</li>
                        ))}
                      </ol>
                    ) : (
                      <div className="text-gray-700 whitespace-pre-line">
                        {recipeDetails.instructions}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Video Recipe Special Section */}
                {recipeDetails.isVideoRecipe && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold mb-3 flex items-center text-blue-800">
                      <ChefHat size={20} className="mr-2" />
                      Video Recipe Details
                    </h3>
                    <div className="space-y-2 text-blue-700">
                      <p><strong>Difficulty:</strong> {recipeDetails.difficulty}</p>
                      <p><strong>Time:</strong> {recipeDetails.time}</p>
                      <p><strong>Rating:</strong> ⭐ {recipeDetails.rating}</p>
                      <p className="mt-3 text-sm">
                        This is a video recipe from our collection. The video tutorial will guide you through the cooking process step-by-step.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* YouTube Link */}
                {recipeDetails.youtube && (
                  <div className="mb-4">
                    <a 
                      href={recipeDetails.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No recipe details found.
              </div>
            )}
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 z-10"
              onClick={closeEditModal}
            >
              <X size={24} />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Edit Recipe</h2>
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div>
                  <label htmlFor="editTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Recipe Title
                  </label>
                  <input
                    type="text"
                    id="editTitle"
                    name="title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter recipe title"
                    value={editForm.title}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div>
                  <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="editDescription"
                    name="description"
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Describe your recipe"
                    value={editForm.description}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div>
                  <label htmlFor="editIngredients" className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredients (comma separated)
                  </label>
                  <textarea
                    id="editIngredients"
                    name="ingredients"
                    required
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., 2 cups flour, 1 cup sugar, 3 eggs"
                    value={editForm.ingredients}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div>
                  <label htmlFor="editSteps" className="block text-sm font-medium text-gray-700 mb-2">
                    Steps (comma separated)
                  </label>
                  <textarea
                    id="editSteps"
                    name="steps"
                    required
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., Mix ingredients, Bake at 350F, Let cool"
                    value={editForm.steps}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipe Image
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="editImageFile" className="block text-sm font-medium text-gray-700 mb-2">
                        Upload New Image (Optional)
                      </label>
                      <input
                        type="file"
                        id="editImageFile"
                        accept="image/*"
                        onChange={handleEditFileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
                    </div>
                    <div className="text-center text-gray-500">- OR -</div>
                    <div>
                      <label htmlFor="editImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL (Alternative)
                      </label>
                      <input
                        type="url"
                        id="editImageUrl"
                        name="image"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                        placeholder="https://example.com/image.jpg"
                        value={editForm.image}
                        onChange={handleEditFormChange}
                        disabled={selectedFile !== null}
                      />
                    </div>
                  </div>
                  {(imagePreview || editForm.image) && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Preview
                      </label>
                      <div className="relative inline-block">
                        <img
                          src={imagePreview || editForm.image}
                          alt="Recipe preview"
                          className="w-32 h-32 object-cover rounded-md border"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div className="hidden w-32 h-32 bg-gray-200 rounded-md border flex items-center justify-center">
                          <span className="text-gray-500 text-sm">Image not available</span>
                        </div>
                        <button
                          type="button"
                          onClick={removeEditImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {editLoading ? "Updating Recipe..." : "Update Recipe"}
                  </button>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 relative">
            <h2 className="text-xl font-bold mb-4 text-center text-red-600">Delete Recipe</h2>
            <p className="mb-6 text-center text-gray-700">Are you sure you want to delete this recipe? This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDeleteRecipe}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 font-semibold"
              >
                Delete
              </button>
              <button
                onClick={() => { setDeleteModalOpen(false); setRecipeToDelete(null); }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Image Modal is now handled by ProfileImage component */}

    </div>
  );
}