import React from 'react';
import TaskCard from './TaskCard';

/**
 * TaskList Component
 * Renders a list area for tasks
 */
const TaskList = ({ tasks, onTaskClick, onDeleteTask }) => {
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
        <h4 className="list-title">Today's Tasks</h4>
        <div className="list-items">
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={onTaskClick} 
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
