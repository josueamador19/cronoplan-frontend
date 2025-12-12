// src/services/boardsService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Crear instancia de axios para boards
const boardsAPI = axios.create({
  baseURL: `${API_BASE_URL}/boards`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
boardsAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =====================================================
// FUNCIONES DE BOARDS
// =====================================================

/**
 * Obtener todos los boards del usuario
 */
export const getAllBoards = async () => {
  try {
    const response = await boardsAPI.get('/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener boards:', error);
    throw error;
  }
};

/**
 * Obtener un board específico
 */
export const getBoardById = async (boardId) => {
  try {
    const response = await boardsAPI.get(`/${boardId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener board:', error);
    throw error;
  }
};

/**
 * Crear un nuevo board
 */
export const createBoard = async (boardData) => {
  try {
    const response = await boardsAPI.post('/', {
      name: boardData.name,
      color: boardData.color || '#1890FF',
      icon: boardData.icon || '📊',
      type: boardData.type || 'personal'
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear board:', error);
    throw error;
  }
};

/**
 * Actualizar un board
 */
export const updateBoard = async (boardId, boardData) => {
  try {
    const response = await boardsAPI.put(`/${boardId}`, boardData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar board:', error);
    throw error;
  }
};

/**
 * Eliminar un board
 */
export const deleteBoard = async (boardId) => {
  try {
    await boardsAPI.delete(`/${boardId}`);
    return true;
  } catch (error) {
    console.error('Error al eliminar board:', error);
    throw error;
  }
};

export default {
  getAllBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard
};