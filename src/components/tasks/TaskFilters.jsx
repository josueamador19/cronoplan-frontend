// src/components/tasks/TaskFilters.jsx
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

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

const TaskFilters = ({ 
  tasks = [],
  activeFilters = [], 
  onFilterRemove, 
  onClearAll,
  priorityFilter,
  dateFilter,
  boardFilter,
  onPriorityChange,
  onDateChange,
  onBoardChange
}) => {
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

  // Obtener tableros únicos de las tareas (excluyendo "Sin tablero")
  const uniqueBoards = [...new Set(
    tasks
      .map(t => t.board)
      .filter(board => board && board !== 'Sin tablero')
  )];
  const boardOptions = [
    { value: 'sin-tablero', label: 'Sin tablero' },
    ...uniqueBoards.map(board => ({ value: board, label: board }))
  ];

  // Crear array de filtros activos para mostrar chips
  const getActiveFiltersForDisplay = () => {
    const displayFilters = [...activeFilters]; // Mantener filtros externos
    
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
        value: dateOptions.find(o => o.value === dateFilter)?.label || dateFilter
      });
    }
    if (boardFilter) {
      displayFilters.push({
        id: 'board-local',
        label: 'Tablero',
        value: boardOptions.find(o => o.value === boardFilter)?.label || boardFilter
      });
    }
    
    return displayFilters;
  };

  const handleRemoveFilter = (filterId) => {
    if (filterId === 'priority-local') {
      onPriorityChange && onPriorityChange(null);
    } else if (filterId === 'date-local') {
      onDateChange && onDateChange(null);
    } else if (filterId === 'board-local') {
      onBoardChange && onBoardChange(null);
    } else {
      // Es un filtro externo
      onFilterRemove && onFilterRemove(filterId);
    }
  };

  const handleClearAll = () => {
    onPriorityChange && onPriorityChange(null);
    onDateChange && onDateChange(null);
    onBoardChange && onBoardChange(null);
    onClearAll && onClearAll();
  };

  const displayFilters = getActiveFiltersForDisplay();

  return (
    <div style={{ marginBottom: '20px' }}>
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
          onChange={onPriorityChange}
        />
        <FilterDropdown
          label="Fecha de entrega"
          options={dateOptions}
          value={dateFilter}
          onChange={onDateChange}
        />
        <FilterDropdown
          label="Tablero"
          options={boardOptions}
          value={boardFilter}
          onChange={onBoardChange}
        />
      </div>

      {/* Chips de filtros activos */}
      {displayFilters.length > 0 && (
        <div className="task-filters">
          {displayFilters.map((filter) => (
            <div key={filter.id} className="filter-chip">
              <span className="filter-chip-label">{filter.label}:</span>
              <span>{filter.value}</span>
              <span 
                className="filter-chip-close"
                onClick={() => handleRemoveFilter(filter.id)}
              >
                <FaTimes />
              </span>
            </div>
          ))}
          
          <button 
            className="clear-filters"
            onClick={handleClearAll}
          >
            Limpiar todo
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;