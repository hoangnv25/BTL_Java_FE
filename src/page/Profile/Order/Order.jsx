import './Order.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { base } from '../../../service/Base';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';

export default function Order() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [orders, setOrders] = useState([]);
	const [expandedId, setExpandedId] = useState(null);
	const [cancelId, setCancelId] = useState(null);
	const [canceling, setCanceling] = useState(false);
	const [cancelError, setCancelError] = useState('');

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

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				await fetchOrders(mounted);
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
							const isOpen = expandedId === o.id;
							const firstItem = (o.orderDetails || [])[0];
							const totalItems = (o.orderDetails || []).reduce((sum, d) => sum + (d.quantity || 0), 0);
							const canCancel = o.status === 'PENDING' || o.status === 'APPROVED';
							return (
								<div key={o.id} className="profile-orders-item">
									<button
										className="profile-orders-row"
										onClick={() => setExpandedId(isOpen ? null : o.id)}
										aria-expanded={isOpen}
									>
										<div className="profile-order-summary">
											<img
												src={firstItem?.image || '/product-placeholder.png'}
												alt={firstItem?.productName || 'Sản phẩm'}
											/>
											<div className="info">
												<div className="title">
													{firstItem?.productName || `Đơn hàng #${o.id}`}
												</div>
												<div className="sub">{totalItems} sản phẩm</div>
											</div>
										</div>
										<span>{formatDateTime(o.orderDate)}</span>
										<span>{formatCurrency(o.totalAmount)}</span>
										<span>—</span>
										<span>
											<span className={`profile-badge ${statusMeta.cls}`}>
												{statusMeta.label}
											</span>
										</span>
										<span className="profile-row-expander">
											{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
										</span>
									</button>

									<div className={`profile-order-details ${isOpen ? 'open' : ''}`}>
											{canCancel && (
												<div className="profile-order-actions">
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
											</div>
											<div className="profile-order-products">
												{(o.orderDetails || []).map((d, idx) => (
													<div key={`${o.id}-${idx}`} className="profile-order-product">
														<img src={d.image} alt={d.productName} />
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
		</div>
	);
}


