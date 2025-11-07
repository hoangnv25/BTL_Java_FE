import './UpdatePassword.css'
import axios from 'axios'
import { useState } from 'react'
import { base } from '../../../service/Base'

export default function UpdatePassword({ open, onClose, user }) {
    const token = localStorage.getItem('token')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState({})

    if (!open) return null

    const validate = () => {
        const newErrors = {}
        
        if (!oldPassword.trim()) {
            newErrors.oldPassword = 'Vui lòng nhập mật khẩu cũ'
        }
        
        if (!newPassword.trim()) {
            newErrors.newPassword = 'Vui lòng nhập mật khẩu mới'
        } else if (newPassword.length < 6) {
            newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự'
        }
        
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới'
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
        }
        
        if (oldPassword === newPassword) {
            newErrors.newPassword = 'Mật khẩu mới phải khác mật khẩu cũ'
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validate()) {
            return
        }
        
        if (!token) {
            window.alert('Bạn chưa đăng nhập')
            return
        }

        try {
            setSubmitting(true)
            const formData = new FormData()
            formData.append('oldPassword', oldPassword)
            formData.append('password', newPassword)

            const userId = user?.id || user?.userId
            const response = await axios.put(`${base}/users/${userId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response?.status === 200) {
                window.alert('Đổi mật khẩu thành công!')
                setOldPassword('')
                setNewPassword('')
                setConfirmPassword('')
                setErrors({})
                onClose && onClose()
            } else {
                window.alert('Đổi mật khẩu thất bại!')
            }
        } catch (err) {
            console.error('Update password error:', err)
            const errorMsg = err?.response?.data?.message || 
                           err?.response?.data?.result?.message ||
                           'Có lỗi xảy ra khi đổi mật khẩu'
            window.alert(errorMsg)
        } finally {
            setSubmitting(false)
        }
    }

    const handleClose = () => {
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setErrors({})
        onClose && onClose()
    }

    return (
        <div className="uip-overlay" onClick={handleClose}>
            <div className="uip-modal" onClick={(e) => e.stopPropagation()}>
                <div className="uip-header">
                    <h3>Đổi mật khẩu</h3>
                    <button className="uip-close" onClick={handleClose}>×</button>
                </div>
                <form className="uip-form" onSubmit={handleSubmit}>
                    <label className="uip-field">
                        <span>Mật khẩu cũ <span className="required">*</span></span>
                        <input 
                            type="password" 
                            value={oldPassword} 
                            onChange={(e) => {
                                setOldPassword(e.target.value)
                                if (errors.oldPassword) setErrors({...errors, oldPassword: ''})
                            }} 
                            placeholder="Nhập mật khẩu cũ"
                            className={errors.oldPassword ? 'error' : ''}
                        />
                        {errors.oldPassword && <span className="error-text">{errors.oldPassword}</span>}
                    </label>
                    
                    <label className="uip-field">
                        <span>Mật khẩu mới <span className="required">*</span></span>
                        <input 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => {
                                setNewPassword(e.target.value)
                                if (errors.newPassword) setErrors({...errors, newPassword: ''})
                            }} 
                            placeholder="Nhập mật khẩu mới"
                            className={errors.newPassword ? 'error' : ''}
                        />
                        {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
                    </label>
                    
                    <label className="uip-field">
                        <span>Xác nhận mật khẩu mới <span className="required">*</span></span>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => {
                                setConfirmPassword(e.target.value)
                                if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''})
                            }} 
                            placeholder="Nhập lại mật khẩu mới"
                            className={errors.confirmPassword ? 'error' : ''}
                        />
                        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                    </label>
                    
                    <div className="uip-actions">
                        <button type="button" className="uip-btn secondary" onClick={handleClose}>Hủy</button>
                        <button type="submit" className="uip-btn primary" disabled={submitting}>
                            {submitting ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

