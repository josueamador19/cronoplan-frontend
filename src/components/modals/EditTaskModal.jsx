// src/components/modals/EditTaskModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes, FaEllipsisV, FaEdit, FaTrash, FaCalendarAlt, FaClock, FaExchangeAlt } from 'react-icons/fa';
import PriorityBadge from '../tasks/PriorityBadge';
import StatusBadge from '../tasks/StatusBadge';
import { updateTask, deleteTask, moveTaskToBoard } from '../services/tasksService';
import '../../styles/modal.css';

const EditTaskModal = ({ 
  isOpen, 
  onClose, 
  task,
  boards = [],
  onTaskUpdate,
  onTaskDelete
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const priorities = ['Alta', 'Media', 'Baja'];
  const statuses = [
    { value: 'todo', label: '📋 Por hacer' },
    { value: 'progress', label: '🔄 En progreso' },
    { value: 'done', label: '✅ Completada' }
  ];

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

  useEffect(() => {
    if (isEditing && task) {
      setEditData({
        title: task.title ?? '',
        description: task.description ?? '',
        priority: task.priority ?? 'Media',
        status: task.status ?? 'todo',
        status_badge: task.status_badge || task.statusBadge || '',
        status_badge_color: task.status_badge_color || task.statusBadgeColor || '#6B7280',
        board_id: task.board_id || task.boardId || '',
        assignee_id: task.assignee_id || task.assigneeId || '',
        due_date: task.due_date || task.dueDateRaw || '',
        due_time: task.due_time || task.dueTime || ''
      });
    }
  }, [isEditing, task]);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        setLoading(true);
        await deleteTask(task.id);
        
        if (onTaskDelete) {
          onTaskDelete(task.id);
        }
        onClose();
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar la tarea');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: name === 'board_id' ? (value ? parseInt(value) : '') : value
    }));
    setError('');
  };

  const handleBadgeSelect = (badge) => {
    setEditData(prev => ({
      ...prev,
      status_badge: badge.name,
      status_badge_color: badge.color
    }));
  };

const handleSaveEdit = async (e) => {
  e.preventDefault();
  
  if (!editData.title || !editData.title.trim()) {
    setError('El título de la tarea es requerido');
    return;
  }

  setLoading(true);
  setError('');

  try {
    // Construir el payload con los tipos correctos según el backend
    const payload = {
      title: editData.title.trim(),
    };

    // Solo agregar campos que tienen valores válidos
    if (editData.description !== undefined && editData.description !== null) {
      payload.description = editData.description;
    }

    if (editData.board_id) {
      payload.board_id = parseInt(editData.board_id);
    }

    if (editData.priority) {
      payload.priority = editData.priority;
    }

    // MAPEAR status - SOLO UNA VEZ
    if (editData.status) {
      const statusMap = {
        'Sin categoría': 'todo', 
        'En progreso': 'progress',
        'En revisión': 'review',
        'Completada': 'done'
      };
      
      payload.status = statusMap[editData.status] || editData.status;
    }

    if (editData.status_badge) {
      payload.status_badge = editData.status_badge;
    }

    if (editData.status_badge_color) {
      payload.status_badge_color = editData.status_badge_color;
    }

    if (editData.assignee_id) {
      payload.assignee_id = String(editData.assignee_id);
    }

    if (editData.due_date) {
      payload.due_date = editData.due_date;
    }

    if (editData.due_time) {
      payload.due_time = editData.due_time;
    }

    if (editData.completed !== undefined && editData.completed !== null) {
      payload.completed = Boolean(editData.completed);
    }

    console.log('📤 Payload a enviar:', payload);
    console.log('🆔 Task ID:', task.id);

    const updatedTask = await updateTask(task.id, payload);
    
    if (onTaskUpdate) {
      onTaskUpdate(updatedTask);
    }
    setIsEditing(false);
    onClose();
  } catch (error) {
    console.error('❌ Error completo:', error);
    console.error('📋 Response data:', error.response?.data);
    console.error('🔢 Status:', error.response?.status);
    
    const errorMessage = error.response?.data?.detail 
      || error.response?.data?.message 
      || 'Error al actualizar la tarea';
    
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};


  const handleMoveToBoard = async (newBoardId) => {
    setLoading(true);
    try {
      const updatedTask = await moveTaskToBoard(task.id, newBoardId);
      
      if (onTaskUpdate) {
        onTaskUpdate(updatedTask);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al mover la tarea');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsEditing(false);
    setShowMenu(false);
    setError('');
    onClose();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Sin fecha';
      
      return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Sin fecha';
    }
  };

  if (!isOpen || !task) return null;

  
  //console.log('Boards disponibles:', boards);
 //console.log('Total de boards:', boards.length);

  // Validar que editData tenga valores cuando está en modo edición
  const safeEditData = {
    title: editData.title ?? '',
    description: editData.description ?? '',
    priority: editData.priority ?? 'Media',
    status: editData.status ?? 'todo',
    status_badge: editData.status_badge ?? '',
    status_badge_color: editData.status_badge_color ?? '#6B7280',
    board_id: editData.board_id ?? '',
    due_date: editData.due_date ?? '',
    due_time: editData.due_time ?? ''
  };

  const currentStatusLabel = statuses.find(s => s.value === (isEditing ? safeEditData.status : task.status))?.label || '📋 Por hacer';
  
  // Obtener el boardId correcto (camelCase o snake_case)
  const taskBoardId = task.boardId ?? task.board_id ?? '';
  
  // Obtener la fecha formateada o raw
  const displayDate = task.dueDate || formatDate(task.due_date);
  
  // Obtener status badge
  const taskStatusBadge = task.statusBadge || task.status_badge;
  const taskStatusBadgeColor = task.statusBadgeColor || task.status_badge_color;

  return (
    <div className="task-modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget && !loading) closeModal();
    }}>
      <div className="task-modal" style={{ 
        maxWidth: '650px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header - Fijo */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #f0f0f0',
          flexShrink: 0
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
            {isEditing ? `Editar Tarea ${currentStatusLabel}` : 'Detalles de Tarea'}
          </h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {!isEditing && (
              <button 
                onClick={handleMenuToggle}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  color: '#6b7280',
                  fontSize: '18px'
                }}
              >
                <FaEllipsisV />
              </button>
            )}
            <button
              onClick={closeModal}
              disabled={loading}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                padding: '8px',
                borderRadius: '4px',
                color: '#999'
              }}
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Menú desplegable */}
        {showMenu && !isEditing && (
          <div style={{
            position: 'absolute',
            top: '60px',
            right: '60px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 100,
            minWidth: '160px',
            overflow: 'hidden'
          }}>
            <button onClick={handleEdit} style={{
              width: '100%',
              padding: '12px 16px',
              background: 'white',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '14px',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <FaEdit /> Editar
            </button>
            <button onClick={handleDelete} style={{
              width: '100%',
              padding: '12px 16px',
              background: 'white',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '14px',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <FaTrash /> Eliminar
            </button>
          </div>
        )}

        {/* Body - Con scroll */}
        {!isEditing ? (
          // Vista de Detalles
          <div style={{ 
            padding: '24px',
            overflowY: 'auto',
            flex: 1
          }}>
            {/* Título */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: '#999',
                marginBottom: '8px',
                textTransform: 'uppercase',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}>
                Título
              </label>
              <h3 style={{ margin: 0, fontSize: '20px', color: '#1f2937', fontWeight: '600' }}>
                {task.title}
              </h3>
            </div>

            {/* Descripción */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: '#999',
                marginBottom: '8px',
                textTransform: 'uppercase',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}>
                Descripción
              </label>
              <p style={{ margin: 0, fontSize: '15px', color: '#4b5563', lineHeight: '1.6' }}>
                {task.description || 'Sin descripción'}
              </p>
            </div>

            {/* Grid de Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: '#999',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  Prioridad
                </label>
                <PriorityBadge priority={task.priority} />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: '#999',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  Estado
                </label>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  backgroundColor: '#f0f0f0',
                  color: '#666'
                }}>
                  {currentStatusLabel}
                </span>
              </div>
            </div>

            {/* Fechas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: '#999',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  <FaCalendarAlt /> Fecha límite
                </label>
                <p style={{ margin: 0, fontSize: '15px', color: '#4b5563' }}>
                  {displayDate}
                </p>
              </div>

              {(task.dueTime || task.due_time) && (
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    color: '#999',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    <FaClock /> Hora
                  </label>
                  <p style={{ margin: 0, fontSize: '15px', color: '#4b5563' }}>
                    {task.dueTime || task.due_time}
                  </p>
                </div>
              )}
            </div>

            {/* Tablero */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: '#999',
                marginBottom: '8px',
                textTransform: 'uppercase',
                fontWeight: '600'
              }}>
                Tablero
              </label>
              <p style={{ margin: 0, fontSize: '15px', color: '#4b5563' }}>
                {task.board || 'Sin tablero'}
              </p>
            </div>

            {/* Categoría */}
            {taskStatusBadge && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: '#999',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  Categoría
                </label>
                <StatusBadge status={taskStatusBadge} color={taskStatusBadgeColor} />
              </div>
            )}

            {/* Asignado */}
            {task.assignee && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: '#999',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  Asignado a
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {task.assignee.avatar && (
                    <img 
                      src={task.assignee.avatar} 
                      alt={task.assignee.name}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #e5e7eb'
                      }}
                    />
                  )}
                  <span style={{ fontSize: '15px', color: '#1f2937', fontWeight: '500' }}>
                    {task.assignee.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Vista de Edición
          <form onSubmit={handleSaveEdit} style={{ 
            display: 'flex', 
            flexDirection: 'column',
            flex: 1,
            overflow: 'hidden'
          }}>
            <div style={{ 
              padding: '24px',
              overflowY: 'auto',
              flex: 1
            }}>
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
                  value={safeEditData.title}
                  onChange={handleChange}
                  disabled={loading}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
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
                  value={safeEditData.description}
                  onChange={handleChange}
                  disabled={loading}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Tablero y Fecha */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#333' }}>
                    Tablero
                  </label>
                  <select
                    name="board_id"
                    value={safeEditData.board_id || ''}
                    onChange={handleChange}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">Sin tablero</option>
                    {boards.map(board => (
                      <option key={board.id} value={board.id}>
                        {board.icon && `${board.icon} `}{board.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#333' }}>
                    Fecha límite
                  </label>
                  <input
                    type="date"
                    name="due_date"
                    value={safeEditData.due_date}
                    onChange={handleChange}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              {/* Hora */}
              {safeEditData.due_date && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#333' }}>
                    ⏰ Hora de vencimiento
                  </label>
                  <input
                    type="time"
                    name="due_time"
                    value={safeEditData.due_time}
                    onChange={handleChange}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              )}

              {/* Prioridad y Estado */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#333' }}>
                    Prioridad
                  </label>
                  <select
                    name="priority"
                    value={safeEditData.priority}
                    onChange={handleChange}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#333' }}>
                    Estado
                  </label>
                  <select
                    name="status"
                    value={safeEditData.status}
                    onChange={handleChange}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    {statuses.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Categorías */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#333' }}>
                  Categoría (opcional)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {badges.map(badge => (
                    <button
                      key={badge.name}
                      type="button"
                      onClick={() => handleBadgeSelect(badge)}
                      disabled={loading}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: safeEditData.status_badge === badge.name ? `2px solid ${badge.color}` : '1px solid #f0f0f0',
                        backgroundColor: safeEditData.status_badge === badge.name ? `${badge.color}15` : 'white',
                        color: badge.color,
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      {badge.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mover tablero - Solo en modo edición */}
              <div style={{
                padding: '16px',
                backgroundColor: '#f0f9ff',
                borderRadius: '8px',
                border: '1px solid #bae7ff',
                marginBottom: '20px'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1890ff',
                  marginBottom: '12px'
                }}>
                  <FaExchangeAlt /> Mover a otro tablero
                </label>
                <select 
                  value={taskBoardId}
                  onChange={(e) => handleMoveToBoard(e.target.value ? parseInt(e.target.value) : null)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  <option value="">Sin tablero</option>
                  {boards.map(board => (
                    <option key={board.id} value={board.id}>
                      {board.icon && `${board.icon} `}{board.name}
                    </option>
                  ))}
                </select>
                <p style={{
                  fontSize: '12px',
                  color: '#666',
                  marginTop: '8px',
                  marginBottom: 0
                }}>
                  💡 Puedes mover esta tarea a otro tablero sin guardar los cambios
                </p>
              </div>

              {/* Vista previa */}
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
                  fontWeight: '600'
                }}>
                  Vista previa
                </p>
                <div>
                  <p style={{ margin: '0 0 8px 0', fontWeight: '600', fontSize: '16px', color: '#333' }}>
                    {safeEditData.title || 'Título de la tarea'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {safeEditData.status_badge && (
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        backgroundColor: `${safeEditData.status_badge_color}15`,
                        color: safeEditData.status_badge_color
                      }}>
                        {safeEditData.status_badge}
                      </span>
                    )}
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500',
                      backgroundColor: 
                        safeEditData.priority === 'Alta' ? '#ff4d4f15' :
                        safeEditData.priority === 'Media' ? '#faad1415' :
                        '#52c41a15',
                      color:
                        safeEditData.priority === 'Alta' ? '#ff4d4f' :
                        safeEditData.priority === 'Media' ? '#faad14' :
                        '#52c41a'
                    }}>
                      {safeEditData.priority}
                    </span>
                    {safeEditData.due_date && (
                      <span style={{ fontSize: '11px', color: '#999' }}>
                        📅 {safeEditData.due_date} {safeEditData.due_time && `⏰ ${safeEditData.due_time}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fijo */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              flexShrink: 0
            }}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
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
                disabled={loading || !safeEditData.title || !safeEditData.title.trim()}
                style={{
                  padding: '8px 24px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: loading || !safeEditData.title || !safeEditData.title.trim() ? '#d9d9d9' : '#1890ff',
                  color: 'white',
                  cursor: loading || !safeEditData.title || !safeEditData.title.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditTaskModal;