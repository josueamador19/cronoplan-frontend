// src/components/modals/SubtaskItem.jsx
import React from 'react';

const SubtaskItem = ({ subtask, onToggle }) => {
  return (
    <li className="subtask-item">
      <input
        type="checkbox"
        className="subtask-checkbox"
        checked={subtask.completed}
        onChange={() => onToggle(subtask.id)}
      />
      <span className={`subtask-text ${subtask.completed ? 'completed' : ''}`}>
        {subtask.text}
      </span>
      {subtask.assignee && (
        <img
          src={subtask.assignee.avatar}
          alt={subtask.assignee.name}
          className="subtask-avatar"
          title={subtask.assignee.name}
        />
      )}
    </li>
  );
};

export default SubtaskItem;