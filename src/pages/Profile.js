// src/pages/Profile.js (continuación)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGitHub } from '../context/GitHubContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { 
    userInfo, 
    isConnected, 
    connectWithGitHub, 
    disconnectGitHub,
    loading
  } = useGitHub();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-white">
      <div className="container mx-auto px-4 py-8 " >
        <div className="rounded-lg shadow-md p-6 max-w-lg mx-auto  bg-white dark:bg-gray-900 text-black dark:text-white">
          <h1 className="text-2xl font-bold mb-6 text-center">Perfil de Usuario</h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Información local</h2>
            <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-4 rounded">
              <p><strong>Nombre:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Conexión con GitHub</h2>
            
            {loading ? (
              <div className="text-center py-4">Cargando...</div>
            ) : isConnected ? (
              <div>
                <div className="p-4 rounded mb-4  bg-white dark:bg-gray-900 text-black dark:text-white">
                  <p className="text-green-700">✓ Conectado con GitHub</p>
                  {userInfo && (
                    <div className="mt-2">
                      <div className="flex items-center">
                        <img 
                          src={userInfo.avatar_url} 
                          alt="GitHub Avatar" 
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <p><strong>Username:</strong> {userInfo.login}</p>
                          <p><strong>Nombre:</strong> {userInfo.name || 'No disponible'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <button 
                    onClick={() => navigate('/repositories')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Ver repositorios
                  </button>
                  
                  <button 
                    onClick={disconnectGitHub}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Desconectar GitHub
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-yellow-50 p-4 rounded mb-4">
                  <p className="text-yellow-700">No estás conectado con GitHub</p>
                  <p className="mt-2 text-sm">Conéctate para ver y gestionar tus repositorios</p>
                </div>
                
                <button 
                  onClick={connectWithGitHub}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-black flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.295-1.552 3.3-1.23 3.3-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                  </svg>
                  Conectar con GitHub
                </button>
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t mt-6">
            <button 
              onClick={handleLogout}
              className="w-full bg-red-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;