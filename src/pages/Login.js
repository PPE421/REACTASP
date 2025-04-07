
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Email es requerido'),
  password: Yup.string().required('Contraseña es requerida')
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const successMessage = location.state?.message || '';

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await login(values);
      if (result.success) {
        navigate('/profile');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gray-100 dark:bg-gray-900 rounded shadow-md">
      <div className="p-8 rounded shadow-md w-full max-w-md  bg-gray-100 dark:bg-gray-800 ">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{successMessage}</div>
        )}
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4 ">
                <label htmlFor="email" className="block mb-1">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="w-full p-2 border rounded  bg-gray-100 dark:bg-gray-700  shadow-md"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block mb-1">Contraseña</label>
                <Field
                  type="password"
                  name="password"
                  className="w-full p-2 border  bg-gray-100 dark:bg-gray-700  shadow-md"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </Form>
          )}
        </Formik>
        
        <div className="mt-4 text-center">
          ¿No tienes una cuenta? <Link to="/signup" className="text-blue-500">Regístrate</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;