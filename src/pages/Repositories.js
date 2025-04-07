import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGitHub } from '../context/GitHubContext';

const RepositoryCard = ({ repository, isFavorite, onToggleFavorite }) => {
  return (
    <div className=" p-4 rounded shadow-md mb-4  bg-gray-100 dark:bg-gray-900 ">
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
          onClick={() => onToggleFavorite(repository)}
          className={`p-2 rounded-full ${isFavorite
              ? 'text-yellow-500 hover:text-yellow-600'
              : 'text-gray-400 hover:text-yellow-500'
            }`}
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
          className="text-blue-500 hover:underline text-sm  bg-gray-100 dark:bg-gray-900  shadow-md"
        >
          Ver en GitHub →
        </a>
      </div>
    </div>
  );
};

const Repositories = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const {
    repositories,
    favorites,
    loading,
    error,
    isConnected,
    loadUserData,
    searchRepositories,
    addToFavorites,
    removeFromFavorites,
    checkIsFavorite
  } = useGitHub();


  useEffect(() => {
    if (isConnected) {
      loadUserData();
    } else {
      navigate('/profile');
    }
  }, [isConnected, loadUserData, navigate]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Debounce search queries
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        searchRepositories(query);
      }, 500)
    );
  };

  const handleToggleFavorite = (repo) => {
    if (checkIsFavorite(repo.id)) {
      removeFromFavorites(repo.id);
    } else {
      addToFavorites(repo);
    }
  };

  const displayedRepositories = activeTab === 'all'
    ? repositories
    : favorites;

  return (
    <div className="min-h-screen  bg-gray-100 dark:bg-gray-900  shadow-md">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Repositorios de GitHub</h1>
          <button
            onClick={() => navigate('/profile')}
            className="text-blue-500 hover:underline"
          >
            Volver al perfil
          </button>
        </div>

        <div className=" rounded-lg p-4 mb-6  bg-gray-100 dark:bg-gray-900  shadow-md">
          <div className="flex mb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-md mr-2 ${activeTab === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Todos los repositorios
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2 rounded-md flex items-center ${activeTab === 'favorites'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              Favoritos ({favorites.length})
            </button>
          </div>

          {activeTab === 'all' && (
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar repositorios..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full p-2 pl-10 border rounded-md  bg-gray-100 dark:bg-gray-900  shadow-md"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          )}
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
            <p className="mt-2 text-gray-600">Cargando repositorios...</p>
          </div>
        ) : error ? (
          <div className="bg-red-200 p-4 rounded-md text-red-600 text-center">
            <p>Error al cargar repositorios: {error}</p>
          </div>
        ) : displayedRepositories.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-md text-center">
            <p className="text-gray-600">
              {activeTab === 'all'
                ? 'No se encontraron repositorios.'
                : 'No tienes repositorios favoritos.'}
            </p>
            {activeTab === 'favorites' && (
              <button
                onClick={() => setActiveTab('all')}
                className="mt-2 text-blue-500 hover:underline"
              >
                Explorar repositorios
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {displayedRepositories.map(repo => (
              <RepositoryCard
                key={repo.id}
                repository={repo}
                isFavorite={checkIsFavorite(repo.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Repositories;