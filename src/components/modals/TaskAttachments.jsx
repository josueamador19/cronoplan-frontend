// src/components/modals/TaskAttachments.jsx
import React from 'react';
import { FaPaperclip, FaTrash } from 'react-icons/fa';

const TaskAttachments = ({ attachments = [], onUpload, onDelete }) => {
  return (
    <div className="task-section">
      <div className="task-section-header">
        <FaPaperclip className="task-section-icon" />
        <h3 className="task-section-title">Adjuntos</h3>
      </div>

      <div className="attachment-list">
        {attachments.map(attachment => (
          <div key={attachment.id} className="attachment-item">
            <div className="attachment-info">
              <div className="attachment-icon">
                {attachment.icon}
              </div>
              <div className="attachment-details">
                <div className="attachment-name">{attachment.name}</div>
                <div className="attachment-meta">{attachment.uploadedAt}</div>
              </div>
            </div>
            <button
              className="delete-attachment-btn"
              onClick={() => onDelete && onDelete(attachment.id)}
            >
              <FaTrash />
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskAttachments;