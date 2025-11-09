import './AdminReview.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { base } from '../../../service/Base';
import { Star, Trash2, MessageSquare, User } from 'lucide-react';
import ConfirmDialog from '../Components/ConfirmDialog';

export default function AdminReview() {
    const token = localStorage.getItem('token');
    const [reviews, setReviews] = useState([]);
    const [allReviews, setAllReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ratingFilter, setRatingFilter] = useState('all');
    const [deletingId, setDeletingId] = useState(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [usersMap, setUsersMap] = useState(new Map());

    useEffect(() => {
        fetchData();
    }, []);

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

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch reviews trước
            const reviewsResponse = await axios.get(`${base}/reviews`);
            
            // Parse reviews data
            let reviewsData = [];
            if (reviewsResponse.data?.result && Array.isArray(reviewsResponse.data.result)) {
                reviewsData = reviewsResponse.data.result;
            } else if (reviewsResponse.data?.data && Array.isArray(reviewsResponse.data.data)) {
                reviewsData = reviewsResponse.data.data;
            } else if (Array.isArray(reviewsResponse.data)) {
                reviewsData = reviewsResponse.data;
            }
            
            // Fetch users để lấy thông tin bổ sung
            let userMap = new Map();
            try {
                const usersResponse = await axios.get(`${base}/users`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                
                const usersArray = usersResponse.data?.result || usersResponse.data?.data || usersResponse.data || [];
                usersArray.forEach(user => {
                    if (user.userName) {
                        userMap.set(user.userName, user);
                    }
                });
                setUsersMap(userMap);
            } catch (userErr) {
                // Ignore user fetch error
            }
            
            // Map reviews với user data
            const enrichedReviews = reviewsData.map(review => {
                const fullName = review.fullName || review.user_fullName || review.userName || 'Unknown';
                const user = userMap.get(fullName);
                
                return {
                    ...review,
                    userFullName: fullName,
                    userAvatar: user?.avatar || null,
                    userEmail: user?.email || null,
                    userPhone: user?.phoneNumber || null
                };
            });
            
            // Sort by createdAt (mới nhất trước)
            enrichedReviews.sort((a, b) => {
                const dateA = new Date(a.createdAt || 0);
                const dateB = new Date(b.createdAt || 0);
                return dateB - dateA;
            });
            
            setAllReviews(enrichedReviews);
            setReviews(enrichedReviews);
        } catch (err) {
            setAllReviews([]);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (review) => {
        setSelectedReview(review);
        setShowConfirmDelete(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedReview) return;
        
        setShowConfirmDelete(false);
        setDeletingId(selectedReview.id);
        
        try {
            await axios.delete(`${base}/reviews/${selectedReview.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // Remove from state
            setAllReviews(prev => prev.filter(r => r.id !== selectedReview.id));
            setReviews(prev => prev.filter(r => r.id !== selectedReview.id));
        } catch (err) {
            console.error('Error deleting review:', err);
            alert('Có lỗi xảy ra khi xóa review. Vui lòng thử lại.');
        } finally {
            setDeletingId(null);
            setSelectedReview(null);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(
                    <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                );
            } else if (i === fullStars + 1 && hasHalfStar) {
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
                stars.push(
                    <Star key={i} size={16} fill="none" color="#d1d5db" />
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

    return (
        <div className="admin-review-page">
            <div className="admin-review-header">
                <div className="admin-review-title">
                    <MessageSquare size={28} />
                    <h1>Quản lý đánh giá</h1>
                </div>
                <div className="admin-review-stats">
                    <div className="stat-item">
                        <span className="stat-label">Tổng đánh giá</span>
                        <span className="stat-value">{allReviews.length}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Đang hiển thị</span>
                        <span className="stat-value">{reviews.length}</span>
                    </div>
                </div>
            </div>

            {/* Filter by rating */}
            {!loading && allReviews.length > 0 && (
                <div className="admin-review-filter">
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

            <div className="admin-review-content">
                {loading ? (
                    <div className="admin-review-loading">
                        <div className="spinner"></div>
                        <p>Đang tải danh sách đánh giá...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="admin-review-empty">
                        <MessageSquare size={64} />
                        <h3>Chưa có đánh giá nào</h3>
                        <p>Chưa có đánh giá nào trong hệ thống.</p>
                    </div>
                ) : (
                    <div className="admin-reviews-grid">
                        {reviews.map((review) => {
                            const rating = parseFloat(review.rating) || 0;
                            return (
                                <div key={review.id} className="admin-review-card">
                                    {/* User Info */}
                                    <div className="review-user-info">
                                        <div className="user-avatar">
                                            {review.userAvatar ? (
                                                <img 
                                                    src={review.userAvatar.startsWith('http') || review.userAvatar.startsWith('/') 
                                                        ? review.userAvatar 
                                                        : `${base}/${review.userAvatar}`
                                                    } 
                                                    alt={review.userFullName}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div className="user-avatar-fallback" style={{ display: review.userAvatar ? 'none' : 'flex' }}>
                                                <User size={20} />
                                            </div>
                                        </div>
                                        <div className="user-details">
                                            <h4>{review.userFullName}</h4>
                                            {review.userEmail && <p className="user-email">{review.userEmail}</p>}
                                            {review.userPhone && <p className="user-phone">{review.userPhone}</p>}
                                        </div>
                                    </div>

                                    {/* Rating & Actions */}
                                    <div className="review-card-header">
                                        <div className="review-rating">
                                            {renderStars(rating)}
                                            <span className="rating-number">{rating}/5</span>
                                        </div>
                                        <div className="review-card-actions">
                                            <button
                                                className="btn-icon btn-delete"
                                                onClick={() => handleDeleteClick(review)}
                                                disabled={deletingId === review.id}
                                                title="Xóa đánh giá"
                                            >
                                                {deletingId === review.id ? (
                                                    <div className="spinner-small"></div>
                                                ) : (
                                                    <Trash2 size={20} strokeWidth={2.5} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Comment */}
                                    <div className="review-card-content">
                                        <p>{review.comment || review.content || 'Không có nội dung'}</p>
                                    </div>

                                    {/* Footer */}
                                    <div className="review-card-footer">
                                        <span className="review-date">
                                            {review.createdAt ? formatDate(review.createdAt) : 'N/A'}
                                        </span>
                                        <span className="review-id">ID: {review.id}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={showConfirmDelete}
                title="Xóa đánh giá"
                message={`Bạn có chắc chắn muốn xóa đánh giá của ${selectedReview?.userFullName}? Hành động này không thể hoàn tác.`}
                confirmText="Xóa đánh giá"
                cancelText="Hủy"
                type="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                    setShowConfirmDelete(false);
                    setSelectedReview(null);
                }}
            />
        </div>
    );
}

