import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { base } from '../../service/Base';
import { addPendingPayment } from '../../utils/pendingPayment';
import AddressManager from '../../page/Profile/Address/Address';
import './Checkout.css';
import { App } from 'antd';
import { CreditCard, Banknote } from 'lucide-react';

export default function Checkout({
  open,
  items = [],
  onClose,
  onOrderSuccess,
}) {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(null); // 'CASH' hoặc 'VNPAY'
  const { message } = App.useApp();

  const loadDefaultAddress = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setSelectedAddress(null);
      setAddressError('Bạn cần đăng nhập để chọn địa chỉ');
      return;
    }

    try {
      setLoadingAddress(true);
      setAddressError('');
      const res = await axios.get(`${base}/address/default`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200 && res.data) {
        setSelectedAddress((prev) => prev || res.data);
      } else {
        setSelectedAddress((prev) => prev || null);
      }
    } catch (error) {
      setSelectedAddress((prev) => prev || null);
      setAddressError('Không thể tải địa chỉ mặc định. Vui lòng thử lại.');
    } finally {
      setLoadingAddress(false);
    }
  };

  const loadUserPhone = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUserPhone('');
      setShippingPhone('');
      return;
    }

    try {
      const res = await axios.get(`${base}/users/myInfor`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200 && res.data) {
        const phone = res.data.phoneNumber || res.data.phone || '';
        setUserPhone(phone);
        setShippingPhone(prev => prev || phone);
      } else {
        setUserPhone('');
        setShippingPhone('');
      }
    } catch {
      setUserPhone('');
      setShippingPhone('');
    }
  };

  useEffect(() => {
    if (!open) return;
    if (showAddressModal) return;
    loadDefaultAddress();
  }, [open, showAddressModal]);

  useEffect(() => {
    if (!open) return;
    loadUserPhone();
  }, [open]);

  useEffect(() => {
    if (open) {
      setNote('');
      setShippingPhone(prev => prev || userPhone || '');
      setPaymentMethod(null);
    }
  }, [open, userPhone]);

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      const discount = item.product?.discount || 0;
      const finalPrice = price * (1 - discount / 100);
      return sum + finalPrice * item.quantity;
    }, 0);
  }, [items]);

  const handleConfirm = async () => {
    if (!items.length) {
      message.error('Không có sản phẩm nào được chọn.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Vui lòng đăng nhập để đặt hàng');
      onClose?.();
      return;
    }

    if (!shippingPhone.trim()) {
      message.error('Vui lòng nhập số điện thoại nhận hàng');
      return;
    }

    if (!selectedAddress?.address_id) {
      message.error('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    if (!paymentMethod) {
      message.error('Vui lòng chọn phương thức thanh toán');
      return;
    }

    const payload = {
      note: note || undefined,
      phoneNumber: shippingPhone.trim(),
      items: items.map(it => ({
        variationId: it.product_variation_id,
        quantity: it.quantity,
      })),
    };

    payload.addressId = selectedAddress.address_id;

    try {
      setIsSubmitting(true);
      const res = await axios.post(`${base}/orders`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200 || res.status === 201) {
        const orderId =
          res.data?.result?.orderId ??
          res.data?.result?.id ??
          res.data?.orderId ??
          res.data?.id;

        if (orderId) {
          try {
            await axios.patch(
              `${base}/orders/${orderId}/update`,
              {
                addressId: selectedAddress.address_id,
                phoneNumber: shippingPhone.trim(),
                note: note || undefined,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );
          } catch (patchError) {
            console.error('Failed to update order info', patchError);
            message.warning('Đặt hàng xong nhưng không cập nhật được thông tin giao hàng.');
          }

          // Xử lý thanh toán sau khi tạo đơn thành công
          try {
            let paymentUrl = `${base}/api/payment/create?orderId=${orderId}&paymentMethod=${paymentMethod}`;
            if (paymentMethod === 'VNPAY') {
              paymentUrl += '&bankCode=NCB';
            }
            
            const paymentResponse = await axios.post(paymentUrl, {}, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            // Nếu là VNPAY và có paymentUrl trong response, chuyển hướng đến trang thanh toán
            if (paymentMethod === 'VNPAY' && paymentResponse.data?.paymentUrl) {
              // Xóa giỏ hàng trước khi chuyển hướng
              try {
                await Promise.allSettled(
                  items.map((it) =>
                    axios.delete(`${base}/cart/${it.product_variation_id}`, {
                      headers: { Authorization: `Bearer ${token}` },
                    })
                  )
                );
              } catch (cleanupError) {
                console.error('Failed to clean up cart items', cleanupError);
              }
              
              message.success('Đang chuyển đến trang thanh toán...');
              addPendingPayment(orderId, paymentResponse.data.paymentUrl);
              // Mở trang thanh toán VNPAY ở tab mới để không mất trạng thái hiện tại
              window.open(paymentResponse.data.paymentUrl, '_blank', 'noopener,noreferrer');
              return;
            }
          } catch (paymentError) {
            console.error('Failed to create payment', paymentError);
            message.warning('Đặt hàng thành công nhưng không tạo được thanh toán. Vui lòng liên hệ hỗ trợ.');
          }
        }

        // Xóa giỏ hàng cho trường hợp thanh toán tiền mặt
        try {
          await Promise.allSettled(
            items.map((it) =>
              axios.delete(`${base}/cart/${it.product_variation_id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
            )
          );
        } catch (cleanupError) {
          console.error('Failed to clean up cart items', cleanupError);
        }

        message.success('Đặt hàng thành công!');
        onOrderSuccess?.(items);
        setNote('');
        onClose?.();
        return;
      }

      throw new Error('Unexpected status when creating order');
    } catch (error) {
      message.error(error?.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div className="checkout-modal-backdrop" onClick={onClose}>
        <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
          <div className="checkout-modal-header">
            <div>
              <h2>Xác nhận đơn hàng</h2>
              <p>Kiểm tra thông tin trước khi đặt</p>
            </div>
            <button className="checkout-close-btn" onClick={onClose} aria-label="Đóng">
              ×
            </button>
          </div>

          <div className="checkout-modal-body">
            <section className="checkout-section">
              <div className="checkout-section-header">
                <h3>Địa chỉ nhận hàng</h3>
                <button
                  type="button"
                  className="checkout-link-btn"
                  onClick={() => setShowAddressModal(true)}
                >
                  Quản lý địa chỉ
                </button>
              </div>
              <div className="checkout-address-block">
                {loadingAddress && <p>Đang tải địa chỉ...</p>}
                {!loadingAddress && addressError && (
                  <p className="checkout-address-error">{addressError}</p>
                )}
                {!loadingAddress && !addressError && !selectedAddress && (
                  <p>Chưa có địa chỉ mặc định. Hãy thêm một địa chỉ để tiếp tục.</p>
                )}
                {!loadingAddress && selectedAddress && (
                  <div className="checkout-address-details">
                    <p>
                      <strong>Đường:</strong> {selectedAddress.street}
                    </p>
                    <p>
                      <strong>Phường/Xã:</strong> {selectedAddress.ward}
                    </p>
                    <p>
                      <strong>Quận/Huyện:</strong> {selectedAddress.city}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="checkout-section">
              <div className="checkout-section-header">
                <h3>Số điện thoại nhận hàng</h3>
                {userPhone && (
                  <button
                    type="button"
                    className="checkout-link-btn"
                    onClick={() => setShippingPhone(userPhone)}
                  >
                    Dùng số mặc định
                  </button>
                )}
              </div>
              <input
                className="checkout-phone-input"
                value={shippingPhone}
                onChange={(e) => setShippingPhone(e.target.value)}
                placeholder="Nhập số điện thoại nhận hàng"
                type="tel"
              />
            </section>

            <section className="checkout-section">
              <div className="checkout-section-header">
                <h3>Sản phẩm</h3>
                <span>{items.length} sản phẩm</span>
              </div>
              <div className="checkout-items">
                {items.map((item) => {
                  const itemKey = `${item.product_id}-${item.product_variation_id}`;
                  const price = item.product?.price || 0;
                  const discount = item.product?.discount || 0;
                  const finalPrice = price * (1 - discount / 100);
                  return (
                    <div className="checkout-item" key={itemKey}>
                      <div className="checkout-item-image">
                        <img
                          src={item.selectedVariation?.image || item.product?.thumbnail}
                          alt={item.product?.title || 'Sản phẩm'}
                          onError={(e) => {
                            if (item.product?.thumbnail) {
                              e.target.src = item.product.thumbnail;
                            }
                          }}
                        />
                      </div>
                      <div className="checkout-item-info">
                        <h4>{item.product?.title}</h4>
                        <p className="checkout-item-variant">
                          {item.selectedVariation?.color} / {item.selectedVariation?.size}
                        </p>
                      </div>
                      <div className="checkout-item-qty">x{item.quantity}</div>
                      <div className="checkout-item-price">
                        {finalPrice.toLocaleString()}₫
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="checkout-section">
              <h3>Phương thức thanh toán</h3>
              <div className="checkout-payment-methods">
                <label className={`checkout-payment-option ${paymentMethod === 'CASH' ? 'checkout-payment-selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH"
                    checked={paymentMethod === 'CASH'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="checkout-payment-icon checkout-payment-icon-cash">
                    <Banknote size={28} />
                  </div>
                  <span className="checkout-payment-label">
                    <strong>Tiền mặt</strong>
                    <span>Thanh toán khi nhận hàng</span>
                  </span>
                </label>
                <label className={`checkout-payment-option ${paymentMethod === 'VNPAY' ? 'checkout-payment-selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="VNPAY"
                    checked={paymentMethod === 'VNPAY'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="checkout-payment-icon checkout-payment-icon-card">
                    <CreditCard size={28} />
                  </div>
                  <span className="checkout-payment-label">
                    <strong>Thẻ</strong>
                    <span>Thanh toán qua VNPAY</span>
                  </span>
                </label>
              </div>
            </section>

            <section className="checkout-section">
              <h3>Ghi chú đơn hàng</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập ghi chú cho đơn hàng..."
              />
            </section>
          </div>

          <div className="checkout-modal-footer">
            <div className="checkout-total">
              <span>Tổng cộng</span>
              <strong>{totalAmount.toLocaleString()}₫</strong>
            </div>
            <div className="checkout-footer-actions">
              <button className="checkout-secondary-btn" onClick={onClose}>
                Hủy
              </button>
              <button
                className="checkout-primary-btn"
                onClick={handleConfirm}
                disabled={isSubmitting || !items.length || !paymentMethod}
              >
                {isSubmitting ? 'Đang đặt hàng...' : 'Xác nhận đặt hàng'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddressManager
        open={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSelect={(addr) => {
          setSelectedAddress(addr);
          setShowAddressModal(false);
        }}
        selectedId={selectedAddress?.address_id}
      />
    </>,
    document.body
  );
}

