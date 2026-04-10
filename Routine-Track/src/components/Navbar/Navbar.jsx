import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiBell, FiSettings, FiMenu } from 'react-icons/fi';
import AccountDropdown from './AccountDropdown';

const Navbar = ({ toggleSidebar, onLogout, user, setUser, showToast, activeView }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  const getPageTitle = () => {
    if (!activeView) return 'Overview';
    return activeView.charAt(0).toUpperCase() + activeView.slice(1);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="dash-navbar">
      <div className="nav-left">
        <button className="mobile-toggle" onClick={toggleSidebar}>
          <FiMenu />
        </button>
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>
      
      <div className="nav-center">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search tasks..." 
          />
        </div>
      </div>
      
      <div className="nav-right">
        <div className="nav-actions">
          <button className="icon-button">
            <FiBell />
          </button>
          <button className="icon-button">
            <FiSettings />
          </button>
        </div>
        
        <div className="divider"></div>
        
        <div className="nav-right-container">
          <div 
            className="user-profile" 
            onClick={toggleDropdown}
            ref={profileRef}
          >
            <div className="user-info" style={{ textAlign: 'right' }}>
              <span className="user-name">{user.first_name} {user.last_name}</span>
              <span className="user-role">{user.bio}</span>
            </div>
            <div className="avatar">
              {user.profileImg ? (
                <img src={user.profileImg} alt="Avatar" className="avatar-img" />
              ) : (
                `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`
              )}
            </div>
          </div>
          
          <AccountDropdown 
            isOpen={isDropdownOpen} 
            setIsOpen={setIsDropdownOpen}
            dropdownRef={dropdownRef}
            onLogout={onLogout}
            user={user}
            setUser={setUser}
            showToast={showToast}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
