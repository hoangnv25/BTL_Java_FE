import React, { useState } from 'react';
import { App } from 'antd';
import axios from 'axios';
import { base } from '../../../service/Base';
import './ProductFeedback.css'; // Reuse existing styles

export default function FeedbackModal({ productId, productName, onClose, onSuccess }) {
    const { message } = App.useApp();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        if (!token) {
            message.warning('Vui lòng đăng nhập để đánh giá sản phẩm');
            return;
        }

        if (!rating || rating === 0) {
            message.warning('Vui lòng chọn số sao đánh giá');
            return;
        }

        if (!comment || !comment.trim()) {
            message.warning('Vui lòng nhập nhận xét');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                rating: String(rating),
                note: comment.trim()
            };

            const response = await axios.post(
                `${base}/feedback/${productId}`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200 || response.status === 201) {
                message.success('Đã gửi đánh giá thành công!');
                if (onSuccess) onSuccess();
                onClose();
            } else {
                message.error(response.data?.message || 'Không thể gửi đánh giá');
            }
        } catch (err) {
            console.error('[Feedback] Error creating feedback:', err);
            const errorMsg = err?.response?.data?.message || 'Có lỗi khi gửi đánh giá';
            message.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="profile-order-modal-backdrop" onClick={onClose}>
            <div className="profile-order-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '100%' }}>
                <div className="profile-order-modal-header">
                    <h4>Đánh giá sản phẩm</h4>
                </div>
                <div className="profile-order-modal-body">
                    <p style={{ marginBottom: '16px', fontWeight: 500 }}>{productName}</p>
                    
                    <form id="feedback-form" onSubmit={handleSubmit}>
                        <div className="pf-form-group">
                            <label>Đánh giá của bạn:</label>
                            <div className="pf-form-rating" style={{ justifyContent: 'center', margin: '10px 0' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`pf-form-star ${rating >= star ? 'active' : ''}`}
                                        onClick={() => setRating(star)}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="pf-form-group">
                            <label htmlFor="modal-comment">Nhận xét:</label>
                            <textarea
                                id="modal-comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                                rows={4}
                                required
                                style={{ width: '100%' }}
                            />
                        </div>
                    </form>
                </div>
                <div className="profile-order-modal-footer">
                    <button
                        type="button"
                        className="profile-btn profile-btn-secondary"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        form="feedback-form"
                        className="profile-btn profile-btn-primary" // Assuming this class exists or I'll use inline style/pf-btn-submit
                        style={{ background: '#2563eb', color: 'white', border: 'none' }}
                        disabled={submitting}
                    >
                        {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>
                </div>
            </div>
        </div>
    );
}
