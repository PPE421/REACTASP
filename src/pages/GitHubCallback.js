// src/pages/GitHubCallback.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGitHub } from '../context/GitHubContext';

const GitHubCallback = () => {
  const navigate = useNavigate();
  const { handleGitHubCallback } = useGitHub();
  const [status, setStatus] = useState('Procesando...');

  useEffect(() => {
    const processCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');

      if (code && state) {
        const success = await handleGitHubCallback(code, state);
        if (success) {
          setStatus('Conexión exitosa, redirigiendo...');
          setTimeout(() => navigate('/repositories'), 1500);
        } else {
          setStatus('Error al procesar la autorización');
          setTimeout(() => navigate('/profile'), 2000);
        }
      } else {
        setStatus('Parámetros de autorización inválidos');
        setTimeout(() => navigate('/profile'), 2000);
      }
    };

    processCallback();
  }, [handleGitHubCallback, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center  bg-white dark:bg-black text-black dark:text-white transition-all duration-500">
      <div className="p-8 rounded shadow-md w-full max-w-md text-center  bg-white dark:bg-black text-black dark:text-white transition-all duration-500">
        <h1 className="text-2xl font-bold mb-4">GitHub Authorization</h1>
        <p>{status}</p>
      </div>
    </div>
  );
};

export default GitHubCallback;