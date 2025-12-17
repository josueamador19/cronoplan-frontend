
import React from 'react';
import { parseLocalDate, isSameDay, isToday } from '../../utils/dateUtils';

const CalendarMonthView = ({ tasks, currentDate, onDateClick, onTaskClick }) => {
  
  // Obtener días del mes
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Ajustar para que lunes sea el primer día
    const adjustedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    
    const days = [];
    
    // Días del mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = adjustedStartDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false
      });
    }
    
    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Días del mes siguiente para completar la grilla
    const remainingDays = 42 - days.length; 
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
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

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="calendar-month">
      {/* Header con días de la semana */}
      <div className="calendar-month-header">
        {weekDays.map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>

      {/* Grilla de días */}
      <div className="calendar-month-grid">
        {days.map((day, index) => {
          const dayTasks = getTasksForDay(day.date);
          const isCurrentDay = isToday(day.date);
          
          return (
            <div
              key={index}
              className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${isCurrentDay ? 'today' : ''}`}
              onClick={() => onDateClick(day.date)}
            >
              <div className="calendar-day-number">
                {day.date.getDate()}
              </div>
              
              <div className="calendar-day-tasks">
                {dayTasks.slice(0, 3).map(task => (
                  <div
                    key={task.id}
                    className="calendar-task-item"
                    style={{
                      backgroundColor: task.status_badge_color 
                        ? `${task.status_badge_color}15` 
                        : '#1890ff15',
                      borderLeft: `3px solid ${task.status_badge_color || '#1890ff'}`
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick(task);
                    }}
                  >
                    <span className="task-item-text">
                      {task.title}
                    </span>
                  </div>
                ))}
                
                {dayTasks.length > 3 && (
                  <div className="calendar-task-more">
                    +{dayTasks.length - 3} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarMonthView;