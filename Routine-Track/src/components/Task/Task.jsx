import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import TaskList from './TaskList';
import TaskPanel from './TaskPanel';
import DeleteModal from './DeleteModal';
import SuccessModal from './SuccessModal';
import { taskApi } from '../../api/api';
import '../../style/Task.css';

/**
 * TaskPage Main Component
 */
const Task = ({ isPanelOpen, setIsPanelOpen }) => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [editingTask, setEditingTask] = useState(null);
  
  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    setTasks(taskApi.getTasks());
  }, []);

  const handleSaveTask = (formData) => {
    if (formData.id) {
      const updated = taskApi.updateTask(formData);
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    } else {
      const newTask = taskApi.addTask(formData);
      setTasks(prev => [...prev, newTask]);
    }
    setIsPanelOpen(false);
    setEditingTask(null);
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsPanelOpen(true);
  };

  const handleDeleteRequest = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      taskApi.deleteTask(taskToDelete.id);
      setTasks(prev => prev.filter(t => t.id !== taskToDelete.id));
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      setIsSuccessModalOpen(true);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || task.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="task-page-wrapper">
      <header className="task-page-header">
        <div className="header-left">
          <div className="task-search">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search your tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="header-right">
          <div className="filter-chips">
            {['All', 'To Do', 'In Progress', 'Done'].map(filter => (
              <button 
                key={filter} 
                className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="task-page-body">
        <TaskList 
          tasks={filteredTasks} 
          onTaskClick={handleEditClick} 
          onDeleteTask={handleDeleteRequest}
        />
      </main>

      <TaskPanel 
        isOpen={isPanelOpen} 
        onClose={() => { setIsPanelOpen(false); setEditingTask(null); }} 
        onSave={handleSaveTask}
        taskToEdit={editingTask}
      />

      <DeleteModal 
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName="Task"
      />

      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message="Successfully Deleted"
      />
    </div>
  );
};

export default Task;
