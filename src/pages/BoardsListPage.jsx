// src/pages/BoardsListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import TopBar from '../components/layout/TopBar';
import { getAllBoards, deleteBoard } from '../components/services/boardsService';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';

const BoardsListPage = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const boardsData = await getAllBoards();
      setBoards(boardsData);
      
      console.log('✅ Tableros cargados:', boardsData.length);
    } catch (error) {
      console.error('❌ Error al cargar tableros:', error);
      
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Error al cargar los tableros');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBoardClick = (boardId) => {
    navigate(`/dashboard/board/${boardId}`);
  };

  const handleCreateBoard = () => {
    alert('Modal para crear tablero - Próximamente');
    // TODO: Abrir modal para crear board
  };

  const handleEditBoard = (e, board) => {
    e.stopPropagation(); // Evitar que se abra el board
    alert(`Editar tablero: ${board.name} - Próximamente`);
    // TODO: Abrir modal para editar board
  };

  const handleDeleteBoard = async (e, board) => {
    e.stopPropagation(); // Evitar que se abra el board
    
    if (!window.confirm(`¿Eliminar el tablero "${board.name}"? Las tareas quedarán sin tablero.`)) {
      return;
    }

    try {
      await deleteBoard(board.id);
      console.log('✅ Tablero eliminado');
      
      // Recargar tableros
      await loadBoards();
      
      alert('Tablero eliminado exitosamente');
    } catch (error) {
      console.error('❌ Error al eliminar:', error);
      alert('Error al eliminar el tablero');
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeItem="tableros">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px' 
        }}>
          <p>Cargando tableros...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout activeItem="tableros">
        <div style={{ padding: '40px', textAlign: 'center', color: '#ff4d4f' }}>
          <h3>⚠️ {error}</h3>
          <button onClick={loadBoards}>Reintentar</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeItem="tableros">
      <TopBar 
        title="Mis Tableros"
        subtitle="Gestiona tus proyectos y espacios de trabajo"
        onCreateBoard={handleCreateBoard}
      />

      <div style={{ padding: '20px' }}>
        {/* Botón para crear nuevo tablero */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ margin: 0 }}>
            Todos los tableros ({boards.length})
          </h2>
          <button 
            onClick={handleCreateBoard}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            <FaPlus /> Nuevo Tablero
          </button>
        </div>

        {/* Empty state */}
        {boards.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📊</div>
            <h3 style={{ fontSize: '24px', color: '#333', marginBottom: '12px' }}>
              No tienes tableros aún
            </h3>
            <p style={{ color: '#999', marginBottom: '24px' }}>
              Crea tu primer tablero para organizar tus proyectos
            </p>
            <button 
              onClick={handleCreateBoard}
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
              <FaPlus style={{ marginRight: '8px' }} />
              Crear primer tablero
            </button>
          </div>
        ) : (
          /* Grid de tableros */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {boards.map(board => (
              <div
                key={board.id}
                onClick={() => handleBoardClick(board.id)}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                  borderLeft: `4px solid ${board.color}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
              >
                {/* Header del board */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '32px' }}>{board.icon}</span>
                    <div>
                      <h3 style={{ 
                        margin: 0, 
                        fontSize: '18px', 
                        fontWeight: '600',
                        color: '#333'
                      }}>
                        {board.name}
                      </h3>
                      <p style={{ 
                        margin: '4px 0 0 0', 
                        fontSize: '12px', 
                        color: '#999' 
                      }}>
                        {board.type === 'personal' ? '👤 Personal' : '👥 Equipo'}
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={(e) => handleEditBoard(e, board)}
                      style={{
                        padding: '6px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#999',
                        borderRadius: '4px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f0f0f0';
                        e.currentTarget.style.color = '#1890ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#999';
                      }}
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteBoard(e, board)}
                      style={{
                        padding: '6px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#999',
                        borderRadius: '4px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fff1f0';
                        e.currentTarget.style.color = '#ff4d4f';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#999';
                      }}
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>

                {/* Estadísticas */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 0',
                  borderTop: '1px solid #f0f0f0'
                }}>
                  <div>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '24px', 
                      fontWeight: 'bold',
                      color: board.color 
                    }}>
                      {board.task_count || 0}
                    </p>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '12px', 
                      color: '#999' 
                    }}>
                      tareas
                    </p>
                  </div>

                  <div style={{ 
                    padding: '4px 12px',
                    background: `${board.color}15`,
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: board.color,
                    fontWeight: '600'
                  }}>
                    Ver tablero →
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BoardsListPage;