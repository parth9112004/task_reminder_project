import React, { useState, useRef, useEffect } from 'react';
import { FiClock, FiMoreVertical, FiEdit2, FiTrash2, FiHeart } from 'react-icons/fi';

/**
 * TaskCard Component
 * Displays individual task summary with interactive menu
 */
const TaskCard = ({ task, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getStatusClass = (status) => {
    return status?.toLowerCase().replace(' ', '-') || 'to-do';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="task-card-v2" onClick={() => onEdit(task)}>
      <div className="task-card-main">
        <div className={`priority-indicator ${getPriorityClass(task.priority)}`}></div>
        <div className="task-content">
          <h3>{task.title}</h3>
          <div className="task-meta">
            <span className="task-time"><FiClock /> {task.time || 'No time set'}</span>
            <span className={`status-pill ${getStatusClass(task.status)}`}>
              {task.status}
            </span>
          </div>
        </div>
      </div>
      <div className="task-card-actions">
        {task.priority === 'High' && <span className="urgent-badge">High Priority</span>}
        
        <div className="more-menu-container" ref={menuRef}>
          <button 
            className="more-btn" 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <FiMoreVertical />
          </button>
          
          {showMenu && (
            <div className="task-dropdown-menu">
              <div className="menu-item-v2" onClick={(e) => { e.stopPropagation(); onEdit(task); setShowMenu(false); }}>
                <FiEdit2 /> Edit
              </div>
              <div className="menu-item-v2 delete" onClick={(e) => { e.stopPropagation(); onDelete(task); setShowMenu(false); }}>
                <FiTrash2 /> Delete
              </div>
              <div className="menu-item-v2 fav" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}>
                <FiHeart /> Favourite
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
