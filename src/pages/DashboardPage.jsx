// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import TopBar from '../components/layout/TopBar';
import KanbanBoard from '../components/boards/KanbanBoard';
import TaskList from '../components/tasks/TaskList';
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
  const [activeView, setActiveView] = useState('kanban'); // 'kanban' o 'list'

  // Cargar datos iniciales
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar boards y tasks en paralelo
      const [boardsData, tasksData] = await Promise.all([
        getAllBoards(),
        getAllTasks()
      ]);

      setBoards(boardsData);
      setTasks(tasksData.tasks || tasksData);

      // Si hay boards, seleccionar el primero por defecto
      if (boardsData.length > 0 && !selectedBoard) {
        setSelectedBoard(boardsData[0].id);
      }

      console.log('✅ Datos cargados:', { 
        boards: boardsData.length, 
        tasks: tasksData.tasks?.length || tasksData.length 
      });

    } catch (error) {
      console.error('❌ Error al cargar dashboard:', error);
      
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

  // ⭐ Callback cuando se crea un board
  const handleBoardCreated = async (newBoard) => {
    console.log('🎉 Nuevo board creado:', newBoard);
    
    // Recargar boards
    const updatedBoards = await getAllBoards();
    setBoards(updatedBoards);
    
    // Opcional: Seleccionar el nuevo board
    setSelectedBoard(newBoard.id);
    
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

  const handleBoardSelect = (boardId) => {
    setSelectedBoard(boardId);
  };

  const handleAddTask = (columnId) => {
    alert('Modal para crear tarea - Próximamente');
    // TODO: Abrir modal para crear tarea
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
    column: task.status, // todo, progress, done
    completed: task.completed,
    assignee: task.assignee || { 
      name: 'Sin asignar', 
      avatar: 'https://ui-avatars.com/api/?name=NA&background=cccccc&color=666666' 
    }
  }));

  // Helper para formatear fecha
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
          <p>Cargando dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout activeItem="inicio">
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          color: '#ff4d4f'
        }}>
          <h3>⚠️ {error}</h3>
          <button 
            onClick={loadDashboardData}
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
    <DashboardLayout activeItem="inicio">
      {/* TopBar con callbacks */}
      <TopBar 
        title={`¡Bienvenido, ${user?.full_name || 'Usuario'}! 👋`}
        subtitle="Aquí está un resumen de tu productividad"
        onTaskCreated={handleTaskCreated}
        onBoardCreated={handleBoardCreated}
      />

      {/* Estadísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        padding: '0 20px 20px',
        marginBottom: '20px'
      }}>
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
        />
        <StatCard
          icon="⏳"
          title="Pendientes"
          value={stats.pendingTasks}
          color="#faad14"
        />
        <StatCard
          icon="🔥"
          title="Alta Prioridad"
          value={stats.highPriority}
          color="#ff4d4f"
        />
      </div>

      {/* Controles de vista */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px 20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
            {selectedBoard 
              ? `Tablero: ${boards.find(b => b.id === selectedBoard)?.name}`
              : 'Todas las tareas'}
          </h2>
          <select 
            value={selectedBoard || ''} 
            onChange={(e) => handleBoardSelect(Number(e.target.value) || null)}
            style={{
              padding: '8px 16px',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="">Todos los tableros</option>
            {boards.map(board => (
              <option key={board.id} value={board.id}>
                {board.icon} {board.name} ({board.task_count || 0})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`view-tab ${activeView === 'kanban' ? 'active' : ''}`}
            onClick={() => setActiveView('kanban')}
            style={{
              padding: '8px 16px',
              border: activeView === 'kanban' ? 'none' : '1px solid #d9d9d9',
              background: activeView === 'kanban' ? '#1890ff' : 'white',
              color: activeView === 'kanban' ? 'white' : '#666',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            📊 Kanban
          </button>
          <button 
            className={`view-tab ${activeView === 'list' ? 'active' : ''}`}
            onClick={() => setActiveView('list')}
            style={{
              padding: '8px 16px',
              border: activeView === 'list' ? 'none' : '1px solid #d9d9d9',
              background: activeView === 'list' ? '#1890ff' : 'white',
              color: activeView === 'list' ? 'white' : '#666',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            📋 Lista
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ padding: '0 20px 20px' }}>
        {transformedTasks.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📋</div>
            <h3 style={{ fontSize: '24px', color: '#333', marginBottom: '12px' }}>
              No tienes tareas aún
            </h3>
            <p style={{ color: '#999', marginBottom: '24px' }}>
              Crea tu primera tarea para comenzar
            </p>
            <button 
              onClick={() => handleAddTask('todo')}
              style={{
                padding: '12px 32px',
                backgroundColor: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              + Crear primera tarea
            </button>
          </div>
        ) : (
          <>
            {activeView === 'kanban' ? (
              <KanbanBoard
                tasks={transformedTasks}
                onAddTask={handleAddTask}
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
    </DashboardLayout>
  );
};

// Componente para tarjetas de estadísticas
const StatCard = ({ icon, title, value, color, onClick }) => (
  <div 
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '20px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s'
    }}
    onMouseEnter={(e) => {
      if (onClick) {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
      }
    }}
    onMouseLeave={(e) => {
      if (onClick) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      }
    }}
  >
    <span style={{ fontSize: '32px' }}>{icon}</span>
    <div>
      <p style={{ 
        fontSize: '28px', 
        fontWeight: 'bold', 
        color: color, 
        margin: 0 
      }}>
        {value}
      </p>
      <p style={{ 
        fontSize: '14px', 
        color: '#999', 
        margin: 0 
      }}>
        {title}
      </p>
    </div>
  </div>
);

export default DashboardPage;