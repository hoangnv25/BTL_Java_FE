import './Review.css'
import axios from 'axios';
import { base } from '../../../service/Base';
import { useEffect, useState } from 'react';
import { Star, Send, MessageSquare, Trash2 } from 'lucide-react';

export default function Review({ onClose, open }) {
    const token = localStorage.getItem('token')
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [checking, setChecking] = useState(true);
    const [hasReview, setHasReview] = useState(false);
    const [existingReview, setExistingReview] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!open || !token) {
            setChecking(false);
            return;
        }

        const checkExistingReview = async () => {
            try {
                setChecking(true);
                const response = await axios.get(`${base}/reviews/user`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200 && response.data?.data && response.data.data.length > 0) {
                    const review = response.data.data[0];
                    setHasReview(true);
                    setExistingReview(review);
                    // Load dữ liệu vào form để chỉnh sửa
                    setRating(parseInt(review.rating) || 0);
                    setComment(review.comment || '');
                } else {
                    setHasReview(false);
                }
            } catch (err) {
                console.error('Error checking review:', err);
                // Nếu API không tồn tại hoặc lỗi, cho phép tạo review
                setHasReview(false);
            } finally {
                setChecking(false);
            }
        };

        checkExistingReview();
    }, [open, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!rating || rating === 0) {
            setError('Vui lòng chọn đánh giá sao');
            return;
        }

        if (!comment.trim()) {
            setError('Vui lòng nhập bình luận');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let response;
            
            if (hasReview && existingReview) {
                // Update existing review
                const reviewId = existingReview.id || existingReview.reviewId || existingReview.comment_id;
                response = await axios.put(
                    `${base}/reviews/${reviewId}`,
                    {
                        rating: rating.toString(),
                        comment: comment.trim()
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            } else {
                // Create new review
                response = await axios.post(
                    `${base}/reviews`,
                    {
                        rating: rating.toString(),
                        comment: comment.trim()
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }

            if (response.status === 200 || response.status === 201) {
                setSuccess(true);
                setSuccessMessage(hasReview ? 'Đánh giá đã được cập nhật thành công!' : 'Đánh giá của bạn đã được gửi thành công!');
                
                // Nếu là tạo mới, fetch lại review để có reviewId
                if (!hasReview) {
                    try {
                        const checkResponse = await axios.get(`${base}/reviews/user`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        if (checkResponse.status === 200 && checkResponse.data?.data && checkResponse.data.data.length > 0) {
                            const review = checkResponse.data.data[0];
                            setHasReview(true);
                            setExistingReview(review);
                        }
                    } catch (err) {
                        console.error('Error fetching review after creation:', err);
                    }
                } else {
                    // Cập nhật existingReview với dữ liệu mới
                    if (existingReview) {
                        setExistingReview({
                            ...existingReview,
                            rating: rating,
                            comment: comment.trim()
                        });
                    }
                }
                
                setTimeout(() => {
                    setSuccess(false);
                    setSuccessMessage('');
                    if (onClose) onClose();
                }, 2000);
            }
        } catch (err) {
            console.error('Error saving review:', err);
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu đánh giá. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!existingReview) return;

        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?');
        if (!confirmDelete) return;

        setDeleting(true);
        setError('');

        try {
            const reviewId = existingReview.id || existingReview.reviewId || existingReview.comment_id;
            const response = await axios.delete(
                `${base}/reviews/${reviewId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200 || response.status === 204) {
                setSuccess(true);
                setSuccessMessage('Đánh giá đã được xóa thành công!');
                setHasReview(false);
                setExistingReview(null);
                setRating(0);
                setComment('');
                setTimeout(() => {
                    setSuccess(false);
                    setSuccessMessage('');
                    if (onClose) onClose();
                }, 2000);
            }
        } catch (err) {
            console.error('Error deleting review:', err);
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại.');
        } finally {
            setDeleting(false);
        }
    };

    if (!open) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && onClose) {
            onClose();
        }
    };

    if (checking) {
        return (
            <div className="review-overlay" onClick={handleOverlayClick}>
                <div className="review-form-container" onClick={(e) => e.stopPropagation()}>
                    <div className="review-checking">
                        <div className="spinner-small"></div>
                        <p>Đang kiểm tra...</p>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="review-overlay" onClick={handleOverlayClick}>
            <div className="review-form-container" onClick={(e) => e.stopPropagation()}>
            <div className="review-form-header">
                <div className="review-form-title">
                    <MessageSquare size={24} />
                    <h2>{hasReview ? 'Chỉnh sửa đánh giá' : 'Đánh giá về shop'}</h2>
                </div>
                {onClose && (
                    <button className="close-btn" onClick={onClose}>×</button>
                )}
            </div>
            {hasReview && (
                <div className="review-note-banner">
                    <p>Bạn đã đánh giá shop. Bạn có thể cập nhật đánh giá của mình.</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="review-form">
                <div className="form-group">
                    <label className="form-label">Đánh giá của bạn *</label>
                    <div className="rating-container">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                            >
                                <Star size={32} fill={star <= (hoverRating || rating) ? '#fbbf24' : 'none'} />
                            </button>
                        ))}
                    </div>
                    {rating > 0 && (
                        <p className="rating-text">
                            {rating === 1 && 'Rất không hài lòng'}
                            {rating === 2 && 'Không hài lòng'}
                            {rating === 3 && 'Bình thường'}
                            {rating === 4 && 'Hài lòng'}
                            {rating === 5 && 'Rất hài lòng'}
                        </p>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="comment" className="form-label">Bình luận *</label>
                    <textarea
                        id="comment"
                        className="comment-input"
                        rows="6"
                        placeholder="Chia sẻ trải nghiệm của bạn về shop..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxLength={500}
                    />
                    <div className="char-count">{comment.length}/500</div>
                </div>

                {error && (
                    <div className="error-message">{error}</div>
                )}

                {success && (
                    <div className="success-message">
                        ✓ {successMessage}
                    </div>
                )}

                <div className="form-actions">
                    {onClose && (
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={loading || deleting}
                        >
                            Hủy
                        </button>
                    )}
                    {hasReview && existingReview && (
                        <button
                            type="button"
                            className="btn-delete"
                            onClick={handleDelete}
                            disabled={loading || deleting}
                        >
                            {deleting ? (
                                <>
                                    <div className="spinner-small"></div>
                                    <span>Đang xóa...</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 size={18} />
                                    <span>Xóa đánh giá</span>
                                </>
                            )}
                        </button>
                    )}
                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={loading || deleting || !rating || !comment.trim()}
                    >
                        {loading ? (
                            <>
                                <div className="spinner-small"></div>
                                <span>Đang {hasReview ? 'cập nhật' : 'gửi'}...</span>
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                <span>{hasReview ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
}
