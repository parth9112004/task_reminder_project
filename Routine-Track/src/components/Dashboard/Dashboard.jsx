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
  FiList,
  FiArrowRight,
  FiChevronDown,
  FiCheck
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { taskApi } from '../../api/api';
import '../../style/Dashboard.css';

const Dashboard = ({ user, setActiveView }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, in_progress: 0 });
  const [todayTasks, setTodayTasks] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectView, setProjectView] = useState('grid');
  const [activeProjects, setActiveProjects] = useState([]);
  const [noteContent, setNoteContent] = useState('');
  const [isNoteMenuOpen, setIsNoteMenuOpen] = useState(false);
  const noteRef = React.useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await taskApi.getStats();
        setStats({
          total: statsData.total ?? 0,
          completed: statsData.done ?? 0,
          pending: statsData.pending ?? 0,
          in_progress: statsData.in_progress ?? 0
        });

        const allTasks = await taskApi.getTasks();
        setTodayTasks(allTasks.slice(0, 3));

        // Get live in_progress tasks for the "Active Projects" section
        const inProgressTasks = await taskApi.getTasks('In Progress');
        // Add dummy avatars to each task to match the design requested
        const mappedProjects = inProgressTasks.map((task, idx) => ({
          ...task,
          members: [
            `https://i.pravatar.cc/150?u=${idx + 1}`,
            `https://i.pravatar.cc/150?u=${idx + 10}`,
            `https://i.pravatar.cc/150?u=${idx + 20}`
          ].slice(0, (idx % 3) + 1)
        }));
        setActiveProjects(mappedProjects);

        const weekly = await taskApi.getWeeklyStats();
        setWeeklyData(weekly);

        const note = await taskApi.getNote();
        setNoteContent(note.content || '');
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
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
    { title: 'TOTAL TASKS', value: stats.total, icon: <FiList />, color: '#6366f1' },
    { title: 'COMPLETED', value: stats.completed, icon: <FiCheckCircle />, color: '#10b981' },
    { title: 'PENDING', value: stats.pending, icon: <FiClock />, color: '#f59e0b' },
    { title: 'IN PROGRESS', value: stats.in_progress, icon: <FiTrendingUp />, color: '#3b82f6' },
  ];



  const upcomingDeadlines = [
    { id: 1, title: 'Product Launch Deck', subtitle: 'Marketing Campaign', remaining: '2 days left', type: 'urgent' },
    { id: 2, title: 'API Integration Sync', subtitle: 'Web Architecture', remaining: '5 days left', type: 'normal' },
  ];

  // Helper to get color based on progress percentage
  const getProgressColor = (percent) => {
    if (percent < 30) return '#ef4444'; // Red
    if (percent < 50) return '#3b82f6'; // Blue
    if (percent < 70) return '#f59e0b'; // Orange
    return '#10b981'; // Green
  };

  // Note Handlers
  const handleSaveNote = async () => {
    try {
      await taskApi.saveNote(noteContent);
      setIsNoteMenuOpen(false);
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  const handleDeleteNote = async () => {
    try {
      await taskApi.deleteNote();
      setNoteContent('');
      setIsNoteMenuOpen(false);
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const handleEditNote = () => {
    if (noteRef.current) {
      noteRef.current.focus();
    }
    setIsNoteMenuOpen(false);
  };
  const maxVal = Math.max(...weeklyData.map(d => d.total), 0);

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
              <h2>All Task</h2>
              <button className="view-all-btn" onClick={() => setActiveView('tasks')}>
                View All <FiArrowRight className="arrow-icon" />
              </button>
            </div>
            <div className="task-list">
              {todayTasks.length > 0 ? todayTasks.map(task => (
                <div key={task.id} className={`task-item status-${task.status.toLowerCase().replace(' ', '-')}`}>
                  <div className="task-left">
                    <div className="priority-border"></div>
                    <div className="task-main-info">
                      <h3>{task.title}</h3>
                      <span>{task.time || 'No time set'}</span>
                    </div>
                  </div>
                  <div className="task-right">
                    <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              )) : (
                <div style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic', padding: '10px 0' }}>No tasks found for today.</div>
              )}
            </div>
          </section>

          {/* Active Projects */}
          <section className="dashboard-section projects-section">
            <div className="section-header">
              <h2>Active Projects</h2>
              <div className="view-toggles-modern">
                <button 
                  className={`toggle-btn-premium ${projectView === 'grid' ? 'active' : ''}`}
                  onClick={() => setProjectView('grid')}
                >
                  <FiGrid />
                </button>
                <button 
                  className={`toggle-btn-premium ${projectView === 'list' ? 'active' : ''}`}
                  onClick={() => setProjectView('list')}
                >
                  <FiList />
                </button>
              </div>
            </div>
            <div className={`project-display-container ${projectView}-view`}>
              {activeProjects.map(project => (
                <div key={project.id} className="project-card-premium">
                  <div className="project-meta-info">
                    <div className="project-title-group">
                      <h3>{project.title}</h3>
                      <p className="project-desc-line">{project.description || 'Current active objective'}</p>
                    </div>
                    <div className="team-avatars-group">
                      {project.members.map((avatar, i) => (
                        <img key={i} src={avatar} alt="Team" className="team-avatar-premium" />
                      ))}
                      {project.members?.length > 3 && <span className="avatar-more-pill">+{project.members.length - 3}</span>}
                    </div>
                  </div>
                  <div className="project-progress">
                    <div className="project-progress-header">
                      <span>Progress {project.progress || 0}%</span>
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${project.progress || 0}%`,
                          backgroundColor: getProgressColor(project.progress || 0)
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              {activeProjects.length === 0 && (
                <div className="empty-projects-state">
                  <p>No active projects at the moment.</p>
                </div>
              )}
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
                <div className="note-menu-container">
                  <FiMoreVertical 
                    className="more-icon-btn" 
                    onClick={() => setIsNoteMenuOpen(!isNoteMenuOpen)}
                  />
                  {isNoteMenuOpen && (
                    <div className="note-dropdown-active">
                      <button onClick={handleEditNote}>
                        <FiEdit3 /> Edit
                      </button>
                      <button onClick={handleSaveNote}>
                        <FiCheckCircle /> Save
                      </button>
                      <button onClick={handleDeleteNote} className="delete-opt">
                        <FiClock /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="notes-container-premium">
                <textarea 
                  ref={noteRef}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Capture your immediate thoughts, reminders, or scratchpad items here..."
                ></textarea>
              </div>
            </section>
          </div>
        </div>

        {/* Right Column */}
        <div className="grid-right-col">
          {/* Weekly Progress */}
          <section className="dashboard-section weekly-progress">
            <div className="section-header">
              <div className="header-title-group">
                <h2>Weekly Progress</h2>
                <p className="chart-subtitle">Output compared to last session</p>
              </div>
              <div className="status-badge-green">
                <FiTrendingUp size={14} /> <span>+12.5%</span>
              </div>
            </div>
            <div className="chart-container-modern" style={{ height: '260px', width: '100%', minHeight: '260px' }}>
              <ResponsiveContainer width="100%" height="100%" minHeight={260}>
                <BarChart data={weeklyData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 600 }}
                    dy={12}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="total" 
                    radius={[20, 20, 20, 20]} 
                    barSize={32}
                  >
                    {weeklyData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.total === maxVal && maxVal > 0 ? '#5c59e8' : '#cbdcfd'} 
                        style={{ 
                          cursor: 'pointer', 
                          transition: 'all 0.3s ease',
                          filter: entry.total === maxVal && maxVal > 0 ? 'drop-shadow(0 6px 12px rgba(92, 89, 232, 0.3))' : 'none'
                        }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Performance Insights (Replaces Calendar) */}
          <section className="dashboard-section performance-insights-card">
            <div className="insights-header">
              <div className="header-label-group">
                <h3>October totals</h3>
                <FiChevronDown className="dropdown-icon-mini" />
              </div>
            </div>
            
            <div className="insights-summary-row">
              <div className="days-count">
                <span className="big-number">14</span>
                <span className="unit-label">Days</span>
              </div>
              <div className="completion-badge-premium">
                <div className="check-circles">
                  <div className="circle-outline"></div>
                  <div className="circle-filled"><FiCheck /></div>
                </div>
                <span className="badge-text">Completed</span>
              </div>
            </div>

            <div className="activity-grid-premium">
              <div className="days-header-row">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, idx) => <span key={`${d}-${idx}`}>{d}</span>)}
              </div>
              <div className="dots-grid">
                {[...Array(28)].map((_, i) => (
                  <div key={i} className={`activity-dot ${[7, 10, 14, 17, 18, 20, 21, 22, 23, 24, 25, 26].includes(i) ? 'active' : ''}`}>
                    {[10, 14, 21, 24, 25, 26].includes(i) && <span className="dot-val">{Math.floor(Math.random() * 3) + 1}</span>}
                    {i === 18 && (
                      <div className="special-dot">
                        <span className="special-val">3/3</span>
                        <FiChevronDown className="special-arrow" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
