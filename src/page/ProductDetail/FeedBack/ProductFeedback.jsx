import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { base } from "../../../service/Base.jsx";
import { App } from "antd";
import { jwtDecode } from "jwt-decode";
import { Trash2, Edit2 } from "lucide-react";
import "./ProductFeedback.css";

const STAR_LEVELS = [5, 4, 3, 2, 1];

const renderStars = (rating = 0) => {
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.5;
    const empty = 5 - full - (hasHalf ? 1 : 0);

    return (
        <span className="pf-stars">
            {Array.from({ length: full }).map((_, idx) => (
                <span key={`full-${idx}`} className="pf-star pf-star--full">★</span>
            ))}
            {hasHalf && <span className="pf-star pf-star--half">★</span>}
            {Array.from({ length: empty }).map((_, idx) => (
                <span key={`empty-${idx}`} className="pf-star pf-star--empty">★</span>
            ))}
        </span>
    );
};

const formatDate = (dateValue) => {
    if (!dateValue) return "";
    try {
        return new Date(dateValue).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    } catch {
        return "";
    }
};

export default function ProductFeedback({ productId }) {
    const { message } = App.useApp();
    const [feedbackData, setFeedbackData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingFeedbackId, setEditingFeedbackId] = useState(null);
    const [formData, setFormData] = useState({
        rating: 0,
        comment: "",
        images: []
    });
    const [submitting, setSubmitting] = useState(false);
    const [userAvatars, setUserAvatars] = useState(new Map()); // Map userId -> avatar

    const totalFeedbacks = feedbackData?.totalFeedbacks || 0;

    const distribution = useMemo(() => {
        const dist = feedbackData?.ratingDistribution || {};
        return STAR_LEVELS.map(level => ({
            level,
            count: Number(dist[level] ?? 0)
        }));
    }, [feedbackData]);

    useEffect(() => {
        if (!productId) {
            setFeedbackData(null);
            return;
        }

        let cancelled = false;

        const fetchFeedback = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${base}/feedback/${productId}`, {
                    headers: {
                        // Không cần authentication cho API get feedback
                    }
                });
                if (!cancelled) {
                    if (response.status === 200 && response.data?.code === 1000) {
                        const result = response.data.result;
                        setFeedbackData(result);
                        
                        // Fetch avatars cho các user trong feedback
                        if (Array.isArray(result.feedbacks) && result.feedbacks.length > 0) {
                            const userIds = [...new Set(result.feedbacks.map(fb => fb.userId).filter(Boolean))];
                            console.log('Fetching avatars for userIds:', userIds);
                            if (userIds.length > 0 && !cancelled) {
                                // Fetch avatars
                                const avatarMap = new Map();
                                const promises = userIds.map(async (userId) => {
                                    try {
                                        // Thử không cần auth trước
                                        let userResponse;
                                        try {
                                            userResponse = await axios.get(`${base}/users/${userId}`, {
                                                headers: {}
                                            });
                                        } catch (authErr) {
                                            // Nếu lỗi 401/403, thử với token
                                            const token = localStorage.getItem('token');
                                            if (token) {
                                                userResponse = await axios.get(`${base}/users/${userId}`, {
                                                    headers: {
                                                        'Authorization': `Bearer ${token}`
                                                    }
                                                });
                                            } else {
                                                throw authErr;
                                            }
                                        }
                                        
                                        if (userResponse && userResponse.status === 200) {
                                            const userData = userResponse.data?.result || userResponse.data?.data || userResponse.data;
                                            console.log(`User ${userId} data:`, userData);
                                            if (userData?.avatar) {
                                                // Đảm bảo avatar là URL đầy đủ
                                                const avatarUrl = userData.avatar.startsWith('http') || userData.avatar.startsWith('/')
                                                    ? userData.avatar
                                                    : `${base}/${userData.avatar}`;
                                                console.log(`Setting avatar for user ${userId}:`, avatarUrl);
                                                avatarMap.set(userId, avatarUrl);
                                            } else {
                                                console.log(`No avatar found for user ${userId}`);
                                            }
                                        }
                                    } catch (err) {
                                        console.log(`Failed to fetch avatar for user ${userId}:`, err?.response?.status || err.message);
                                        // Ignore error, sẽ dùng placeholder
                                    }
                                });
                                await Promise.all(promises);
                                if (!cancelled) {
                                    setUserAvatars(prev => {
                                        const newMap = new Map(prev);
                                        avatarMap.forEach((avatar, userId) => {
                                            newMap.set(userId, avatar);
                                        });
                                        return newMap;
                                    });
                                }
                            }
                        }
                    } else {
                        setError(response.data?.message || "Không thể tải đánh giá sản phẩm");
                        setFeedbackData(null);
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err?.response?.data?.message || "Có lỗi khi tải đánh giá sản phẩm");
                    setFeedbackData(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchFeedback();

        return () => {
            cancelled = true;
        };
    }, [productId]);

    const fetchFeedbackData = async () => {
        if (!productId) return;
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${base}/feedback/${productId}`, {
                headers: {}
            });
            if (response.status === 200 && response.data?.code === 1000) {
                const result = response.data.result;
                setFeedbackData(result);
                
                // Fetch avatars cho các user trong feedback
                if (Array.isArray(result.feedbacks) && result.feedbacks.length > 0) {
                    const userIds = [...new Set(result.feedbacks.map(fb => fb.userId).filter(Boolean))];
                    if (userIds.length > 0) {
                        // Fetch avatars
                        const avatarMap = new Map();
                        const promises = userIds.map(async (userId) => {
                            try {
                                // Thử không cần auth trước
                                let userResponse;
                                try {
                                    userResponse = await axios.get(`${base}/users/${userId}`, {
                                        headers: {}
                                    });
                                } catch (authErr) {
                                    // Nếu lỗi 401/403, thử với token
                                    const token = localStorage.getItem('token');
                                    if (token) {
                                        userResponse = await axios.get(`${base}/users/${userId}`, {
                                            headers: {
                                                'Authorization': `Bearer ${token}`
                                            }
                                        });
                                    } else {
                                        throw authErr;
                                    }
                                }
                                
                                if (userResponse && userResponse.status === 200) {
                                    const userData = userResponse.data?.result || userResponse.data?.data || userResponse.data;
                                    if (userData?.avatar) {
                                        // Đảm bảo avatar là URL đầy đủ
                                        const avatarUrl = userData.avatar.startsWith('http') || userData.avatar.startsWith('/')
                                            ? userData.avatar
                                            : `${base}/${userData.avatar}`;
                                        avatarMap.set(userId, avatarUrl);
                                    }
                                }
                            } catch (err) {
                                console.log(`Failed to fetch avatar for user ${userId}:`, err?.response?.status || err.message);
                                // Ignore error, sẽ dùng placeholder
                            }
                        });
                        await Promise.all(promises);
                        setUserAvatars(prev => {
                            const newMap = new Map(prev);
                            avatarMap.forEach((avatar, userId) => {
                                newMap.set(userId, avatar);
                            });
                            return newMap;
                        });
                    }
                }
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Có lỗi khi tải đánh giá sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            message.warning('Vui lòng đăng nhập để đánh giá sản phẩm');
            return;
        }

        if (isEditing && !editingFeedbackId) {
            message.error('Không xác định được đánh giá cần chỉnh sửa');
            return;
        }

        if (formData.rating === 0) {
            message.warning('Vui lòng chọn số sao đánh giá');
            return;
        }

        if (!formData.comment.trim()) {
            message.warning('Vui lòng nhập đánh giá');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                rating: String(formData.rating),
                note: formData.comment.trim()
            };
            let response;

            if (isEditing && editingFeedbackId) {
                response = await axios.put(`${base}/feedback/${productId}/${editingFeedbackId}`, payload, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                response = await axios.post(`${base}/feedback/${productId}`, payload, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }

            if (response.status === 200 || response.status === 201) {
                message.success(isEditing ? 'Đã cập nhật đánh giá thành công!' : 'Đã gửi đánh giá thành công!');
                setFormData({ rating: 0, comment: "", images: [] });
                setShowForm(false);
                setIsEditing(false);
                setEditingFeedbackId(null);
                // Refresh danh sách feedback
                await fetchFeedbackData();
            } else {
                message.error(response.data?.message || 'Không thể gửi đánh giá');
            }
        } catch (err) {
            console.error('Error submitting feedback:', err);
            message.error(err?.response?.data?.message || 'Có lỗi khi gửi đánh giá');
        } finally {
            setSubmitting(false);
        }
    };

    const checkIsAdmin = () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken.scope?.includes('ROLE_ADMIN') || false;
        } catch {
            return false;
        }
    };

    const getCurrentUserId = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const decodedToken = jwtDecode(token);
            // Thử nhiều field có thể chứa userId
            const userId = decodedToken.sub || decodedToken.userId || decodedToken.id || decodedToken.user_id || null;
            return userId;
        } catch {
            return null;
        }
    };

    const canManageFeedback = (feedbackItem) => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        const isAdmin = checkIsAdmin();
        if (isAdmin) return true; // Admin có thể chỉnh sửa/xóa mọi feedback

        const currentUserId = getCurrentUserId();
        // API trả về userId trực tiếp trong feedback item
        const feedbackUserId = feedbackItem.userId || feedbackItem.user_id || feedbackItem.user?.id;
        
        // Chỉ user tạo feedback mới được chỉnh sửa/xóa
        const canModify = currentUserId && feedbackUserId && String(currentUserId) === String(feedbackUserId);
        
        return canModify;
    };

    const canEditFeedback = (feedbackItem) => canManageFeedback(feedbackItem);
    const canDeleteFeedback = (feedbackItem) => canManageFeedback(feedbackItem);

    const handleEditFeedback = (feedbackItem) => {
        if (!canEditFeedback(feedbackItem)) return;
        const feedbackId = feedbackItem.id || feedbackItem.feedbackId || feedbackItem.feedback_id;
        if (!feedbackId) {
            message.error('Không tìm thấy mã đánh giá để chỉnh sửa');
            return;
        }
        const currentRating = Number(feedbackItem.rating || feedbackItem.star || 0);
        setFormData({
            rating: Number.isNaN(currentRating) ? 0 : currentRating,
            comment: feedbackItem.note || feedbackItem.feedback || ""
        });
        setIsEditing(true);
        setEditingFeedbackId(feedbackId);
        setShowForm(true);
    };

    const handleDeleteFeedback = async (feedbackId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            message.warning('Vui lòng đăng nhập');
            return;
        }

        if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
            return;
        }

        try {
            const response = await axios.delete(`${base}/feedback/${productId}/${feedbackId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200 || response.status === 204) {
                message.success('Đã xóa đánh giá thành công!');
                if (isEditing && editingFeedbackId === feedbackId) {
                    setIsEditing(false);
                    setEditingFeedbackId(null);
                    setFormData({ rating: 0, comment: "", images: [] });
                    setShowForm(false);
                }
                // Refresh danh sách feedback
                await fetchFeedbackData();
            } else {
                message.error(response.data?.message || 'Không thể xóa đánh giá');
            }
        } catch (err) {
            console.error('Error deleting feedback:', err);
            message.error(err?.response?.data?.message || 'Có lỗi khi xóa đánh giá');
        }
    };

    if (!productId) return null;

    return (
        <section className="product-feedback">
            <div className="pf-header">
                <h2>Đánh giá sản phẩm</h2>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    {totalFeedbacks > 0 && <span>{totalFeedbacks} đánh giá</span>}
                    <button 
                        type="button"
                        onClick={() => {
                            const token = localStorage.getItem('token');
                            if (!token) {
                                message.warning('Vui lòng đăng nhập để đánh giá sản phẩm');
                                return;
                            }
                            if (showForm) {
                                setShowForm(false);
                                setIsEditing(false);
                                setEditingFeedbackId(null);
                                setFormData({ rating: 0, comment: "", images: [] });
                            } else {
                                setShowForm(true);
                                setIsEditing(false);
                                setEditingFeedbackId(null);
                                setFormData({ rating: 0, comment: "", images: [] });
                            }
                        }}
                        className="pf-btn-add"
                    >
                        {showForm ? (isEditing ? 'Hủy chỉnh sửa' : 'Hủy') : 'Viết đánh giá'}
                    </button>
                </div>
            </div>

            {showForm && (
                <form className="pf-form" onSubmit={handleSubmitFeedback}>
                    <div className="pf-form-title">
                        {isEditing ? 'Chỉnh sửa đánh giá của bạn' : 'Viết đánh giá của bạn'}
                    </div>
                    <div className="pf-form-group">
                        <label>Đánh giá của bạn:</label>
                        <div className="pf-form-rating">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`pf-form-star ${formData.rating >= star ? 'active' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="pf-form-group">
                        <label htmlFor="pf-comment">Nhận xét:</label>
                        <textarea
                            id="pf-comment"
                            value={formData.comment}
                            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                            rows={4}
                            required
                        />
                    </div>
                    <div className="pf-form-actions">
                        <button type="submit" disabled={submitting} className="pf-btn-submit">
                            {submitting
                                ? (isEditing ? 'Đang cập nhật...' : 'Đang gửi...')
                                : (isEditing ? 'Cập nhật đánh giá' : 'Gửi đánh giá')}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <div className="pf-loading">
                    <div className="pf-skeleton pf-skeleton--summary" />
                    <div className="pf-skeleton pf-skeleton--list" />
                </div>
            ) : error ? (
                <div className="pf-error">{error}</div>
            ) : (
                <>
                    <div className="pf-summary">
                        <div className="pf-summary-score">
                            <span className="pf-score-number">
                                {Number(feedbackData?.averageRating || 0).toFixed(1)}
                            </span>
                            {renderStars(feedbackData?.averageRating || 0)}
                            <span className="pf-score-label">
                                {totalFeedbacks > 0 ? `Dựa trên ${totalFeedbacks} đánh giá` : "Chưa có đánh giá"}
                            </span>
                        </div>
                        <div className="pf-distribution">
                            {distribution.map(({ level, count }) => {
                                const width = totalFeedbacks > 0 ? (count / totalFeedbacks) * 100 : 0;
                                return (
                                    <div className="pf-distribution-row" key={level}>
                                        <span className="pf-distribution-label">{level}</span>
                                        <div className="pf-distribution-bar">
                                            <div
                                                className="pf-distribution-bar-fill"
                                                style={{ width: `${width}%` }}
                                            />
                                        </div>
                                        <span className="pf-distribution-count">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pf-feedback-list">
                        {Array.isArray(feedbackData?.feedbacks) && feedbackData.feedbacks.length > 0 ? (
                            feedbackData.feedbacks.map((item, index) => (
                                <div className="pf-feedback-card" key={item.id || index}>
                                    <div className="pf-feedback-header">
                                        <div className="pf-feedback-user">
                                            <div className="pf-feedback-avatar">
                                                {(userAvatars.get(item.userId) || item.user?.avatar) ? (
                                                    <img 
                                                        src={userAvatars.get(item.userId) || item.user?.avatar} 
                                                        alt={item.userFullName || "avatar"}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <span 
                                                    className="pf-feedback-avatar-placeholder"
                                                    style={{ display: (userAvatars.get(item.userId) || item.user?.avatar) ? 'none' : 'flex' }}
                                                >
                                                    {(item.userFullName || item.user?.name || "KH")[0]?.toUpperCase() || "KH"}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="pf-feedback-name">
                                                    {item.userFullName || item.user?.name || item.userName || "Khách hàng"}
                                                </div>
                                                <div className="pf-feedback-date">
                                                    {formatDate(item.createdAt) || "—"}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            {renderStars(item.rating || item.star || 0)}
                                            {canEditFeedback(item) && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditFeedback(item)}
                                                    className="pf-btn-edit"
                                                    title="Chỉnh sửa đánh giá"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            )}
                                            {canDeleteFeedback(item) && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteFeedback(item.id || item.feedbackId || item.feedback_id)}
                                                    className="pf-btn-delete"
                                                    title="Xóa đánh giá"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {item.note && (
                                        <p className="pf-feedback-comment">{item.note}</p>
                                    )}
                                    {item.images && item.images.length > 0 && (
                                        <div className="pf-feedback-images">
                                            {item.images.map((img, idx) => (
                                                <img key={idx} src={img} alt={`feedback-${idx}`} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="pf-empty">
                                <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                                <p>Hãy là người đầu tiên chia sẻ cảm nhận của bạn!</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </section>
    );
}