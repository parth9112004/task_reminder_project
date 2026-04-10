import React, { useState, useRef } from 'react';
import { FiEdit2, FiCheck, FiX, FiInfo } from 'react-icons/fi';

const AccountDropdown = ({ isOpen, setIsOpen, dropdownRef, user, setUser, showToast }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser(prev => ({
        ...prev,
        profileImg: imageUrl
      }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSaveStatus(null);

    const formData = new FormData();
    formData.append('first_name', user.first_name);
    formData.append('last_name', user.last_name);
    formData.append('bio', user.bio);

    try {
      const response = await fetch("http://localhost/routine-tracker/update_user.php", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      const data = await response.json();
      console.log("Update API Response:", data);

      if (data.status === 'success') {
        setSaveStatus('success');
        showToast("Profile updated successfully", "success");
        setTimeout(() => {
          setSaveStatus(null);
          setIsOpen(false);
        }, 1200);
      } else {
        showToast(data.message || "Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      showToast("An error occurred while updating profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="account-dropdown" ref={dropdownRef}>
      <div className="dropdown-header">
        <div className="profile-img-container" onClick={handleImageClick}>
          {user.profileImg ? (
            <img src={user.profileImg} alt="Profile" className="profile-img" />
          ) : (
            <div className="profile-img-placeholder">
              {user.first_name.charAt(0)}{user.last_name.charAt(0)}
            </div>
          )}
          <div className="edit-badge">
            <FiEdit2 size={12} />
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="dropdown-user-info">
          <h3 className="dropdown-name">{user.first_name} {user.last_name}</h3>
          <p className="dropdown-subtitle">{user.bio}</p>
        </div>
      </div>

      <div className="dropdown-form-modern">
        <div className="form-row">
          <div className="input-group-modern">
            <label>First Name</label>
            <input 
              type="text" 
              name="first_name"
              value={user.first_name} 
              onChange={handleInputChange}
              placeholder="Enter first name"
            />
          </div>
          <div className="input-group-modern">
            <label>Last Name</label>
            <input 
              type="text" 
              name="last_name"
              value={user.last_name} 
              onChange={handleInputChange}
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div className="input-group-modern">
          <label>Bio / Role</label>
          <input 
            type="text"
            name="bio"
            value={user.bio}
            onChange={handleInputChange}
            placeholder="Manager / Developer / etc."
          />
        </div>
      </div>

      <button className="btn-save-modern" onClick={handleSave} disabled={isLoading}>
        {isLoading ? (
          <div className="loader-small"></div>
        ) : saveStatus === 'success' ? (
          <><FiCheck /> Saved</>
        ) : (
          'Update Profile'
        )}
      </button>
    </div>
  );
};

export default AccountDropdown;
