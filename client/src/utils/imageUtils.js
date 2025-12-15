const getProfileImageUrl = (profilePath) => {
  if (!profilePath) return null;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${baseUrl}${profilePath}`;
};

export { getProfileImageUrl };
