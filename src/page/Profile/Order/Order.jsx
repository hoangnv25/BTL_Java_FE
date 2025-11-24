import './Order.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { base } from '../../../service/Base';
import { Package, ChevronDown, ChevronUp, Star, CreditCard, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FeedbackModal from '../../ProductDetail/FeedBack/FeedbackModal';
import OrderDetailModal from './OrderDetailModal';
import { getPendingPaymentsMap, removePendingPayment } from '../../../utils/pendingPayment';

export default function Order() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [orders, setOrders] = useState([]);
	const [expandedId, setExpandedId] = useState(null);
	const [cancelId, setCancelId] = useState(null);
	const [canceling, setCanceling] = useState(false);
	const [cancelError, setCancelError] = useState('');
	const [viewProduct, setViewProduct] = useState(null);
	const [feedbackProduct, setFeedbackProduct] = useState(null);
	const [productFeedbackStatus, setProductFeedbackStatus] = useState({});
	const [selectedOrderForModal, setSelectedOrderForModal] = useState(null);
	const [pendingPayments, setPendingPayments] = useState({});
	const [now, setNow] = useState(Date.now());
	const navigate = useNavigate();

	const fetchOrders = async (mounted = true) => {
		const token = localStorage.getItem('token');
		try {
			setLoading(true);
			const res = await axios.get(`${base}/orders`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!mounted) return;
			if (res.status === 200 && res.data && Array.isArray(res.data.result)) {
				const getTs = (x) => {
					const t = Date.parse(x?.orderDate ?? x);
					return Number.isNaN(t) ? 0 : t;
				};
				const sorted = [...res.data.result].sort((a, b) => getTs(b) - getTs(a));
				setOrders(sorted);
			} else {
				setOrders([]);
			}
		} catch (e) {
			setError('Không thể tải danh sách đơn hàng.');
		} finally {
			if (mounted) setLoading(false);
		}
	};

	// Kiểm tra user đã đánh giá sản phẩm chưa
	const checkUserFeedbackForProduct = async (productId) => {
		const token = localStorage.getItem('token');
		if (!token) return false;

		try {
			const decodedToken = JSON.parse(atob(token.split('.')[1]));
			const currentUserId = decodedToken.sub || decodedToken.userId || decodedToken.id;

			const res = await axios.get(`${base}/feedback/${productId}`);
			if (res.status === 200 && res.data?.result?.feedbacks) {
				const feedbacks = res.data.result.feedbacks;
				return feedbacks.some(fb => String(fb.userId) === String(currentUserId));
			}
			return false;
		} catch (e) {
			console.error('Error checking feedback:', e);
			return false;
		}
	};

	// Load trạng thái feedback cho các sản phẩm trong đơn hàng COMPLETED
	const loadFeedbackStatus = async (ordersList) => {
		const token = localStorage.getItem('token');
		if (!token) return;

		const statusMap = {};
		for (const order of ordersList) {
			if (order.status === 'COMPLETED' && order.orderDetails) {
				for (const detail of order.orderDetails) {
					if (detail.productId && !statusMap[detail.productId]) {
						const hasReviewed = await checkUserFeedbackForProduct(detail.productId);
						statusMap[detail.productId] = hasReviewed;
					}
				}
			}
		}
		setProductFeedbackStatus(statusMap);
	};

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				await fetchOrders(mounted);
				// Load trạng thái feedback sau khi load orders
				if (mounted) {
					const currentOrders = await axios.get(`${base}/orders`, {
						headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
					});
					if (currentOrders.status === 200 && currentOrders.data?.result) {
						await loadFeedbackStatus(currentOrders.data.result);
					}
				}
			} catch (e) {
				// handled in fetchOrders
			} finally {
				// handled in fetchOrders
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	// Đồng bộ danh sách thanh toán chờ trong localStorage
	useEffect(() => {
		if (typeof window === 'undefined') return;
		const refresh = () => {
			setPendingPayments(getPendingPaymentsMap());
			setNow(Date.now());
		};
		refresh();
		const interval = setInterval(refresh, 15000);
		return () => clearInterval(interval);
	}, []);

	// Loại bỏ link thanh toán khi đơn đã hoàn tất/hủy
	useEffect(() => {
		if (!orders.length) return;
		const map = getPendingPaymentsMap();
		let updated = false;
		Object.keys(map).forEach((orderId) => {
			const order = orders.find((o) => String(o.id) === String(orderId));
			if (!order || order.paymentStatus === 'COMPLETED' || order.status === 'CANCELED') {
				removePendingPayment(orderId);
				updated = true;
			}
		});
		if (updated) {
			setPendingPayments(getPendingPaymentsMap());
		}
	}, [orders]);

	const formatCurrency = (num) =>
		typeof num === 'number'
			? num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
			: '—';

	const formatDateTime = (dt) => {
		try {
			const original = new Date(dt);
			const adjusted = new Date(original.getTime() + 7 * 60 * 60 * 1000);
			return adjusted.toLocaleString('vi-VN');
		} catch {
			return '—';
		}
	};

	const getStatusMeta = (status) => {
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

	const getPaymentStatusMeta = (paymentStatus, paymentMethod) => {
		if (!paymentStatus && !paymentMethod) {
			return { label: 'Chưa thanh toán', cls: 'payment-none', method: null, methodLabel: null };
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

		if (paymentStatus === 'PENDING') {
			const methodLabel = paymentMethod === 'VNPAY' ? 'VNPAY' : paymentMethod === 'CASH' ? 'Tiền mặt' : null;
			return { 
				label: 'Chờ thanh toán', 
				cls: 'payment-pending',
				method: paymentMethod,
				methodLabel: methodLabel
			};
		}

		return { label: 'Chưa thanh toán', cls: 'payment-none', method: null, methodLabel: null };
	};

	return (
		<div className="profile-orders-section">
			<h3 className="profile-orders-title">
				<Package size={20} />
				<span>Đơn hàng của bạn</span>
			</h3>
			<div className="profile-orders-table">
				<div className="profile-orders-head">
					<span>Sản phẩm</span>
					<span>Ngày đặt</span>
					<span>Thành tiền</span>
					<span>TT thanh toán</span>
					<span>TT vận chuyển</span>
				</div>

				{loading && (
					<div className="profile-orders-empty">
						<div className="profile-orders-spinner" />
						<p>Đang tải đơn hàng...</p>
					</div>
				)}

				{!loading && error && (
					<div className="profile-orders-empty">
						<p>{error}</p>
					</div>
				)}

				{!loading && !error && orders.length === 0 && (
					<div className="profile-orders-empty">
						<Package size={48} />
						<p>Không có đơn hàng nào</p>
					</div>
				)}

				{!loading && !error && orders.length > 0 && (
					<div className="profile-orders-body">
					{orders.map((o) => {
						const statusMeta = getStatusMeta(o.status);
						const paymentMeta = getPaymentStatusMeta(o.paymentStatus, o.paymentMethod);
						const isOpen = expandedId === o.id;
						const firstItem = (o.orderDetails || [])[0];
						const totalItems = (o.orderDetails || []).reduce((sum, d) => sum + (d.quantity || 0), 0);
						const pendingPayment = pendingPayments[o.id];
						const remainingMs = pendingPayment ? pendingPayment.expiresAt - now : 0;
						const hasActivePaymentLink = Boolean(pendingPayment && remainingMs > 0);
						const remainingMinutes = hasActivePaymentLink ? Math.max(1, Math.ceil(remainingMs / 60000)) : 0;
						// Đếm số sản phẩm chưa đánh giá trong đơn hàng đã hoàn thành
						const unReviewedCount = o.status === 'COMPLETED' ? 
							(o.orderDetails || []).filter(d => !productFeedbackStatus[d.productId]).length : 0;
						// Không cho hủy nếu đã xác nhận và đã thanh toán bằng VNPAY
						const canCancel = (o.status === 'PENDING' || o.status === 'APPROVED') && 
							!(o.status === 'APPROVED' && o.paymentStatus === 'COMPLETED' && o.paymentMethod === 'VNPAY');
						return (
							<div key={o.id} className="profile-orders-item">
								<button
									className="profile-orders-row"
									onClick={() => {
										// Trên mobile, mở modal; trên desktop, expand inline
										if (window.innerWidth <= 768) {
											setSelectedOrderForModal(o);
										} else {
											setExpandedId(isOpen ? null : o.id);
										}
									}}
									aria-expanded={isOpen}
								>
									<div className="profile-order-summary">
										<div className="profile-order-image-wrapper">
											<img
												src={firstItem?.image || '/product-placeholder.png'}
												alt={firstItem?.productName || 'Sản phẩm'}
											/>
											{unReviewedCount > 0 && (
												<span className="profile-order-review-badge" title={`${unReviewedCount} sản phẩm chưa đánh giá`}>
													{unReviewedCount}
												</span>
											)}
										</div>
										<div className="info">
											<div className="title">
												{firstItem?.productName || `Đơn hàng #${o.id}`}
											</div>
											<div className="sub">{totalItems} sản phẩm</div>
										</div>
									</div>
									<span>{formatDateTime(o.orderDate)}</span>
									<span>{formatCurrency(o.totalAmount)}</span>
									<span>
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
									</span>
									<span>
										<span className={`profile-badge ${statusMeta.cls}`}>
											{statusMeta.label}
										</span>
									</span>
									<span className="profile-row-expander">
										{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
									</span>
								</button>

									<div className={`profile-order-details ${isOpen ? 'open' : ''} profile-order-details-desktop`}>
										{(canCancel || hasActivePaymentLink) && (
											<div className="profile-order-actions">
												{canCancel && (
													<button
														type="button"
														className="profile-btn profile-btn-danger"
														onClick={(e) => {
															e.stopPropagation();
															setCancelError('');
															setCancelId(o.id);
														}}
													>
														Hủy đơn
													</button>
												)}
												{hasActivePaymentLink && (
													<div className="profile-order-pay-later">
														<button
															type="button"
															className="profile-btn profile-btn-primary"
															onClick={(e) => {
																e.stopPropagation();
																window.open(pendingPayment.paymentUrl, '_blank', 'noopener,noreferrer');
															}}
														>
															Thanh toán ngay
														</button>
														<span className="profile-payment-expire">
															Hết hạn trong khoảng {remainingMinutes} phút
														</span>
													</div>
												)}
											</div>
										)}
										<div className="profile-order-meta">
											<div>
												<strong>Người nhận:</strong> {o.userFullName}
											</div>
											<div>
												<strong>Điện thoại:</strong> {o.phoneNumber}
											</div>
											<div>
												<strong>Địa chỉ:</strong> {o.fullAddress}
											</div>
											{Boolean(o.note) && (
												<div>
													<strong>Ghi chú:</strong> {o.note}
												</div>
											)}
											<div>
												<strong>Phương thức thanh toán:</strong>{' '}
												{o.paymentMethod === 'VNPAY' ? 'Thẻ (VNPAY)' : 
												 o.paymentMethod === 'CASH' ? 'Tiền mặt' : 
												 'Chưa chọn'}
											</div>
											{o.paymentDate && (
												<div>
													<strong>Ngày thanh toán:</strong> {formatDateTime(o.paymentDate)}
												</div>
											)}
										</div>
										<div className="profile-order-products">
											{(o.orderDetails || []).map((d, idx) => (
												<div
													key={`${o.id}-${idx}`}
													className="profile-order-product"
													style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}
												>
													<div className="profile-order-product-image-wrapper">
														<img
															src={d.image}
															alt={d.productName}
															onClick={(e) => {
																e.stopPropagation();
																setViewProduct({ id: d.productId, name: d.productName });
															}}
														/>
														{o.status === 'COMPLETED' && !productFeedbackStatus[d.productId] && (
															<span className="profile-product-review-dot" title="Chưa đánh giá"></span>
														)}
													</div>
													<div className="profile-order-product-info">
														<div className="name">{d.productName}</div>
														<div className="sub">
															<span>{d.color}</span>
															<span> • </span>
															<span>Size {d.size}</span>
															<span> • </span>
															<span>x{d.quantity}</span>
														</div>
													</div>
													<div className="profile-order-product-price">
														{formatCurrency(d.price)}
													</div>
													{o.status === 'COMPLETED' && !productFeedbackStatus[d.productId] && (
														<button
															type="button"
															className="profile-btn-feedback profile-btn-feedback-desktop"
															onClick={(e) => {
																e.stopPropagation();
																setFeedbackProduct({
																	productId: d.productId,
																	productName: d.productName
																});
															}}
															style={{
																marginLeft: 'auto',
																padding: '8px 16px',
																borderRadius: '8px',
																border: 'none',
																background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
																color: 'white',
																cursor: 'pointer',
																display: 'flex',
																alignItems: 'center',
																gap: '6px',
																fontSize: '14px',
																fontWeight: 600,
																boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)',
																transition: 'all 0.3s ease',
																whiteSpace: 'nowrap'
															}}
															onMouseEnter={(e) => {
																e.currentTarget.style.transform = 'translateY(-2px)';
																e.currentTarget.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.4)';
															}}
															onMouseLeave={(e) => {
																e.currentTarget.style.transform = 'translateY(0)';
																e.currentTarget.style.boxShadow = '0 2px 8px rgba(251, 191, 36, 0.3)';
															}}
														>
															<Star size={16} fill="white" />
															Đánh giá
														</button>
													)}
												</div>
											))}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{viewProduct && (
				<div
					className="profile-order-modal-backdrop"
					onClick={() => setViewProduct(null)}
				>
					<div
						className="profile-order-modal"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="profile-order-modal-header">
							<h4>Xem sản phẩm</h4>
						</div>
						<div className="profile-order-modal-body">
							<p>Bạn có muốn mở trang sản phẩm "{viewProduct.name}"?</p>
						</div>
						<div className="profile-order-modal-footer">
							<button
								type="button"
								className="profile-btn profile-btn-secondary"
								onClick={() => setViewProduct(null)}
							>
								Đóng
							</button>
							<button
								type="button"
								className="profile-btn profile-btn-danger"
								onClick={() => {
									const id = viewProduct.id;
									setViewProduct(null);
									navigate(`/product/${id}`);
								}}
							>
								Xem sản phẩm
							</button>
						</div>
					</div>
				</div>
			)}

			{cancelId !== null && (
				<div className="profile-order-modal-backdrop" onClick={() => !canceling && setCancelId(null)}>
					<div className="profile-order-modal" onClick={(e) => e.stopPropagation()}>
						<div className="profile-order-modal-header">
							<h4>Xác nhận hủy đơn</h4>
						</div>
						<div className="profile-order-modal-body">
							<p>Bạn có chắc chắn muốn hủy đơn hàng?</p>
							{cancelError && <div className="profile-order-modal-error">{cancelError}</div>}
						</div>
						<div className="profile-order-modal-footer">
							<button
								type="button"
								className="profile-btn profile-btn-secondary"
								onClick={() => setCancelId(null)}
								disabled={canceling}
							>
								Đóng
							</button>
							<button
								type="button"
								className="profile-btn profile-btn-danger"
								onClick={async () => {
									setCancelError('');
									const token = localStorage.getItem('token');
									try {
										setCanceling(true);
										await axios.patch(`${base}/orders/${cancelId}/cancel`, {}, {
											headers: { Authorization: `Bearer ${token}` },
										});
										setCancelId(null);
										await fetchOrders(true);
									} catch (e) {
										setCancelError('Hủy đơn thất bại. Vui lòng thử lại.');
									} finally {
										setCanceling(false);
									}
								}}
								disabled={canceling}
							>
								{canceling ? 'Đang hủy...' : 'Xác nhận hủy'}
							</button>
						</div>
					</div>
				</div>
			)}

			{feedbackProduct && (
				<FeedbackModal
					productId={feedbackProduct.productId}
					productName={feedbackProduct.productName}
					onClose={() => setFeedbackProduct(null)}
					onSuccess={async () => {
						// Dispatch event để cập nhật badge trên navbar
						window.dispatchEvent(new Event('feedbackChanged'));
						// Refresh lại trạng thái feedback
						const currentOrders = await axios.get(`${base}/orders`, {
							headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
						});
						if (currentOrders.status === 200 && currentOrders.data?.result) {
							await loadFeedbackStatus(currentOrders.data.result);
						}
					}}
				/>
			)}

			<OrderDetailModal
				order={selectedOrderForModal}
				isOpen={!!selectedOrderForModal}
				onClose={() => setSelectedOrderForModal(null)}
				onCancelOrder={(orderId) => {
					setCancelError('');
					setCancelId(orderId);
				}}
				canCancel={selectedOrderForModal ? 
					((selectedOrderForModal.status === 'PENDING' || selectedOrderForModal.status === 'APPROVED') && 
					 !(selectedOrderForModal.status === 'APPROVED' && selectedOrderForModal.paymentStatus === 'COMPLETED' && selectedOrderForModal.paymentMethod === 'VNPAY')) 
					: false}
				onFeedbackClick={(product) => {
					setFeedbackProduct(product);
					setSelectedOrderForModal(null);
				}}
				productFeedbackStatus={productFeedbackStatus}
				pendingPayment={
					selectedOrderForModal ? pendingPayments[selectedOrderForModal.id] : null
				}
				remainingMs={
					selectedOrderForModal && pendingPayments[selectedOrderForModal?.id]
						? Math.max(0, pendingPayments[selectedOrderForModal.id].expiresAt - now)
						: 0
				}
			/>
		</div>
	);
}
