// src/pages/BoardPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import BoardHeader from '../components/boards/BoardHeader';
import KanbanBoard from '../components/boards/KanbanBoard';
import CreateTaskModal from '../components/modals/CreateTaskModal';
import { getBoardById } from '../components/services/boardsService';
import { getTasksByBoard, updateTaskStatus } from '../components/services/tasksService';

const BoardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ⭐ Estados para el modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('todo');

  // Cargar board y tareas
  useEffect(() => {
    loadBoardData();
  }, [id]);

  const loadBoardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔄 Cargando board ${id}...`);

      // Cargar board y sus tareas
      const [boardData, tasksData] = await Promise.all([
        getBoardById(id),
        getTasksByBoard(id)
      ]);

      setBoard(boardData);
      setTasks(tasksData);

      {/**
        console.log('Board cargado:', {
        board: boardData.name,
        tasks: tasksData.length
      });
        */}

    } catch (error) {
      console.error('Error al cargar board:', error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate('/login');
      } else if (error.response?.status === 404) {
        setError('Tablero no encontrado');
      } else {
        setError('Error al cargar el tablero');
      }
    } finally {
      setLoading(false);
    }
  };

  // Transformar tareas para el frontend
  const transformedTasks = tasks.map(task => ({
    id: task.id,
    title: task.title,
    status: task.status_badge || 'Sin categoría',
    statusColor: task.status_badge_color || '#9254DE',
    priority: task.priority,
    dueDate: formatDate(task.due_date),
    board: task.board || board?.name || 'Sin tablero',
    boardId: task.board_id,
    column: task.status, // todo, progress, done
    completed: task.completed,
    assignee: task.assignee || { 
      name: 'Sin asignar', 
      avatar: 'https://ui-avatars.com/api/?name=NA&background=cccccc&color=666666'
    }
  }));

  function formatDate(dateString) {
    if (!dateString) return 'Sin fecha';
    
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }

  // Abrir modal para crear tarea
  const handleAddTask = (columnId) => {
    //console.log('Crear tarea en columna:', columnId);
    setSelectedColumn(columnId);
    setIsTaskModalOpen(true);
  };

  // ⭐ Manejar éxito al crear tarea
  const handleTaskCreated = async (newTask) => {
    //console.log('Tarea creada:', newTask);
    setIsTaskModalOpen(false);
    // Recargar datos del board
    await loadBoardData();
  };

  const handleTaskClick = (task) => {
    console.log('Click en tarea:', task);
    alert(`Ver/editar tarea: ${task.title} - Próximamente`);
    // TODO: Abrir modal para ver/editar tarea
  };

  const handleTaskUpdate = async () => {
    // Recargar datos después de actualizar una tarea
    await loadBoardData();
  };

  if (loading) {
    return (
      <DashboardLayout activeItem="tableros">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div className="spinner"></div>
          <p>Cargando tablero...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout activeItem="tableros">
        <div style={{ padding: '40px', textAlign: 'center', color: '#ff4d4f' }}>
          <h3>{error}</h3>
          <button 
            onClick={() => navigate('/dashboard')}
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
            Volver al Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeItem="tableros">
      {board && (
        <BoardHeader
          board={{
            name: board.name,
            icon: board.icon,
            color: board.color,
            taskCount: tasks.length
          }}
        />
      )}

      <div style={{ padding: '20px' }}>
        {transformedTasks.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ fontSize: '24px', color: '#333', marginBottom: '12px' }}>
              Este tablero está vacío
            </h3>
            <p style={{ color: '#999', marginBottom: '24px' }}>
              Crea tu primera tarea para comenzar
            </p>
            <button 
              onClick={() => handleAddTask('todo')}
              style={{
                padding: '12px 32px',
                backgroundColor: board?.color || '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              ➕ Crear tarea
            </button>
          </div>
        ) : (
          <KanbanBoard
            tasks={transformedTasks}
            onAddTask={handleAddTask}
            onTaskClick={handleTaskClick}
            onTaskUpdate={handleTaskUpdate}
          />
        )}
      </div>

      {/* MODAL PARA CREAR TAREA */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSuccess={handleTaskCreated}
        defaultBoardId={id}
        defaultStatus={selectedColumn}
      />
    </DashboardLayout>
  );
};

export default BoardPage;