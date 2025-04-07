// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GitHubProvider } from './context/GitHubContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Repositories from './pages/Repositories';
import GitHubCallback from './pages/GitHubCallback';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Leer modo oscuro desde localStorage o usar false
  const [darkMode, setDarkMode] = useState(() => {
    const storedMode = localStorage.getItem('darkMode');
    return storedMode === 'true';
  });

  useEffect(() => {
    const root = window.document.documentElement;

    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Guardar en localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <Router>
      <AuthProvider>
        <GitHubProvider>
          <div className="min-h-screen w-full bg-white dark:bg-black text-black dark:text-white transition-all duration-500">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="fixed top-4 right-4 px-4 py-2 rounded bg-gray-800 text-white dark:bg-yellow-400 dark:text-black transition"
            >
              {darkMode ? '☀️ Claro' : '🌙 Oscuro'}
            </button>

            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/repositories" element={<ProtectedRoute><Repositories /></ProtectedRoute>} />
              <Route path="/github-callback" element={<ProtectedRoute><GitHubCallback /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </GitHubProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
