import React from 'react';
import TaskCard from './TaskCard';

/**
 * TaskList Component
 * Renders a list area for tasks
 */
const TaskList = ({ title, tasks, onTaskClick, onDeleteTask, onUpdateStatus, onToggleFavourite }) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📂</div>
        <h3>No tasks found</h3>
        <p>You're all caught up! Create a new task to get started.</p>
      </div>
    );
  }

  return (
    <div className="task-list-v2">
      <div className="list-group">
        <h4 className="list-title-v2">{title}</h4>
        <div className="list-items">
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={onTaskClick} 
              onDelete={onDeleteTask}
              onUpdateStatus={onUpdateStatus}
              onToggleFavourite={onToggleFavourite}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
