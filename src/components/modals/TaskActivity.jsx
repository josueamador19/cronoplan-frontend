// src/components/modals/TaskActivity.jsx
import React from 'react';

const TaskActivity = ({ activities = [], onFilter }) => {
  return (
    <div className="sidebar-section">
      <div className="activity-header">
        <label className="sidebar-label" style={{ marginBottom: 0 }}>
          Actividad
        </label>
        <button className="filter-btn" onClick={onFilter}>
          Filtrar
        </button>
      </div>

      <ul className="activity-list">
        {activities.map(activity => (
          <li key={activity.id} className="activity-item">
            {activity.user.avatar ? (
              <img
                src={activity.user.avatar}
                alt={activity.user.name}
                className="activity-avatar"
              />
            ) : (
              <div className="system-activity-icon">
                🔔
              </div>
            )}

            <div className="activity-content">
              <div className="activity-text">
                <span className="activity-user">{activity.user.name}</span>
                {' '}{activity.action}{' '}
                {activity.detail && (
                  <span className="activity-detail">{activity.detail}</span>
                )}
              </div>

              {activity.attachment && (
                <div className="activity-attachment">
                  <span>{activity.attachment.icon}</span>
                  <span>{activity.attachment.name}</span>
                </div>
              )}

              <div className="activity-timestamp">{activity.timestamp}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskActivity;