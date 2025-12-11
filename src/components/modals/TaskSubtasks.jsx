// src/components/modals/TaskSubtasks.jsx
import React from 'react';
import { FaCheckSquare, FaPlus } from 'react-icons/fa';
import SubtaskItem from './SubTaskItem';

const TaskSubtasks = ({ subtasks = [], onToggle, onAdd }) => {
  const completedCount = subtasks.filter(st => st.completed).length;
  const totalCount = subtasks.length;

  return (
    <div className="task-section">
      <div className="subtasks-header">
        <div className="task-section-header" style={{ marginBottom: 0 }}>
          <FaCheckSquare className="task-section-icon" />
          <h3 className="task-section-title">
            <span className="subtasks-title-wrapper">
              Subtareas
              <span className="subtasks-count">{completedCount}/{totalCount}</span>
            </span>
          </h3>
        </div>
      </div>

      <ul className="subtask-list">
        {subtasks.map(subtask => (
          <SubtaskItem
            key={subtask.id}
            subtask={subtask}
            onToggle={onToggle}
          />
        ))}
      </ul>

      <button className="add-subtask-btn" onClick={onAdd}>
        <FaPlus />
        Añadir subtarea...
      </button>
    </div>
  );
};

export default TaskSubtasks;