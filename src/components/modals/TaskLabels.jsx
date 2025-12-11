// src/components/modals/TaskLabels.jsx
import React from 'react';
import { FaTag, FaPlus } from 'react-icons/fa';

const TaskLabels = ({ labels = [], onAdd, onRemove }) => {
  return (
    <div className="task-section">
      <div className="task-section-header">
        <FaTag className="task-section-icon" />
        <h3 className="task-section-title">Etiquetas</h3>
      </div>

      <div className="task-labels">
        {labels.map(label => (
          <span
            key={label.id}
            className="task-label"
            style={{
              backgroundColor: `${label.color}20`,
              color: label.color
            }}
            onClick={() => onRemove && onRemove(label.id)}
            title="Click para remover"
          >
            {label.icon} {label.name}
          </span>
        ))}
        <button className="add-label-btn" onClick={onAdd}>
          <FaPlus />
          Añadir etiqueta
        </button>
      </div>
    </div>
  );
};

export default TaskLabels;