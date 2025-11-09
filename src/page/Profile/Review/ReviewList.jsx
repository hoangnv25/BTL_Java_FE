import './ReviewList.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { base } from '../../../service/Base';
import { Star, Plus, Edit2, Trash2, MessageSquare } from 'lucide-react';
import Review from './Review';

export default function ReviewList({ open, onClose }) {
    const token = localStorage.getItem('token');
    const [reviews, setReviews] = useState([]);
    const [allReviews, setAllReviews] = useState([]); // Lưu tất cả reviews
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [ratingFilter, setRatingFilter] = useState('all'); // 'all', 1, 2, 3, 4, 5

    useEffect(() => {
        if (!open || !token) {
            setLoading(false);
            return;
        }

        fetchReviews();
    }, [open, token]);

    // Filter reviews khi ratingFilter thay đổi
    useEffect(() => {
        if (ratingFilter === 'all') {
            setReviews(allReviews);
        } else {
            const filtered = allReviews.filter(review => {
                const reviewRating = Number(review.rating) || 0;
                return reviewRating === Number(ratingFilter);
            });
            setReviews(filtered);
        }
    }, [ratingFilter, allReviews]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            
            // Lấy thông tin user để có userId
            const userResponse = await axios.get(`${base}/users/myInfor`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const currentUser = userResponse.data?.result || userResponse.data?.data || userResponse.data;
            const userId = currentUser?.id || currentUser?.userId || currentUser?.user_id;
            
            if (!userId) {
                setReviews([]);
                setLoading(false);
                return;
            }
            
            // Lấy tất cả reviews của user
            const reviewsResponse = await axios.get(`${base}/reviews/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // Parse reviews
            let reviewsData = [];
            let overallRating = null;
            
            if (reviewsResponse.data?.result?.reviews && Array.isArray(reviewsResponse.data.result.reviews)) {
                reviewsData = reviewsResponse.data.result.reviews;
                // Lấy rating chung từ result.rating
                overallRating = reviewsResponse.data.result.rating;
            } else if (reviewsResponse.data?.result && Array.isArray(reviewsResponse.data.result)) {
                reviewsData = reviewsResponse.data.result;
            } else if (reviewsResponse.data?.data && Array.isArray(reviewsResponse.data.data)) {
                reviewsData = reviewsResponse.data.data;
            } else if (Array.isArray(reviewsResponse.data)) {
                reviewsData = reviewsResponse.data;
            }
            
            // Nếu có overallRating, gán vào mỗi review nếu review chưa có rating
            if (overallRating !== null) {
                reviewsData = reviewsData.map(review => ({
                    ...review,
                    rating: review.rating || overallRating
                }));
            }
            
            setAllReviews(reviewsData);
            setReviews(reviewsData); // Set cả reviews để hiển thị ngay
        } catch (err) {
            setAllReviews([]);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setSelectedReview(null);
        setIsCreateMode(true);
        setShowReviewForm(true);
    };

    const handleEditReview = (review) => {
        setSelectedReview(review);
        setIsCreateMode(false);
        setShowReviewForm(true);
    };

    const handleCloseForm = () => {
        setShowReviewForm(false);
        setSelectedReview(null);
        setIsCreateMode(false);
        // Refresh danh sách reviews sau khi đóng form
        fetchReviews();
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                // Full star
                stars.push(
                    <Star
                        key={i}
                        size={16}
                        fill="#fbbf24"
                        color="#fbbf24"
                    />
                );
            } else if (i === fullStars + 1 && hasHalfStar) {
                // Half star
                stars.push(
                    <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                        <Star size={16} fill="none" color="#d1d5db" />
                        <Star 
                            size={16} 
                            fill="#fbbf24" 
                            color="#fbbf24"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)'
                            }}
                        />
                    </div>
                );
            } else {
                // Empty star
                stars.push(
                    <Star
                        key={i}
                        size={16}
                        fill="none"
                        color="#d1d5db"
                    />
                );
            }
        }
        return stars;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!open) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && onClose) {
            onClose();
        }
    };

    return (
        <>
            <div className="review-list-overlay" onClick={handleOverlayClick}>
                <div className="review-list-container" onClick={(e) => e.stopPropagation()}>
                    <div className="review-list-header">
                        <div className="review-list-title">
                            <MessageSquare size={24} />
                            <h2>Quản lý đánh giá</h2>
                        </div>
                        <button className="review-list-close" onClick={onClose}>×</button>
                    </div>

                    <div className="review-list-actions">
                        <button className="btn-create-review" onClick={handleCreateNew}>
                            <Plus size={20} />
                            <span>Tạo đánh giá mới</span>
                        </button>
                    </div>

                    {/* Filter by rating */}
                    {!loading && allReviews.length > 0 && (
                        <div className="review-filter">
                            <span className="filter-label">Lọc theo đánh giá:</span>
                            <div className="filter-buttons">
                                <button
                                    className={`filter-btn ${ratingFilter === 'all' ? 'active' : ''}`}
                                    onClick={() => setRatingFilter('all')}
                                >
                                    Tất cả
                                    <span className="filter-count">({allReviews.length})</span>
                                </button>
                                {[5, 4, 3, 2, 1].map((rating) => {
                                    const count = allReviews.filter(r => Number(r.rating) === rating).length;
                                    return (
                                        <button
                                            key={rating}
                                            className={`filter-btn ${ratingFilter === rating ? 'active' : ''}`}
                                            onClick={() => setRatingFilter(rating)}
                                            disabled={count === 0}
                                        >
                                            <Star size={14} fill={ratingFilter === rating ? '#fbbf24' : 'none'} color="#fbbf24" />
                                            <span>{rating}</span>
                                            <span className="filter-count">({count})</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="review-list-content">
                        {loading ? (
                            <div className="review-list-loading">
                                <div className="spinner"></div>
                                <p>Đang tải danh sách đánh giá...</p>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="review-list-empty">
                                <MessageSquare size={64} />
                                <h3>Chưa có đánh giá nào</h3>
                                <p>Bạn chưa tạo đánh giá nào. Hãy tạo đánh giá đầu tiên của bạn!</p>
                                <button className="btn-create-first" onClick={handleCreateNew}>
                                    <Plus size={20} />
                                    <span>Tạo đánh giá đầu tiên</span>
                                </button>
                            </div>
                        ) : (
                            <div className="reviews-grid">
                                {reviews.map((review) => {
                                    const rating = parseInt(review.rating) || 0;
                                    
                                    return (
                                        <div key={review.id} className="review-card">
                                            <div className="review-card-header">
                                                <div className="review-rating">
                                                    {renderStars(rating)}
                                                    <span className="rating-number">{rating}/5</span>
                                                </div>
                                            <div className="review-card-actions">
                                                <button
                                                    className="btn-icon btn-edit"
                                                    onClick={() => handleEditReview(review)}
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="review-card-content">
                                            <p>{review.comment || review.content || 'Không có nội dung'}</p>
                                        </div>
                                        <div className="review-card-footer">
                                            <span className="review-date">
                                                {review.createdAt ? formatDate(review.createdAt) : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Form tạo/sửa review */}
            {showReviewForm && (
                <Review
                    open={showReviewForm}
                    onClose={handleCloseForm}
                    existingReview={selectedReview}
                    isCreateMode={isCreateMode}
                />
            )}
        </>
    );
}

