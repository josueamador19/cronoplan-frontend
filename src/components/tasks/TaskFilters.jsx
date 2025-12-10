// src/components/tasks/TaskFilters.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const TaskFilters = ({ activeFilters = [], onRemoveFilter, onClearAll }) => {
  if (activeFilters.length === 0) return null;

  return (
    <div className="task-filters">
      {activeFilters.map((filter, index) => (
        <div key={index} className="filter-chip">
          <span className="filter-chip-label">{filter.label}:</span>
          <span>{filter.value}</span>
          <span 
            className="filter-chip-close"
            onClick={() => onRemoveFilter && onRemoveFilter(filter.id)}
          >
            <FaTimes />
          </span>
        </div>
      ))}
      
      {activeFilters.length > 0 && (
        <button 
          className="clear-filters"
          onClick={onClearAll}
        >
          Limpiar todo
        </button>
      )}
    </div>
  );
};

export default TaskFilters;