// src/components/calendar/CalendarWeekView.jsx
import React from 'react';

const CalendarWeekView = ({ tasks, currentDate, onDateClick, onTaskClick }) => {
  
  // Obtener inicio de la semana (lunes)
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  // Obtener los 7 días de la semana
  const getWeekDays = () => {
    const startOfWeek = getStartOfWeek(currentDate);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  // Obtener tareas para un día específico
  const getTasksForDay = (date) => {
    return tasks.filter(task => {
      if (!task.due_date) return false;
      
      const taskDate = new Date(task.due_date);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Verificar si es hoy
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Generar horas del día
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const weekDays = getWeekDays();
  const weekDayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="calendar-week">
      {/* Header con días de la semana */}
      <div className="calendar-week-header">
        <div className="calendar-week-time-column"></div>
        
        {weekDays.map((day, index) => {
          const dayTasks = getTasksForDay(day);
          const isCurrentDay = isToday(day);
          
          return (
            <div
              key={index}
              className={`calendar-week-day-header ${isCurrentDay ? 'today' : ''}`}
              onClick={() => onDateClick(day)}
            >
              <div className="week-day-name">
                {weekDayNames[index]}
              </div>
              <div className={`week-day-number ${isCurrentDay ? 'today-number' : ''}`}>
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grilla de horas */}
      <div className="calendar-week-grid">
        <div className="calendar-week-hours">
          {hours.map(hour => (
            <div key={hour} className="calendar-week-hour">
              <span className="hour-label">
                {hour.toString().padStart(2, '0')}:00
              </span>
            </div>
          ))}
        </div>

        {/* Columnas de días */}
        <div className="calendar-week-days">
          {weekDays.map((day, dayIndex) => {
            const dayTasks = getTasksForDay(day);
            
            return (
              <div key={dayIndex} className="calendar-week-day-column">
                {hours.map(hour => (
                  <div
                    key={hour}
                    className="calendar-week-hour-slot"
                  />
                ))}
                
                {/* Tareas del día */}
                {dayTasks.map(task => {
                  // Calcular posición vertical basada en la hora
                  // Por simplicidad, asumimos que las tareas sin hora se muestran a las 8 AM
                  const topPosition = 8 * 60; // 8 AM en píxeles (60px por hora)
                  
                  return (
                    <div
                      key={task.id}
                      className="calendar-week-task"
                      style={{
                        top: `${topPosition}px`,
                        backgroundColor: task.status_badge_color 
                          ? `${task.status_badge_color}15` 
                          : '#1890ff15',
                        borderLeft: `3px solid ${task.status_badge_color || '#1890ff'}`
                      }}
                      onClick={() => onTaskClick(task)}
                    >
                      <div className="week-task-time">08:00 - 09:00</div>
                      <div className="week-task-title">{task.title}</div>
                      {task.status_badge && (
                        <div className="week-task-badge">
                          {task.status_badge}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarWeekView;