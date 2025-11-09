import './Review.css'
import axios from 'axios';
import { base } from '../../../service/Base';
import { useEffect, useState } from 'react';
import { Star, Send, MessageSquare, Trash2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

export default function Review({ onClose, open, existingReview: initialReview, isCreateMode }) {
    const token = localStorage.getItem('token')
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [checking, setChecking] = useState(!initialReview && !isCreateMode); // Chỉ check nếu không có initialReview
    const [hasReview, setHasReview] = useState(!!initialReview);
    const [existingReview, setExistingReview] = useState(initialReview);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    // Load dữ liệu từ initialReview nếu có
    useEffect(() => {
        if (initialReview) {
            setRating(parseInt(initialReview.rating) || 0);
            setComment(initialReview.comment || initialReview.content || '');
            setHasReview(true);
            setExistingReview(initialReview);
        } else if (isCreateMode) {
            setRating(0);
            setComment('');
            setHasReview(false);
            setExistingReview(null);
        }
    }, [initialReview, isCreateMode]);

    useEffect(() => {
        // Nếu đã có initialReview hoặc isCreateMode thì không cần check
        if (initialReview || isCreateMode) {
            setChecking(false);
            return;
        }

        if (!open || !token) {
            setChecking(false);
            return;
        }

        const checkExistingReview = async () => {
            try {
                setChecking(true);
                
                // Lấy thông tin user hiện tại để có userId
                const userResponse = await axios.get(`${base}/users/myInfor`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                const currentUser = userResponse.data?.result || userResponse.data?.data || userResponse.data;
                const userId = currentUser?.id || currentUser?.userId || currentUser?.user_id;
                
                if (!userId) {
                    setHasReview(false);
                    return;
                }
                
                // Lấy review của user bằng API getReviewByUserId
                const reviewsResponse = await axios.get(`${base}/reviews/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                // Parse reviews data - xử lý nhiều format
                let reviewData = null;
                
                // Trường hợp đặc biệt: result.reviews là array (backend format mới)
                if (reviewsResponse.data?.result?.reviews && Array.isArray(reviewsResponse.data.result.reviews)) {
                    if (reviewsResponse.data.result.reviews.length > 0) {
                        reviewData = reviewsResponse.data.result.reviews[0];
                        // Thêm rating từ result.rating nếu có
                        if (reviewsResponse.data.result.rating && !reviewData.rating) {
                            reviewData.rating = reviewsResponse.data.result.rating;
                        }
                    }
                }
                // Trường hợp 1: response.data.result là array
                else if (reviewsResponse.data?.result && Array.isArray(reviewsResponse.data.result)) {
                    if (reviewsResponse.data.result.length > 0) {
                        reviewData = reviewsResponse.data.result[0];
                    }
                }
                // Trường hợp 2: response.data.result là single object (có id)
                else if (reviewsResponse.data?.result && typeof reviewsResponse.data.result === 'object' && reviewsResponse.data.result.id) {
                    reviewData = reviewsResponse.data.result;
                }
                // Trường hợp 3: response.data.data là array
                else if (reviewsResponse.data?.data && Array.isArray(reviewsResponse.data.data)) {
                    if (reviewsResponse.data.data.length > 0) {
                        reviewData = reviewsResponse.data.data[0];
                    }
                }
                // Trường hợp 4: response.data.data là single object
                else if (reviewsResponse.data?.data && typeof reviewsResponse.data.data === 'object' && reviewsResponse.data.data.id) {
                    reviewData = reviewsResponse.data.data;
                }
                // Trường hợp 5: response.data là array trực tiếp
                else if (Array.isArray(reviewsResponse.data)) {
                    if (reviewsResponse.data.length > 0) {
                        reviewData = reviewsResponse.data[0];
                    }
                }
                // Trường hợp 6: response.data là single object trực tiếp (có id)
                else if (reviewsResponse.data && typeof reviewsResponse.data === 'object' && reviewsResponse.data.id) {
                    reviewData = reviewsResponse.data;
                }
                
                if (reviewData) {
                    setHasReview(true);
                    setExistingReview(reviewData);
                    // Load dữ liệu vào form để chỉnh sửa
                    setRating(parseInt(reviewData.rating) || 0);
                    setComment(reviewData.comment || reviewData.content || '');
                } else {
                    setHasReview(false);
                    setExistingReview(null);
                    setRating(0);
                    setComment('');
                }
            } catch (err) {
                
                // Nếu lỗi 404 (không có review) hoặc lỗi khác, cho phép tạo review mới
                setHasReview(false);
                setExistingReview(null);
                setRating(0);
                setComment('');
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
                        rating: rating,
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
                        rating: rating,
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
                        // Ignore error
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
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu đánh giá. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = () => {
        if (!existingReview) return;
        setShowConfirmDelete(true);
    };

    const handleDelete = async () => {
        setShowConfirmDelete(false);
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
                        {[1, 2, 3, 4, 5].map((starIndex) => {
                            const currentRating = hoverRating || rating;
                            const isFull = starIndex <= currentRating;
                            const isHalf = starIndex - 0.5 === currentRating;
                            
                            return (
                                <div key={starIndex} className="star-wrapper">
                                    {/* Half star button (left half) */}
                                    <button
                                        type="button"
                                        className="star-btn star-half-btn"
                                        onClick={() => setRating(starIndex - 0.5)}
                                        onMouseEnter={() => setHoverRating(starIndex - 0.5)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        <Star 
                                            size={32} 
                                            fill={isHalf || isFull ? '#fbbf24' : 'none'}
                                            color="#fbbf24"
                                            style={{
                                                clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)'
                                            }}
                                        />
                                    </button>
                                    {/* Full star button (right half) */}
                                    <button
                                        type="button"
                                        className="star-btn star-full-btn"
                                        onClick={() => setRating(starIndex)}
                                        onMouseEnter={() => setHoverRating(starIndex)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        <Star 
                                            size={32} 
                                            fill={isFull ? '#fbbf24' : 'none'}
                                            color="#fbbf24"
                                        />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    {rating > 0 && (
                        <p className="rating-text">
                            {rating <= 1 && 'Rất không hài lòng'}
                            {rating > 1 && rating <= 2 && 'Không hài lòng'}
                            {rating > 2 && rating < 4 && 'Bình thường'}
                            {rating >= 4 && rating < 5 && 'Hài lòng'}
                            {rating === 5 && 'Rất hài lòng'}
                            <span style={{marginLeft: '8px', color: '#9ca3af'}}>({rating} sao)</span>
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
                            onClick={confirmDelete}
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

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={showConfirmDelete}
                title="Xóa đánh giá"
                message="Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác."
                confirmText="Xóa đánh giá"
                cancelText="Hủy"
                type="danger"
                onConfirm={handleDelete}
                onCancel={() => setShowConfirmDelete(false)}
            />
        </div>
    );
}
