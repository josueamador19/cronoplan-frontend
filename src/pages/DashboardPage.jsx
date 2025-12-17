// src/pages/DashboardPage.jsx - CON MODAL DE CREAR TAREA
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import TopBar from '../components/layout/TopBar';
import KanbanBoard from '../components/boards/KanbanBoard';
import TaskList from '../components/tasks/TaskList';
import CreateTaskModal from '../components/modals/CreateTaskModal';
import { getAllBoards } from '../components/services/boardsService';
import { getAllTasks } from '../components/services/tasksService';
import { getStoredUser } from '../components/services/authService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = getStoredUser();
  
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('kanban');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // ⭐ Estados para el modal de crear tarea
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalDefaultStatus, setTaskModalDefaultStatus] = useState('todo');

  // Detectar cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [boardsData, tasksData] = await Promise.all([
        getAllBoards(),
        getAllTasks()
      ]);

      setBoards(boardsData);
      setTasks(tasksData.tasks || tasksData);

      if (boardsData.length > 0 && !selectedBoard) {
        setSelectedBoard(boardsData[0].id);
      }

      console.log('Datos cargados:', { 
        boards: boardsData.length, 
        tasks: tasksData.tasks?.length || tasksData.length 
      });

    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError('Error al cargar los datos. Intenta recargar la página.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBoardCreated = async (newBoard) => {
    console.log('Nuevo board creado:', newBoard);
    const updatedBoards = await getAllBoards();
    setBoards(updatedBoards);
    setSelectedBoard(newBoard.id);
  };

  const handleTaskCreated = async (newTask) => {
    console.log('✅ Nueva tarea creada desde modal:', newTask);
    // Recargar todas las tareas
    await loadDashboardData();
    // Cerrar el modal
    setIsTaskModalOpen(false);
  };

  const handleBoardSelect = (boardId) => {
    setSelectedBoard(boardId);
  };

  // ⭐ Función para abrir el modal de crear tarea
  // columnId puede ser: 'todo', 'progress', 'done'
  const handleAddTask = (columnId = 'todo') => {
    console.log('🎯 Abriendo modal para crear tarea en columna:', columnId);
    setTaskModalDefaultStatus(columnId);
    setIsTaskModalOpen(true);
  };

  // ⭐ Función para cerrar el modal
  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setTaskModalDefaultStatus('todo');
  };

  const handleTaskClick = (task) => {
    alert(`Ver/editar tarea: ${task.title} - Próximamente`);
    // TODO: Abrir modal para ver/editar tarea
  };

  // Filtrar tareas del board seleccionado
  const filteredTasks = selectedBoard
    ? tasks.filter(task => task.board_id === selectedBoard)
    : tasks;

  // Transformar tareas del backend al formato del frontend
  const transformedTasks = filteredTasks.map(task => ({
    id: task.id,
    title: task.title,
    status: task.status_badge || 'Sin categoría',
    statusColor: task.status_badge_color || '#9254DE',
    priority: task.priority,
    dueDate: formatDate(task.due_date),
    board: task.board || 'Sin tablero',
    boardId: task.board_id,
    column: task.status,
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

  // Calcular estadísticas
  const stats = {
    totalBoards: boards.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.completed).length,
    pendingTasks: tasks.filter(t => !t.completed).length,
    highPriority: tasks.filter(t => t.priority === 'Alta').length
  };

  if (loading) {
    return (
      <DashboardLayout activeItem="inicio">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout activeItem="inicio">
        <div className="dashboard-error">
          <h3>⚠️ {error}</h3>
          <button onClick={loadDashboardData}>
            Reintentar
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeItem="inicio">
      <TopBar 
        title={`¡Bienvenido, ${user?.full_name || 'Usuario'}!`}
        subtitle="Aquí está un resumen de tu productividad"
        onTaskCreated={handleTaskCreated}
        onBoardCreated={handleBoardCreated}
      />

      {/* Estadísticas */}
      <div className="dashboard-stats">
        <StatCard
          icon="📊"
          title="Tableros"
          value={stats.totalBoards}
          color="#1890ff"
          onClick={() => navigate('/dashboard/boards')}
        />
        <StatCard
          icon="✅"
          title="Tareas Totales"
          value={stats.totalTasks}
          color="#52c41a"
          onClick={() => navigate('/dashboard/tasks')}
        />
        <StatCard
          icon="⏳"
          title="Pendientes"
          value={stats.pendingTasks}
          color="#faad14"
          onClick={() => navigate('/dashboard/reminders')}
        />
        <StatCard
          icon="🔥"
          title="Alta Prioridad"
          value={stats.highPriority}
          color="#ff4d4f"
          onClick={() => navigate('/dashboard/tasks?priority=Alta')}
        />
      </div>

      {/* Controles de vista RESPONSIVE */}
      <div className="dashboard-controls">
        <div className="dashboard-controls-left">
          <h2 className={isMobile ? 'hide-mobile' : ''}>
            {selectedBoard 
              ? boards.find(b => b.id === selectedBoard)?.name
              : 'Todas las tareas'}
          </h2>
          <div className="board-selector">
            <select 
              value={selectedBoard || ''} 
              onChange={(e) => handleBoardSelect(Number(e.target.value) || null)}
            >
              <option value="">Todos los tableros</option>
              {boards.map(board => (
                <option key={board.id} value={board.id}>
                  {board.icon} {board.name} ({board.task_count || 0})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="dashboard-controls-right">
          <div className="view-toggle">
            <button 
              className={activeView === 'kanban' ? 'active' : ''}
              onClick={() => setActiveView('kanban')}
            >
              <span className="hide-mobile">📊</span> Kanban
            </button>
            <button 
              className={activeView === 'list' ? 'active' : ''}
              onClick={() => setActiveView('list')}
            >
              <span className="hide-mobile">📋</span> Lista
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="dashboard-content">
        {transformedTasks.length === 0 ? (
          <EmptyState onAddTask={() => handleAddTask('todo')} />
        ) : (
          <>
            {activeView === 'kanban' ? (
              <KanbanBoard
                tasks={transformedTasks}
                onAddTask={handleAddTask} // ⭐ Pasa la función al KanbanBoard
                onTaskClick={handleTaskClick}
                onTaskUpdate={loadDashboardData}
              />
            ) : (
              <TaskList
                tasks={transformedTasks}
                filters={[]}
                onFilterRemove={() => {}}
                onClearFilters={() => {}}
              />
            )}
          </>
        )}
      </div>

      {/* ⭐ Modal de Crear Tarea */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        onSuccess={handleTaskCreated}
        defaultBoardId={selectedBoard}
        defaultStatus={taskModalDefaultStatus}
      />
    </DashboardLayout>
  );
};

// Componente StatCard RESPONSIVE
const StatCard = ({ icon, title, value, color, onClick }) => (
  <div 
    className="stat-card"
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <span className="stat-icon">{icon}</span>
    <div>
      <p className="stat-value" style={{ color }}>
        {value}
      </p>
      <p className="stat-label">
        {title}
      </p>
    </div>
  </div>
);

// Componente EmptyState
const EmptyState = ({ onAddTask }) => (
  <div className="empty-state">
    <div style={{ fontSize: '64px', marginBottom: '20px' }}>📋</div>
    <h3>No tienes tareas aún</h3>
    <p>Crea tu primera tarea para comenzar</p>
    <button className="primary-btn" onClick={onAddTask}>
      + Crear primera tarea
    </button>
  </div>
);

export default DashboardPage