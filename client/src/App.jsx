import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import WhatWeDo from "./components/WhatWeDo";
import AboutUs from "./components/AboutUs";
import Footer from "./components/Footer";
import ContactModal from "./components/ContactModal";
import Discover from "./components/Discover";
import NewRecipe from "./components/NewRecipe";
import Vedios from "./components/Vedios";
import VideoRecipesPage from "./components/VideoRecipesPage";
import DiscoverPage from "./components/DiscoverPage";
import OurJournal from "./components/OurJournal";
import AZRecipesModal from "./components/AZRecipesModal";
import CategoryRecipesModal from "./components/CategoryRecipesModal";

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import ResetPassword from "./components/ResetPassword";
import Recipes from "./components/Recipes";
import AddRecipe from "./components/AddRecipe";
import Profile from "./components/Profile";
import AiSuggest from "./components/AiSuggest";
import { RecipeProvider } from "./context/RecipeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Rooms from "./components/Rooms";
import RoomDetails from "./components/RoomDetails";

function BlogArticleModal({ title, articles, error, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : articles && articles.length > 0 ? (
            <ul className="space-y-6">
              {articles.map((article, idx) => (
                <li
                  key={idx}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <h3 className="text-lg font-semibold mb-1">
                    {article.title}
                  </h3>
                  <div className="text-gray-700 mb-2">
                    {article.description}
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Read Full Article
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500">
              No articles found for this topic.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation(); // Now this will work properly inside Router
  const [showAZModal, setShowAZModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryData, setCategoryData] = useState({
    title: "",
    category: "",
    type: "category",
  });
  const [blogModal, setBlogModal] = useState({
    open: false,
    title: "",
    articles: [],
    error: "",
  });
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const handleShowAZModal = () => {
    setShowAZModal(true);
  };

  const handleCloseAZModal = () => {
    setShowAZModal(false);
  };

  const handleShowCategoryRecipes = (title, category, type = "category") => {
    setCategoryData({ title, category, type });
    setShowCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setCategoryData({ title: "", category: "", type: "category" });
  };

  const handleShowBlogArticle = async (title) => {
    // Map dropdown label to a broader NewsAPI query
    const topicMap = {
      "Healthy Recipes": [
        "healthy recipes",
        "nutrition",
        "healthy eating",
        "food",
      ],
      "Meal Planning": ["meal planning", "meal prep", "weekly meals", "food"],
      Baking: ["baking", "bread", "cakes", "desserts"],
      "Vegetarian Cooking": [
        "vegetarian",
        "plant based",
        "vegan",
        "healthy eating",
      ],
      "Food Trends": ["food trends", "food news", "restaurant trends", "food"],
      "Kitchen Tips": ["kitchen tips", "cooking tips", "chef advice", "food"],
      "World Cuisines": [
        "world cuisines",
        "international food",
        "global recipes",
        "food",
      ],
      "Quick Dinners": [
        "quick dinners",
        "easy dinner recipes",
        "weeknight meals",
        "food",
      ],
    };
    const queries = topicMap[title] || [title, "food"];
    let found = false;
    let error = "";
    for (let query of queries) {
      try {
        const apiKey = import.meta.env.VITE_NEWSAPI_KEY;
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(
            query
          )}&language=en&pageSize=5&apiKey=${apiKey}`
        );
        const data = await response.json();
        if (data.status === "error") {
          error = data.message || "API error.";
          break;
        }
        if (data.articles && data.articles.length > 0) {
          setBlogModal({
            open: true,
            title,
            articles: data.articles,
            error: "",
          });
          found = true;
          break;
        }
      } catch {
        error = "Network or API error.";
        break;
      }
    }
    if (!found) {
      setBlogModal({ open: true, title, articles: [], error });
    }
  };

  const handleCloseBlogModal = () =>
    setBlogModal({ open: false, title: "", articles: [], error: "" });

  const handleShowContactModal = () => setShowContactModal(true);
  const handleCloseContactModal = () => setShowContactModal(false);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white font-sans text-gray-700">
      <Header 
        key={location.pathname}
        onShowAZModal={handleShowAZModal}
        onShowCategoryRecipes={handleShowCategoryRecipes}
        onShowBlogArticle={handleShowBlogArticle}
        scrollToSection={scrollToSection}
      />
      <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
        <Hero />
        <WhatWeDo />
        <Discover id="discover-section" />
        <NewRecipe />
        <Vedios id="videos-section" />
        <AboutUs />
        <OurJournal />
                </>
              }
            />
            <Route path="/register" element={<Register key="register" />} />
            <Route path="/login" element={<Login key="login" isOpen={isLoginOpen} onClose={closeLogin} />} />
            <Route path="/reset-password/:token" element={<ResetPassword key="reset-password" />} />
            <Route path="/recipes" element={<Recipes key="recipes" />} />
            <Route path="/add-recipe" element={<AddRecipe key="add-recipe" />} />
            <Route path="/profile" element={<Profile key="profile" onShowLogin={openLogin} />} />
            <Route path="/ai-suggest" element={<AiSuggest key="ai-suggest" />} />
            <Route path="/videos" element={<VideoRecipesPage key="videos" />} />
            <Route path="/discover" element={<DiscoverPage key="discover" />} />
            <Route path="/rooms" element={<Rooms key="rooms" />} />
            <Route path="/rooms/:roomId" element={<RoomDetails key="room-details" />} />
          </Routes>
      </main>
      <Footer
        onShowAZModal={handleShowAZModal}
        onShowContactModal={handleShowContactModal}
        scrollToSection={scrollToSection}
      />
      {/* Modals */}
      <AZRecipesModal isOpen={showAZModal} onClose={handleCloseAZModal} />
      {showCategoryModal && (
        <CategoryRecipesModal 
          title={categoryData.title}
          category={categoryData.category}
          type={categoryData.type}
          onClose={handleCloseCategoryModal}
        />
      )}
      {blogModal.open && (
        <BlogArticleModal
          title={blogModal.title}
          articles={blogModal.articles}
          error={blogModal.error}
          onClose={handleCloseBlogModal}
        />
      )}
      {showContactModal && (
          <ContactModal
            isOpen={showContactModal}
            onClose={handleCloseContactModal}
          />
      )}
      {/* Global Login Modal */}
      <Login isOpen={isLoginOpen} onClose={closeLogin} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <RecipeProvider>
          <AppContent />
        </RecipeProvider>
      </AuthProvider>
    </Router>
  );
}
