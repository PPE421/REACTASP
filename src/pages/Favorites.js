// src/pages/Favorites.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGitHub } from '../context/GitHubContext';

const RepositoryCard = ({ repository, onRemoveFavorite }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{repository.name}</h3>
          {repository.description && (
            <p className="text-gray-600 mt-1">{repository.description}</p>
          )}
          <div className="mt-2 flex items-center text-sm">
            <span className="mr-4">
              <span className="text-yellow-500 mr-1">★</span>
              {repository.stargazers_count}
            </span>
            {repository.language && (
              <span>
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block mr-1"></span>
                {repository.language}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => onRemoveFavorite(repository.id)}
          className="p-2 rounded-full text-yellow-500 hover:text-red-500"
          title="Eliminar de favoritos"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      </div>
      <div className="mt-3 text-right">
        <a
          href={repository.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm"
        >
          Ver en GitHub →
        </a>
      </div>
    </div>
  );
};

const Favorites = () => {
  const navigate = useNavigate();
  const { 
    favorites, 
    loading, 
    error, 
    isConnected,
    removeFromFavorites
  } = useGitHub();

  useEffect(() => {
    // Verificar si el usuario está conectado a GitHub
    if (!isConnected) {
      navigate('/profile');
    }
  }, [isConnected, navigate]);

  const handleRemoveFavorite = (repoId) => {
    removeFromFavorites(repoId);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Repositorios Favoritos</h1>
          <div>
            <button
              onClick={() => navigate('/repositories')}
              className="mr-4 text-blue-500 hover:underline"
            >
              Ver todos los repositorios
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="text-blue-500 hover:underline"
            >
              Volver al perfil
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <svg
              className="animate-spin h-10 w-10 text-blue-500 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-2 text-gray-600">Cargando favoritos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-600 text-center">
            <p>Error al cargar favoritos: {error}</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <svg
              className="w-16 h-16 text-yellow-500 mx-auto mb-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">No tienes repositorios favoritos</h2>
            <p className="text-gray-600 mb-4">
              Explora tus repositorios y marca algunos como favoritos para verlos aquí.
            </p>
            <button
              onClick={() => navigate('/repositories')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Explorar repositorios
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {favorites.map(repo => (
              <RepositoryCard
                key={repo.id}
                repository={repo}
                onRemoveFavorite={handleRemoveFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;