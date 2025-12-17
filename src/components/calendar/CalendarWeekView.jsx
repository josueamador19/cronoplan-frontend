
import React from 'react';
import { parseLocalDate, isSameDay, isToday } from '../../utils/dateUtils';

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

  const getTasksForDay = (date) => {
    return tasks.filter(task => {
      if (!task.due_date) return false;
      
     
      const taskDate = parseLocalDate(task.due_date);
      return isSameDay(taskDate, date);
    });
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
                  
                  const timeStr = task.due_time || '08:00';
                  const [hour, minute] = timeStr.split(':').map(Number);
                  const topPosition = hour * 60 + minute; 
                  const endHour = hour + 1;
                  
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
                      <div className="week-task-time">
                        {timeStr} - {endHour.toString().padStart(2, '0')}:00
                      </div>
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