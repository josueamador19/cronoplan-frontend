// src/components/modals/CreateTaskModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createTask } from '../services/tasksService';
import { getAllBoards } from '../services/boardsService';
import '../../styles/modal.css';

const CreateTaskModal = ({ isOpen, onClose, onSuccess, defaultBoardId = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    board_id: defaultBoardId,
    priority: 'Media',
    status: 'todo',
    status_badge: '',
    status_badge_color: '#9254DE',
    assignee_id: null,
    due_date: ''
  });
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [error, setError] = useState('');

  // Prioridades disponibles
  const priorities = ['Alta', 'Media', 'Baja'];

  // Estados disponibles
  const statuses = [
    { value: 'todo', label: '📋 Por hacer' },
    { value: 'progress', label: '🔄 En progreso' },
    { value: 'done', label: '✅ Completada' }
  ];

  // Badges predefinidos
  const badges = [
    { name: 'Diseño', color: '#9254DE' },
    { name: 'Research', color: '#FF4D4F' },
    { name: 'Development', color: '#1890FF' },
    { name: 'Testing', color: '#52C41A' },
    { name: 'Marketing', color: '#FAAD14' },
    { name: 'Planning', color: '#13C2C2' },
    { name: 'Review', color: '#EB2F96' },
    { name: 'Deployment', color: '#722ED1' }
  ];

  // Cargar boards al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadBoards();
    }
  }, [isOpen]);

  // Actualizar board_id si defaultBoardId cambia
  useEffect(() => {
    if (defaultBoardId) {
      setFormData(prev => ({ ...prev, board_id: defaultBoardId }));
    }
  }, [defaultBoardId]);

  const loadBoards = async () => {
    try {
      setLoadingBoards(true);
      const boardsData = await getAllBoards();
      setBoards(boardsData);
    } catch (error) {
      console.error('❌ Error al cargar boards:', error);
    } finally {
      setLoadingBoards(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'board_id' ? (value ? parseInt(value) : null) : value
    }));
    setError('');
  };

  const handleBadgeSelect = (badge) => {
    setFormData(prev => ({
      ...prev,
      status_badge: badge.name,
      status_badge_color: badge.color
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('El título de la tarea es requerido');
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('📤 Creando tarea:', formData);

      // Preparar datos para enviar
      const taskData = {
        ...formData,
        board_id: formData.board_id || null,
        status_badge: formData.status_badge || null,
        due_date: formData.due_date || null
      };

      // Llamar al backend
      const newTask = await createTask(taskData);

      console.log('✅ Tarea creada:', newTask);

      // Notificar éxito
      if (onSuccess) {
        onSuccess(newTask);
      }

      // Resetear formulario
      setFormData({
        title: '',
        description: '',
        board_id: defaultBoardId,
        priority: 'Media',
        status: 'todo',
        status_badge: '',
        status_badge_color: '#9254DE',
        assignee_id: null,
        due_date: ''
      });

      // Cerrar modal
      onClose();

    } catch (error) {
      console.error('❌ Error al crear tarea:', error);
      
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.request) {
        setError('Error de conexión. Verifica que el backend esté corriendo.');
      } else {
        setError('Error al crear la tarea. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="task-modal-overlay" onClick={handleOverlayClick}>
      <div className="task-modal" style={{ maxWidth: '600px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
            Crear Nueva Tarea
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              padding: '8px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999'
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '24px' }}>
            {/* Error message */}
            {error && (
              <div style={{
                backgroundColor: '#fff1f0',
                border: '1px solid #ffccc7',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '20px',
                color: '#cf1322',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            {/* Título */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#333'
              }}>
                Título de la tarea *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: Implementar sistema de login"
                disabled={loading}
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1890ff'}
                onBlur={(e) => e.target.style.borderColor = '#d9d9d9'}
              />
            </div>

            {/* Descripción */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#333'
              }}>
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe los detalles de la tarea..."
                disabled={loading}
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1890ff'}
                onBlur={(e) => e.target.style.borderColor = '#d9d9d9'}
              />
            </div>

            {/* Tablero y Fecha en fila */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px',
              marginBottom: '20px'
            }}>
              {/* Tablero */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  Tablero
                </label>
                <select
                  name="board_id"
                  value={formData.board_id || ''}
                  onChange={handleChange}
                  disabled={loading || loadingBoards}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: loading || loadingBoards ? 'not-allowed' : 'pointer',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                >
                  <option value="">Sin tablero</option>
                  {boards.map(board => (
                    <option key={board.id} value={board.id}>
                      {board.icon} {board.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha límite */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  Fecha límite
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1890ff'}
                  onBlur={(e) => e.target.style.borderColor = '#d9d9d9'}
                />
              </div>
            </div>

            {/* Prioridad y Estado en fila */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px',
              marginBottom: '20px'
            }}>
              {/* Prioridad */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  Prioridad
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estado */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  Estado
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Categoría (Badge) */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#333'
              }}>
                Categoría (opcional)
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px'
              }}>
                {badges.map(badge => (
                  <button
                    key={badge.name}
                    type="button"
                    onClick={() => handleBadgeSelect(badge)}
                    disabled={loading}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: formData.status_badge === badge.name
                        ? `2px solid ${badge.color}`
                        : '1px solid #f0f0f0',
                      backgroundColor: formData.status_badge === badge.name
                        ? `${badge.color}15`
                        : 'white',
                      color: badge.color,
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center'
                    }}
                  >
                    {badge.name}
                  </button>
                ))}
              </div>
              {formData.status_badge && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    status_badge: '', 
                    status_badge_color: '#9254DE' 
                  }))}
                  disabled={loading}
                  style={{
                    marginTop: '8px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    color: '#999',
                    background: 'transparent',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Limpiar categoría
                </button>
              )}
            </div>

            {/* Preview */}
            <div style={{
              padding: '16px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              border: '1px solid #f0f0f0'
            }}>
              <p style={{
                fontSize: '12px',
                color: '#999',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Vista previa
              </p>
              <div>
                <p style={{
                  margin: '0 0 8px 0',
                  fontWeight: '600',
                  fontSize: '16px',
                  color: '#333'
                }}>
                  {formData.title || 'Título de la tarea'}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  {formData.status_badge && (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: `${formData.status_badge_color}15`,
                      color: formData.status_badge_color
                    }}>
                      {formData.status_badge}
                    </span>
                  )}
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500',
                    backgroundColor: 
                      formData.priority === 'Alta' ? '#ff4d4f15' :
                      formData.priority === 'Media' ? '#faad1415' :
                      '#52c41a15',
                    color:
                      formData.priority === 'Alta' ? '#ff4d4f' :
                      formData.priority === 'Media' ? '#faad14' :
                      '#52c41a'
                  }}>
                    {formData.priority}
                  </span>
                  {formData.due_date && (
                    <span style={{
                      fontSize: '11px',
                      color: '#999'
                    }}>
                      📅 {formData.due_date}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '8px 16px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#666',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim()}
              style={{
                padding: '8px 24px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: loading || !formData.title.trim() 
                  ? '#d9d9d9' 
                  : '#1890ff',
                color: 'white',
                cursor: loading || !formData.title.trim() 
                  ? 'not-allowed' 
                  : 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {loading ? 'Creando...' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;