import React from 'react';
import '../../style/modals.css';

/**
 * DeleteModal Component
 * Center popup for delete confirmation (Image 3)
 */
const DeleteModal = ({ isOpen, onCancel, onConfirm, itemName = 'Task' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-center">
      <div className="modal-content-center delete-modal">
        <p className="modal-header-text">You Are About To Delete This {itemName}</p>
        <h2 className="modal-main-text">Are You Sure?</h2>
        <div className="modal-actions-center">
          <button className="btn-modal yes" onClick={onConfirm}>Yes</button>
          <button className="btn-modal no" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
