import React from 'react';
import { FiCheck } from 'react-icons/fi';
import './modals.css';

/**
 * SuccessModal Component
 * Success feedback popup (Image 4 reference)
 */
const SuccessModal = ({ isOpen, onClose, message = 'Successfully Deleted' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-center">
      <div className="modal-content-center success-modal">
        <p className="modal-header-text">{message}</p>
        <h2 className="modal-main-text success">Done</h2>
        <div className="success-icon-circle">
          <FiCheck />
        </div>
        <button className="btn-modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SuccessModal;
