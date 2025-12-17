
/**
 * Parsea una fecha en formato YYYY-MM-DD a un objeto Date
 * en la zona horaria local (sin conversión a UTC)
 * 
 * @param {string} dateString - Fecha en formato "YYYY-MM-DD"
 * @returns {Date} - Objeto Date en zona horaria local
 */
export const parseLocalDate = (dateString) => {
  if (!dateString) return null;
  
  // Dividir la fecha en partes
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Crear fecha en zona horaria local (mes es 0-indexed)
  return new Date(year, month - 1, day);
};

/**
 * Compara si dos fechas son el mismo día
 * (ignora horas, minutos, segundos)
 * 
 * @param {Date} date1 
 * @param {Date} date2 
 * @returns {boolean}
 */
export const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

/**
 * Verifica si una fecha es hoy
 * 
 * @param {Date} date 
 * @returns {boolean}
 */
export const isToday = (date) => {
  return isSameDay(date, new Date());
};

/**
 * Formatea una fecha a string legible en español
 * 
 * @param {Date} date 
 * @param {object} options - Opciones de Intl.DateTimeFormat
 * @returns {string}
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  };
  
  return date.toLocaleDateString('es-ES', { ...defaultOptions, ...options });
};

/**
 * Convierte una fecha a formato YYYY-MM-DD
 * 
 * @param {Date} date 
 * @returns {string}
 */
export const toDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default {
  parseLocalDate,
  isSameDay,
  isToday,
  formatDate,
  toDateString
};