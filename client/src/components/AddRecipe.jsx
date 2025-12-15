import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function AddRecipe() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Clear any previous messages
    
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
          setMessage("Image upload failed, but continuing with recipe creation...");
          // Continue without image if upload fails
        }
      }

      const payload = {
        ...form,
        image: imageUrl, // Ensure image is always a string
        ingredients: form.ingredients.split(",").map(item => item.trim()).filter(item => item),
        steps: form.steps.split(",").map(item => item.trim()).filter(item => item)
      };
      
      console.log('Submitting recipe payload:', payload);
      const response = await API.post("/recipes", payload);
      console.log('Recipe created successfully:', response.data);
      
      setMessage("Recipe added successfully! Redirecting...");
      setTimeout(() => navigate("/recipes"), 2000);
    } catch (err) {
      console.error('Recipe creation error:', err);
      setMessage(err.response?.data?.message || "Failed to add recipe");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setForm({ ...form, image: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Recipe</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Enter recipe title"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Describe your recipe"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
                Ingredients (comma separated)
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                required
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., 2 cups flour, 1 cup sugar, 3 eggs"
                value={form.ingredients}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-2">
                Steps (comma separated)
              </label>
              <textarea
                id="steps"
                name="steps"
                required
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., Mix ingredients, Bake at 350F, Let cool"
                value={form.steps}
                onChange={handleChange}
              />
            </div>

            <div>
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

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? "Adding Recipe..." : "Add Recipe"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/recipes")}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>

            {message && (
              <div className={`text-sm text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}