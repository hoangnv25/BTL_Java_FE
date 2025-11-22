import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { base } from "../../../service/Base.jsx";
import { App } from "antd";
import { jwtDecode } from "jwt-decode";
import { Trash2, Edit2, MoreVertical } from "lucide-react";
import { handleDeleteFeedback } from "./DeleteFeedback";
import { handleUpdateFeedback } from "./UpdateFeedback";
import ConfirmDialog from "../../Profile/Review/ConfirmDialog";
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
    const [formData, setFormData] = useState({
        rating: 0,
        comment: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingFeedbackId, setEditingFeedbackId] = useState(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [selectedFeedbackToDelete, setSelectedFeedbackToDelete] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null); // Track which feedback's menu is open

    const totalFeedbacks = feedbackData?.totalFeedbacks || 0;

    const distribution = useMemo(() => {
        const dist = feedbackData?.ratingDistribution || {};
        return STAR_LEVELS.map(level => ({
            level,
            count: Number(dist[level] ?? 0)
        }));
    }, [feedbackData]);

    // API Get Feedback
    const handleGetFeedback = async (productIdParam) => {
        if (!productIdParam) {
            return { success: false, error: 'NO_PRODUCT_ID' };
        }

        try {
            const response = await axios.get(`${base}/feedback/${productIdParam}`, {
                headers: {
                    // Không cần authentication cho API get feedback
                }
            });

            // Kiểm tra response status
            if (response.status === 200) {
                const responseData = response.data;

                // Kiểm tra code response
                if (responseData?.code === 1000 && responseData?.result) {
                    const result = responseData.result;

                    // Format data theo đúng structure
                    const formattedData = {
                        productId: result.productId || productIdParam,
                        productName: result.productName || '',
                        averageRating: Number(result.averageRating) || 0,
                        totalFeedbacks: Number(result.totalFeedbacks) || 0,
                        ratingDistribution: result.ratingDistribution || {
                            "1": 0,
                            "2": 0,
                            "3": 0,
                            "4": 0,
                            "5": 0
                        },
                        feedbacks: Array.isArray(result.feedbacks)
                            ? result.feedbacks.map(fb => ({
                                id: fb.id,
                                userId: fb.userId,
                                userFullName: fb.userFullName || 'Khách hàng',
                                productId: fb.productId || productIdParam,
                                productName: fb.productName || result.productName || '',
                                rating: Number(fb.rating) || 0,
                                note: fb.note || '',
                                createdAt: fb.createdAt || null
                            }))
                            : []
                    };

                    return { success: true, data: formattedData };
                } else {
                    const errorMsg = responseData?.message || 'Không thể tải đánh giá sản phẩm';
                    return { success: false, error: errorMsg };
                }
            } else {
                const errorMsg = response.data?.message || 'Không thể tải đánh giá sản phẩm';
                return { success: false, error: errorMsg };
            }
        } catch (err) {
            console.error('[Feedback] Error getting feedback:', err);

            const errorMsg = err?.response?.data?.message
                || err?.response?.data?.error
                || 'Có lỗi khi tải đánh giá sản phẩm';

            return { success: false, error: errorMsg };
        }
    };

    // Refresh feedback data (sau khi create/update/delete)
    const fetchFeedbackData = async () => {
        if (!productId) return;

        try {
            setLoading(true);
            setError(null);

            const result = await handleGetFeedback(productId);

            if (result.success && result.data) {
                setFeedbackData(result.data);
            } else {
                setError(result.error || 'Không thể tải đánh giá sản phẩm');
                setFeedbackData(null);
            }
        } catch (err) {
            console.error('[Feedback] Error refreshing feedback:', err);
            setError('Có lỗi khi tải đánh giá sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    // useEffect để fetch feedback khi productId thay đổi
    useEffect(() => {
        if (!productId) {
            setFeedbackData(null);
            return;
        }

        let cancelled = false;

        const loadFeedback = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await handleGetFeedback(productId);

                if (!cancelled) {
                    if (result.success && result.data) {
                        setFeedbackData(result.data);
                    } else {
                        setError(result.error || 'Không thể tải đánh giá sản phẩm');
                        setFeedbackData(null);
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    console.error('[Feedback] Unexpected error:', err);
                    setError('Có lỗi không mong muốn xảy ra');
                    setFeedbackData(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadFeedback();

        return () => {
            cancelled = true;
        };
    }, [productId]);

    // API Create Feedback
    const handleCreateFeedback = async (rating, note) => {
        const token = localStorage.getItem('token');
        if (!token) {
            message.warning('Vui lòng đăng nhập để đánh giá sản phẩm');
            return { success: false, error: 'UNAUTHORIZED' };
        }

        if (!productId) {
            message.error('Không tìm thấy sản phẩm');
            return { success: false, error: 'NO_PRODUCT_ID' };
        }

        if (!rating || rating === 0) {
            message.warning('Vui lòng chọn số sao đánh giá');
            return { success: false, error: 'NO_RATING' };
        }

        if (!note || !note.trim()) {
            message.warning('Vui lòng nhập nhận xét');
            return { success: false, error: 'NO_NOTE' };
        }

        try {
            const payload = {
                rating: String(rating), // API yêu cầu rating là string
                note: note.trim()
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

            // Kiểm tra response thành công
            if (response.status === 200 || response.status === 201) {
                const responseData = response.data;

                // Kiểm tra code response (nếu API trả về format {code, message, result})
                if (responseData?.code === 1000 || response.status === 200 || response.status === 201) {
                    message.success('Đã gửi đánh giá thành công!');
                    return { success: true, data: responseData };
                } else {
                    const errorMsg = responseData?.message || 'Không thể gửi đánh giá';
                    message.error(errorMsg);
                    return { success: false, error: errorMsg };
                }
            } else {
                const errorMsg = response.data?.message || 'Không thể gửi đánh giá';
                message.error(errorMsg);
                return { success: false, error: errorMsg };
            }
        } catch (err) {
            console.error('[Feedback] Error creating feedback:', err);

            // Xử lý các lỗi cụ thể
            if (err?.response?.status === 401) {
                message.error('Vui lòng đăng nhập lại');
                return { success: false, error: 'UNAUTHORIZED' };
            } else if (err?.response?.status === 403) {
                message.error('Bạn không có quyền thực hiện hành động này');
                return { success: false, error: 'FORBIDDEN' };
            } else if (err?.response?.status === 400) {
                const errorMsg = err?.response?.data?.message || 'Dữ liệu không hợp lệ';
                message.error(errorMsg);
                return { success: false, error: errorMsg };
            } else {
                const errorMsg = err?.response?.data?.message || 'Có lỗi khi gửi đánh giá. Vui lòng thử lại sau.';
                message.error(errorMsg);
                return { success: false, error: errorMsg };
            }
        }
    };

    // Kiểm tra quyền quản lý feedback
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
            return decodedToken.sub || decodedToken.userId || decodedToken.id || decodedToken.user_id || decodedToken.username || null;
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
        const feedbackUserId = feedbackItem.userId;

        // Chỉ user tạo feedback mới được chỉnh sửa/xóa
        return currentUserId && feedbackUserId && String(currentUserId) === String(feedbackUserId);
    };

    const canEditFeedback = (feedbackItem) => canManageFeedback(feedbackItem);
    const canDeleteFeedback = (feedbackItem) => canManageFeedback(feedbackItem);

    // Handle edit feedback
    const handleEditFeedback = (feedbackItem) => {
        if (!canEditFeedback(feedbackItem)) return;
        const feedbackId = feedbackItem.id;
        if (!feedbackId) {
            message.error('Không tìm thấy mã đánh giá để chỉnh sửa');
            return;
        }
        setFormData({
            rating: Number(feedbackItem.rating) || 0,
            comment: feedbackItem.note || ""
        });
        setIsEditing(true);
        setEditingFeedbackId(feedbackId);
        setShowForm(true);
    };

    // Handle delete feedback click
    const handleDeleteClick = (feedbackItem) => {
        if (!canDeleteFeedback(feedbackItem)) {
            message.error('Bạn không có quyền xóa đánh giá này');
            return;
        }
        setSelectedFeedbackToDelete(feedbackItem);
        setShowConfirmDelete(true);
    };

    // Handle confirm delete
    const handleConfirmDelete = async () => {
        if (!selectedFeedbackToDelete) return;

        const feedbackId = selectedFeedbackToDelete.id;
        const result = await handleDeleteFeedback(productId, feedbackId);

        if (result?.success) {
            setShowConfirmDelete(false);
            setSelectedFeedbackToDelete(null);
            // Refresh danh sách feedback
            await fetchFeedbackData();
        }
    };

    // Handle submit form (create hoặc update)
    const handleSubmitFeedback = async (e) => {
        e.preventDefault();

        setSubmitting(true);

        try {
            let result;

            if (isEditing && editingFeedbackId) {
                // Update feedback
                result = await handleUpdateFeedback(
                    productId,
                    editingFeedbackId,
                    formData.rating,
                    formData.comment
                );
            } else {
                // Create feedback
                result = await handleCreateFeedback(
                    formData.rating,
                    formData.comment
                );
            }

            if (result?.success) {
                // Reset form
                setFormData({ rating: 0, comment: "" });
                setShowForm(false);
                setIsEditing(false);
                setEditingFeedbackId(null);

                // Refresh danh sách feedback
                await fetchFeedbackData();
            }
        } catch (err) {
            console.error('[Feedback] Unexpected error:', err);
            message.error('Có lỗi không mong muốn xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openMenuId && !event.target.closest('.pf-feedback-menu-wrapper')) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [openMenuId]);

    if (!productId) return null;

    return (
        <section className="product-feedback">
            <div className="pf-header">
                <h2>Đánh giá sản phẩm</h2>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    {totalFeedbacks > 0 && <span>{totalFeedbacks} đánh giá</span>}
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
                    {feedbackData && (
                        <>
                            <div className="pf-summary">
                                <div className="pf-summary-score">
                                    <span className="pf-score-number">
                                        {Number(feedbackData.averageRating || 0).toFixed(1)}
                                    </span>
                                    {renderStars(feedbackData.averageRating || 0)}
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
                                {Array.isArray(feedbackData.feedbacks) && feedbackData.feedbacks.length > 0 ? (
                                    feedbackData.feedbacks.map((item, index) => (
                                        <div className="pf-feedback-card" key={item.id || index}>
                                            <div className="pf-feedback-header">
                                                <div className="pf-feedback-user">
                                                    <div className="pf-feedback-avatar">
                                                        <span className="pf-feedback-avatar-placeholder">
                                                            {(item.userFullName || "KH")[0]?.toUpperCase() || "KH"}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="pf-feedback-name">
                                                            {item.userFullName || "Khách hàng"}
                                                        </div>
                                                        <div className="pf-feedback-date">
                                                            {formatDate(item.createdAt) || "—"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
                                                    {renderStars(item.rating || 0)}
                                                    {(canEditFeedback(item) || canDeleteFeedback(item)) && (
                                                        <div className="pf-feedback-menu-wrapper">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setOpenMenuId(openMenuId === item.id ? null : item.id);
                                                                }}
                                                                className="pf-btn-menu"
                                                                title="Tùy chọn"
                                                            >
                                                                <MoreVertical size={18} />
                                                            </button>
                                                            {openMenuId === item.id && (
                                                                <div className="pf-feedback-menu">
                                                                    {canEditFeedback(item) && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleEditFeedback(item);
                                                                                setOpenMenuId(null);
                                                                            }}
                                                                            className="pf-menu-item pf-menu-item-edit"
                                                                        >
                                                                            <Edit2 size={16} />
                                                                            <span>Chỉnh sửa</span>
                                                                        </button>
                                                                    )}
                                                                    {canDeleteFeedback(item) && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeleteClick(item);
                                                                                setOpenMenuId(null);
                                                                            }}
                                                                            className="pf-menu-item pf-menu-item-delete"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                            <span>Xóa</span>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {item.note && (
                                                <p className="pf-feedback-comment">{item.note}</p>
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
                    {!feedbackData && !loading && !error && (
                        <div className="pf-empty">
                            <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                            <p>Hãy là người đầu tiên chia sẻ cảm nhận của bạn!</p>
                        </div>
                    )}
                </>
            )}

            <ConfirmDialog
                open={showConfirmDelete}
                title="Xác nhận xóa đánh giá"
                message="Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác."
                confirmText="Xóa đánh giá"
                cancelText="Hủy"
                type="danger"
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setShowConfirmDelete(false);
                    setSelectedFeedbackToDelete(null);
                }}
            />
        </section>
    );
}

