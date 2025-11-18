import './UserDetailModal.css'
import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { base } from '../../../service/Base'
import { X, User, Mail, Phone, Upload, Save } from 'lucide-react'
import { App } from 'antd'

export default function UserDetailModal({ open, onClose, user, onUpdated }) {
    const { message } = App.useApp()
    const token = localStorage.getItem('token')
    
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        phoneNumber: ''
    })
    const [avatarFile, setAvatarFile] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    // Initialize form data when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                userName: user.userName || user.fullName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || user.phone || ''
            })
            setAvatarFile(null)
            setIsEditing(false)
        }
    }, [user])

    const previewSrc = useMemo(() => {
        if (avatarFile) return URL.createObjectURL(avatarFile)
        // Get avatar from multiple possible fields
        const userAvatar = user?.avatar || user?.imageUrl || user?.image || user?.user_img || null
        if (userAvatar) {
            if (userAvatar.startsWith('http') || userAvatar.startsWith('/') || userAvatar.startsWith('data:')) {
                return userAvatar
            }
            return `${base}/${userAvatar}`
        }
        return '/ava_user.webp'
    }, [avatarFile, user])

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                message.error('Kích thước ảnh không được vượt quá 5MB')
                return
            }
            // Validate file type
            if (!file.type.startsWith('image/')) {
                message.error('Vui lòng chọn file ảnh')
                return
            }
            setAvatarFile(file)
        }
    }

    const handleRemoveImage = () => {
        setAvatarFile(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!token) {
            message.error('Bạn chưa đăng nhập')
            return
        }

        if (!user) {
            message.error('Không tìm thấy thông tin người dùng')
            return
        }

        try {
            setSubmitting(true)
            const formDataToSend = new FormData()
            
            // Append fields if they have changed
            if (avatarFile) {
                formDataToSend.append('avatar', avatarFile)
            }
            if (formData.phoneNumber !== undefined) {
                formDataToSend.append('phoneNumber', formData.phoneNumber)
            }
            if (formData.email !== undefined) {
                formDataToSend.append('email', formData.email)
            }
            if (formData.userName !== undefined) {
                formDataToSend.append('userName', formData.userName)
            }

            const userId = user.id || user.userId
            const response = await axios.put(`${base}/users/${userId}`, formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response?.status === 200) {
                message.success('Cập nhật thông tin người dùng thành công!')
                const updatedData = response.data?.result || response.data?.data || response.data
                onUpdated && onUpdated(updatedData)
                setIsEditing(false)
            } else {
                message.error(response.data?.message || 'Cập nhật thất bại')
            }
        } catch (err) {
            console.error('Update user error:', err)
            const errorMsg = err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin người dùng'
            message.error(errorMsg)
        } finally {
            setSubmitting(false)
        }
    }

    const handleCancel = () => {
        if (submitting) return
        // Reset form to original user data
        if (user) {
            setFormData({
                userName: user.userName || user.fullName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || user.phone || '',
                role: user.role || user.roleName || 'USER'
            })
            setAvatarFile(null)
        }
        setIsEditing(false)
    }

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && !submitting) {
            handleCancel()
            onClose && onClose()
        }
    }

    if (!open || !user) return null

    return (
        <div 
            className="user-detail-modal-overlay" 
            role="dialog" 
            aria-modal="true"
            onClick={handleOverlayClick}
        >
            <div className="user-detail-modal" onClick={(e) => e.stopPropagation()}>
                <div className="user-detail-modal-header">
                    <div className="modal-header-content">
                        <h2>Thông tin người dùng</h2>
                        <button
                            type="button"
                            className="modal-close-btn"
                            onClick={() => {
                                handleCancel()
                                onClose && onClose()
                            }}
                            disabled={submitting}
                            aria-label="Đóng"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <form className="user-detail-modal-body" onSubmit={handleSubmit}>
                    {/* Avatar Section */}
                    <div className="user-detail-avatar-section">
                        <div className="avatar-preview-wrapper">
                            <img 
                                src={previewSrc} 
                                alt={formData.userName || 'User'} 
                                className="avatar-preview"
                                onError={(e) => {
                                    e.target.src = '/ava_user.webp'
                                }}
                            />
                            {isEditing && (
                                <div className="avatar-edit-overlay">
                                    <label htmlFor="avatar-upload" className="avatar-upload-btn">
                                        <Upload size={20} />
                                        <span>Đổi ảnh</span>
                                    </label>
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="avatar-upload-input"
                                    />
                                    {avatarFile && (
                                        <button
                                            type="button"
                                            className="avatar-remove-btn"
                                            onClick={handleRemoveImage}
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Info Fields */}
                    <div className="user-detail-fields">
                        <div className="form-group">
                            <label htmlFor="userName">
                                <User size={16} />
                                Tên người dùng
                            </label>
                            {isEditing ? (
                                <input
                                    id="userName"
                                    type="text"
                                    className="form-control"
                                    value={formData.userName}
                                    onChange={(e) => handleInputChange('userName', e.target.value)}
                                    placeholder="Nhập tên người dùng"
                                />
                            ) : (
                                <div className="form-display">{formData.userName || 'N/A'}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                <Mail size={16} />
                                Email
                            </label>
                            {isEditing ? (
                                <input
                                    id="email"
                                    type="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Nhập email"
                                />
                            ) : (
                                <div className="form-display">{formData.email || 'N/A'}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneNumber">
                                <Phone size={16} />
                                Số điện thoại
                            </label>
                            {isEditing ? (
                                <input
                                    id="phoneNumber"
                                    type="tel"
                                    className="form-control"
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    placeholder="Nhập số điện thoại"
                                />
                            ) : (
                                <div className="form-display">{formData.phoneNumber || 'N/A'}</div>
                            )}
                        </div>

                        {/* Read-only fields */}
                        <div className="form-group">
                            <label>User ID</label>
                            <div className="form-display">
                                {user.id || user.userId || 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="user-detail-modal-footer">
                        {isEditing ? (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCancel}
                                    disabled={submitting}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <div className="spinner-small"></div>
                                            <span>Đang lưu...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            <span>Lưu thay đổi</span>
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setIsEditing(true)}
                            >
                                Chỉnh sửa thông tin
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

