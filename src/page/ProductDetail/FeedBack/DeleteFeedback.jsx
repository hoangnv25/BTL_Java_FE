import axios from "axios";
import { base } from "../../../service/Base.jsx";
import { message } from "antd";

/**
 * API Delete Feedback
 * @param {number} productId - ID của sản phẩm
 * @param {number} feedbackId - ID của feedback cần xóa
 * @returns {Promise<{success: boolean, error?: string, data?: any}>}
 */
export const handleDeleteFeedback = async (productId, feedbackId) => {
    
    const token = localStorage.getItem('token');
    
    if (!token) {
        message.warning('Vui lòng đăng nhập');
        return { success: false, error: 'UNAUTHORIZED' };
    }

    if (!productId || !feedbackId) {
        message.error('Thông tin không đầy đủ');
        return { success: false, error: 'MISSING_DATA' };
    }

    try {
        const response = await axios.delete(
            `${base}/feedback/${productId}/${feedbackId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        // Kiểm tra response thành công
        if (response.status === 200 || response.status === 204) {
            const responseData = response.data;
            
            // Kiểm tra code response (nếu API trả về format {code, message, result})
            if (responseData?.code === 1000 || response.status === 200 || response.status === 204) {
                message.success('Đã xóa đánh giá thành công!');
                return { success: true, data: responseData };
            } else {
                const errorMsg = responseData?.message || 'Không thể xóa đánh giá';
                message.error(errorMsg);
                return { success: false, error: errorMsg };
            }
        } else {
            const errorMsg = response.data?.message || 'Không thể xóa đánh giá';
            message.error(errorMsg);
            return { success: false, error: errorMsg };
        }
    } catch (err) {
        console.error('[Feedback] Error deleting feedback:', err);
        
        // Xử lý các lỗi cụ thể
        if (err?.response?.status === 401) {
            message.error('Vui lòng đăng nhập lại');
            return { success: false, error: 'UNAUTHORIZED' };
        } else if (err?.response?.status === 403) {
            message.error('Bạn không có quyền xóa đánh giá này');
            return { success: false, error: 'FORBIDDEN' };
        } else if (err?.response?.status === 404) {
            message.error('Không tìm thấy đánh giá cần xóa');
            return { success: false, error: 'NOT_FOUND' };
        } else if (err?.response?.status === 400) {
            const errorMsg = err?.response?.data?.message || 'Dữ liệu không hợp lệ';
            message.error(errorMsg);
            return { success: false, error: errorMsg };
        } else {
            const errorMsg = err?.response?.data?.message 
                || err?.response?.data?.error 
                || 'Có lỗi khi xóa đánh giá. Vui lòng thử lại sau.';
            message.error(errorMsg);
            return { success: false, error: errorMsg };
        }
    }
};

