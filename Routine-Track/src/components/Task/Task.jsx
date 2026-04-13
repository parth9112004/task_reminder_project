import React, { useState, useEffect } from 'react';
import { FiSearch, FiHeart } from 'react-icons/fi';
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
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const fetchTasksAndStats = async (filterStatus = activeFilter) => {
    try {
      const data = await taskApi.getTasks(filterStatus);
      setTasks(data);
      // Call stats API alongside tasks as required to ensure everything stays in sync
      await taskApi.getStats();
    } catch (error) {
      console.error("Failed to sync tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasksAndStats(activeFilter);
  }, [activeFilter]);

  const handleSaveTask = async (formData) => {
    try {
      if (formData.id) {
        await taskApi.updateTask(formData);
      } else {
        await taskApi.addTask(formData);
      }
      await fetchTasksAndStats();
      setIsPanelOpen(false);
      setEditingTask(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsPanelOpen(true);
  };

  const handleDeleteRequest = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      try {
        await taskApi.deleteTask(taskToDelete.id);
        await fetchTasksAndStats();
        setIsDeleteModalOpen(false);
        setTaskToDelete(null);
        setIsSuccessModalOpen(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      try {
        await taskApi.updateTask({ ...task, status: newStatus });
        await fetchTasksAndStats();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleToggleFavourite = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      try {
        // Assume API accepts `favourite` boolean properly based on taskApi normalization
        await taskApi.updateTask({ ...task, favourite: !task.favourite });
        await fetchTasksAndStats();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getPageTitle = () => {
    if (showFavouritesOnly) return 'Favourite Tasks';
    switch (activeFilter) {
      case 'Pending': return 'Pending Tasks';
      case 'In Progress': return 'In Progress Tasks';
      case 'Done': return 'Complete Tasks';
      default: return 'All Tasks';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavourite = !showFavouritesOnly || task.favourite;
    return matchesSearch && matchesFavourite;
  });

  return (
    <div className="task-page-wrapper">
      <header className="task-page-header">
        <div className="header-left-v2">
          <div className="filter-chips">
            {['All', 'Pending', 'In Progress', 'Done'].map(filter => (
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
        <div className="header-right-v2">
          <div className="task-search">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search your tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            className={`fav-filter-btn ${showFavouritesOnly ? 'active' : ''}`}
            onClick={() => setShowFavouritesOnly(!showFavouritesOnly)}
            title="Show Favourites"
          >
            <FiHeart />
          </button>
        </div>
      </header>

      <main className="task-page-body">
        <TaskList 
          title={getPageTitle()}
          tasks={filteredTasks} 
          onTaskClick={handleEditClick} 
          onDeleteTask={handleDeleteRequest}
          onUpdateStatus={handleUpdateStatus}
          onToggleFavourite={handleToggleFavourite}
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
