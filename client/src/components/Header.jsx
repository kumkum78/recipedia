import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Menu,
  X,
  Search,
  Bookmark,
  User,
  Plus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";
import AZRecipesModal from "./AZRecipesModal";
import ContactModal from "./ContactModal";
import SearchModal from "./SearchModal";
import { useAuth } from "../hooks/useAuth";

// Profile image URL helper
const formatProfileUrl = (profilePath) => {
  if (!profilePath) return null;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${baseUrl}${profilePath}`;
};

const Navbar = ({
  onShowAZModal,
  onShowCategoryRecipes,
  onShowBlogArticle,
  scrollToSection,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isAZModalOpen, setIsAZModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState([""]);
  const [recipeSteps, setRecipeSteps] = useState([""]);
  const [recipeTags, setRecipeTags] = useState("");
  // Recipe image handling
  const [recipeImage, setRecipeImage] = useState(null);
  const recipeFileInputRef = React.useRef(null);
  const handleRecipeImageChange = (e) => setRecipeImage(e.target.files[0]);
  const handleAddRecipeImage = () =>
    recipeFileInputRef.current && recipeFileInputRef.current.click();

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  const socialLinks = {
    instagram: "https://www.instagram.com/homecookingshow/",
    twitter: "https://x.com/CookingChannel",
    youtube: "https://www.youtube.com/@CookingshookingIn",
    pinterest:
      "https://in.pinterest.com/search/pins/?q=cooking%20recipes&rs=ac&len=7&source_id=ac_vSBeYhIh&eq=cooking&etslf=1855",
  };

  // Add this click handler function
  const handleSocialClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  // Removed unused function
  const handleCloseAddRecipe = () => setShowAddRecipeModal(false);
  const handleAddIngredient = () =>
    setRecipeIngredients([...recipeIngredients, ""]);
  const handleIngredientChange = (idx, value) =>
    setRecipeIngredients(
      recipeIngredients.map((ing, i) => (i === idx ? value : ing))
    );
  const handleRemoveIngredient = (idx) =>
    setRecipeIngredients(recipeIngredients.filter((_, i) => i !== idx));
  const handleAddStep = () => setRecipeSteps([...recipeSteps, ""]);
  const handleStepChange = (idx, value) =>
    setRecipeSteps(recipeSteps.map((step, i) => (i === idx ? value : step)));
  const handleRemoveStep = (idx) =>
    setRecipeSteps(recipeSteps.filter((_, i) => i !== idx));
  const handleCreateRecipe = (e) => {
    e.preventDefault();
    /* handle recipe creation logic here */ handleCloseAddRecipe();
  };

  useEffect(() => {
    const handleScroll = () => {
      const topBarHeight = 60; // Approximate height of top bar
      setIsSticky(window.scrollY > topBarHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleCategoryClick = (category) => {
    setIsCategoriesOpen(false);
    switch (category) {
      case "videos": {
        navigate('/videos');
        break;
      }
      case "az-recipes": {
        // Show AZ Recipes Modal
        onShowAZModal();
        break;
      }
      case "this-week": {
        navigate('/discover');
        break;
      }
      case "popular": {
        // Fetch popular recipes (you can customize the category)
        onShowCategoryRecipes("Popular", "Miscellaneous");
        break;
      }
      case "breakfast": {
        onShowCategoryRecipes("Breakfast", "Breakfast");
        break;
      }
      case "lunch": {
        // Using a lunch-appropriate category
        onShowCategoryRecipes("Lunch", "Chicken");
        break;
      }
      case "dinner": {
        onShowCategoryRecipes("Dinner", "Beef");
        break;
      }
      case "dessert": {
        onShowCategoryRecipes("Dessert", "Dessert");
        break;
      }
      default:
        break;
    }
  };

  const handleSmoothNav = (sectionId) => {
    if (window.location.pathname === "/") {
      scrollToSection && scrollToSection(sectionId);
    } else {
      navigate("/");
      setTimeout(() => {
        scrollToSection && scrollToSection(sectionId);
      }, 300); // Wait for navigation
    }
  };

  return (
    <nav className="bg-white">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 py-2">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between min-h-[32px]">
            {/* Existing content */}
            <div className="hidden md:flex items-center justify-center space-x-6 text-xs text-gray-600">
              <div className="flex items-center space-x-4 border-r border-gray-300 pr-6">
                {/* Recipe Categories (top left) */}
                <div
                  className="flex items-center justify-center space-x-3 relative"
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                >
                  <button className="flex items-center space-x-3" type="button">
                    <Menu
                      className="text-gray-500 hover:text-red-500 cursor-pointer"
                      size={22}
                    />
                    <span className="font-semibold text-gray-500 text-sm hover:text-red-500 cursor-pointer">
                      Recipe Categories
                    </span>
                  </button>
                  {isCategoriesOpen && (
                    <div className="absolute top-6 left-0 z-50 w-56 bg-white rounded-md shadow-lg border py-2">
                      <button
                        onClick={() => {
                          setIsCategoriesOpen(false);
                          navigate('/videos');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500"
                      >
                        Video Recipes
                      </button>
                      <button
                        onClick={() => setIsAZModalOpen(true)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500"
                      >
                        A-Z Recipes
                      </button>
                      <button
                        onClick={() => {
                          setIsCategoriesOpen(false);
                          navigate('/discover');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500"
                      >
                        This Week's Recipes
                      </button>
                      <button
                        onClick={() => handleCategoryClick("popular")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500"
                      >
                        Popular Recipes
                      </button>
                      <button
                        onClick={() => handleCategoryClick("breakfast")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500"
                      >
                        Breakfast Recipes
                      </button>
                      <button
                        onClick={() => handleCategoryClick("lunch")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500"
                      >
                        Lunch Recipes
                      </button>
                      <button
                        onClick={() => handleCategoryClick("dinner")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500"
                      >
                        Dinner Recipes
                      </button>
                      <button
                        onClick={() => handleCategoryClick("dessert")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500"
                      >
                        Dessert Recipes
                      </button>
                    </div>
                  )}
                </div>

                <span className="font-small text-xs font-semibold border border-gray-300 rounded-full px-2 py-1">
                  1.6K
                </span>
              </div>
              <span
                className="text-gray-400 text-sm tracking-tighter hidden lg:inline hover:text-red-500 hover:cursor-pointer"
                onClick={() => handleSmoothNav('videos-section')}
              >
                Video Recipes
              </span>
              <span
                className="text-gray-400 text-sm tracking-tighter hidden lg:inline hover:text-red-500 hover:cursor-pointer"
                onClick={() => setIsAZModalOpen(true)}
              >
                A-Z Recipes
              </span>
              <span
                className="text-gray-400 text-sm tracking-tighter hidden lg:inline hover:text-red-500 hover:cursor-pointer"
                onClick={() => handleSmoothNav('discover-section')}
              >
                This Week's Recipes
              </span>

              {/* Add the modal */}
              <AZRecipesModal
                isOpen={isAZModalOpen}
                onClose={() => setIsAZModalOpen(false)}
              />

              <span
                className="text-gray-400 text-sm tracking-tighter hidden lg:inline hover:text-red-500 hover:cursor-pointer"
                onClick={() => setIsContactModalOpen(true)} // Opens contact modal
              >
                Contact Us
              </span>
              <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
              />
            </div>

            {/* Mobile top bar - simplified */}
            <div className="md:hidden flex items-center justify-between w-full">
              <div className="flex items-center space-x-2 relative">
                <button
                  onClick={toggleCategories}
                  className="flex items-center space-x-2"
                >
                  <Menu
                    className="text-gray-500 hover:text-red-500 cursor-pointer"
                    size={16}
                  />
                  <span className="font-semibold text-gray-500 text-xs hover:text-red-500 cursor-pointer">
                    Categories
                  </span>
                </button>
                <span className="font-small text-xs font-semibold border border-gray-300 rounded-full px-1.5 py-0.5">
                  1.6K
                </span>

                {isCategoriesOpen && (
                  <div className="absolute top-7 left-0 z-50 w-48 bg-white rounded-md shadow-lg border py-2">
                    <button
                      onClick={() => {
                        setIsCategoriesOpen(false);
                        navigate('/videos');
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 w-full text-left"
                    >
                      Video Recipes
                    </button>
                    <button
                      onClick={() => setIsAZModalOpen(true)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 w-full text-left"
                    >
                      A-Z Recipes
                    </button>
                    <button
                      onClick={() => {
                        setIsCategoriesOpen(false);
                        navigate('/discover');
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 w-full text-left"
                    >
                      This Week's Recipes
                    </button>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500"
                    >
                      Popular Recipes
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500"
                    >
                      Breakfast Recipes
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500"
                    >
                      Lunch Recipes
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500"
                    >
                      Dinner Recipes
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500"
                    >
                      Dessert Recipes
                    </a>
                  </div>
                )}
              </div>
              {/* <span className='text-gray-400 font-semibold text-xs tracking-tighter'>Contact</span> */}
            </div>

            {/* Welcome message for logged in users */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center">
                <span className="text-green-600 font-medium text-sm">
                  Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                </span>
              </div>
            )}

            <div className="hidden md:flex items-center space-x-7">
              {/* Instagram */}
              <button
                onClick={() => handleSocialClick(socialLinks.instagram)}
                className="w-3.5 h-3.5 text-black hover:cursor-pointer hover:text-gray-700 transition-colors duration-200"
                aria-label="Visit our Instagram"
              >
                <svg
                  className="w-full h-full"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </button>

              {/* Twitter/X */}
              <button
                onClick={() => handleSocialClick(socialLinks.twitter)}
                className="w-3.5 h-3.5 text-black hover:cursor-pointer hover:text-gray-700 transition-colors duration-200"
                aria-label="Visit our Twitter"
              >
                <svg
                  className="w-full h-full"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>

              {/* YouTube */}
              <button
                onClick={() => handleSocialClick(socialLinks.youtube)}
                className="w-3.5 h-3.5 text-black hover:cursor-pointer hover:text-gray-700 transition-colors duration-200"
                aria-label="Visit our YouTube"
              >
                <svg
                  className="w-full h-full"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </button>

              {/* Pinterest */}
              <button
                onClick={() => handleSocialClick(socialLinks.pinterest)}
                className="w-3.5 h-3.5 text-black hover:cursor-pointer hover:text-gray-700 transition-colors duration-200"
                aria-label="Visit our Pinterest"
              >
                <svg
                  className="w-full h-full"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.082.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.744-1.378l-.628 2.43c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div
        className={`transition-all duration-300 ${
          isSticky
            ? "fixed top-0 left-0 right-0 z-50 bg-white shadow-md"
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between min-h-[48px] sm:min-h-[56px] lg:h-16">
            {/* Logo */}
            <div className="flex items-center gap-6 sm:gap-8 lg:gap-14">
              <div className="flex items-center">
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 bg-red-500 rounded-md flex items-center justify-center mr-2">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
                  </svg>
                </div>
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-500">
                  Recipedia
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:block pt-2">
                <div className="flex items-center space-x-8">
                  <div className="relative">
                    <button
                      onClick={() => {
                        navigate('/');
                        // Smooth scroll to top after navigation
                        setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 100);
                      }}
                      className="text-gray-800 hover:text-red-500 hover:cursor-pointer text-lg tracking-tighter font-semibold flex items-center py-2"
                    >
                      Home
                    </button>
                    {/* {activeDropdown === "home" && (
                      <div className="absolute z-50 mt-1 w-48 bg-white rounded-md shadow-lg border py-1">
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Home Option 1
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Home Option 2
                        </a>
                      </div>
                    )} */}
                  </div>

                  <div className="relative">
                    <Link
                      to="/recipes"
                      className="text-gray-800 hover:text-red-500  hover:cursor-pointer text-lg tracking-tighter font-semibold flex items-center py-2"
                    >
                      Recipes
                      {/* <ChevronDown size={14} className="ml-1 mt-1" /> */}
                    </Link>
                    {/* {activeDropdown === "recipes" && (
                      <div className="absolute z-50 mt-1 w-48 bg-white rounded-md shadow-lg border py-1">
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          All Recipes
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Popular Recipes
                        </a>
                      </div>
                    )} */}
                  </div>

                  {/* Rooms */}
                  <div className="relative">
                    {isAuthenticated ? (
                      <Link
                        to="/rooms"
                        className="text-gray-800 hover:text-red-500  hover:cursor-pointer text-lg tracking-tighter font-semibold flex items-center py-2"
                      >
                        Rooms
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          setShowLoginPrompt(true);
                          setTimeout(() => {
                            setShowLoginPrompt(false);
                            openLogin();
                          }, 2000);
                        }}
                        className="text-gray-800 hover:text-red-500  hover:cursor-pointer text-lg tracking-tighter font-semibold flex items-center py-2"
                      >
                        Rooms
                      </button>
                    )}
                  </div>

                  {/* Cuisines */}
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveDropdown("cuisines")}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className="text-gray-800 hover:text-red-500  hover:cursor-pointer text-lg tracking-tighter font-semibold flex items-center py-2"
                      type="button"
                    >
                      Cuisines
                      <ChevronDown size={14} className="ml-1 mt-1" />
                    </button>
                    {activeDropdown === "cuisines" && (
                      <div className="absolute z-50 w-48 bg-white rounded-md shadow-lg border py-1">
                        <a
                          onClick={() =>
                            onShowCategoryRecipes("Italian", "Italian", "area")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Italian
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes("French", "French", "area")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          French
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes("Mexican", "Mexican", "area")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Mexican
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes(
                              "Japanese",
                              "Japanese",
                              "area"
                            )
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Japanese
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes("Chinese", "Chinese", "area")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Chinese
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes("Greek", "Greek", "area")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Greek
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes("Spanish", "Spanish", "area")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Spanish
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes("Thai", "Thai", "area")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Thai
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes("Turkish", "Turkish", "area")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Turkish
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes("Indian", "Indian", "area")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Indian
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes(
                              "Moroccan",
                              "Moroccan",
                              "area"
                            )
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Moroccan
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes(
                              "American",
                              "American",
                              "area"
                            )
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          American
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes("British", "British", "area")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          British
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Categories */}
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveDropdown("categories")}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className="text-gray-800 hover:text-red-500  hover:cursor-pointer text-lg tracking-tighter font-semibold flex items-center py-2"
                      type="button"
                    >
                      Categories
                      <ChevronDown size={14} className="ml-1 mt-1" />
                    </button>
                    {activeDropdown === "categories" && (
                      <div className="absolute z-50 w-48 bg-white rounded-md shadow-lg border py-1">
                        <a
                          onClick={() =>
                            onShowCategoryRecipes("Beef", "Beef", "category")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Beef
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes(
                              "Chicken",
                              "Chicken",
                              "category"
                            )
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Chicken
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes(
                              "Dessert",
                              "Dessert",
                              "category"
                            )
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Dessert
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes("Lamb", "Lamb", "category")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Lamb
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes(
                              "Miscellaneous",
                              "Miscellaneous",
                              "category"
                            )
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Miscellaneous
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes("Pasta", "Pasta", "category")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Pasta
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes("Pork", "Pork", "category")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Pork
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes(
                              "Seafood",
                              "Seafood",
                              "category"
                            )
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Seafood
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes("Side", "Side", "category")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Side
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes(
                              "Starter",
                              "Starter",
                              "category"
                            )
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Starter
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes("Vegan", "Vegan", "category")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Vegan
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes(
                              "Vegetarian",
                              "Vegetarian",
                              "category"
                            )
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Vegetarian
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes(
                              "Breakfast",
                              "Breakfast",
                              "category"
                            )
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Breakfast
                        </a>
                        <a
                          onClick={() =>
                            onShowCategoryRecipes("Goat", "Goat", "category")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Goat
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Blog */}
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveDropdown("blog")}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className="text-gray-800 hover:text-red-500  hover:cursor-pointer text-lg tracking-tighter font-semibold flex items-center py-2"
                      type="button"
                    >
                      Blog
                      <ChevronDown size={14} className="ml-1 mt-1" />
                    </button>
                    {activeDropdown === "blog" && (
                      <div className="absolute z-50 w-48 bg-white rounded-md shadow-lg border py-1">
                        <a
                          onClick={() => onShowBlogArticle("Healthy Eating")}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Essential Cooking Tips
                        </a>
                        <a
                          onClick={() =>
                            onShowBlogArticle("Easy Dinner Recipes")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Quick & Healthy Weeknight Dinners
                        </a>
                        <a
                          onClick={() => onShowBlogArticle("Baking Tips")}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Mastering the Art of One-Pot Cooking
                        </a>
                        <a
                          onClick={() => onShowBlogArticle("Vegetarian Meals")}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Cooking on a Budget
                        </a>
                        <a
                          onClick={() => onShowBlogArticle("Food Science")}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Baking Basics
                        </a>
                        <a
                          onClick={() => onShowBlogArticle("Global Cuisine")}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Spices That Instantly Elevate Any Dish
                        </a>
                        <a
                          onClick={() => onShowBlogArticle("Meal Prep Ideas")}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          Meal Prep Ideas
                        </a>
                        <a
                          onClick={() => onShowBlogArticle("Restaurant News")}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          href="#"
                        >
                          From Fridge to Feast
                        </a>
                      </div>
                    )}
                  </div>

                  {/* REMOVE Register and Login buttons from desktop nav */}
                  {/* <Link to="/register" className="text-gray-800 hover:text-red-500 text-lg font-semibold">
                    Register
                  </Link> */}
                  {/* <Link to="/login" className="text-gray-800 hover:text-red-500 text-lg font-semibold">
                    Login
                  </Link> */}

                  <Link
                    to="/ai-suggest"
                    className="text-gray-800 hover:text-red-500 text-lg font-semibold"
                  >
                    AI Suggest
                  </Link>
                </div>
              </div>
            </div>

                          {/* Right side actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                className="text-black hover:text-red-500 hover:cursor-pointer p-1"
                onClick={openSearch}
              >
                <Search size={20} />
              </button>
              {isAuthenticated ? (
                <Link to="/profile" className="text-black hover:text-red-500 p-1">
                  {user?.profilePicture ? (
                    <img 
                      src={formatProfileUrl(user.profilePicture)}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.src = '/images/icon.png';
                        e.target.onerror = null;
                      }}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={24} className="text-gray-400" />
                    </div>
                  )}
                </Link>
              ) : (
                <button
                  className="text-black hover:text-red-500 hover:cursor-pointer p-1"
                  onClick={openLogin}
                >
                  <User size={20} />
                </button>
              )}
              <Link
                to="/add-recipe"
                className="bg-gray-200 hover:bg-red-500 hover:text-white text-black px-4.5 py-2.5 font-semibold tracking-tighter rounded-md text-sm font-medium hover:cursor-pointer"
              >
                Add Recipe
              </Link>
              <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
            </div>
            
            {/* Login Modal */}
      <Login isOpen={isLoginOpen} onClose={closeLogin} />

      {/* Custom Login Prompt */}
      {showLoginPrompt && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Please login to access room facilities</span>
          </div>
        </div>
      )}
            <div className="hidden md:flex lg:hidden items-center space-x-2 sm:space-x-3">
              <button className="text-black hover:text-red-500 p-1" onClick={openSearch}>
                <Search size={18} />
              </button>
              {isAuthenticated ? (
                <Link to="/profile" className="text-black hover:text-red-500 p-1">
                  {user?.profilePicture ? (
                    <img 
                      src={formatProfileUrl(user.profilePicture)}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.src = '/images/icon.png';
                        e.target.onerror = null;
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={20} className="text-gray-400" />
                    </div>
                  )}
                </Link>
              ) : (
                <button
                  className="text-black hover:text-red-500 p-1"
                  onClick={openLogin}
                >
                  <User size={18} />
                </button>
              )}
              <Link to="/add-recipe" className="bg-gray-200 hover:bg-red-500 hover:text-white text-black px-2 sm:px-3 py-1.5 sm:py-2 font-semibold tracking-tighter rounded-md text-xs sm:text-sm font-medium">
                Add Recipe
              </Link>
                <Link to="/add-recipe" className="bg-gray-200 hover:bg-red-500 hover:text-white text-black px-2 sm:px-3 py-1.5 sm:py-2 font-semibold tracking-tighter rounded-md text-xs sm:text-sm font-medium">
                  Add Recipe
                </Link>
                <button
                  onClick={toggleMenu}
                  className="text-gray-600 hover:text-red-500 p-1.5 sm:p-2"
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>

            {/* Mobile actions */}
            <div className="flex md:hidden items-center space-x-1">
              <button className="text-black hover:text-red-500 p-1" onClick={openSearch}>
                <Search size={16} />
              </button>
              {isAuthenticated ? (
                <Link to="/profile" className="text-black hover:text-red-500 p-1">
                  {user?.profilePicture ? (
                    <img 
                      src={formatProfileUrl(user.profilePicture)}
                      alt="Profile"
                      className="w-7 h-7 rounded-full object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.src = '/images/icon.png';
                        e.target.onerror = null;
                      }}
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={16} className="text-gray-400" />
                    </div>
                  )}
                </Link>
                ) : (
                <button 
                  className="text-black hover:text-red-500 p-1"
                  onClick={openLogin}
                >
                  <User size={16} />
                </button>
              )}
              <button
                onClick={toggleMenu}
                className="text-gray-600 hover:text-red-500 p-1.5"
              >
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile and tablet menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-b border-gray-100">
            <div className="px-3 sm:px-4 pt-2 pb-3 space-y-1 bg-white">
            {/* Mobile/Tablet navigation with dropdowns */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  navigate('/');
                  // Smooth scroll to top after navigation
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full text-left text-gray-800 hover:text-red-500 flex items-center justify-between px-2 sm:px-3 py-2 text-sm font-medium"
              >
                Home
              </button>
            </div>

            <div className="space-y-1">
              <Link
                to="/recipes"
                className="w-full text-left text-gray-800 hover:text-red-500 flex items-center justify-between px-2 sm:px-3 py-2 text-sm font-medium"
              >
                Recipes
              </Link>
            </div>
            <div className="space-y-1">
              {isAuthenticated ? (
                <Link
                  to="/rooms"
                  className="w-full text-left text-gray-800 hover:text-red-500 flex items-center justify-between px-2 sm:px-3 py-2 text-sm font-medium"
                >
                  Rooms
                </Link>
              ) : (
                                  <button
                    onClick={() => {
                      setShowLoginPrompt(true);
                      setTimeout(() => {
                        setShowLoginPrompt(false);
                        openLogin();
                      }, 2000);
                    }}
                    className="w-full text-left text-gray-800 hover:text-red-500 flex items-center justify-between px-2 sm:px-3 py-2 text-sm font-medium"
                  >
                    Rooms
                  </button>
              )}
            </div>

            <div className="space-y-1">
              <button
                onClick={() => toggleDropdown("mobile-cuisines")}
                className="w-full text-left text-gray-800 hover:text-red-500 flex items-center justify-between px-2 sm:px-3 py-2 text-sm font-medium"
              >
                Cuisines
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    activeDropdown === "mobile-cuisines" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeDropdown === "mobile-cuisines" && (
                <div className="ml-3 sm:ml-4 space-y-1">
                  <a
                    href="#"
                    className="block px-2 sm:px-3 py-2 text-sm text-gray-600 hover:text-red-500"
                  >
                    Italian
                  </a>
                  <a
                    href="#"
                    className="block px-2 sm:px-3 py-2 text-sm text-gray-600 hover:text-red-500"
                  >
                    Chinese
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <button
                onClick={() => toggleDropdown("mobile-categories")}
                className="w-full text-left text-gray-800 hover:text-red-500 flex items-center justify-between px-2 sm:px-3 py-2 text-sm font-medium"
              >
                Categories
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    activeDropdown === "mobile-categories" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeDropdown === "mobile-categories" && (
                <div className="ml-3 sm:ml-4 space-y-1">
                  <a
                    href="#"
                    className="block px-2 sm:px-3 py-2 text-sm text-gray-600 hover:text-red-500"
                  >
                    Breakfast
                  </a>
                  <a
                    href="#"
                    className="block px-2 sm:px-3 py-2 text-sm text-gray-600 hover:text-red-500"
                  >
                    Lunch
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <button
                onClick={() => toggleDropdown("mobile-blog")}
                className="w-full text-left text-gray-800 hover:text-red-500 flex items-center justify-between px-3 py-2 text-sm font-medium"
              >
                Blog
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    activeDropdown === "mobile-blog" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeDropdown === "mobile-blog" && (
                <div className="ml-4 space-y-1">
                  <a
                    href="#"
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-red-500"
                  >
                    Latest Posts
                  </a>
                  <a
                    href="#"
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-red-500"
                  >
                    Cooking Tips
                  </a>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <button
                onClick={() => toggleDropdown("mobile-features")}
                className="w-full text-left text-gray-800 hover:text-red-500 flex items-center justify-between px-3 py-2 text-sm font-medium"
              >
                Features
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    activeDropdown === "mobile-features" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeDropdown === "mobile-features" && (
                <div className="ml-4 space-y-1">
                  <a
                    href="#"
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-red-500"
                  >
                    Meal Planner
                  </a>
                  <a
                    href="#"
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-red-500"
                  >
                    Recipe Calculator
                  </a>
                </div>
              )}
            </div>

            {/* Navigation Links for Mobile */}
            <div className="px-3 py-2 md:hidden space-y-2">
              <Link to="/recipes" className="block w-full text-gray-700 hover:text-red-500 px-3 py-2 text-sm font-medium">
                Recipes
              </Link>
              <Link to="/ai-suggest" className="block w-full text-gray-700 hover:text-red-500 px-3 py-2 text-sm font-medium">
                AI Suggest
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="block w-full text-gray-700 hover:text-red-500 px-3 py-2 text-sm font-medium">
                    Profile
                  </Link>
                  <Link to="/rooms" className="block w-full text-gray-700 hover:text-red-500 px-3 py-2 text-sm font-medium">
                    My Rooms
                  </Link>
                  <button 
                    onClick={logout}
                    className="block w-full text-left text-gray-700 hover:text-red-500 px-3 py-2 text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={openLogin}
                  className="block w-full text-left text-gray-700 hover:text-red-500 px-3 py-2 text-sm font-medium"
                >
                  Login / Register
                </button>
              )}
            </div>
            


            {/* Social media icons for mobile */}
            <div className="flex md:hidden items-center justify-center space-x-6 px-3 py-3 border-t border-gray-100 mt-3">
              <svg
                className="w-4 h-4 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <svg
                className="w-4 h-4 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <svg
                className="w-4 h-4 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <svg
                className="w-4 h-4 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.082.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.744-1.378l-.628 2.43c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {showAddRecipeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto relative p-8">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              onClick={handleCloseAddRecipe}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
            <form onSubmit={handleCreateRecipe}>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Title</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={recipeTitle}
                  onChange={(e) => setRecipeTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  value={recipeDescription}
                  onChange={(e) => setRecipeDescription(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Image</label>
                <input
                  type="file"
                  className="w-full hidden"
                  ref={recipeFileInputRef}
                  onChange={handleRecipeImageChange}
                  accept="image/*"
                />
                <button
                  type="button"
                  className="text-blue-600 underline"
                  onClick={handleAddRecipeImage}
                >
                  + Add Image
                </button>
                {recipeImage && (
                  <div className="mt-2 text-sm text-gray-700">
                    Selected: {recipeImage.name}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Ingredients</label>
                {recipeIngredients.map((ing, idx) => (
                  <div key={idx} className="flex mb-2">
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={ing}
                      onChange={(e) =>
                        handleIngredientChange(idx, e.target.value)
                      }
                      required
                    />
                    <button
                      type="button"
                      className="ml-2 text-red-500"
                      onClick={() => handleRemoveIngredient(idx)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-blue-600 underline"
                  onClick={handleAddIngredient}
                >
                  + Add Ingredient
                </button>
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Steps</label>
                {recipeSteps.map((step, idx) => (
                  <div key={idx} className="flex mb-2">
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={step}
                      onChange={(e) => handleStepChange(idx, e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="ml-2 text-red-500"
                      onClick={() => handleRemoveStep(idx)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-blue-600 underline"
                  onClick={handleAddStep}
                >
                  + Add Step
                </button>
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={recipeTags}
                  onChange={(e) => setRecipeTags(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-500 text-white py-2 rounded font-semibold mt-4"
              >
                Create Recipe
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </nav>
  );
};

export default Navbar;
