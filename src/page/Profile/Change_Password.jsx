import './Change_Password.css'
import { useState } from 'react'

// Component đổi mật khẩu với validate cơ bản và submit giả lập
export default function Change_Password() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Cập nhật giá trị input khi người dùng nhập
    const handleChange = (e) => {
        const { name, value } = e.target
        console.log('Change field:', name, '->', value)
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Xử lý submit: kiểm tra xác nhận mật khẩu và gọi API (demo)
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('Submitting change password:', formData)
        if (formData.newPassword !== formData.confirmPassword) {
            alert('Mật khẩu xác nhận không khớp')
            return
        }
        try {
            setIsSubmitting(true)
            // TODO: call API
            await new Promise(r => setTimeout(r, 600))
            alert('Đổi mật khẩu thành công (demo)')
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="change-info-container">
            <h2 className="change-info-title">Đổi mật khẩu</h2>
            <form className="change-info-card" onSubmit={handleSubmit}>
                <div className="change-info-row">
                    <span className="label">Mật khẩu hiện tại</span>
                    <input
                        className="input"
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="change-info-row">
                    <span className="label">Mật khẩu mới</span>
                    <input
                        className="input"
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />
                </div>
                <div className="change-info-row">
                    <span className="label">Xác nhận mật khẩu</span>
                    <input
                        className="input"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />
                </div>
                <div className="change-info-actions">
                    <button className="btn-primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Đang lưu...' : 'Lưu mật khẩu'}
                    </button>
                </div>
            </form>
        </div>
    )
}


