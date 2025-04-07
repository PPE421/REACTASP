// src/context/GitHubContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useCallback } from 'react';
import {
  getUserInfo,
  getUserRepositories,
  searchUserRepositories,
  getGitHubToken,
  saveGitHubToken,
  removeGitHubToken
} from '../services/githubService';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite
} from '../services/favoriteService';

const GitHubContext = createContext();

export const useGitHub = () => useContext(GitHubContext);

export const GitHubProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(!!getGitHubToken());

  // Cargar favoritos al inicio
  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  // Función para manejar la conexión con GitHub
  const connectWithGitHub = () => {
    // Generar un estado aleatorio para seguridad
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('oauth_state', state);

    // Reemplazar con tu CLIENT_ID real
    const CLIENT_ID = 'Ov23lioRMmddXLlVxoqf';

    // Construir URL de autorización
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo&state=${state}&redirect_uri=${window.location.origin}/github-callback`;

    // Redirigir al usuario a GitHub para autorización
    window.location.href = authUrl;
  };

  // Función para procesar el token recibido
  const handleGitHubCallback = async (code, state) => {
    const savedState = localStorage.getItem('oauth_state');
    if (state !== savedState) {
      setError('Invalid state parameter');
      return false;
    }

    try {
      setLoading(true);
      // Nota: Este intercambio debe hacerse desde un backend por seguridad
      // Aquí simulamos que ya tenemos el token para fines del ejercicio
      // En un caso real, enviarías 'code' a tu backend y el backend haría el intercambio

      // IMPORTANTE: En una aplicación real, NUNCA debes hacer esto en el frontend
      // Simular recepción de token para este ejercicio
      const mockToken = 'github_mock_token_' + code.substring(0, 5);
      saveGitHubToken(mockToken);
      setIsConnected(true);

      // Cargar información del usuario y sus repositorios
      await loadUserData();

      return true;
    } catch (err) {
      setError('Error exchanging code for token');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos del usuario y repositorios
  // const loadUserData = async () => {
  //   if (!getGitHubToken()) return;

  //   setLoading(true);
  //   setError(null);

  //   try {
  //     // Cargar información del usuario
  //     const userResult = await getUserInfo();
  //     if (userResult.success) {
  //       setUserInfo(userResult.data);
  //     } else {
  //       throw new Error('Failed to load user info');
  //     }

  //     // Cargar repositorios
  //     const reposResult = await getUserRepositories();
  //     if (reposResult.success) {
  //       setRepositories(reposResult.data);
  //     } else {
  //       throw new Error('Failed to load repositories');
  //     }
  //   } catch (err) {
  //     setError(err.message);
  //     // Si hay error de autenticación, desconectar
  //     if (err.message.includes('401')) {
  //       disconnectGitHub();
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadUserData = useCallback(async () => {
    if (!getGitHubToken()) return;

    setLoading(true);
    setError(null);

    try {
      const userResult = await getUserInfo();
      if (userResult.success) {
        setUserInfo(userResult.data);
      } else {
        throw new Error('Failed to load user info');
      }

      const reposResult = await getUserRepositories();
      if (reposResult.success) {
        setRepositories(reposResult.data);
      } else {
        throw new Error('Failed to load repositories');
      }
    } catch (err) {
      setError(err.message);
      if (err.message.includes('401')) {
        disconnectGitHub();
      }
    } finally {
      setLoading(false);
    }
  }, [setUserInfo, setRepositories, setError, setLoading]);

  // Buscar repositorios
  const searchRepositories = async (query) => {
    if (!query.trim()) {
      // Si la búsqueda está vacía, mostrar todos los repositorios
      await loadUserData();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await searchUserRepositories(query);
      if (result.success) {
        setRepositories(result.data);
      } else {
        throw new Error('Failed to search repositories');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Desconectar de GitHub
  const disconnectGitHub = () => {
    removeGitHubToken();
    setIsConnected(false);
    setUserInfo(null);
    setRepositories([]);
  };

  // Añadir repositorio a favoritos
  const addToFavorites = (repo) => {
    const updatedFavorites = addFavorite(repo);
    setFavorites(updatedFavorites);
  };

  // Eliminar repositorio de favoritos
  const removeFromFavorites = (repoId) => {
    const updatedFavorites = removeFavorite(repoId);
    setFavorites(updatedFavorites);
  };

  // Verificar si un repositorio está en favoritos
  const checkIsFavorite = (repoId) => {
    return isFavorite(repoId);
  };

  const value = {
    userInfo,
    repositories,
    favorites,
    loading,
    error,
    isConnected,
    connectWithGitHub,
    handleGitHubCallback,
    loadUserData,
    searchRepositories,
    disconnectGitHub,
    addToFavorites,
    removeFromFavorites,
    checkIsFavorite
  };

  return (
    <GitHubContext.Provider value={value}>
      {children}
    </GitHubContext.Provider>
  );
};