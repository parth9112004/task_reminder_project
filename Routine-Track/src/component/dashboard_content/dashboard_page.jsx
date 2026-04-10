import React, { useState, useEffect } from 'react';
import { 
  FiCheckCircle, 
  FiClock, 
  FiBriefcase, 
  FiTrendingUp, 
  FiMoreVertical, 
  FiCalendar, 
  FiEdit3, 
  FiPlus, 
  FiGrid, 
  FiList 
} from 'react-icons/fi';
import './dashboard_page.css';

const DashboardPage = ({ user }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options).toUpperCase();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const summaryCards = [
    { title: 'TOTAL TASKS', value: 42, icon: <FiList />, color: '#6366f1' },
    { title: 'COMPLETED', value: 28, icon: <FiCheckCircle />, color: '#10b981' },
    { title: 'PENDING', value: 14, icon: <FiClock />, color: '#f59e0b' },
    { title: 'PROJECTS', value: 6, icon: <FiBriefcase />, color: '#8b5cf6' },
  ];

  const todayTasks = [
    { id: 1, title: 'Finalize Design System v2', time: '09:00 AM - 11:00 AM', status: 'IN PROGRESS', priority: 'medium' },
    { id: 2, title: 'Client Stakeholder Meeting', time: '01:30 PM - 02:30 PM', status: 'HIGH PRIORITY', priority: 'high' },
    { id: 3, title: 'Draft Q4 Strategy Report', time: '08:00 AM - 09:00 AM', status: 'DONE', priority: 'low' },
  ];

  const activeProjects = [
    { 
      id: 1, 
      title: 'Brand Identity Redesign', 
      team: 'Internal Marketing Team', 
      progress: 75,
      members: ['https://i.pravatar.cc/150?u=1', 'https://i.pravatar.cc/150?u=2', 'https://i.pravatar.cc/150?u=3']
    },
    { 
      id: 2, 
      title: 'Web Architecture Refactor', 
      team: 'Engineering Division', 
      progress: 32,
      members: ['https://i.pravatar.cc/150?u=4']
    }
  ];

  const upcomingDeadlines = [
    { id: 1, title: 'Product Launch Deck', subtitle: 'Marketing Campaign', remaining: '2 days left', type: 'urgent' },
    { id: 2, title: 'API Integration Sync', subtitle: 'Web Architecture', remaining: '5 days left', type: 'normal' },
  ];

  const weeklyData = [
    { day: 'M', value: 40 },
    { day: 'T', value: 60 },
    { day: 'W', value: 45 },
    { day: 'T', value: 90 },
    { day: 'F', value: 30 },
    { day: 'S', value: 20 },
    { day: 'S', value: 10 },
  ];

  return (
    <div className="dashboard-page-container">
      {/* Welcome Header */}
      <header className="dashboard-header">
        <div className="welcome-text">
          <h1>Welcome back, {user?.first_name || 'Alex'}.</h1>
          <p>You have 8 tasks scheduled for today.</p>
        </div>
        <div className="live-datetime">
          <div className="time">{formatTime(currentTime)}</div>
          <div className="date">{formatDate(currentTime)}</div>
        </div>
      </header>

      {/* Summary Cards Row */}
      <div className="summary-grid">
        {summaryCards.map((card, index) => (
          <div key={index} className="summary-card">
            <div className="card-icon" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
              {card.icon}
            </div>
            <div className="card-info">
              <span className="card-title">{card.title}</span>
              <span className="card-value">{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-main-grid">
        {/* Left Column */}
        <div className="grid-left-col">
          {/* Today's Tasks */}
          <section className="dashboard-section tasks-section">
            <div className="section-header">
              <h2>Today's Tasks</h2>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="task-list">
              {todayTasks.map(task => (
                <div key={task.id} className={`task-item priority-${task.priority}`}>
                  <div className="task-left">
                    <div className="priority-border"></div>
                    <div className="task-main-info">
                      <h3>{task.title}</h3>
                      <span>{task.time}</span>
                    </div>
                  </div>
                  <div className="task-right">
                    <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Active Projects */}
          <section className="dashboard-section projects-section">
            <div className="section-header">
              <h2>Active Projects</h2>
              <div className="view-toggles">
                <button className="toggle-btn active"><FiGrid /></button>
                <button className="toggle-btn"><FiList /></button>
              </div>
            </div>
            <div className="project-grid">
              {activeProjects.map(project => (
                <div key={project.id} className="project-card">
                  <div className="project-card-header">
                    <div className="project-title-group">
                      <h3>{project.title}</h3>
                      <p>{project.team}</p>
                    </div>
                    <div className="team-avatars">
                      {project.members.map((avatar, i) => (
                        <img key={i} src={avatar} alt="Team" className="team-avatar" />
                      ))}
                      {project.members.length > 3 && <span className="avatar-more">+{project.members.length - 3}</span>}
                    </div>
                  </div>
                  <div className="project-progress">
                    <div className="progress-label">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="add-project-btn">
                <FiPlus />
              </div>
            </div>
          </section>

          {/* Bottom Grid: Deadlines & Notes */}
          <div className="bottom-row-grid">
            <section className="dashboard-section deadlines-section">
              <div className="section-header">
                <h2>Upcoming Deadlines</h2>
              </div>
              <div className="deadline-list">
                {upcomingDeadlines.map(deadline => (
                  <div key={deadline.id} className="deadline-item">
                    <div className="deadline-icon-box">
                      {deadline.type === 'urgent' ? '!' : <FiClock />}
                    </div>
                    <div className="deadline-info">
                      <h4>{deadline.title}</h4>
                      <p>{deadline.subtitle}</p>
                    </div>
                    <span className={`deadline-tag ${deadline.type}`}>{deadline.remaining}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-section notes-section">
              <div className="section-header">
                <h2>Quick Notes</h2>
                <FiMoreVertical className="more-icon" />
              </div>
              <div className="notes-container">
                <textarea placeholder="Type your thoughts here..."></textarea>
                <div className="notes-footer">
                  <button className="save-note-btn">
                    <FiCalendar style={{ marginRight: '6px' }} /> Save Note
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Right Column */}
        <div className="grid-right-col">
          {/* Weekly Progress */}
          <section className="dashboard-section weekly-progress">
            <div className="section-header">
              <h2>Weekly Progress</h2>
            </div>
            <div className="chart-container">
              {weeklyData.map((data, i) => (
                <div key={i} className="chart-bar-wrapper">
                  <div 
                    className={`chart-bar ${data.value > 80 ? 'active' : ''}`} 
                    style={{ height: `${data.value}%` }}
                  ></div>
                  <span>{data.day}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Calendar */}
          <section className="dashboard-section calendar-section">
            <div className="calendar-header">
              <h3>October 2024</h3>
              <div className="cal-nav">
                <button>&lt;</button>
                <button>&gt;</button>
              </div>
            </div>
            <div className="calendar-grid">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="cal-day-label">{day}</div>
              ))}
              {/* Dummy dates for Oct 2024 */}
              {[29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((date, i) => (
                <div 
                  key={i} 
                  className={`cal-date ${date === 14 ? 'current' : ''} ${i < 2 ? 'prev-month' : ''}`}
                >
                  {date}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
