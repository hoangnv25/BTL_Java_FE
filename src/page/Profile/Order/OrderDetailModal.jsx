import './OrderDetailModal.css';
import { ChevronLeft, Package, MapPin, Phone, FileText, CreditCard, Banknote, X, Star } from 'lucide-react';

export default function OrderDetailModal({ 
	order, 
	isOpen, 
	onClose, 
	onCancelOrder,
	canCancel,
	onFeedbackClick,
	productFeedbackStatus,
	pendingPayment,
	remainingMs = 0
}) {
	if (!isOpen || !order) return null;

	const formatCurrency = (num) =>
		typeof num === 'number'
			? num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
			: '—';

	const formatDateTime = (dt) => {
		try {
			const original = new Date(dt);
			const adjusted = new Date(original.getTime() + 0 * 60 * 60 * 1000);
			return adjusted.toLocaleString('vi-VN');
		} catch {
			return '—';
		}
	};

	const getStatusMeta = (status, paymentStatus) => {
		if (paymentStatus === 'FAILED') {
			return { label: 'Đã hủy', cls: 'canceled' };
		}

		switch (status) {
			case 'PENDING':
				return { label: 'Chờ xử lý', cls: 'pending' };
			case 'APPROVED':
				return { label: 'Đã xác nhận', cls: 'approved' };
			case 'SHIPPING':
				return { label: 'Đang giao', cls: 'shipping' };
			case 'COMPLETED':
				return { label: 'Hoàn thành', cls: 'completed' };
			case 'CANCELED':
				return { label: 'Đã hủy', cls: 'canceled' };
			default:
				return { label: status || '—', cls: 'pending' };
		}
	};

	const getPaymentStatusMeta = (paymentStatus, paymentMethod, orderStatus) => {
		if (orderStatus === 'CANCELED') {
			return { label: 'Đã hủy', cls: 'payment-canceled', method: null, methodLabel: null };
		}

		if (paymentStatus === 'COMPLETED') {
			const methodLabel = paymentMethod === 'VNPAY' ? 'VNPAY' : paymentMethod === 'CASH' ? 'Tiền mặt' : null;
			return { 
				label: 'Đã thanh toán', 
				cls: 'payment-completed',
				method: paymentMethod,
				methodLabel: methodLabel
			};
		}

		if (paymentStatus === 'FAILED') {
			return { label: 'Thanh toán thất bại', cls: 'payment-failed', method: null, methodLabel: null };
		}

		if (paymentStatus === 'PENDING') {
			if (paymentMethod === 'CASH') {
				return {
					label: 'Thanh toán khi nhận hàng',
					cls: 'payment-cod',
					method: null,
					methodLabel: null
				};
			}
			const methodLabel = paymentMethod === 'VNPAY' ? 'VNPAY' : paymentMethod === 'CASH' ? 'Tiền mặt' : null;
			return {
				label: 'Chờ thanh toán',
				cls: 'payment-pending',
				method: paymentMethod,
				methodLabel: methodLabel
			};
		}

		return { label: '_', cls: 'payment-none', method: null, methodLabel: null };
	};

	const statusMeta = getStatusMeta(order.status, order.paymentStatus);
	const paymentMeta = getPaymentStatusMeta(order.paymentStatus, order.paymentMethod, order.status);
	const totalItems = (order.orderDetails || []).reduce((sum, d) => sum + (d.quantity || 0), 0);
	const hasActivePaymentLink = Boolean(
		pendingPayment &&
		remainingMs > 0 &&
		order.paymentStatus !== 'COMPLETED'
	);
	const showPayNowButton =
		hasActivePaymentLink &&
		order.paymentMethod === 'VNPAY' &&
		order.paymentStatus === 'PENDING' &&
		order.status === 'PENDING';
	const remainingMinutes = hasActivePaymentLink ? Math.max(1, Math.ceil(remainingMs / 60000)) : 0;

	return (
		<div className="order-detail-modal-backdrop" onClick={onClose}>
			<div className="order-detail-modal" onClick={(e) => e.stopPropagation()}>
				{/* Header */}
				<div className="order-detail-modal-header">
					<button className="order-detail-modal-back" onClick={onClose}>
						<ChevronLeft size={24} />
					</button>
					<h2 className="order-detail-modal-title">Chi tiết đơn hàng</h2>
					<div style={{ width: 40 }}></div>
				</div>

				{/* Content */}
				<div className="order-detail-modal-content">
					{/* Order Info Card */}
					<div className="order-detail-card">
						<div className="order-detail-card-header">
							<Package size={20} />
							<h3>Thông tin đơn hàng</h3>
						</div>
						<div className="order-detail-card-body">
							<div className="order-detail-info-row">
								<span className="order-detail-label">Mã đơn hàng:</span>
								<span className="order-detail-value">{order.id}</span>
							</div>
							<div className="order-detail-info-row">
								<span className="order-detail-label">Ngày đặt:</span>
								<span className="order-detail-value">{formatDateTime(order.orderDate)}</span>
							</div>
							<div className="order-detail-info-row">
								<span className="order-detail-label">Tổng tiền:</span>
								<span className="order-detail-value order-detail-price">{formatCurrency(order.totalAmount)}</span>
							</div>
							<div className="order-detail-info-row">
								<span className="order-detail-label">Số lượng sản phẩm:</span>
								<span className="order-detail-value">{totalItems} sản phẩm</span>
							</div>
						</div>
					</div>

					{/* Status Card */}
					<div className="order-detail-card">
						<div className="order-detail-card-header">
							<h3>Trạng thái</h3>
						</div>
						<div className="order-detail-card-body">
							<div className="order-detail-status-group">
								<div className="order-detail-status-item">
									<span className="order-detail-label">Đơn hàng:</span>
									<span className={`profile-badge ${statusMeta.cls}`}>
										{statusMeta.label}
									</span>
								</div>
								<div className="order-detail-status-item">
									<span className="order-detail-label">Thanh toán:</span>
									<div className="profile-payment-badge-group">
										<span className={`profile-badge ${paymentMeta.cls}`}>
											{paymentMeta.label}
										</span>
										{paymentMeta.method && (
											<span className={`profile-badge-method profile-badge-method-${paymentMeta.method?.toLowerCase()}`}>
												{paymentMeta.method === 'VNPAY' ? (
													<CreditCard size={14} />
												) : paymentMeta.method === 'CASH' ? (
													<Banknote size={14} />
												) : null}
											</span>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Delivery Info Card */}
					<div className="order-detail-card">
						<div className="order-detail-card-header">
							<MapPin size={20} />
							<h3>Thông tin giao hàng</h3>
						</div>
						<div className="order-detail-card-body">
							<div className="order-detail-info-row">
								<span className="order-detail-label">Người nhận:</span>
								<span className="order-detail-value">{order.userFullName}</span>
							</div>
							<div className="order-detail-info-row">
								<span className="order-detail-label">
									<Phone size={16} style={{ display: 'inline', marginRight: 4 }} />
									Điện thoại:
								</span>
								<span className="order-detail-value">{order.phoneNumber}</span>
							</div>
							<div className="order-detail-info-row order-detail-address">
								<span className="order-detail-label">Địa chỉ:</span>
								<span className="order-detail-value">{order.fullAddress}</span>
							</div>
							{Boolean(order.note) && (
								<div className="order-detail-info-row order-detail-note">
									<span className="order-detail-label">
										<FileText size={16} style={{ display: 'inline', marginRight: 4 }} />
										Ghi chú:
									</span>
									<span className="order-detail-value">{order.note}</span>
								</div>
							)}
						</div>
					</div>

					{/* Payment Info Card */}
					{(order.paymentMethod || order.paymentDate) && (
						<div className="order-detail-card">
							<div className="order-detail-card-header">
								<CreditCard size={20} />
								<h3>Thông tin thanh toán</h3>
							</div>
							<div className="order-detail-card-body">
								<div className="order-detail-info-row">
									<span className="order-detail-label">Phương thức:</span>
									<span className="order-detail-value">
										{order.paymentMethod === 'VNPAY' ? 'Thẻ (VNPAY)' : 
										 order.paymentMethod === 'CASH' ? 'Tiền mặt' : 
										 'Chưa chọn'}
									</span>
								</div>
								{order.paymentDate && (
									<div className="order-detail-info-row">
										<span className="order-detail-label">Ngày thanh toán:</span>
										<span className="order-detail-value">{formatDateTime(order.paymentDate)}</span>
									</div>
								)}
							</div>
						</div>
					)}

					{showPayNowButton && (
						<div className="order-detail-card order-detail-card-payment-reminder">
							<div className="order-detail-card-header">
								<CreditCard size={20} />
								<h3>Thanh toán đang chờ</h3>
							</div>
							<div className="order-detail-card-body order-detail-pay-later">
								<button
									type="button"
									className="profile-btn profile-btn-primary"
									onClick={() =>
										window.open(pendingPayment.paymentUrl, '_blank', 'noopener,noreferrer')
									}
								>
									Thanh toán ngay
								</button>
								<span className="profile-payment-expire">
									Hết hạn trong khoảng {remainingMinutes} phút
								</span>
							</div>
						</div>
					)}

					{/* Products Card */}
					<div className="order-detail-card">
						<div className="order-detail-card-header">
							<Package size={20} />
							<h3>Sản phẩm ({totalItems})</h3>
						</div>
						<div className="order-detail-card-body">
							<div className="order-detail-products">
								{(order.orderDetails || []).map((d, idx) => (
									<div key={`${order.id}-${idx}`} className="order-detail-product">
										<div className="order-detail-product-image-wrapper">
											<img
												src={d.image}
												alt={d.productName}
												className="order-detail-product-image"
											/>
											{order.status === 'COMPLETED' && !productFeedbackStatus?.[d.productId] && (
												<span className="order-detail-review-dot" title="Chưa đánh giá"></span>
											)}
										</div>
										<div className="order-detail-product-info">
											<div className="order-detail-product-name">{d.productName}</div>
											<div className="order-detail-product-variant">
												<span>{d.color}</span>
												<span> • </span>
												<span>Size {d.size}</span>
												<span> • </span>
												<span>x{d.quantity}</span>
											</div>
											<div className="order-detail-product-price">
												{formatCurrency(d.price)}
											</div>
											{order.status === 'COMPLETED' && !productFeedbackStatus?.[d.productId] && (
												<button
													type="button"
													className="order-detail-feedback-btn"
													onClick={() => onFeedbackClick?.({
														productId: d.productId,
														productName: d.productName
													})}
												>
													<Star size={16} fill="white" />
													Đánh giá
												</button>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Actions */}
					{canCancel && (
						<div className="order-detail-actions">
							<button
								type="button"
								className="order-detail-cancel-btn"
								onClick={() => {
									onCancelOrder?.(order.id);
									onClose();
								}}
							>
								Hủy đơn hàng
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

