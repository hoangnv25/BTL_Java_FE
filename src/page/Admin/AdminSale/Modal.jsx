import axios from 'axios'
import { base } from '../../../service/Base'
import { App } from 'antd'
import { useState } from 'react'

export default function ModalSale({ open = false, onClose = () => {}, fetchSales = () => {} }) {

    const { message } = App.useApp();
    if (!open) return null
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        stDate: '',
        endDate: '',
        active: false
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const toIsoWithSeconds = (value, isEndDate = false) => {
        if (!value) return ''
        if (value.length === 10) {
            return `${value}T${isEndDate ? '23:59:59' : '00:00:00'}`
        }
        if (value.length === 16) {
            return `${value}:00`
        }
        return value
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                ...formData,
                stDate: toIsoWithSeconds(formData.stDate, false),
                endDate: toIsoWithSeconds(formData.endDate, true),
            }
            const response = await axios.post(`${base}/sales`, payload, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            
            if (response.status === 200) {
                message.success(response.data?.message || 'Thêm khuyến mãi thành công')
                if (typeof onClose === 'function') onClose()
                if (typeof fetchSales === 'function') fetchSales()
            } else {
                message.error(response.data?.message || 'Thêm khuyến mãi thất bại')
            }
        } catch (error) {
            message.error(error?.response?.data?.message || 'Thêm khuyến mãi thất bại')
        }
    }
    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal">
                <div className="modal-header">
                    <h2 className="modal-title">Thêm khuyến mãi</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Tên khuyến mãi</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
                            <label htmlFor="description">Mô tả khuyến mãi</label>
                            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} />
                            <label htmlFor="stDate">Ngày giờ bắt đầu</label>
                            <input type="datetime-local" id="stDate" name="stDate" value={formData.stDate} onChange={handleInputChange} />
                            <label htmlFor="endDate">Ngày giờ kết thúc</label>
                            <input type="datetime-local" id="endDate" name="endDate" value={formData.endDate} onChange={handleInputChange} />
                        </div>
                        <button type="submit" className="btn btn-primary">Thêm khuyến mãi</button>
                    </form>
                </div>
            </div>

            <button onClick={onClose}>Close</button>
        </div>
    )
}