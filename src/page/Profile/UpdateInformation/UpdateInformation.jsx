import './UpdateInformation.css'
import axios from 'axios'
import { useMemo, useState } from 'react'
import { base } from '../../../service/Base'
import { Upload, X } from 'lucide-react'

export default function UpdateInformation({ open, onClose, user, onUpdated }) {
    const token = localStorage.getItem('token')
    const [email, setEmail] = useState(user?.email || '')
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '')
    const [avatarFile, setAvatarFile] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const previewSrc = useMemo(() => {
        if (avatarFile) return URL.createObjectURL(avatarFile)
        return user?.avatar || '/ava_user.webp'
    }, [avatarFile, user])

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setAvatarFile(file)
        }
    }

    const handleRemoveImage = () => {
        setAvatarFile(null)
    }

    if (!open) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!token) {
            window.alert('Bạn chưa đăng nhập')
            return
        }

        try {
            setSubmitting(true)
            const formData = new FormData()
            if (avatarFile) formData.append('avatar', avatarFile)
            if (phoneNumber !== undefined) formData.append('phoneNumber', phoneNumber)
            if (email !== undefined) formData.append('email', email)

            const userId = user?.id || user?.userId
            const response = await axios.put(`${base}/users/${userId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response?.status === 200) {
                window.alert('Cập nhật thành công!')
                onUpdated && onUpdated(response.data)
            } else {
                window.alert('Cập nhật thất bại!')
            }
        } catch (err) {
            console.error('Update user error:', err)
            window.alert(err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="uii-overlay" onClick={onClose}>
            <div className="uii-modal" onClick={(e) => e.stopPropagation()}>
                <div className="uii-header">
                    <h3>Thay đổi thông tin</h3>
                    <button className="uii-close" onClick={onClose}>×</button>
                </div>
                <form className="uii-form" onSubmit={handleSubmit}>
                    <div className="uii-field">
                        <label htmlFor="avatar">Ảnh đại diện</label>
                        {!avatarFile && (!user?.avatar || user?.avatar === '/ava_user.webp') ? (
                            <div className="uii-image-upload-area">
                                <input
                                    id="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="uii-image-input"
                                />
                                <label htmlFor="avatar" className="uii-image-upload-label">
                                    <Upload size={24} />
                                    <span>Click để chọn ảnh</span>
                                    <span className="uii-upload-hint">PNG, JPG, JPEG (Max 5MB)</span>
                                </label>
                            </div>
                        ) : (
                            <div className="uii-image-preview-wrapper">
                                <div className="uii-image-preview-container">
                                    <img src={previewSrc} alt="Avatar preview" className="uii-image-preview" />
                                    <button
                                        type="button"
                                        className="uii-btn-remove-image"
                                        onClick={handleRemoveImage}
                                        title="Xóa ảnh"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                                <label htmlFor="avatar-change" className="uii-btn-change-image">
                                    <input
                                        id="avatar-change"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="uii-image-input"
                                    />
                                    Chọn ảnh khác
                                </label>
                            </div>
                        )}
                    </div>
                    <label className="uii-field">
                        <span>Điện thoại</span>
                        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Số điện thoại" />
                    </label>
                    <label className="uii-field">
                        <span>Email</span>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    </label>
                    <div className="uii-actions">
                        <button type="button" className="uii-btn secondary" onClick={onClose}>Hủy</button>
                        <button type="submit" className="uii-btn primary" disabled={submitting}>{submitting ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}


