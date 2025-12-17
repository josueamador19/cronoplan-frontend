// src/services/tasksService.js - CORREGIDO
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Crear instancia de axios para tasks
const tasksAPI = axios.create({
  baseURL: `${API_BASE_URL}/tasks`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
tasksAPI.interceptors.request.use(
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
// FUNCIONES DE TASKS
// =====================================================

/**
 * Obtener todas las tareas con filtros opcionales
 */
export const getAllTasks = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.board_id) params.append('board_id', filters.board_id);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.completed !== undefined) params.append('completed', filters.completed);
    if (filters.page) params.append('page', filters.page);
    if (filters.page_size) params.append('page_size', filters.page_size);
    
    const response = await tasksAPI.get(`/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    throw error;
  }
};

/**
 * Obtener tareas de un board específico
 */
export const getTasksByBoard = async (boardId) => {
  try {
    const response = await tasksAPI.get(`/board/${boardId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener tareas del board:', error);
    throw error;
  }
};

/**
 * Obtener una tarea específica
 */
export const getTaskById = async (taskId) => {
  try {
    const response = await tasksAPI.get(`/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    throw error;
  }
};

/**
 * Crear una nueva tarea
 */
export const createTask = async (taskData) => {
  try {
    const payload = {
      title: taskData.title,
      description: taskData.description || null,
      board_id: taskData.board_id || null,
      priority: taskData.priority || 'Media',
      status: taskData.status || 'todo',
      status_badge: taskData.status_badge || null,
      status_badge_color: taskData.status_badge_color || '#9254DE',
      assignee_id: taskData.assignee_id || null,
      due_date: taskData.due_date || null,
      due_time: taskData.due_time || '09:00',  // ⭐ NUEVO
      // Incluir campos de recordatorio
      create_reminder: taskData.create_reminder !== undefined ? taskData.create_reminder : true,
      reminder_days_before: taskData.reminder_days_before || 1,
      reminder_time: taskData.reminder_time || '09:00'
    };
    
    console.log('📤 Payload enviado al backend:', payload);
    
    const response = await tasksAPI.post('/', payload);
    return response.data;
  } catch (error) {
    console.error('Error al crear tarea:', error);
    throw error;
  }
};

/**
 * Actualizar una tarea
 */
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await tasksAPI.put(`/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    throw error;
  }
};

/**
 * Cambiar solo el status de una tarea (para drag & drop)
 */
export const updateTaskStatus = async (taskId, newStatus) => {
  try {
    const response = await tasksAPI.patch(`/${taskId}/status`, {
      status: newStatus
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar status:', error);
    throw error;
  }
};

/**
 * Eliminar una tarea
 */
export const deleteTask = async (taskId) => {
  try {
    await tasksAPI.delete(`/${taskId}`);
    return true;
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    throw error;
  }
};

/**
 * Helper: Formatear fecha para el backend
 * Mantiene la fecha en formato local sin conversión de zona horaria
 */
export const formatDateForBackend = (date) => {
  if (!date) return null;
  
  if (typeof date === 'string') {
    // Si ya es string en formato YYYY-MM-DD, devolverlo tal cual
    return date;
  }
  
  if (date instanceof Date) {
    // Formatear en zona horaria local (sin conversión a UTC)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  return null;
};

/**
 * Helper: Formatear fecha para el frontend
 */
export const formatDateForFrontend = (dateString) => {
  if (!dateString) return null;
  
  // Crear fecha sin conversión de zona horaria
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
};

export default {
  getAllTasks,
  getTasksByBoard,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  formatDateForBackend,
  formatDateForFrontend
};