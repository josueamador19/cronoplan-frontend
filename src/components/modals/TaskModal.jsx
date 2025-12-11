// src/components/modals/TaskModal.jsx
import React, { useState, useEffect } from 'react';
import TaskModalHeader from './TaskModalHeader';
import TaskDescription from './TaskDescription';
import TaskSubtasks from './TaskSubtasks';
import TaskLabels from './TaskLabels';
import TaskAttachments from './TaskAttachments';
import TaskSidebar from './TaskSidebar';
import Button from '../ui/Button';
import '../../styles/modal.css';

const TaskModal = ({ task, isOpen, onClose, onSave }) => {
  const [taskData, setTaskData] = useState(task);

  useEffect(() => {
    setTaskData(task);
  }, [task]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubtaskToggle = (subtaskId) => {
    const updatedSubtasks = taskData.subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    setTaskData({ ...taskData, subtasks: updatedSubtasks });
  };

  const handleDescriptionChange = (newDescription) => {
    setTaskData({ ...taskData, description: newDescription });
  };

  const handleCommentAdd = (comment) => {
    console.log('New comment:', comment);
    alert(`Comentario agregado: ${comment}`);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(taskData);
    }
    onClose();
  };

  // Usuario actual (ejemplo)
  const currentUser = {
    name: 'Usuario Actual',
    avatar: 'https://i.pravatar.cc/150?img=12'
  };

  return (
    <div className="task-modal-overlay" onClick={handleOverlayClick}>
      <div className="task-modal">
        <TaskModalHeader
          board={taskData.board}
          boardIcon={taskData.boardIcon}
          status={taskData.status}
          statusColor={taskData.statusColor}
          priority={taskData.priority}
          onPriorityChange={() => alert('Cambiar prioridad')}
          onMove={() => alert('Mover tarea')}
          onClose={onClose}
        />

        <div className="task-modal-body">
          <div className="task-modal-main">
            <TaskDescription
              description={taskData.description}
              onChange={handleDescriptionChange}
            />

            <TaskSubtasks
              subtasks={taskData.subtasks}
              onToggle={handleSubtaskToggle}
              onAdd={() => alert('Añadir subtarea')}
            />

            <TaskLabels
              labels={taskData.labels}
              onAdd={() => alert('Añadir etiqueta')}
              onRemove={(id) => console.log('Remove label:', id)}
            />

            <TaskAttachments
              attachments={taskData.attachments}
              onUpload={() => alert('Upload file')}
              onDelete={(id) => console.log('Delete attachment:', id)}
            />
          </div>

          <TaskSidebar
            dueDate={taskData.dueDate}
            dueDateFormatted={taskData.dueDateFormatted}
            daysLeft={taskData.daysLeft}
            reminder={taskData.reminder}
            assignee={taskData.assignee}
            activity={taskData.activity}
            currentUser={currentUser}
            onDateChange={() => alert('Cambiar fecha')}
            onReminderChange={() => alert('Cambiar recordatorio')}
            onAssigneeChange={() => alert('Cambiar asignado')}
            onCommentAdd={handleCommentAdd}
          />
        </div>

        <div className="task-modal-footer">
          <div className="autosave-text">
            ✓ Cambios guardados automáticamente
          </div>
          <Button variant="primary" onClick={handleSave}>
            Guardar cambios
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;