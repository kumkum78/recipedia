import { useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
}; 