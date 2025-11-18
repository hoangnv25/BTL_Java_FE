import { AlertTriangle } from 'lucide-react'
import './ConfirmDialog.css'

export default function ConfirmDialog({ 
    open, 
    title, 
    message, 
    onConfirm, 
    onCancel,
    confirmText = 'OK',
    cancelText = 'Hủy',
    type = 'danger' // 'danger', 'warning', 'info'
}) {
    if (!open) return null

    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                <div className={`confirm-icon ${type}`}>
                    <AlertTriangle size={48} />
                </div>
                <h2 className="confirm-title">{title}</h2>
                <p className="confirm-message">{message}</p>
                <div className="confirm-actions">
                    <button className="btn-confirm-cancel" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className={`btn-confirm-ok ${type}`} onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

