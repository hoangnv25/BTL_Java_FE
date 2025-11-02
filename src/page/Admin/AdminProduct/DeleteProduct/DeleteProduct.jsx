import { useState } from 'react'
import axios from 'axios'
import { base } from '../../../../service/Base'
import { App } from 'antd'
import { Trash2 } from 'lucide-react'
import './DeleteProduct.css'

export default function DeleteProductModal({ open = false, onClose, onDeleted, product }) {
    const [deleting, setDeleting] = useState(false)
    const { message } = App.useApp()

    const handleCancel = () => {
        if (deleting) return
        if (typeof onClose === 'function') onClose()
    }

    const handleConfirmDelete = async () => {
        if (!product || !product.productId) {
            message.error('Không tìm thấy sản phẩm để xóa')
            if (typeof onClose === 'function') onClose()
            return
        }

        setDeleting(true)
        try {
            const response = await axios.delete(`${base}/products/${product.productId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200 || response.status === 204) {
                message.success('Xóa sản phẩm thành công')
                if (typeof onDeleted === 'function') onDeleted(product)
                if (typeof onClose === 'function') onClose()
                return
            }
            message.error(response.data?.message || 'Xóa sản phẩm thất bại')
        } catch (err) {
            console.error('Error deleting product:', err)
            message.error(err?.response?.data?.message || 'Có lỗi khi xóa sản phẩm')
        } finally {
            setDeleting(false)
        }
    }

    if (!open || !product) return null

    return (
        <div className="modal-overlay delete-product-overlay" onClick={handleCancel} role="dialog" aria-modal="true">
            <div className="modal delete-product-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Xác nhận xóa</h2>
                    <button className="btn-close" onClick={handleCancel} disabled={deleting}>×</button>
                </div>
                <div className="modal-body">
                    <div className="delete-confirm-content">
                        <div className="delete-warning-icon">
                            <Trash2 size={48} color="#dc3545" />
                        </div>
                        <p className="delete-confirm-text">
                            Bạn có chắc chắn muốn xóa sản phẩm <strong>"{product.title}"</strong>?
                        </p>
                        <p className="delete-confirm-subtext">
                            Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến sản phẩm này sẽ bị xóa vĩnh viễn.
                        </p>
                    </div>
                </div>
                <div className="modal-footer">
                    <button 
                        className="btn btn-secondary" 
                        onClick={handleCancel}
                        disabled={deleting}
                    >
                        Hủy
                    </button>
                    <button 
                        className="btn btn-danger" 
                        onClick={handleConfirmDelete}
                        disabled={deleting}
                    >
                        {deleting ? 'Đang xóa...' : 'Xóa sản phẩm'}
                    </button>
                </div>
            </div>
        </div>
    )
}

