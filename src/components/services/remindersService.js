
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const remindersAPI = axios.create({
  baseURL: `${API_BASE_URL}/reminders`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para token
remindersAPI.interceptors.request.use(
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
// RECORDATORIOS
// =====================================================

export const getAllReminders = async () => {
  try {
    const response = await remindersAPI.get('/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener recordatorios:', error);
    throw error;
  }
};

export const getReminderById = async (reminderId) => {
  try {
    const response = await remindersAPI.get(`/${reminderId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener recordatorio:', error);
    throw error;
  }
};

export const createReminder = async (reminderData) => {
  try {
    const response = await remindersAPI.post('/', reminderData);
    return response.data;
  } catch (error) {
    console.error('Error al crear recordatorio:', error);
    throw error;
  }
};

export const updateReminder = async (reminderId, reminderData) => {
  try {
    const response = await remindersAPI.put(`/${reminderId}`, reminderData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar recordatorio:', error);
    throw error;
  }
};

export const deleteReminder = async (reminderId) => {
  try {
    await remindersAPI.delete(`/${reminderId}`);
    return true;
  } catch (error) {
    console.error('Error al eliminar recordatorio:', error);
    throw error;
  }
};

// =====================================================
// NOTIFICACIONES
// =====================================================

export const getAllNotifications = async () => {
  try {
    const response = await remindersAPI.get('/notifications/all');
    return response.data;
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    throw error;
  }
};

export const getUnreadNotifications = async () => {
  try {
    const response = await remindersAPI.get('/notifications/unread');
    return response.data;
  } catch (error) {
    console.error('Error al obtener notificaciones no leídas:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await remindersAPI.patch(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error al marcar como leída:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await remindersAPI.post('/notifications/mark-all-read');
    return response.data;
  } catch (error) {
    console.error('Error al marcar todas como leídas:', error);
    throw error;
  }
};

// =====================================================
// FUNCIONES AUXILIARES
// =====================================================

export const calculateDaysUntilDue = (dueDate) => {
  if (!dueDate) return null;
  
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const formatDaysUntilDue = (days) => {
  if (days === null || days === undefined) return '';
  
  if (days < 0) return `Vencida hace ${Math.abs(days)} día${Math.abs(days) > 1 ? 's' : ''}`;
  if (days === 0) return 'Vence hoy';
  if (days === 1) return 'Vence mañana';
  return `Faltan ${days} días`;
};

export const getDaysColor = (days) => {
  if (days === null || days === undefined) return '#999';
  if (days < 0) return '#ff4d4f'; // Rojo (vencida)
  if (days === 0) return '#ff4d4f'; // Rojo (hoy)
  if (days === 1) return '#faad14'; // Naranja (mañana)
  if (days <= 3) return '#faad14'; // Naranja (próxima)
  return '#52c41a'; // Verde (con tiempo)
};

export const shouldNotify = (task, reminderType, daysBefore = null) => {
  const days = calculateDaysUntilDue(task.due_date);
  
  if (days === null) return false;
  
  switch (reminderType) {
    case 'daily':
      return days >= 0;
    case 'before_due':
      return days === daysBefore;
    case 'on_due':
      return days === 0;
    default:
      return false;
  }
};

export const generateNotificationMessage = (task, reminderType, daysBefore = null) => {
  const days = calculateDaysUntilDue(task.due_date);
  
  if (reminderType === 'daily') {
    return `La tarea "${task.title}" ${formatDaysUntilDue(days).toLowerCase()}`;
  } else if (reminderType === 'before_due') {
    return `La tarea "${task.title}" vence en ${daysBefore} día${daysBefore > 1 ? 's' : ''}`;
  } else if (reminderType === 'on_due') {
    return `La tarea "${task.title}" vence hoy`;
  }
  
  return `Recordatorio: ${task.title}`;
};

export default {
  getAllReminders,
  getReminderById,
  createReminder,
  updateReminder,
  deleteReminder,
  getAllNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  calculateDaysUntilDue,
  formatDaysUntilDue,
  getDaysColor,
  shouldNotify,
  generateNotificationMessage
};