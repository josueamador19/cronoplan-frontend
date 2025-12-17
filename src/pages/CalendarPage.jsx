// src/pages/CalendarPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import TopBar from '../components/layout/TopBar';
import CalendarMonthView from '../components/calendar/CalendarMonthView';
import CalendarWeekView from '../components/calendar/CalendarWeekView';
import CalendarDayView from '../components/calendar/CalendarDayView';
import { getAllTasks } from '../components/services/tasksService';
import { getAllBoards } from '../components/services/boardsService';
import '../styles/calendar.css';

const CalendarPage = () => {
  const navigate = useNavigate();
  
  // Estados
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('month'); // 'month', 'week', 'day'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showRemindersOnly, setShowRemindersOnly] = useState(false);
  const [showTasksOnly, setShowTasksOnly] = useState(false);

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [tasksData, boardsData] = await Promise.all([
        getAllTasks(),
        getAllBoards()
      ]);

      setTasks(tasksData.tasks || tasksData);
      setBoards(boardsData);

      console.log('✅ Datos del calendario cargados:', {
        tasks: tasksData.tasks?.length || tasksData.length,
        boards: boardsData.length
      });

    } catch (error) {
      console.error('❌ Error al cargar datos del calendario:', error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError('Error al cargar el calendario');
      }
    } finally {
      setLoading(false);
    }
  };

  // Callbacks para crear board/tarea
  const handleBoardCreated = async (newBoard) => {
    const updatedBoards = await getAllBoards();
    setBoards(updatedBoards);
  };

  const handleTaskCreated = async (newTask) => {
    const tasksData = await getAllTasks();
    setTasks(tasksData.tasks || tasksData);
  };

  // Navegación de fechas
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    
    if (activeView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (activeView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (activeView === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    }
    
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    
    if (activeView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (activeView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (activeView === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    }
    
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Formatear título según la vista
  const getDateTitle = () => {
    const options = { year: 'numeric', month: 'long' };
    
    if (activeView === 'month') {
      return currentDate.toLocaleDateString('es-ES', options);
    } else if (activeView === 'week') {
      // Obtener rango de la semana
      const startOfWeek = getStartOfWeek(currentDate);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      
      return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${endOfWeek.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`;
    } else if (activeView === 'day') {
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      return currentDate.toLocaleDateString('es-ES', options);
    }
  };

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lunes como inicio
    return new Date(d.setDate(diff));
  };

  if (loading) {
    return (
      <DashboardLayout activeItem="calendario">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div className="spinner"></div>
          <p>Cargando calendario...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout activeItem="calendario">
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          color: '#ff4d4f'
        }}>
          <h3>⚠️ {error}</h3>
          <button 
            onClick={loadData}
            style={{
              marginTop: '20px',
              padding: '10px 24px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Reintentar
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeItem="calendario">
      <TopBar 
        title="Calendario"
        subtitle="Gestiona tus eventos y recordatorios"
        onTaskCreated={handleTaskCreated}
        onBoardCreated={handleBoardCreated}
      />

      <div className="calendar-container">
        {/* Controles del calendario */}
        <div className="calendar-controls">
          <div className="calendar-controls-left">
            <button className="btn-today" onClick={handleToday}>
              Hoy
            </button>
            
            <div className="calendar-navigation">
              <button className="btn-nav" onClick={handlePrevious}>
                ‹
              </button>
              <button className="btn-nav" onClick={handleNext}>
                ›
              </button>
            </div>
            
            <h2 className="calendar-title">{getDateTitle()}</h2>
          </div>

          <div className="calendar-controls-right">

            {/* Vista selector */}
            <div className="view-selector">
              <button 
                className={`view-tab ${activeView === 'month' ? 'active' : ''}`}
                onClick={() => setActiveView('month')}
              >
                Mes
              </button>
              <button 
                className={`view-tab ${activeView === 'week' ? 'active' : ''}`}
                onClick={() => setActiveView('week')}
              >
                Semana
              </button>
              <button 
                className={`view-tab ${activeView === 'day' ? 'active' : ''}`}
                onClick={() => setActiveView('day')}
              >
                Día
              </button>
            </div>
          </div>
        </div>

        {/* Vista del calendario */}
        <div className="calendar-view">
          {activeView === 'month' && (
            <CalendarMonthView
              tasks={tasks}
              currentDate={currentDate}
              onDateClick={(date) => {
                setCurrentDate(date);
                setActiveView('day');
              }}
              onTaskClick={(task) => console.log('Task clicked:', task)}
            />
          )}

          {activeView === 'week' && (
            <CalendarWeekView
              tasks={tasks}
              currentDate={currentDate}
              onDateClick={(date) => {
                setCurrentDate(date);
                setActiveView('day');
              }}
              onTaskClick={(task) => console.log('Task clicked:', task)}
            />
          )}

          {activeView === 'day' && (
            <CalendarDayView
              tasks={tasks}
              currentDate={currentDate}
              onTaskClick={(task) => console.log('Task clicked:', task)}
              onCreateTask={() => console.log('Create task')}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;