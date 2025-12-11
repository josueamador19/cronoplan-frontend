// src/components/modals/TaskDescription.jsx
import React, { useState } from 'react';
import { FaAlignLeft, FaBold, FaItalic, FaListUl } from 'react-icons/fa';

const TaskDescription = ({ description, onChange, readOnly = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(description);

  const handleChange = (e) => {
    setContent(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <div className="task-section">
      <div className="task-section-header">
        <FaAlignLeft className="task-section-icon" />
        <h3 className="task-section-title">Descripción</h3>
      </div>

      <div className="task-description-editor">
        {!readOnly && (
          <div className="task-description-toolbar">
            <button className="toolbar-btn" title="Negrita">
              <FaBold />
            </button>
            <button className="toolbar-btn" title="Cursiva">
              <FaItalic />
            </button>
            <button className="toolbar-btn" title="Lista">
              <FaListUl />
            </button>
          </div>
        )}

        {isEditing && !readOnly ? (
          <textarea
            className="task-description-content"
            value={content}
            onChange={handleChange}
            onBlur={() => setIsEditing(false)}
            autoFocus
            style={{
              width: '100%',
              minHeight: '150px',
              border: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              resize: 'vertical'
            }}
          />
        ) : (
          <div 
            className="task-description-content"
            onClick={() => !readOnly && setIsEditing(true)}
            style={{ cursor: readOnly ? 'default' : 'pointer' }}
          >
            {content}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDescription;