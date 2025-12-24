// src/components/tasks/TaskRow.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaCalendarAlt, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

const TaskRow = ({ task, onCheck, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleEdit = () => {
    setShowDropdown(false);
    onEdit && onEdit(task);
  };

  const handleDelete = () => {
    setShowDropdown(false);
    if (window.confirm(`¿Estás seguro de eliminar la tarea "${task.title}"?`)) {
      onDelete && onDelete(task.id);
    }
  };

  return (
    <tr className="task-row">
      <td>
        <input 
          type="checkbox" 
          className="task-checkbox"
          checked={task.completed}
          onChange={() => onCheck && onCheck(task.id)}
        />
      </td>
      <td>
        <div className="task-title-cell">
          <span className="task-title">{task.title}</span>
          <div className="mobile-task-info">
            <StatusBadge status={task.status} color={task.statusColor} />
            <PriorityBadge priority={task.priority} />
            <div className="task-date">
              <FaCalendarAlt />
              <span>{task.dueDate}</span>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              {task.board}
            </span>
          </div>
        </div>
      </td>
      <td>
        <PriorityBadge priority={task.priority} />
      </td>
      <td>
        <div className="task-date">
          <FaCalendarAlt />
          <span>{task.dueDate}</span>
        </div>
      </td>
      <td>
        <span>{task.board}</span>
      </td>
      <td>
        <div style={{ position: 'relative' }}>
          <button 
            ref={buttonRef}
            className="task-actions-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaEllipsisV />
          </button>

          {showDropdown && (
            <div 
              ref={dropdownRef}
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                zIndex: 1000,
                minWidth: '150px',
                overflow: 'hidden'
              }}
            >
              <button 
                onClick={handleEdit}
                style={{
                  width: '100%',
                  padding: '10px 16px',
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
                <FaEdit size={14} /> Ver
              </button>
              <button 
                onClick={handleDelete}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'background 0.2s',
                  borderTop: '1px solid #f3f4f6'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <FaTrash size={14} /> Eliminar
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TaskRow;