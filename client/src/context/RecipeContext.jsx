import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../hooks/useAuth';
import { RecipeContext } from './RecipeContext.js';

export const RecipeProvider = ({ children }) => {
  const [likedRecipes, setLikedRecipes] = useState(new Set());
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load user's likes and bookmarks on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadUserPreferences();
    }
  }, [isAuthenticated]);

  const loadUserPreferences = async () => {
    try {
      setLoading(true);
      const response = await API.get('/users/profile');
      const profile = response.data;
      
      // Convert arrays to Sets for efficient lookup
      // Handle both ObjectId recipes and string ID recipes (external recipes)
      const likedIds = new Set();
      const bookmarkedIds = new Set();
      
      // Process liked recipes
      if (profile.likedRecipes) {
        profile.likedRecipes.forEach(recipe => {
          if (typeof recipe === 'string') {
            // String ID (external recipe)
            likedIds.add(recipe);
          } else if (recipe._id) {
            // ObjectId recipe
            likedIds.add(recipe._id);
          }
        });
      }
      
      // Process bookmarked recipes
      if (profile.bookmarkedRecipes) {
        profile.bookmarkedRecipes.forEach(recipe => {
          if (typeof recipe === 'string') {
            // String ID (external recipe)
            bookmarkedIds.add(recipe);
          } else if (recipe._id) {
            // ObjectId recipe
            bookmarkedIds.add(recipe._id);
          }
        });
      }
      
      setLikedRecipes(likedIds);
      setBookmarkedRecipes(bookmarkedIds);
      
      console.log('Loaded user preferences:', {
        likedIds: Array.from(likedIds),
        bookmarkedIds: Array.from(bookmarkedIds)
      });
    } catch (error) {
      // Only log error if it's not a 401 (unauthorized) error
      if (error.response?.status !== 401) {
        console.error('Failed to load user preferences:', error);
      } else {
        console.log('User not authenticated, skipping preferences load');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (recipeId, recipeData = null) => {
    // Handle video recipes - store in backend but update UI immediately
    if (recipeId.startsWith('external_video_')) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to like recipes');
        return;
      }

      // Check current state before updating UI
      const isCurrentlyLiked = likedRecipes.has(recipeId);

      // Update UI immediately for better UX
      if (isCurrentlyLiked) {
        // Unlike
        setLikedRecipes(prev => {
          const newSet = new Set(prev);
          newSet.delete(recipeId);
          return newSet;
        });
      } else {
        // Like
        setLikedRecipes(prev => new Set([...prev, recipeId]));
      }

      // Also store in backend for persistence
      try {
        if (isCurrentlyLiked) {
          // Unlike in backend
          await API.delete(`/users/like/${recipeId}`);
        } else {
          // Like in backend
          const requestData = recipeData ? { recipeData } : {};
          console.log('Sending like request for video recipe:', recipeId);
          console.log('Request data:', requestData);
          console.log('Request URL:', `/users/like/${recipeId}`);
          const response = await API.post(`/users/like/${recipeId}`, requestData);
          console.log('Like response:', response.data);
        }
      } catch (error) {
        console.error('Failed to sync like status with backend:', error);
        // Revert UI state if backend call fails
        if (isCurrentlyLiked) {
          setLikedRecipes(prev => new Set([...prev, recipeId]));
        } else {
          setLikedRecipes(prev => {
            const newSet = new Set(prev);
            newSet.delete(recipeId);
            return newSet;
          });
        }
      }
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to like recipes');
      return;
    }

    console.log('Toggling like for recipe:', recipeId);
    console.log('Recipe data:', recipeData);
    console.log('Current token:', token);

    try {
      if (likedRecipes.has(recipeId)) {
        // Unlike
        console.log('Unliking recipe:', recipeId);
        const response = await API.delete(`/users/like/${recipeId}`);
        console.log('Unlike response:', response);
        setLikedRecipes(prev => {
          const newSet = new Set(prev);
          newSet.delete(recipeId);
          return newSet;
        });
      } else {
        // Like
        console.log('Liking recipe:', recipeId);
        const requestData = recipeData ? { recipeData } : {};
        const response = await API.post(`/users/like/${recipeId}`, requestData);
        console.log('Like response:', response);
        setLikedRecipes(prev => new Set([...prev, recipeId]));
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      console.error('Error response:', error.response);
      // Don't show alert for 400 errors (already liked/unliked)
      if (error.response?.status !== 400) {
        alert('Failed to update like status');
      }
    }
  };

  const toggleBookmark = async (recipeId, recipeData = null) => {
    // Handle video recipes - store in backend but update UI immediately
    if (recipeId.startsWith('external_video_')) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to bookmark recipes');
        return;
      }

      // Check current state before updating UI
      const isCurrentlyBookmarked = bookmarkedRecipes.has(recipeId);

      // Update UI immediately for better UX
      if (isCurrentlyBookmarked) {
        // Remove bookmark
        setBookmarkedRecipes(prev => {
          const newSet = new Set(prev);
          newSet.delete(recipeId);
          return newSet;
        });
      } else {
        // Add bookmark
        setBookmarkedRecipes(prev => new Set([...prev, recipeId]));
      }

      // Also store in backend for persistence
      try {
        if (isCurrentlyBookmarked) {
          // Remove bookmark in backend
          await API.delete(`/users/bookmark/${recipeId}`);
        } else {
          // Add bookmark in backend
          const requestData = recipeData ? { recipeData } : {};
          console.log('Sending bookmark request for video recipe:', recipeId);
          console.log('Request data:', requestData);
          await API.post(`/users/bookmark/${recipeId}`, requestData);
        }
      } catch (error) {
        console.error('Failed to sync bookmark status with backend:', error);
        // Revert UI state if backend call fails
        if (isCurrentlyBookmarked) {
          setBookmarkedRecipes(prev => new Set([...prev, recipeId]));
        } else {
          setBookmarkedRecipes(prev => {
            const newSet = new Set(prev);
            newSet.delete(recipeId);
            return newSet;
          });
        }
      }
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to bookmark recipes');
      return;
    }

    console.log('Toggling bookmark for recipe:', recipeId);
    console.log('Recipe data:', recipeData);
    console.log('Current token:', token);

    try {
      if (bookmarkedRecipes.has(recipeId)) {
        // Remove bookmark
        console.log('Unbookmarking recipe:', recipeId);
        const response = await API.delete(`/users/bookmark/${recipeId}`);
        console.log('Unbookmark response:', response);
        setBookmarkedRecipes(prev => {
          const newSet = new Set(prev);
          newSet.delete(recipeId);
          return newSet;
        });
      } else {
        // Add bookmark
        console.log('Bookmarking recipe:', recipeId);
        const requestData = recipeData ? { recipeData } : {};
        const response = await API.post(`/users/bookmark/${recipeId}`, requestData);
        console.log('Bookmark response:', response);
        setBookmarkedRecipes(prev => new Set([...prev, recipeId]));
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
      console.error('Error response:', error.response);
      // Don't show alert for 400 errors (already bookmarked/unbookmarked)
      if (error.response?.status !== 400) {
        alert('Failed to update bookmark status');
      }
    }
  };

  const isLiked = (recipeId) => likedRecipes.has(recipeId);
  const isBookmarked = (recipeId) => bookmarkedRecipes.has(recipeId);

  const value = {
    likedRecipes,
    bookmarkedRecipes,
    loading,
    toggleLike,
    toggleBookmark,
    isLiked,
    isBookmarked,
    loadUserPreferences,
    refreshUserPreferences: loadUserPreferences
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
}; 