import './ChangeInfo.css'
import { useState } from 'react'

// Component hiển thị và chỉnh sửa thông tin cá nhân
export default function ChangeInfo() {
    const initialUserData = {
        full_name: 'Đinh Việt Dũng',
        email: 'john.doe@example.com',
        phone_number: '1234567890',
        address: 'PTIT Hà Đông, Hà Nội',
    }

    // isEditing: đang ở chế độ chỉnh sửa hay không
    // formData: dữ liệu hiển thị và chỉnh sửa
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState(initialUserData)

    // Cập nhật giá trị input khi người dùng nhập
    const handleChange = (e) => {
        const { name, value } = e.target
        console.log('Change field:', name, '->', value)
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Bật chế độ chỉnh sửa
    const handleStartEdit = () => {
        console.log('Enter edit mode')
        setIsEditing(true)
    }
    // Hủy chỉnh sửa, khôi phục dữ liệu ban đầu
    const handleCancel = () => {
        console.log('Cancel edit, reset to initial')
        setFormData(initialUserData)
        setIsEditing(false)
    }
    // Lưu dữ liệu đã chỉnh sửa (sẽ gọi API thật ở đây)
    const handleSave = () => {
        console.log('Saving data:', formData)
        // TODO: call API to save
        // For now, just exit edit mode
        setIsEditing(false)
    }

    return (
        <div className="change-info-container">
            <h2 className="change-info-title">Thông tin cá nhân</h2>

            <div className="change-info-card">
                <div className="change-info-row">
                    <span className="label">Họ và tên</span>
                    {isEditing ? (
                        <input
                            className="input"
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                        />
                    ) : (
                        <span className="value">{formData.full_name}</span>
                    )}
                </div>
                <div className="change-info-row">
                    <span className="label">Email</span>
                    {isEditing ? (
                        <input
                            className="input"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    ) : (
                        <span className="value">{formData.email}</span>
                    )}
                </div>
                <div className="change-info-row">
                    <span className="label">Số điện thoại</span>
                    {isEditing ? (
                        <input
                            className="input"
                            type="tel"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                        />
                    ) : (
                        <span className="value">{formData.phone_number}</span>
                    )}
                </div>
                <div className="change-info-row">
                    <span className="label">Địa chỉ</span>
                    {isEditing ? (
                        <input className="input" type="text" name="address" value={formData.address} onChange={handleChange} />
                    ) : (
                        <span className="value">{formData.address}</span>
                    )}
                </div>
            </div>

            <div className="change-info-actions">
                {!isEditing ? (
                    <button className="btn-primary" onClick={handleStartEdit}>Chỉnh sửa thông tin cá nhân</button>
                ) : (
                    <div className="action-group">
                        <button className="btn-secondary" onClick={handleCancel}>Thoát</button>
                        <button className="btn-primary" onClick={handleSave}>Lưu</button>
                    </div>
                )}
            </div>
        </div>
    )
}


