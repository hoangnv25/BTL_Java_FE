import axios from "axios";
import { base } from "../../../service/Base.jsx";
import { message } from "antd";

/**
 * API Update Feedback
 * @param {number} productId - ID của sản phẩm
 * @param {number} feedbackId - ID của feedback cần cập nhật
 * @param {number} rating - Số sao đánh giá (1-5)
 * @param {string} note - Nội dung đánh giá
 * @returns {Promise<{success: boolean, error?: string, data?: any}>}
 */
export const handleUpdateFeedback = async (productId, feedbackId, rating, note) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        message.warning('Vui lòng đăng nhập');
        return { success: false, error: 'UNAUTHORIZED' };
    }

    if (!productId || !feedbackId) {
        message.error('Thông tin không đầy đủ');
        return { success: false, error: 'MISSING_DATA' };
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

        const response = await axios.put(
            `${base}/feedback/${productId}/${feedbackId}`,
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
                message.success('Đã cập nhật đánh giá thành công!');
                return { success: true, data: responseData };
            } else {
                const errorMsg = responseData?.message || 'Không thể cập nhật đánh giá';
                message.error(errorMsg);
                return { success: false, error: errorMsg };
            }
        } else {
            const errorMsg = response.data?.message || 'Không thể cập nhật đánh giá';
            message.error(errorMsg);
            return { success: false, error: errorMsg };
        }
    } catch (err) {
        console.error('[Feedback] Error updating feedback:', err);
        
        // Xử lý các lỗi cụ thể
        if (err?.response?.status === 401) {
            message.error('Vui lòng đăng nhập lại');
            return { success: false, error: 'UNAUTHORIZED' };
        } else if (err?.response?.status === 403) {
            message.error('Bạn không có quyền chỉnh sửa đánh giá này');
            return { success: false, error: 'FORBIDDEN' };
        } else if (err?.response?.status === 404) {
            message.error('Không tìm thấy đánh giá cần cập nhật');
            return { success: false, error: 'NOT_FOUND' };
        } else if (err?.response?.status === 400) {
            const errorMsg = err?.response?.data?.message || 'Dữ liệu không hợp lệ';
            message.error(errorMsg);
            return { success: false, error: errorMsg };
        } else {
            const errorMsg = err?.response?.data?.message 
                || err?.response?.data?.error 
                || 'Có lỗi khi cập nhật đánh giá. Vui lòng thử lại sau.';
            message.error(errorMsg);
            return { success: false, error: errorMsg };
        }
    }
};

