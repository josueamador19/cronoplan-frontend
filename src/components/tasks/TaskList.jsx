import React, { useState } from 'react';
import TaskRow from './TaskRow';
import TaskFilters from './TaskFilters';
import EditTaskModal from '../modals/EditTaskModal';
import '../../styles/TaskList.css';

const TaskList = ({ 
  tasks = [], 
  filters = [], 
  onFilterRemove, 
  onClearFilters,
  boards = [],
  onTaskUpdate,
  onTaskDelete 
}) => {
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [boardFilter, setBoardFilter] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función de filtrado
  const getFilteredTasks = () => {
    return tasks.filter(task => {
      // Filtro por prioridad
      if (priorityFilter && task.priority !== priorityFilter) {
        return false;
      }

      // Filtro por fecha
      if (dateFilter) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Si la tarea no tiene fecha, no pasa ningún filtro de fecha
        if (!task.dueDate || task.dueDate === 'Sin fecha') {
          return false;
        }

        // Para tareas marcadas como "Vencida"
        if (task.dueDate === 'Vencida') {
          return dateFilter === 'vencidas';
        }

        let taskDate = null;
        
        // Parsear diferentes formatos de fecha
        if (task.dueDate === 'Hoy') {
          taskDate = new Date();
          taskDate.setHours(0, 0, 0, 0);
        } else if (task.dueDate === 'Ayer') {
          taskDate = new Date();
          taskDate.setDate(taskDate.getDate() - 1);
          taskDate.setHours(0, 0, 0, 0);
        } else {
          // Intentar parsear fechas en diferentes formatos
          // Formato: "24 dic 2025", "8 ene 2026", etc.
          const meses = {
            'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
            'jul': 6, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
          };
          
          const match = task.dueDate.match(/(\d+)\s+(\w+)\s+(\d+)/);
          if (match) {
            const [, dia, mes, año] = match;
            const mesNum = meses[mes.toLowerCase()];
            if (mesNum !== undefined) {
              taskDate = new Date(parseInt(año), mesNum, parseInt(dia));
              taskDate.setHours(0, 0, 0, 0);
            }
          } else {
            // Intentar parseo estándar
            taskDate = new Date(task.dueDate);
            if (isNaN(taskDate.getTime())) {
              taskDate = null;
            } else {
              taskDate.setHours(0, 0, 0, 0);
            }
          }
        }
        
        // Si no se pudo parsear la fecha, no aplicar filtro
        if (!taskDate || isNaN(taskDate.getTime())) {
          return false;
        }
        
        if (dateFilter === 'hoy') {
          return taskDate.getTime() === today.getTime();
        } else if (dateFilter === 'esta-semana') {
          const endOfWeek = new Date(today);
          endOfWeek.setDate(today.getDate() + 7);
          return taskDate >= today && taskDate <= endOfWeek;
        } else if (dateFilter === 'este-mes') {
          return taskDate.getMonth() === today.getMonth() && 
                 taskDate.getFullYear() === today.getFullYear() &&
                 taskDate >= today;
        } else if (dateFilter === 'vencidas') {
          return taskDate < today;
        }
      }

      // Filtro por tablero
      if (boardFilter) {
        if (boardFilter === 'sin-tablero') {
          if (task.board && task.board !== 'Sin tablero') return false;
        } else {
          if (task.board !== boardFilter) return false;
        }
      }

      return true;
    });
  };

  const handleTaskCheck = (taskId) => {
    console.log('Task checked:', taskId);
  };

  const handleTaskEdit = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleTaskDelete = (taskId) => {
    if (onTaskDelete) {
      onTaskDelete(taskId);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskUpdated = (updatedTask) => {
    if (onTaskUpdate) {
      onTaskUpdate(updatedTask);
    }
    handleModalClose();
  };

  const handleTaskDeleted = (taskId) => {
    if (onTaskDelete) {
      onTaskDelete(taskId);
    }
    handleModalClose();
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="task-list-container">
      {/* Componente de filtros */}
      <TaskFilters 
        tasks={tasks}
        activeFilters={filters}
        onFilterRemove={onFilterRemove}
        onClearAll={onClearFilters}
        priorityFilter={priorityFilter}
        dateFilter={dateFilter}
        boardFilter={boardFilter}
        onPriorityChange={setPriorityFilter}
        onDateChange={setDateFilter}
        onBoardChange={setBoardFilter}
      />

      <div className="task-list-header">
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>
          Tareas {filteredTasks.length !== tasks.length && `(${filteredTasks.length})`}
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
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskRow 
                key={task.id}
                task={task}
                onCheck={handleTaskCheck}
                onEdit={handleTaskEdit}
                onDelete={handleTaskDelete}
              />
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{
                padding: '40px',
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '0.9rem'
              }}>
                No se encontraron tareas con los filtros seleccionados
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="task-pagination">
        <div className="pagination-info">
          Mostrando {filteredTasks.length} de {tasks.length} actividades
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

      {/* Modal de Edición */}
      <EditTaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        task={selectedTask}
        boards={boards}
        onTaskUpdate={handleTaskUpdated}
        onTaskDelete={handleTaskDeleted}
      />
    </div>
  );
};

export default TaskList;