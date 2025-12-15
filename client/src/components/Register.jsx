import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useRecipeContext } from "../hooks/useRecipeContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [profileIcon, setProfileIcon] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loadUserPreferences } = useRecipeContext();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileIcon(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('password', form.password);
      if (profileIcon) {
        formData.append('profileIcon', profileIcon);
      }

      const res = await API.post("/auth/register", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      localStorage.setItem("token", res.data.token);
      // Load user preferences after successful registration
      await loadUserPreferences();
      setMessage("Registration successful! Redirecting to home...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="profileIcon" className="block text-sm font-medium text-gray-700">
                Profile Icon (Optional)
              </label>
              <div className="mt-1">
                <input
                  id="profileIcon"
                  name="profileIcon"
                  type="file"
                  accept="image/*"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  onChange={handleFileChange}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Choose a profile picture (JPG, PNG, GIF up to 5MB)
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>

            {message && (
              <div className={`text-sm text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}