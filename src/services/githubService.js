// src/services/githubService.js
import { Octokit } from '@octokit/core';

// Función para obtener el token de GitHub del localStorage
export const getGitHubToken = () => {
  // return localStorage.getItem('github_token');
  return 'your_token_here';
};

// Guardar token de GitHub en localStorage
export const saveGitHubToken = (token) => {
  localStorage.setItem('github_token', token);
};

// Eliminar token de GitHub
export const removeGitHubToken = () => {
  localStorage.removeItem('github_token');
};

// Crear instancia de Octokit con el token
const createOctokit = () => {
  const token = getGitHubToken();
  if (!token) {
    throw new Error('No GitHub token found');
  }
  return new Octokit({ auth: token });
};

// Obtener información del usuario
export const getUserInfo = async () => {
  try {
    const octokit = createOctokit();
    const response = await octokit.request('GET /user');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching user info:', error);
    return { success: false, error };
  }
};

// Obtener repositorios del usuario
export const getUserRepositories = async () => {
  try {
    const octokit = createOctokit();
    const response = await octokit.request('GET /users/PPE421/repos', {
      // sort: 'updated',
      // per_page: 100
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return { success: false, error };
  }
};

// Buscar repositorios del usuario
export const searchUserRepositories = async (query) => {
  try {
    const { data: userInfo } = await getUserInfo();
    const octokit = createOctokit();
    const response = await octokit.request('GET /search/repositories', {
      q: `${query} user:${userInfo.login}`
    });
    return { success: true, data: response.data.items };
  } catch (error) {
    console.error('Error searching repositories:', error);
    return { success: false, error };
  }
};

// src/services/favoriteService.js
export const getFavorites = () => {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  return favorites;
};

export const addFavorite = (repo) => {
  const favorites = getFavorites();
  if (!favorites.some(fav => fav.id === repo.id)) {
    favorites.push(repo);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
  return favorites;
};

export const removeFavorite = (repoId) => {
  let favorites = getFavorites();
  favorites = favorites.filter(repo => repo.id !== repoId);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  return favorites;
};

export const isFavorite = (repoId) => {
  const favorites = getFavorites();
  return favorites.some(repo => repo.id === repoId);
};