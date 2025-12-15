import React, { useState } from "react";
import API from "../api";

export default function AiSuggest() {
  const [cuisine, setCuisine] = useState("");
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cuisines = [
    "Indian", "Italian", "Chinese", "Mexican", "French", "Japanese", 
    "Thai", "Greek", "Spanish", "American", "British", "Turkish", 
    "Moroccan", "Korean", "Vietnamese", "Lebanese"
  ];

  const getSuggestions = async (selectedCuisine) => {
    setLoading(true);
    setError("");

    try {
      const response = await API.post("/ai/suggest", { cuisine: selectedCuisine });
      setDishes(response.data.dishes);
    } catch {
      setError("Failed to get suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cuisine) {
      setError("Please select a cuisine");
      return;
    }

    setDishes([]);
    await getSuggestions(cuisine);
  };

  const handleNewSuggestions = async () => {
    await getSuggestions(cuisine);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🤖 Ask AI What to Make
          </h1>
          
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="max-w-md mx-auto">
              <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-2">
                Select Cuisine
              </label>
              <select
                id="cuisine"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">Choose a cuisine...</option>
                {cuisines.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              
              <button
                type="submit"
                disabled={loading || !cuisine}
                className="w-full mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? "Getting Suggestions..." : "Get Dish Suggestions"}
              </button>
            </div>
          </form>

          {error && (
            <div className="text-center mb-6">
              <div className="text-red-600 bg-red-50 p-4 rounded-md">{error}</div>
            </div>
          )}

          {dishes.length > 0 && (
            <div className="text-center">
              <div className="flex justify-center items-center gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  🍽️ {cuisine} Dish Suggestions
                </h2>
                <button
                  onClick={handleNewSuggestions}
                  disabled={loading}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
                >
                  {loading ? "Loading..." : "🔄 New Suggestions"}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dishes.map((dish, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-red-300 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{dish}</h3>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                These are popular {cuisine} dishes you can try making!
              </p>
            </div>
          )}

          {!loading && !error && dishes.length === 0 && cuisine && (
            <div className="text-center">
              <p className="text-gray-500">No suggestions found for {cuisine} cuisine.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}