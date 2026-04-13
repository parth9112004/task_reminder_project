import React, { useEffect, useState } from 'react';
import { FiX, FiGrid } from 'react-icons/fi';
import TaskForm from './TaskForm';

/**
 * TaskPanel Component
 * Slide-in drawer that hosts the TaskForm
 */
const TaskPanel = ({ isOpen, onClose, onSave, taskToEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    priority: 'Medium',
    status: 'Pending',
    reminder: false,
    notifications: { alert: true, sound: false, popup: true }
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData(taskToEdit);
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        priority: 'Medium',
        status: 'Pending',
        reminder: false,
        notifications: { alert: true, sound: false, popup: true }
      });
    }
  }, [taskToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('notif_')) {
      const key = name.split('_')[1];
      setFormData(prev => ({
        ...prev,
        notifications: { ...prev.notifications, [key]: checked }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={`task_panel_overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className={`task-panel-content ${isOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="panel-header">
          <h2>{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>

        <TaskForm 
          formData={formData} 
          handleChange={handleChange} 
          handleSubmit={handleSubmit} 
          isEdit={!!taskToEdit} 
        />
      </div>
    </div>
  );
};

export default TaskPanel;
