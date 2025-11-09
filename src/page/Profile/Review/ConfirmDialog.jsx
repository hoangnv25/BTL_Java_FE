import './ConfirmDialog.css';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmText = 'Xác nhận', cancelText = 'Hủy', type = 'danger' }) {
    if (!open) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && onCancel) {
            onCancel();
        }
    };

    return (
        <div className="confirm-dialog-overlay" onClick={handleOverlayClick}>
            <div className="confirm-dialog-container" onClick={(e) => e.stopPropagation()}>
                <div className={`confirm-dialog-icon ${type}`}>
                    <AlertTriangle size={32} />
                </div>
                <div className="confirm-dialog-content">
                    <h3 className="confirm-dialog-title">{title}</h3>
                    <p className="confirm-dialog-message">{message}</p>
                </div>
                <div className="confirm-dialog-actions">
                    <button className="confirm-dialog-btn btn-cancel" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className={`confirm-dialog-btn btn-confirm ${type}`} onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

