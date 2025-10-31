import React from 'react';
import './modal.css';``

export const Modal = ({ children, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};
