import React, { useState } from 'react';
import { 
  FiClock, 
  FiCalendar, 
  FiAlertCircle, 
  FiBell, 
  FiMessageSquare, 
  FiRotateCcw, 
  FiChevronDown,
  FiActivity
} from 'react-icons/fi';

/**
 * TaskForm Component
 * Precision-styled UI with smooth transitions and specific spacing rules.
 */
const TaskForm = ({ formData, handleChange, handleSubmit, isEdit }) => {
  const [isScheduleOpen, setIsScheduleOpen] = useState(true);

  return (
    <form onSubmit={handleSubmit} className="task-form">
      {/* Name Section */}
      <div className="form-section">
        <label>TASK NAME</label>
        <input 
          type="text" 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          placeholder="e.g. Redesign dashboard UI"
          required 
        />
      </div>

      {/* Description Section */}
      <div className="form-section">
        <label>DESCRIPTION</label>
        <textarea 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          placeholder="Prepare the final design handoff..."
        ></textarea>
      </div>

      {/* Collapsible Schedule Box */}
      <div className={`grouped-section-box schedule-box ${isScheduleOpen ? 'open' : ''}`}>
        <div className="section-header-row clickable" onClick={() => setIsScheduleOpen(!isScheduleOpen)}>
          <div className="toggle-info">
            <div className="icon-bg blue"><FiCalendar /></div>
            <div>
              <h4>Schedule</h4>
              <p>Set dates, times, and priority</p>
            </div>
          </div>
          <FiChevronDown className={`collapse-arrow ${isScheduleOpen ? 'rotate' : ''}`} />
        </div>
        
        <div className={`collapsible-wrapper ${isScheduleOpen ? 'expanded' : 'collapsed'}`}>
          <div className="section-content">
            {/* Row 1: Date & Time - Side by Side (12px gap) */}
            <div className="form-row side-by-side field-gap">
              <div className="form-section flex-1">
                <label><FiCalendar /> DUE DATE</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} />
              </div>
              <div className="form-section flex-1">
                <label><FiClock /> TIME</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} />
              </div>
            </div>

            {/* Row 2: Priority & Status - Side by Side (12px gap) */}
            <div className="form-row side-by-side field-gap mt-12">
              <div className="form-section flex-1">
                <label><FiAlertCircle /> PRIORITY</label>
                <div className="custom-select-wrapper">
                  <select name="priority" value={formData.priority} onChange={handleChange}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                  <FiChevronDown className="select-arrow" />
                </div>
              </div>
              <div className="form-section flex-1">
                <label><FiActivity /> STATUS</label>
                <div className="custom-select-wrapper">
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                  <FiChevronDown className="select-arrow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grouped Reminder & Notification Box */}
      <div className="grouped-section-box reminder-box">
        <div className="section-header-row">
          <div className="toggle-info">
            <div className="icon-bg purple"><FiBell /></div>
            <div>
              <h4>Task Reminders</h4>
              <p>Setup custom alerts and schedule</p>
            </div>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              name="reminder" 
              checked={formData.reminder} 
              onChange={handleChange} 
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className={`collapsible-wrapper ${formData.reminder ? 'expanded' : 'collapsed'}`}>
          <div className="reminder-expanded-content">
            <div className="form-section sub-section">
              <label><FiMessageSquare /> REMINDER MESSAGE</label>
              <input 
                type="text" 
                name="reminderMsg" 
                value={formData.reminderMsg} 
                onChange={handleChange} 
                placeholder="What should the reminder say?"
              />
            </div>

            <div className="form-row sub-row side-by-side field-gap">
              <div className="form-section flex-1">
                <label><FiRotateCcw /> FREQUENCY</label>
                <div className="custom-select-wrapper">
                  <select name="repeatTimes" value={formData.repeatTimes} onChange={handleChange}>
                    <option value="1">Once</option>
                    <option value="2">2 Times</option>
                    <option value="3">3 Times</option>
                    <option value="5">5 Times</option>
                  </select>
                  <FiChevronDown className="select-arrow" />
                </div>
              </div>
              <div className="form-section flex-1">
                <label><FiCalendar /> DAYS BEFORE</label>
                <div className="custom-select-wrapper">
                  <select name="startDaysBefore" value={formData.startDaysBefore} onChange={handleChange}>
                    <option value="0">On Due Date</option>
                    <option value="1">1 Day Before</option>
                    <option value="2">2 Days Before</option>
                    <option value="7">1 Week Before</option>
                  </select>
                  <FiChevronDown className="select-arrow" />
                </div>
              </div>
            </div>

            <div className="form-section sub-section no-margin">
              <label>NOTIFICATION CHANNEL</label>
              <div className="checkbox-group field-gap">
                {['alert', 'sound', 'popup'].map(notif => (
                  <label key={notif} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      name={`notif_${notif}`} 
                      checked={formData.notifications[notif]} 
                      onChange={handleChange} 
                    />
                    <span style={{ textTransform: 'capitalize' }}>{notif}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-footer">
        <button type="submit" className="save-btn">
          {isEdit ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
