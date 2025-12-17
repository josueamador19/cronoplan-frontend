// src/components/tasks/TaskList.jsx
import React, { useState } from 'react';
import { FaList, FaThLarge, FaSortAmountDown } from 'react-icons/fa';
import TaskRow from './TaskRow';
import TaskFilters from './TaskFilters';
import '../../styles/TaskList.css';

const TaskList = ({ tasks = [], filters = [], onFilterRemove, onClearFilters }) => {
  const [activeView, setActiveView] = useState('list');

  const handleTaskCheck = (taskId) => {
    console.log('Task checked:', taskId);
  };

  const handleTaskEdit = (task) => {
    console.log('Task edit:', task);
  };

  return (
    <div className="task-list-container">
      <TaskFilters 
        activeFilters={filters}
        onRemoveFilter={onFilterRemove}
        onClearAll={onClearFilters}
      />

      <div className="task-list-header">
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>
          Tareas
        </h3>
        
      </div>

      <table className="task-table">
        <thead>
          <tr>
            <th style={{ width: '40px' }}></th>
            <th>Tarea</th>
            <th>Prioridad</th>
            <th>Fecha límite</th>
            <th>Tablero</th>
            <th style={{ width: '60px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <TaskRow 
              key={task.id}
              task={task}
              onCheck={handleTaskCheck}
              onEdit={handleTaskEdit}
            />
          ))}
        </tbody>
      </table>

      <div className="task-pagination">
        <div className="pagination-info">
          Mostrando {tasks.length} de {tasks.length} actividades
        </div>
        <div className="pagination-controls">
          <button className="pagination-btn" disabled>
            Anterior
          </button>
          <button className="pagination-btn" disabled>
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskList;