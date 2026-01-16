import React, { useEffect } from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  showCloseButton = true,
  type = 'info'
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = ''; // 恢复背景滚动
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTypeClass = () => {
    switch (type) {
      case 'success': return 'modal-success';
      case 'warning': return 'modal-warning';
      case 'error': return 'modal-error';
      default: return 'modal-info';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${getTypeClass()}`} onClick={e => e.stopPropagation()}>
        {title && (
          <div className="modal-header">
            <h2>{title}</h2>
            {showCloseButton && (
              <button className="modal-close-button" onClick={onClose}>
                &times;
              </button>
            )}
          </div>
        )}
        
        <div className="modal-body">
          {children}
        </div>
        
        {showCloseButton && !title && (
          <button className="modal-close-button standalone-close" onClick={onClose}>
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;