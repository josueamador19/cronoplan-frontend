import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Crear instancia de axios para autenticación
const authAPI = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =====================================================
// INTERCEPTOR PARA MANEJAR SESIÓN Y REFRESH TOKENS
// =====================================================

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Función para configurar interceptores (reutilizable)
const setupInterceptors = (axiosInstance) => {
  // Interceptor de Request - Adjunta el token automáticamente
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor de Response - Maneja errores 401 y renueva tokens
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Si el error es 401 (token expirado)
      if (error.response?.status === 401 && !originalRequest._retry) {
        
        // Si ya estamos refrescando, agregar a la cola
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              return axiosInstance(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refresh_token');

        // Si no hay refresh token, cerrar sesión
        if (!refreshToken) {
          console.log('No hay refresh token - Cerrando sesión');
          handleSessionExpired('Tu sesión ha expirado');
          return Promise.reject(error);
        }

        try {
          // Intentar renovar el token
          console.log('Intentando renovar token...');
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken }
          );

          const { access_token, refresh_token: newRefreshToken, user } = response.data;

          // Guardar nuevos tokens
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', newRefreshToken);
          localStorage.setItem('user', JSON.stringify(user));

          console.log('Token renovado exitosamente');

          // Actualizar header del request original
          originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
          
          // Procesar la cola de requests pendientes
          processQueue(null, access_token);
          
          isRefreshing = false;

          // Reintentar el request original
          return axiosInstance(originalRequest);

        } catch (refreshError) {
          console.error('Error al renovar token:', refreshError);
          
          // Si el refresh token también expiró, cerrar sesión
          processQueue(refreshError, null);
          isRefreshing = false;
          
          handleSessionExpired('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
};

// Función para manejar sesión expirada
const handleSessionExpired = (message) => {
  // Guardar la URL actual para redirect después del login
  const currentPath = window.location.pathname;
  if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
    localStorage.setItem('redirect_after_login', currentPath);
  }
  
  // Limpiar datos de autenticación
  clearAuthData();
  
  // Emitir evento para mostrar notificación
  window.dispatchEvent(new CustomEvent('auth:session-expired', {
    detail: { message }
  }));
  
  // Redirigir al login
  setTimeout(() => {
    window.location.href = '/login';
  }, 1500);
};

// Configurar interceptores en ambas instancias
setupInterceptors(authAPI);
setupInterceptors(api);

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
    clearAuthData();
  } catch (error) {
    // Limpiar localStorage incluso si falla la petición
    clearAuthData();
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

/**
 * Renovar access token manualmente 
 */
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No hay refresh token');
    }
    
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      { refresh_token: refreshToken }
    );
    
    const { access_token, refresh_token: newRefreshToken, user } = response.data;
    
    // Guardar nuevos tokens
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', newRefreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  } catch (error) {
    // Si falla, limpiar todo y cerrar sesión
    clearAuthData();
    throw error;
  }
};

// =====================================================
// FUNCIONES DE PERFIL
// =====================================================

/**
 * Subir/actualizar avatar
 */
export const uploadAvatar = async (file) => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('No estás autenticado');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/profile/avatar', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    // Actualizar avatar en localStorage
    updateStoredUserAvatar(response.data.avatar_url);

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Error al subir avatar';
    throw new Error(errorMessage);
  }
};

/**
 * Eliminar avatar
 */
export const deleteAvatar = async () => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('No estás autenticado');
    }

    const response = await api.delete('/profile/avatar', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Actualizar avatar en localStorage (null)
    updateStoredUserAvatar(null);

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Error al eliminar avatar';
    throw new Error(errorMessage);
  }
};

/**
 * Actualizar nombre de usuario
 */
export const updateUserName = async (fullName) => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('No estás autenticado');
    }

    const response = await api.put('/profile/name', 
      { full_name: fullName },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Actualizar nombre en localStorage
    updateStoredUserName(response.data.full_name);

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Error al actualizar nombre';
    throw new Error(errorMessage);
  }
};

// =====================================================
// HELPERS
// =====================================================

export const saveAuthData = (data) => {
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token); 
  localStorage.setItem('user', JSON.stringify(data.user));
};

export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getStoredToken = () => {
  return localStorage.getItem('access_token');
};

export const getStoredRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

export const clearAuthData = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token'); 
  localStorage.removeItem('user');
  localStorage.removeItem('redirect_after_login');
};

export const isAuthenticated = () => {
  return !!getStoredToken();
};

/**
 * Actualizar solo el avatar del usuario en localStorage
 */
export const updateStoredUserAvatar = (avatarUrl) => {
  const user = getStoredUser();
  if (user) {
    user.avatar_url = avatarUrl;
    localStorage.setItem('user', JSON.stringify(user));
    // Disparar evento personalizado para actualizar UI
    window.dispatchEvent(new Event('userUpdated'));
  }
};

/**
 * Actualizar solo el nombre del usuario en localStorage
 */
export const updateStoredUserName = (fullName) => {
  const user = getStoredUser();
  if (user) {
    user.full_name = fullName;
    localStorage.setItem('user', JSON.stringify(user));
    // Disparar evento personalizado para actualizar UI
    window.dispatchEvent(new Event('userUpdated'));
  }
};