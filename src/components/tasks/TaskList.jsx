// src/components/tasks/TaskList.jsx
import React, { useState } from 'react';
import TaskRow from './TaskRow';
import TaskFilters from './TaskFilters';
import '../../styles/TaskList.css';

// Iconos SVG simples
const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const ChevronDownIcon = ({ isOpen }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{
    transition: 'transform 0.2s',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0)'
  }}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

// Componente de filtros desplegables
const FilterDropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          background: value ? '#eff6ff' : 'white',
          cursor: 'pointer',
          fontSize: '0.875rem',
          color: value ? '#1d4ed8' : '#374151',
          fontWeight: value ? '500' : '400',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          if (!value) e.currentTarget.style.borderColor = '#d1d5db';
        }}
        onMouseLeave={(e) => {
          if (!value) e.currentTarget.style.borderColor = '#e5e7eb';
        }}
      >
        <span>{label}</span>
        <ChevronDownIcon isOpen={isOpen} />
      </button>
      
      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setIsOpen(false)}
          />
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '6px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            minWidth: '200px',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1000
          }}>
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value === value ? null : option.value);
                  setIsOpen(false);
                }}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  background: option.value === value ? '#eff6ff' : 'white',
                  color: option.value === value ? '#1d4ed8' : '#374151',
                  fontWeight: option.value === value ? '500' : '400',
                  fontSize: '0.875rem',
                  borderBottom: '1px solid #f3f4f6',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => {
                  if (option.value !== value) {
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (option.value !== value) {
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const TaskList = ({ tasks = [], filters = [], onFilterRemove, onClearFilters }) => {
  const [activeView, setActiveView] = useState('list');
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [boardFilter, setBoardFilter] = useState(null);

  // Opciones para los filtros
  const priorityOptions = [
    { value: 'Alta', label: 'Alta' },
    { value: 'Media', label: 'Media' },
    { value: 'Baja', label: 'Baja' }
  ];

  const dateOptions = [
    { value: 'hoy', label: 'Hoy' },
    { value: 'esta-semana', label: 'Esta semana' },
    { value: 'este-mes', label: 'Este mes' },
    { value: 'vencidas', label: 'Vencidas' }
  ];

  // Obtener tableros únicos de las tareas
  const uniqueBoards = [...new Set(tasks.map(t => t.board).filter(Boolean))];
  const boardOptions = [
    { value: 'sin-tablero', label: 'Sin tablero' },
    ...uniqueBoards.map(board => ({ value: board, label: board }))
  ];

  // Función de filtrado
  const getFilteredTasks = () => {
    return tasks.filter(task => {
      // Filtro por prioridad
      if (priorityFilter && task.priority !== priorityFilter) {
        return false;
      }

      // Filtro por fecha
      if (dateFilter) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let taskDate = null;
        if (task.dueDate && task.dueDate !== 'Sin fecha') {
          // Parsear diferentes formatos de fecha
          if (task.dueDate === 'Hoy') {
            taskDate = new Date();
          } else if (task.dueDate === 'Ayer') {
            taskDate = new Date();
            taskDate.setDate(taskDate.getDate() - 1);
          } else if (task.dueDate === 'Vencida') {
            // Para "Vencida" no podemos determinar la fecha exacta
            if (dateFilter === 'vencidas') return true;
            return false;
          } else {
            // Intentar parsear fecha en formato "15 dic 2024"
            taskDate = new Date(task.dueDate);
          }
          taskDate?.setHours(0, 0, 0, 0);
        }
        
        if (dateFilter === 'hoy') {
          if (!taskDate || taskDate.getTime() !== today.getTime()) return false;
        } else if (dateFilter === 'esta-semana') {
          if (!taskDate) return false;
          const weekFromNow = new Date(today);
          weekFromNow.setDate(today.getDate() + 7);
          if (taskDate < today || taskDate > weekFromNow) return false;
        } else if (dateFilter === 'este-mes') {
          if (!taskDate) return false;
          if (taskDate.getMonth() !== today.getMonth() || taskDate.getFullYear() !== today.getFullYear()) return false;
        } else if (dateFilter === 'vencidas') {
          if (task.dueDate === 'Vencida') return true;
          if (!taskDate || taskDate >= today) return false;
        }
      }

      // Filtro por tablero
      if (boardFilter) {
        if (boardFilter === 'sin-tablero') {
          if (task.board && task.board !== 'Sin tablero') return false;
        } else {
          if (task.board !== boardFilter) return false;
        }
      }

      return true;
    });
  };

  // Crear array de filtros activos para mostrar chips
  const getActiveFiltersForDisplay = () => {
    const displayFilters = [...filters]; // Mantener filtros externos
    
    if (priorityFilter) {
      displayFilters.push({
        id: 'priority-local',
        label: 'Prioridad',
        value: priorityFilter
      });
    }
    if (dateFilter) {
      displayFilters.push({
        id: 'date-local',
        label: 'Fecha',
        value: dateOptions.find(o => o.value === dateFilter)?.label
      });
    }
    if (boardFilter) {
      displayFilters.push({
        id: 'board-local',
        label: 'Tablero',
        value: boardOptions.find(o => o.value === boardFilter)?.label
      });
    }
    
    return displayFilters;
  };

  const handleRemoveFilterLocal = (filterId) => {
    if (filterId === 'priority-local') {
      setPriorityFilter(null);
    } else if (filterId === 'date-local') {
      setDateFilter(null);
    } else if (filterId === 'board-local') {
      setBoardFilter(null);
    } else {
      // Es un filtro externo
      onFilterRemove && onFilterRemove(filterId);
    }
  };

  const handleClearAllLocal = () => {
    setPriorityFilter(null);
    setDateFilter(null);
    setBoardFilter(null);
    onClearFilters && onClearFilters();
  };

  const handleTaskCheck = (taskId) => {
    console.log('Task checked:', taskId);
  };

  const handleTaskEdit = (task) => {
    console.log('Task edit:', task);
  };

  const filteredTasks = getFilteredTasks();
  const displayFilters = getActiveFiltersForDisplay();

  return (
    <div className="task-list-container">
      {/* Filtros desplegables */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '16px',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '0 4px'
      }}>
        <FilterIcon />
        <FilterDropdown
          label="Prioridad"
          options={priorityOptions}
          value={priorityFilter}
          onChange={setPriorityFilter}
        />
        <FilterDropdown
          label="Fecha de entrega"
          options={dateOptions}
          value={dateFilter}
          onChange={setDateFilter}
        />
        <FilterDropdown
          label="Tablero"
          options={boardOptions}
          value={boardFilter}
          onChange={setBoardFilter}
        />
      </div>

      {/* Chips de filtros activos */}
      <TaskFilters 
        activeFilters={displayFilters}
        onRemoveFilter={handleRemoveFilterLocal}
        onClearAll={handleClearAllLocal}
      />

      <div className="task-list-header">
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>
          Tareas {filteredTasks.length !== tasks.length && `(${filteredTasks.length})`}
        </h3>
      </div>

      <table className="task-table">
        <thead>
          <tr>
            <th style={{ width: '40px' }}></th>
            <th>Tarea</th>
            <th>Prioridad</th>
            <th>Fecha límite</th>
            <th>Tablero</th>
            <th style={{ width: '60px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskRow 
                key={task.id}
                task={task}
                onCheck={handleTaskCheck}
                onEdit={handleTaskEdit}
              />
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{
                padding: '40px',
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '0.9rem'
              }}>
                No se encontraron tareas con los filtros seleccionados
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="task-pagination">
        <div className="pagination-info">
          Mostrando {filteredTasks.length} de {tasks.length} actividades
        </div>
        <div className="pagination-controls">
          <button className="pagination-btn" disabled>
            Anterior
          </button>
          <button className="pagination-btn" disabled>
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskList;