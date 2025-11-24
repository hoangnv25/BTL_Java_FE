import React, { useState } from 'react';
import './Contact.css';
import Breadcrumb from '../../components/Breadcrumb';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { message } from 'antd';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function Contact() {
    usePageTitle('Liên hệ');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Liên hệ" }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý gửi form ở đây
        message.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
    };

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div className="contact-page">
                <div className="contact-container">
                    <section className="contact-hero">
                        <h1 className="contact-title">Liên hệ với chúng tôi</h1>
                        <p className="contact-subtitle">
                            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy gửi tin nhắn cho chúng tôi!
                        </p>
                    </section>

                    <div className="contact-content">
                        <div className="contact-info-section">
                            <h2 className="section-title">Thông tin liên hệ</h2>
                            <div className="contact-info-list">
                                <div className="contact-info-item">
                                    <div className="contact-info-icon">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3>Điện thoại</h3>
                                        <p>1900 1234</p>
                                        <p className="contact-info-note">Thứ 2 - Chủ nhật: 8:00 - 22:00</p>
                                    </div>
                                </div>
                                <div className="contact-info-item">
                                    <div className="contact-info-icon">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3>Email</h3>
                                        <p>support@fashco.com</p>
                                        <p className="contact-info-note">Phản hồi trong vòng 24 giờ</p>
                                    </div>
                                </div>
                                <div className="contact-info-item">
                                    <div className="contact-info-icon">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3>Địa chỉ</h3>
                                        <p>123 Đường ABC, Quận XYZ, Hà Nội</p>
                                        <p className="contact-info-note">Thứ 2 - Chủ nhật: 9:00 - 21:00</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-section">
                            <h2 className="section-title">Gửi tin nhắn</h2>
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Họ và tên *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Nhập họ và tên của bạn"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="0123 456 789"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="subject">Chủ đề *</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nhập chủ đề"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Nội dung tin nhắn *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        placeholder="Nhập nội dung tin nhắn của bạn..."
                                    />
                                </div>
                                <button type="submit" className="submit-button">
                                    <Send size={20} />
                                    <span>Gửi tin nhắn</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

