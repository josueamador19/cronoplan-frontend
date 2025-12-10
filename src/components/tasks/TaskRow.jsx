// src/components/tasks/TaskRow.jsx
import React from 'react';
import { FaCalendarAlt, FaEllipsisV } from 'react-icons/fa';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

const TaskRow = ({ task, onCheck, onEdit }) => {
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
          <StatusBadge status={task.status} color={task.statusColor} />
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
        <button 
          className="task-actions-btn"
          onClick={() => onEdit && onEdit(task)}
        >
          <FaEllipsisV />
        </button>
      </td>
    </tr>
  );
};

export default TaskRow;