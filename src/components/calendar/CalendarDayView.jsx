// src/components/calendar/CalendarDayView.jsx
import React from 'react';

const CalendarDayView = ({ tasks, currentDate, onTaskClick, onCreateTask }) => {
  
  // Obtener tareas para el día actual
  const getDayTasks = () => {
    return tasks.filter(task => {
      if (!task.due_date) return false;
      
      const taskDate = new Date(task.due_date);
      return (
        taskDate.getDate() === currentDate.getDate() &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  // Generar horas del día (6 AM - 11 PM)
  const hours = Array.from({ length: 18 }, (_, i) => i + 6);
  const dayTasks = getDayTasks();

  // Verificar si es hoy
  const isToday = () => {
    const today = new Date();
    return (
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Formatear fecha completa
  const formatDate = () => {
    const options = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    };
    return currentDate.toLocaleDateString('es-ES', options);
  };

  // Obtener hora actual para marcar la línea de tiempo
  const getCurrentHourPosition = () => {
    if (!isToday()) return null;
    
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    
    if (hour < 6 || hour > 23) return null;
    
    const position = ((hour - 6) * 60) + minutes;
    return position;
  };

  const currentTimePosition = getCurrentHourPosition();

  return (
    <div className="calendar-day">
      {/* Header del día */}
      <div className="calendar-day-header">
        <div className="calendar-day-info">
          <h2 className="calendar-day-title">{formatDate()}</h2>
          <p className="calendar-day-subtitle">
            {dayTasks.length} {dayTasks.length === 1 ? 'actividad programada' : 'actividades programadas'}
          </p>
        </div>
        
        <button className="btn-add-activity" onClick={onCreateTask}>
          + Nueva actividad
        </button>
      </div>

      {/* Layout: Timeline + Sidebar */}
      <div className="calendar-day-content">
        {/* Timeline principal */}
        <div className="calendar-day-timeline">
          <div className="calendar-day-hours">
            {hours.map(hour => (
              <div key={hour} className="calendar-day-hour">
                <span className="hour-label">
                  {hour.toString().padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>

          <div className="calendar-day-events">
            {/* Línea de hora actual */}
            {currentTimePosition !== null && (
              <div 
                className="current-time-line"
                style={{ top: `${currentTimePosition}px` }}
              >
                <div className="current-time-dot"></div>
                <div className="current-time-line-bar"></div>
              </div>
            )}

            {/* Grid de horas */}
            {hours.map(hour => (
              <div
                key={hour}
                className="calendar-day-hour-slot"
              />
            ))}

            {/* Eventos del día */}
            {dayTasks.map(task => {
              // Por simplicidad, distribuir tareas a lo largo del día
              const randomHour = 6 + Math.floor(Math.random() * 12);
              const topPosition = (randomHour - 6) * 60;
              
              return (
                <div
                  key={task.id}
                  className="calendar-day-event"
                  style={{
                    top: `${topPosition}px`,
                    backgroundColor: task.status_badge_color 
                      ? `${task.status_badge_color}` 
                      : '#1890ff',
                    borderLeft: `4px solid ${task.status_badge_color || '#1890ff'}`
                  }}
                  onClick={() => onTaskClick(task)}
                >
                  <div className="day-event-time">
                    {randomHour.toString().padStart(2, '0')}:00 - {(randomHour + 1).toString().padStart(2, '0')}:00
                  </div>
                  <div className="day-event-title">{task.title}</div>
                  {task.description && (
                    <div className="day-event-description">
                      {task.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar con resumen */}
        <div className="calendar-day-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Añadir Rápido</h3>
            
            <div className="quick-add-card" onClick={onCreateTask}>
              <div className="quick-add-icon">📝</div>
              <div className="quick-add-content">
                <div className="quick-add-title">Título</div>
                <div className="quick-add-subtitle">Ej. Llamada con cliente</div>
              </div>
            </div>

            <div className="quick-add-info">
              <div className="info-row">
                <span>Fecha</span>
                <span>{currentDate.getDate()}</span>
              </div>
              <div className="info-row">
                <span>Hora</span>
                <span>15:00</span>
              </div>
              <div className="info-row">
                <span>Prioridad</span>
                <div className="priority-selector">
                  <button className="priority-btn">Alta</button>
                  <button className="priority-btn active">Media</button>
                  <button className="priority-btn">Baja</button>
                </div>
              </div>
              <div className="info-row">
                <span>Recordatorio</span>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <button className="btn-save-activity">
              Guardar Actividad
            </button>
          </div>

          {/* Tip */}
          <div className="sidebar-tip">
            <div className="tip-icon">💡</div>
            <div className="tip-content">
              <div className="tip-title">Tip Pro</div>
              <div className="tip-text">
                Arrastra las tareas en la lista semanal para cambiar su fecha de forma rápida sin abrir la tarjeta
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarDayView;