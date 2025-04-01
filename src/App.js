// src/App.js
import React from 'react';
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
  return (
    <Router>
      <AuthProvider>
        <GitHubProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/repositories" 
              element={
                <ProtectedRoute>
                  <Repositories />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/github-callback" 
              element={
                <ProtectedRoute>
                  <GitHubCallback />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </GitHubProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;