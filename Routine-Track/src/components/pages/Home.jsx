import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import Dashboard from '../Dashboard/Dashboard';
import Task from '../Task/Task';
import Calendar from '../Calendar/Calendar';
import '../../style/user_dashboard.css';
import { FiX, FiInfo, FiCheckCircle } from 'react-icons/fi';

const UserDashboard = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  
  // Navigation & Page State
  const [activeView, setActiveView] = useState('dashboard');
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 4000);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost/routine-tracker/get_user.php", {
          credentials: "include"
        });
        const data = await response.json();
        
        if (data.status === "success" && data.user) {
          setUserProfile({
            first_name: data.user.first_name || '',
            last_name: data.user.last_name || '',
            role: 'Executive Workspace',
            bio: data.user.bio || 'Lead Manager',
            profileImg: data.user.profile_img || null
          });
        } else {
          onLogout(); // Redirect to login
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        onLogout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [onLogout]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openTaskPanel = () => {
    setActiveView('tasks');
    setIsTaskPanelOpen(true);
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading your workspace...</p>
      </div>
    );
  }

  if (!userProfile) return null;


  return (
    <div className="dashboard-layout">
      <Sidebar 
        isOpen={isSidebarOpen} 
        closeSidebar={closeSidebar} 
        onLogout={onLogout} 
        activeView={activeView}
        setActiveView={setActiveView}
        openTaskPanel={openTaskPanel}
      />
      <div className="main-content-wrapper">
        <Navbar 
          toggleSidebar={toggleSidebar} 
          onLogout={onLogout} 
          user={userProfile} 
          setUser={setUserProfile} 
          showToast={showToast}
          activeView={activeView}
        />
        <main className="main-content">
          {activeView === 'dashboard' ? (
            <Dashboard user={userProfile} />
          ) : activeView === 'tasks' ? (
            <Task 
              isPanelOpen={isTaskPanelOpen} 
              setIsPanelOpen={setIsTaskPanelOpen} 
            />
          ) : activeView === 'calendar' ? (
            <Calendar />
          ) : (
            <div className="empty-view-placeholder">
              <h2 style={{ padding: '40px', textAlign: 'center' }}>{activeView.charAt(0).toUpperCase() + activeView.slice(1)} View coming soon...</h2>
            </div>
          )}
        </main>
      </div>

      {/* Persistent Notification Toast */}
      <div className={`notification-toast ${toast.show ? 'show' : ''} ${toast.type}`}>
        <div className="toast-icon-container">
          {toast.type === 'success' ? <FiCheckCircle /> : <FiInfo />}
        </div>
        <div className="toast-message">
          {toast.message}
        </div>
        <button className="toast-close" onClick={() => setToast({ show: false, message: '', type: 'info' })}>
          <FiX />
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
