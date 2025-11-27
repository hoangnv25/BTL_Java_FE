import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Home, Package } from 'lucide-react';
import './PaymentResult.css';

// Modal nhỏ để dùng trong trang Profile
export function PaymentNotificationModal({ open, isSuccess, orderInfo, onClose }) {
  if (!open) return null;

  return (
    <div className="payment-notification-backdrop" onClick={onClose}>
      <div 
        className={`payment-notification-modal ${isSuccess ? 'success' : 'failed'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="payment-notification-icon-wrapper">
          {isSuccess ? (
            <CheckCircle className="payment-notification-icon success-icon" />
          ) : (
            <XCircle className="payment-notification-icon failed-icon" />
          )}
        </div>

        <h2 className="payment-notification-title">
          {isSuccess ? 'Thanh toán thành công!' : 'Đã hủy thanh toán'}
        </h2>

        <p className="payment-notification-message">
          {isSuccess ? (
            <>
              Đơn hàng của bạn đã được thanh toán thành công.
              <br />
              Bạn có thể kiểm tra đơn hàng trong trang này.
            </>
          ) : (
            <>
              Bạn đã hủy thanh toán.
              <br />
              Bạn có thể thử lại bất cứ lúc nào.
            </>
          )}
        </p>

        {isSuccess && orderInfo?.orderCode && (
          <div className="payment-notification-order-info">
            <span className="order-info-label">Mã đơn hàng:</span>
            <span className="order-info-value">{orderInfo.orderCode}</span>
          </div>
        )}

        <button 
          className={`payment-notification-btn ${isSuccess ? 'success' : 'failed'}`}
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}

// Trang Payment Result đầy đủ
export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    const success = searchParams.get('success');
    const failed = searchParams.get('failed');
    
    // Lấy thông tin đơn hàng từ query params (nếu có)
    const orderId = searchParams.get('orderId');
    const orderCode = searchParams.get('orderCode');
    const amount = searchParams.get('amount');

    if (success === 'true' || success === '1') {
      setIsSuccess(true);
      setOrderInfo({ orderId, orderCode, amount });
    } else if (failed === 'true' || failed === '1') {
      setIsSuccess(false);
    }
  }, [searchParams]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/user?tab=orders');
  };

  const handleRetryPayment = () => {
    navigate('/cart');
  };

  if (isSuccess === null) {
    return (
      <div className="payment-result-container">
        <div className="payment-result-loading">
          <div className="spinner"></div>
          <p>Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-result-container">
      <div className={`payment-result-modal ${isSuccess ? 'success' : 'failed'}`}>
        <div className="payment-result-icon-wrapper">
          {isSuccess ? (
            <CheckCircle className="payment-result-icon success-icon" />
          ) : (
            <XCircle className="payment-result-icon failed-icon" />
          )}
        </div>

        <h1 className="payment-result-title">
          {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
        </h1>

        <p className="payment-result-message">
          {isSuccess ? (
            <>
              Đơn hàng của bạn đã được xác nhận và đang được xử lý.
              <br />
              Cảm ơn bạn đã mua hàng tại cửa hàng chúng tôi!
            </>
          ) : (
            <>
              Rất tiếc, thanh toán của bạn không thành công.
              <br />
              Vui lòng thử lại hoặc liên hệ với chúng tôi để được hỗ trợ.
            </>
          )}
        </p>

        {isSuccess && orderInfo && (
          <div className="payment-result-order-info">
            {orderInfo.orderCode && (
              <div className="order-info-item">
                <span className="order-info-label">Mã đơn hàng:</span>
                <span className="order-info-value">{orderInfo.orderCode}</span>
              </div>
            )}
            {orderInfo.amount && (
              <div className="order-info-item">
                <span className="order-info-label">Tổng tiền:</span>
                <span className="order-info-value">
                  {Number(orderInfo.amount).toLocaleString('vi-VN')} ₫
                </span>
              </div>
            )}
          </div>
        )}

        <div className="payment-result-actions">
          {isSuccess ? (
            <>
              <button 
                className="payment-result-btn primary"
                onClick={handleViewOrders}
              >
                <Package size={20} />
                Xem đơn hàng
              </button>
              <button 
                className="payment-result-btn secondary"
                onClick={handleGoHome}
              >
                <Home size={20} />
                Về trang chủ
              </button>
            </>
          ) : (
            <>
              <button 
                className="payment-result-btn primary"
                onClick={handleRetryPayment}
              >
                Thử lại
              </button>
              <button 
                className="payment-result-btn secondary"
                onClick={handleGoHome}
              >
                <Home size={20} />
                Về trang chủ
              </button>
            </>
          )}
        </div>

        {isSuccess && (
          <div className="payment-result-footer">
            <p className="payment-result-note">
              📧 Chúng tôi đã gửi email xác nhận đơn hàng đến địa chỉ email của bạn
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

