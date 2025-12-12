// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Crear instancia de axios para autenticación
const authAPI = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =====================================================
// FUNCIONES DE AUTENTICACIÓN
// =====================================================

/**
 * Registrar un nuevo usuario
 */
export const registerUser = async (formData) => {
  try {
    const response = await authAPI.post('/register', {
      email: formData.email,
      password: formData.password,
      full_name: formData.fullName,
      phone: formData.phone || null
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Iniciar sesión
 */
export const loginUser = async (formData) => {
  try {
    const response = await authAPI.post('/login', {
      email: formData.email,
      password: formData.password
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cerrar sesión
 */
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      await authAPI.post('/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
    
    // Limpiar localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  } catch (error) {
    // Limpiar localStorage incluso si falla la petición
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    throw error;
  }
};

/**
 * Obtener usuario actual
 */
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('No hay token');
    }
    
    const response = await authAPI.get('/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar perfil del usuario
 */
export const updateUserProfile = async (userData) => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('No hay token');
    }
    
    const response = await authAPI.put('/me', userData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Verificar si el token es válido
 */
export const verifyToken = async () => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      return false;
    }
    
    await authAPI.get('/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return true;
  } catch (error) {
    return false;
  }
};

// =====================================================
// HELPERS
// =====================================================

export const saveAuthData = (data) => {
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('user', JSON.stringify(data.user));
};

export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getStoredToken = () => {
  return localStorage.getItem('access_token');
};

export const clearAuthData = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  return !!getStoredToken();
};