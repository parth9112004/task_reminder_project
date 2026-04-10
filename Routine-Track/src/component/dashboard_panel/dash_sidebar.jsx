import React from 'react';
import { 
  FiHome, 
  FiCheckSquare, 
  FiCalendar, 
  FiFolder, 
  FiPlus, 
  FiHelpCircle, 
  FiLogOut 
} from 'react-icons/fi';

const DashSidebar = ({ isOpen, closeSidebar, onLogout, activeView, setActiveView, openTaskPanel }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome className="menu-icon" /> },
    { id: 'tasks', label: 'Tasks', icon: <FiCheckSquare className="menu-icon" /> },
    { id: 'calendar', label: 'Calendar', icon: <FiCalendar className="menu-icon" /> },
    { id: 'projects', label: 'Projects', icon: <FiFolder className="menu-icon" /> },
  ];

  return (
    <>
      <div 
        className={`mobile-overlay ${isOpen ? 'open' : ''}`} 
        onClick={closeSidebar}
      />
      <aside className={`dash-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="logo-text">Routine Tracker</h2>
        </div>
        
        <nav className="sidebar-menu">
          {menuItems.map(item => (
            <a 
              key={item.id}
              className={`menu-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveView(item.id);
                if (window.innerWidth <= 768) closeSidebar();
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        
        <div className="sidebar-bottom">
          <button className="btn-primary" onClick={openTaskPanel}>
            <FiPlus />
            <span>New Task</span>
          </button>
          
          <div className="footer-links">
            <div className="footer-link">
              <FiHelpCircle className="menu-icon" />
              <span>Help</span>
            </div>
            <div className="footer-link" onClick={onLogout}>
              <FiLogOut className="menu-icon" />
              <span>Sign Out</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashSidebar;
