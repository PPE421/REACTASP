
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Nombre es requerido'),
  email: Yup.string().email('Email inválido').required('Email es requerido'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('Contraseña es requerida')
});

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await register(values);
      if (result.success) {
        navigate('/login', { state: { message: 'Registro exitoso. Inicia sesión.' } });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error al registrar usuario');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-400 dark:bg-gray-800 text-black dark:text-white">
      <div className=" p-8 rounded shadow-md w-full max-w-md  bg-gray-200 dark:bg-gray-900 text-black dark:text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Registro</h1>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        
        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-1">Nombre</label>
                <Field
                  type="text"
                  name="name"
                  className="w-full p-2 border rounded  bg-gray-200 dark:bg-gray-900 text-black dark:text-white"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block mb-1">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="w-full p-2 border rounded  bg-gray-200 dark:bg-gray-900 text-black dark:text-white"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block mb-1">Contraseña</label>
                <Field
                  type="password"
                  name="password"
                  className="w-full p-2 border rounded  bg-gray-200 dark:bg-gray-900 text-black dark:text-white "
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                {isSubmitting ? 'Registrando...' : 'Registrarse'}
              </button>
            </Form>
          )}
        </Formik>
        
        <div className="mt-4 text-center">
          ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-500">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;