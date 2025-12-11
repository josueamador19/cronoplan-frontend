// src/components/modals/TaskSidebar.jsx
import React from 'react';
import { FaCalendarAlt, FaBell, FaPlus } from 'react-icons/fa';
import TaskActivity from './TaskActivity';
import CommentBox from '../ui/CommentBox';

const TaskSidebar = ({
  dueDate,
  dueDateFormatted,
  daysLeft,
  reminder,
  assignee,
  activity,
  currentUser,
  onDateChange,
  onReminderChange,
  onAssigneeChange,
  onCommentAdd
}) => {
  return (
    <div className="task-modal-sidebar">
      {/* Fecha de entrega */}
      <div className="sidebar-section">
        <label className="sidebar-label">Fecha de entrega</label>
        <div className="date-picker-field" onClick={onDateChange}>
          <FaCalendarAlt />
          <span className="date-value">{dueDateFormatted}</span>
        </div>
        {daysLeft !== undefined && (
          <div className="date-indicator">{daysLeft} días</div>
        )}
      </div>

      {/* Recordatorio */}
      <div className="sidebar-section">
        <label className="sidebar-label">Recordatorio</label>
        <div className="reminder-select" onClick={onReminderChange}>
          <FaBell />
          <span>{reminder}</span>
        </div>
      </div>

      {/* Asignado a */}
      <div className="sidebar-section">
        <label className="sidebar-label">Asignado a</label>
        <div className="assignee-section">
          <div className="assignee-card">
            <img
              src={assignee.avatar}
              alt={assignee.name}
              className="assignee-avatar"
            />
            <span className="assignee-name">{assignee.name}</span>
          </div>
          <button className="add-assignee-btn" onClick={onAssigneeChange}>
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Actividad */}
      <TaskActivity activities={activity} onFilter={() => console.log('Filter')} />

      {/* Comentarios */}
      <CommentBox user={currentUser} onSubmit={onCommentAdd} />
    </div>
  );
};

export default TaskSidebar;