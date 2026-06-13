import Modal from "./Modal";
import "./ConfirmModal.css";

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Elimina", cancelText = "Annulla" }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className="confirm-modal-content">
        <div className="confirm-message">
          {message}
        </div>
        
        <div className="confirm-actions">
          <button 
            onClick={onClose}
            className="confirm-button cancel-button"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className="confirm-button delete-button"
          >
            <span className="delete-icon">🗑️</span>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;