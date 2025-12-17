// src/pages/TasksPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import TopBar from '../components/layout/TopBar';
import TaskList from '../components/tasks/TaskList';
import { getAllBoards } from '../components/services/boardsService';
import { getAllTasks } from '../components/services/tasksService';

const TasksPage = () => {
  const navigate = useNavigate();
  
  // Estados
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Cargando datos desde el backend...');

      // Cargar boards y tasks en paralelo
      const [boardsData, tasksData] = await Promise.all([
        getAllBoards(),
        getAllTasks()
      ]);

      setBoards(boardsData);
      const tasksList = tasksData.tasks || tasksData;
      setTasks(tasksList);

      console.log('Datos cargados exitosamente:', {
        boards: boardsData.length,
        tasks: tasksList.length
      });

    } catch (error) {
      console.error('Error al cargar datos:', error);
      
      // Si es error 401, redirigir al login
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError('Error al cargar las tareas. Verifica tu conexión.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ⭐ Callback cuando se crea un board
  const handleBoardCreated = async (newBoard) => {
    console.log('🎉 Nuevo board creado:', newBoard);
    
    // Recargar boards
    const updatedBoards = await getAllBoards();
    setBoards(updatedBoards);
    
    // Opcional: Mostrar notificación
    // toast.success('¡Tablero creado exitosamente!');
  };

  // ⭐ Callback cuando se crea una tarea
  const handleTaskCreated = async (newTask) => {
    console.log('🎉 Nueva tarea creada:', newTask);
    
    // Recargar tareas
    const tasksData = await getAllTasks();
    setTasks(tasksData.tasks || tasksData);
    
    // Opcional: Mostrar notificación
    // toast.success('¡Tarea creada exitosamente!');
  };

  // Transformar tareas del backend al formato del frontend
  const transformedTasks = tasks.map(task => ({
    id: task.id,
    title: task.title,
    status: task.status_badge || 'Sin categoría',
    statusColor: task.status_badge_color || '#9254DE',
    priority: task.priority,
    dueDate: formatDate(task.due_date),
    board: task.board || 'Sin tablero',
    boardId: task.board_id,
    column: task.status, // todo, progress, done
    completed: task.completed,
    assignee: task.assignee || { 
      name: 'Sin asignar', 
      avatar: 'https://ui-avatars.com/api/?name=NA&background=cccccc&color=666666'
    }
  }));

  // Formatear fecha
  function formatDate(dateString) {
    if (!dateString) return 'Sin fecha';
    
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Comparar fechas
    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else if (date < today) {
      return 'Vencida';
    }
    
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }

  // Filtrar tareas según filtros activos
  const filteredTasks = transformedTasks.filter(task => {
    for (const filter of activeFilters) {
      if (filter.id === 'priority' && task.priority !== filter.value) {
        return false;
      }
      if (filter.id === 'board' && task.board !== filter.value) {
        return false;
      }
      if (filter.id === 'status' && task.status !== filter.value) {
        return false;
      }
    }
    return true;
  });

  const handleRemoveFilter = (filterId) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
  };

  // Mostrar loading
  if (loading) {
    return (
      <DashboardLayout activeItem="actividades">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div className="spinner" style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #1890ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#666' }}>Cargando actividades...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <DashboardLayout activeItem="actividades">
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          color: '#ff4d4f'
        }}>
          <h3>{error}</h3>
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
    <DashboardLayout activeItem="actividades">
      {/* TopBar con callbacks */}
      <TopBar 
        title="Mis Actividades"
        subtitle="Gestión global de tareas pendientes"
        onTaskCreated={handleTaskCreated}
        onBoardCreated={handleBoardCreated}
      />
      
      
      
      {filteredTasks.length === 0 && tasks.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px',
          color: '#999'
        }}>
          <h3 style={{ fontSize: '24px', color: '#333', marginBottom: '12px' }}>
            No tienes tareas aún
          </h3>
          <p style={{ marginBottom: '24px' }}>
            Crea tu primera tarea para comenzar a organizarte
          </p>
        </div>
      ) : (
        <TaskList 
          tasks={filteredTasks}
          filters={activeFilters}
          onFilterRemove={handleRemoveFilter}
          onClearFilters={handleClearFilters}
        />
      )}
    </DashboardLayout>
  );
};

export default TasksPage;