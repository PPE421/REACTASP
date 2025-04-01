export const registerUser = (user) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Verificar si el email ya está registrado
    if (users.some(u => u.email === user.email)) {
      return { success: false, message: 'El email ya está registrado' };
    }
  
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true };
  };
  
  export const loginUser = (credentials) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password
    );
  
    if (user) {
      // Guardar sesión actual
      const session = {
        user: { ...user, password: undefined }, // No guardar contraseña en sesión
        isLoggedIn: true,
        timestamp: new Date().getTime()
      };
      localStorage.setItem('currentSession', JSON.stringify(session));
      return { success: true, user: { ...user, password: undefined } };
    }
  
    return { success: false, message: 'Credenciales inválidas' };
  };
  
  export const logoutUser = () => {
    localStorage.removeItem('currentSession');
    return { success: true };
  };
  
  export const getCurrentUser = () => {
    const session = JSON.parse(localStorage.getItem('currentSession') || '{}');
    if (session.isLoggedIn && session.user) {
      return { success: true, user: session.user };
    }
    return { success: false };
  };
  