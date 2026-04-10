import React from 'react';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiPlus, 
  FiShare2, 
  FiVideo, 
  FiMapPin, 
  FiMoreHorizontal,
  FiLink,
  FiZap
} from 'react-icons/fi';
import '../../style/Calendar.css';

const AvatarStack = ({ count = 3 }) => {
  const avatars = [
    'https://i.pravatar.cc/150?u=a',
    'https://i.pravatar.cc/150?u=b',
    'https://i.pravatar.cc/150?u=c',
    'https://i.pravatar.cc/150?u=d'
  ];
  return (
    <div className="avatar-stack">
      {avatars.slice(0, count).map((src, i) => (
        <img key={i} src={src} alt="Team" />
      ))}
    </div>
  );
};

const Calendar = () => {
  return (
    <div className="calendar-page-container">
      {/* LEFT SIDEBAR */}
      <aside className="calendar-sidebar">
        <div className="mini-calendar-card">
          <div className="mini-cal-header">
            <h3>September 2024</h3>
            <div className="mini-cal-nav">
              <button><FiChevronLeft /></button>
              <button><FiChevronRight /></button>
            </div>
          </div>
          <div className="mini-cal-grid">
            {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map(d => (
              <div key={d} className="day-label">{d}</div>
            ))}
            {[28, 29, 30, 31, 1, 2, 3].map(d => (
              <div key={d} className={`cal-date dimmed`}>{d}</div>
            ))}
            {[4, 5, 6].map(d => (
              <div key={d} className={`cal-date ${d === 4 ? 'active' : ''}`}>{d}</div>
            ))}
            {/* Adding dots/dimmed for visualization */}
            {[7, 8, 9, 10, 11, 12, 13, 14, 15].map(d => (
              <div key={d} className="cal-date dimmed">•</div>
            ))}
          </div>
        </div>

        <section className="upcoming-section">
          <div className="section-header">
            <h2>Upcoming</h2>
            <span className="view-all-link">View All</span>
          </div>
          <div className="upcoming-list">
            <div className="upcoming-card blue">
              <p className="upcoming-card-time">10:00 AM — 11:30 AM</p>
              <h3 className="upcoming-card-title">Design System Sync</h3>
              <AvatarStack count={2} />
            </div>
            <div className="upcoming-card pink">
              <p className="upcoming-card-time">02:00 PM — 05:00 PM</p>
              <h3 className="upcoming-card-title">Stakeholder Review</h3>
              <div className="detail-item" style={{ fontSize: '11px' }}>
                <FiVideo /> Google Meet
              </div>
            </div>
          </div>
        </section>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="calendar-main-content">
        <header className="main-header">
          <div className="today-text-group">
            <h5>TODAY IS</h5>
            <h1>Wednesday, Sept 4</h1>
          </div>
          <div className="header-actions">
            <button className="action-circle-btn btn-gray"><FiShare2 /></button>
            <button className="action-circle-btn btn-indigo"><FiPlus /></button>
          </div>
        </header>

        {/* TIMELINE VIEW */}
        <div className="timeline-container">
          {/* TODAY BLOCK (04) */}
          <div className="timeline-block">
            <div className="timeline-date-bg">04</div>
            <div className="timeline-date-label">TODAY</div>
            
            <div className="events-list">
              {/* Premium Roadmap Card */}
              <article className="event-premium-card">
                <div className="event-card-top">
                  <div className="event-tags-time">
                    <span className="category-tag tag-product">Product</span>
                    <span className="event-time-range">09:30 AM — 11:00 AM</span>
                  </div>
                  <AvatarStack count={3} />
                </div>
                <h2 className="event-title">Quarterly Roadmap Strategy</h2>
                <div className="event-card-bottom">
                  <div className="event-details">
                    <span className="detail-item"><FiVideo /> Zoom Meeting</span>
                    <span className="detail-item"><FiMapPin /> Strategy Room B</span>
                  </div>
                </div>
              </article>

              {/* Mini Lunch Card */}
              <div className="event-mini-card">
                <div className="mini-card-left">
                  <span className="mini-card-time">12:30 PM</span>
                  <div className="mini-card-info">
                    <h4>Lunch with Design Team</h4>
                    <p>Terraza Café, 3rd Floor</p>
                  </div>
                </div>
                <FiMoreHorizontal style={{ color: '#94a3b8' }} />
              </div>
            </div>
          </div>

          {/* TOMORROW BLOCK (05) */}
          <div className="timeline-block" style={{ marginTop: '40px' }}>
            <div className="timeline-date-bg">05</div>
            <div className="timeline-date-label">TOMORROW</div>
            
            <div className="events-list">
              <article className="event-premium-card" style={{ borderLeftColor: '#db2777' }}>
                <div className="event-card-top">
                  <div className="event-tags-time">
                    <span className="category-tag tag-research">Research</span>
                    <span className="event-time-range">11:00 AM — 12:00 PM</span>
                  </div>
                </div>
                <h2 className="event-title">User Interview: Mobile Experience</h2>
                <div className="event-card-bottom">
                  <div className="event-details">
                    <span className="detail-item"><FiLink /> meet.google.com/abc-xyz</span>
                  </div>
                </div>
              </article>
            </div>
          </div>

          {/* NEXT BLOCK (06) placeholder */}
          <div className="timeline-block" style={{ marginTop: '40px', opacity: 0.3 }}>
            <div className="timeline-date-bg">06</div>
            <p style={{ position: 'absolute', left: '120px', top: '35px', fontWeight: '800', color: '#94a3b8' }}>NO EVENTS SCHEDULED</p>
          </div>
        </div>

        {/* PRO TIP WIDGET */}
        <div className="pro-tip-card">
          <div className="tip-icon"><FiZap /></div>
          <div className="tip-content">
            <h4>Pro Tip</h4>
            <p>Press 'C' anywhere to quickly create a new event on your calendar.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calendar;
