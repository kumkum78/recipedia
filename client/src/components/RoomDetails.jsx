import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { Copy, Users, Mail, Plus, X, Trash2 } from "lucide-react";
import io from "socket.io-client";

function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function RoomDetails() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState({ breakfast: [], lunch: [], snacks: [], dinner: [] });
  const [inputs, setInputs] = useState({ breakfast: "", lunch: "", snacks: "", dinner: "" });
  const [message, setMessage] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invites, setInvites] = useState([]);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    description: "",
    ingredients: [""],
    steps: [""],
    image: ""
  });
  const [socket, setSocket] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const today = getToday();

  useEffect(() => {
    fetchRoom();
    fetchSuggestions();
    
    // Initialize socket connection
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);
    
    // Join room
    newSocket.emit('join-room', roomId);
    
    // Listen for real-time updates
    newSocket.on('suggestion-added', (data) => {
      if (data.roomId === roomId) {
        fetchSuggestions();
      }
    });
    
    newSocket.on('recipe-added', (data) => {
      if (data.roomId === roomId) {
        fetchRoom();
      }
    });
    
    return () => {
      newSocket.emit('leave-room', roomId);
      newSocket.disconnect();
    };
    // eslint-disable-next-line
  }, [roomId]);

  const fetchRoom = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get(`/rooms/${roomId}`);
      setRoom(res.data);
    } catch (err) {
      setError("Failed to load room");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    setError("");
    try {
      const res = await API.get(`/rooms/${roomId}/suggestions?date=${today}`);
      setSuggestions(res.data || { breakfast: [], lunch: [], snacks: [], dinner: [] });
    } catch (err) {
      setSuggestions({ breakfast: [], lunch: [], snacks: [], dinner: [] });
    }
  };

  const handleInputChange = (meal, value) => {
    setInputs((prev) => ({ ...prev, [meal]: value }));
  };

  const handleSuggest = async (meal) => {
    setMessage("");
    setError("");
    try {
      await API.post(`/rooms/${roomId}/suggestions`, {
        date: today,
        meal,
        dish: inputs[meal],
      });
      setMessage(`Suggestion added for ${meal}!`);
      setInputs((prev) => ({ ...prev, [meal]: "" }));
      fetchSuggestions();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to add suggestion for ${meal}`);
    }
  };

  const createInvite = async () => {
    setMessage("");
    setError("");
    try {
      const response = await API.post(`/rooms/${roomId}/invite`);
      setInviteCode(response.data.inviteCode);
      setInviteUrl(response.data.inviteUrl);
      setShowInviteModal(true);
      setMessage("Invite created successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create invite");
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setMessage("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 1200);
  };

  const fetchInvites = async () => {
    try {
      const response = await API.get(`/rooms/${roomId}/invites`);
      setInvites(response.data);
    } catch (err) {
      console.error("Failed to fetch invites:", err);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, [roomId]);

  const addRecipeToRoom = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      let imageUrl = "";

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
          console.log('Image uploaded successfully:', imageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          setError("Image upload failed, but continuing with recipe creation...");
          // Continue without image if upload fails
        }
      }

      const recipeData = {
        ...newRecipe,
        image: imageUrl || newRecipe.image // Use uploaded image URL or existing image URL
      };

      const response = await API.post(`/rooms/${roomId}/recipes`, recipeData);
      setMessage("Recipe added to room!");
      setNewRecipe({
        title: "",
        description: "",
        ingredients: [""],
        steps: [""],
        image: ""
      });
      setSelectedFile(null);
      setImagePreview(null);
      setShowAddRecipeModal(false);
      fetchRoom();
      
      // Emit socket event for real-time update
      if (socket) {
        socket.emit('new-recipe', { roomId, recipe: response.data });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add recipe");
    }
  };

  const removeMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }
    
    setMessage("");
    setError("");
    try {
      await API.delete(`/rooms/${roomId}/members`, { data: { memberId } });
      setMessage("Member removed successfully!");
      fetchRoom();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to remove member");
    }
  };

  const addIngredient = () => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ""]
    }));
  };

  const removeIngredient = (index) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index, value) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  const addStep = () => {
    setNewRecipe(prev => ({
      ...prev,
      steps: [...prev.steps, ""]
    }));
  };

  const removeStep = (index) => {
    setNewRecipe(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const updateStep = (index, value) => {
    setNewRecipe(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setNewRecipe(prev => ({ ...prev, image: "" }));
  };

  const handleRecipeClick = async (recipe) => {
    console.log('Recipe clicked:', recipe);
    setShowRecipeModal(true);
    setRecipeDetails(null);
    setRecipeLoading(true);
    
    try {
      // If it's a room recipe with complete data
      if (recipe.title && recipe.description && (recipe.ingredients || recipe.steps)) {
        console.log('Using complete room recipe data');
        setRecipeDetails({
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients || [],
          steps: recipe.steps || [],
          image: recipe.image || null,
          author: recipe.createdBy?.name || recipe.author || 'Unknown'
        });
      } else if (recipe.title && recipe.description) {
        // If it's a room recipe with only basic data, try to fetch complete data
        console.log('Fetching complete recipe data for:', recipe._id);
        try {
          const response = await API.get(`/recipes/${recipe._id}`);
          console.log('Fetched recipe data:', response.data);
          setRecipeDetails({
            title: response.data.title,
            description: response.data.description,
            ingredients: response.data.ingredients || [],
            steps: response.data.steps || [],
            image: response.data.image || null,
            author: response.data.createdBy?.name || response.data.author || 'Unknown'
          });
        } catch (fetchError) {
          console.error('Failed to fetch complete recipe data:', fetchError);
          // Fallback to basic data
          setRecipeDetails({
            title: recipe.title,
            description: recipe.description,
            ingredients: [],
            steps: [],
            image: null,
            author: 'Unknown'
          });
        }
      } else {
        // If it's an external recipe, fetch details
        console.log('Fetching external recipe data');
        const response = await API.get(`/recipes/${recipe._id}`);
        setRecipeDetails(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch recipe details:', error);
      setRecipeDetails({
        title: recipe.title || 'Unknown Recipe',
        description: recipe.description || 'No description available',
        ingredients: [],
        steps: [],
        image: null,
        author: 'Unknown'
      });
    } finally {
      setRecipeLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <button
          onClick={() => navigate("/rooms")}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Rooms
        </button>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {message && <div className="text-green-600 mb-4">{message}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : room ? (
          <>
            <h1 className="text-2xl font-bold mb-2">Room: {room.name}</h1>
            <div className="mb-4 text-sm text-gray-600">Room ID: {room._id}</div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold flex items-center">
                  <Users size={20} className="mr-2" />
                  Members
                </h2>
                <button
                  onClick={createInvite}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center"
                >
                  <Mail size={16} className="mr-1" />
                  Invite
                </button>
              </div>
              <ul className="flex flex-wrap gap-2">
                {room.members && room.members.length > 0 ? (
                  room.members.map((member, index) => (
                    <li key={member._id} className="bg-gray-100 px-3 py-1 rounded text-gray-800 text-sm flex items-center">
                      <span>{member.name || member.email || member._id}</span>
                      {index === 0 && (
                        <span className="ml-2 text-xs bg-green-500 text-white px-1 rounded">Admin</span>
                      )}
                      {index !== 0 && room.members[0]?._id === room.members[0]?._id && (
                        <button
                          onClick={() => removeMember(member._id)}
                          className="ml-2 text-red-500 hover:text-red-700"
                          title="Remove member"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No members</li>
                )}
              </ul>
            </div>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Shared Recipes</h2>
                <button
                  onClick={() => setShowAddRecipeModal(true)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center"
                >
                  <Plus size={16} className="mr-1" />
                  Add Recipe
                </button>
              </div>
              {room.recipes && room.recipes.length > 0 ? (
                <ul className="space-y-2">
                  {room.recipes.map((recipe) => (
                    <li 
                      key={recipe._id} 
                      className="bg-gray-100 px-4 py-2 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleRecipeClick(recipe)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{recipe.title}</div>
                          <div className="text-xs text-gray-500">{recipe.description}</div>
                        </div>
                        <div className="text-xs text-blue-500 font-medium">View Details</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500">No recipes shared in this room yet.</div>
              )}
            </div>
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">Today's Meal Suggestions</h2>
              {['breakfast', 'lunch', 'snacks', 'dinner'].map((meal) => (
                <div key={meal} className="mb-4">
                  <div className="font-semibold capitalize mb-1">{meal}</div>
                  <div className="flex items-center space-x-2 mb-1">
                    <input
                      type="text"
                      className="border rounded px-3 py-1 flex-1"
                      placeholder={`Suggest a dish for ${meal}`}
                      value={inputs[meal]}
                      onChange={e => handleInputChange(meal, e.target.value)}
                    />
                    <button
                      onClick={() => handleSuggest(meal)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      disabled={!inputs[meal]}
                    >
                      Suggest
                    </button>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {suggestions[meal] && suggestions[meal].length > 0 ? (
                      suggestions[meal].map((s, idx) => (
                        <li key={idx} className="bg-green-100 px-2 py-1 rounded text-green-800 text-xs">
                          {s.dish} {s.user && s.user.name ? `by ${s.user.name}` : ""}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 text-xs">No suggestions yet.</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Invite People</h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-500 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invite Code
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inviteCode}
                    readOnly
                    className="border rounded px-3 py-2 flex-1 bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(inviteCode, 'code')}
                    className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 flex items-center cursor-pointer"
                    title="Copy code"
                  >
                    <Copy size={16} />
                    {copiedField === 'code' && <span className="ml-2 text-xs text-white">Copied!</span>}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invite Link
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inviteUrl}
                    readOnly
                    className="border rounded px-3 py-2 flex-1 bg-gray-50 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(inviteUrl, 'link')}
                    className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 flex items-center cursor-pointer"
                    title="Copy link"
                  >
                    <Copy size={16} />
                    {copiedField === 'link' && <span className="ml-2 text-xs text-white">Copied!</span>}
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                Share this code or link with others to invite them to your room. 
                The invite expires in 7 days.
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Recipe Modal */}
        {showAddRecipeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Recipe to Room</h3>
                <button
                  onClick={() => setShowAddRecipeModal(false)}
                  className="text-gray-500 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={addRecipeToRoom}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipe Title
                  </label>
                  <input
                    type="text"
                    value={newRecipe.title}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, title: e.target.value }))}
                    className="border rounded px-3 py-2 w-full"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newRecipe.description}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, description: e.target.value }))}
                    className="border rounded px-3 py-2 w-full h-20"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipe Image
                  </label>
                  {/* File Upload */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Image (Recommended)
                      </label>
                      <input
                        type="file"
                        id="imageFile"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
                    </div>
                    {imagePreview && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image Preview
                        </label>
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
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
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Ingredients
                    </label>
                    <button
                      type="button"
                      onClick={addIngredient}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      + Add Ingredient
                    </button>
                  </div>
                  {newRecipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => updateIngredient(index, e.target.value)}
                        className="border rounded px-3 py-2 flex-1"
                        placeholder={`Ingredient ${index + 1}`}
                        required
                      />
                      {newRecipe.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Steps
                    </label>
                    <button
                      type="button"
                      onClick={addStep}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      + Add Step
                    </button>
                  </div>
                  {newRecipe.steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-2 mb-2">
                      <span className="text-sm text-gray-500 mt-2">{index + 1}.</span>
                      <textarea
                        value={step}
                        onChange={(e) => updateStep(index, e.target.value)}
                        className="border rounded px-3 py-2 flex-1"
                        placeholder={`Step ${index + 1}`}
                        required
                      />
                      {newRecipe.steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          className="text-red-500 hover:text-red-700 mt-2"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddRecipeModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Recipe
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Recipe Details Modal */}
        {showRecipeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl"
                onClick={() => setShowRecipeModal(false)}
              >
                ✕
              </button>
              
              <div className="p-6">
                {recipeLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                    <span className="ml-2 text-gray-600">Loading recipe details...</span>
                  </div>
                ) : recipeDetails ? (
                  <div>
                    {/* Recipe Image */}
                    {recipeDetails.image && (
                      <div className="mb-6">
                        <img
                          src={recipeDetails.image.startsWith('http') ? recipeDetails.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${recipeDetails.image}`}
                          alt={recipeDetails.title}
                          className="w-full h-64 object-cover rounded-lg"
                          onError={(e) => {
                            console.log('Recipe image failed to load:', recipeDetails.image);
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Recipe Title */}
                    <h2 className="text-3xl font-bold mb-4">{recipeDetails.title}</h2>

                    {/* Recipe Description */}
                    {recipeDetails.description && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-700 leading-relaxed">{recipeDetails.description}</p>
                      </div>
                    )}

                    {/* Recipe Author */}
                    {recipeDetails.author && (
                      <div className="mb-6">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Author:</span> {recipeDetails.author}
                        </p>
                      </div>
                    )}

                    {/* Recipe Ingredients */}
                    {recipeDetails.ingredients && recipeDetails.ingredients.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
                        <ul className="space-y-2">
                          {recipeDetails.ingredients.map((ingredient, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-red-500 mr-2">•</span>
                              <span className="text-gray-700">{ingredient}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recipe Steps */}
                    {recipeDetails.steps && recipeDetails.steps.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Instructions</h3>
                        <ol className="space-y-3">
                          {recipeDetails.steps.map((step, index) => (
                            <li key={index} className="flex items-start">
                              <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                                {index + 1}
                              </span>
                              <span className="text-gray-700 leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* No Details Available */}
                    {(!recipeDetails.ingredients || recipeDetails.ingredients.length === 0) && 
                     (!recipeDetails.steps || recipeDetails.steps.length === 0) && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No detailed recipe information available.</p>
                        <p className="text-sm text-gray-400 mt-2">
                          This recipe only has basic information (title and description).
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-red-500">Failed to load recipe details.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 