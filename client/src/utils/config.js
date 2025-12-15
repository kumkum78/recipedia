export const getApiUrl = (path) => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};
