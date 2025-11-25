import { useState } from 'react';
import axios from 'axios';
import { base } from '../../../service/Base';
import { ChevronDown, ChevronUp, CreditCard, Banknote } from 'lucide-react';

export default function AdminOrderItem({ order, onDeleted }) {
	const [open, setOpen] = useState(false);
	const [updating, setUpdating] = useState(false);
	const [error, setError] = useState('');
	const [localStatus, setLocalStatus] = useState(order.status);
	const [deleting, setDeleting] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);

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

	const getPaymentStatusMeta = (paymentStatus, paymentMethod, orderStatus) => {
		if (orderStatus === 'CANCELED') {
			return { label: 'Đã hủy', cls: 'payment-canceled', method: null };
		}

		if (!paymentStatus && !paymentMethod) {
			return { label: 'Chưa thanh toán', cls: 'payment-none', method: null };
		}

		if (paymentStatus === 'COMPLETED') {
			return { label: 'Đã thanh toán', cls: 'payment-completed', method: paymentMethod };
		}

		if (paymentStatus === 'PENDING') {
			return { label: 'Chờ thanh toán', cls: 'payment-pending', method: paymentMethod };
		}

		return { label: 'Chưa thanh toán', cls: 'payment-none', method: null };
	};

	const statusMeta = getStatusMeta(localStatus);
	const totalItems = (order.orderDetails || []).reduce(
		(sum, d) => sum + (d.quantity || 0),
		0
	);
	const paymentMeta = getPaymentStatusMeta(order.paymentStatus, order.paymentMethod, order.status);

	const doUpdateStatus = async () => {
		setError('');
		const token = localStorage.getItem('token');
		try {
			setUpdating(true);
			await axios.patch(
				`${base}/orders/${order.id}/status`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
					params: { status: localStatus },
				}
			);
		} catch (e) {
			setError('Cập nhật trạng thái thất bại. Vui lòng thử lại.');
		} finally {
			setUpdating(false);
		}
	};

	const doDelete = async () => {
		setError('');
		const token = localStorage.getItem('token');
		try {
			setDeleting(true);
			await axios.delete(`${base}/orders/${order.id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (onDeleted) onDeleted(order.id);
			setConfirmOpen(false);
		} catch (e) {
			setError('Xóa đơn thất bại. Vui lòng thử lại.');
		} finally {
			setDeleting(false);
		}
	};

	return (
		<div className={`admin-orders-item ${open ? 'open' : ''}`}>
			<button
				className="admin-orders-row"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
			>
				<span>{order.id}</span>
				<span>{order.userFullName || `User ${order.userId}`}</span>
				<span>{formatDateTime(order.orderDate)}</span>
				<span>{formatCurrency(order.totalAmount)}</span>
				<span>
					<div className="admin-payment-badge-group">
						<span className={`admin-payment-badge ${paymentMeta.cls}`}>
							{paymentMeta.label}
						</span>
						{paymentMeta.method && (
							<span className={`admin-payment-method admin-payment-method-${paymentMeta.method.toLowerCase()}`}>
								{paymentMeta.method === 'VNPAY' ? <CreditCard size={12} /> : paymentMeta.method === 'CASH' ? <Banknote size={12} /> : null}
							</span>
						)}
					</div>
				</span>
				<span>
					<span className={`admin-badge ${statusMeta.cls}`}>{statusMeta.label}</span>
				</span>
				<span className="admin-row-expander">
					{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
				</span>
			</button>

			<div className={`admin-order-details ${open ? 'open' : ''}`}>
				<div className="admin-order-actions">
					<div className="admin-status-editor">
						<label>Trạng thái</label>
						<select
							value={localStatus}
							onChange={(e) => setLocalStatus(e.target.value)}
							disabled={updating}
						>
							<option value="PENDING">Chờ xử lý</option>
							<option value="APPROVED">Đã xác nhận</option>
							<option value="SHIPPING">Đang giao</option>
							<option value="COMPLETED">Hoàn thành</option>
							<option value="CANCELED">Đã hủy</option>
						</select>
						<button
							type="button"
							className="admin-btn admin-btn-primary"
							onClick={doUpdateStatus}
							disabled={updating}
						>
							{updating ? 'Đang cập nhật...' : 'Cập nhật'}
						</button>
						<button
							type="button"
							className="admin-btn admin-btn-danger"
							onClick={() => setConfirmOpen(true)}
							disabled={deleting}
						>
							{deleting ? 'Đang xóa...' : 'Xóa đơn'}
						</button>
					</div>
					{error && <div className="admin-inline-error">{error}</div>}
				</div>
				<div className="admin-order-meta">
					<div>
						<strong>Người nhận:</strong> {order.userFullName}
					</div>
					<div>
						<strong>Điện thoại:</strong> {order.phoneNumber}
					</div>
					<div>
						<strong>Địa chỉ:</strong> {order.fullAddress}
					</div>
					<div>
						<strong>Số lượng:</strong> {totalItems} sản phẩm
					</div>
					{Boolean(order.note) && (
						<div>
							<strong>Ghi chú:</strong> {order.note}
						</div>
					)}
				</div>

				<div className="admin-order-products">
					{(order.orderDetails || []).map((d, idx) => (
						<div key={`${order.id}-${idx}`} className="admin-order-product">
							<img src={d.image} alt={d.productName} />
							<div className="admin-order-product-info">
								<div className="name">{d.productName}</div>
								<div className="sub">
                                    <span>{d.color}</span>
                                    <span> • </span>
                                    <span>Size {d.size}</span>
                                    <span> • </span>
                                    <span>x{d.quantity}</span>
								</div>
							</div>
							<div className="admin-order-product-price">{formatCurrency(d.price)}</div>
						</div>
					))}
				</div>
			</div>
			{confirmOpen && (
				<div className="admin-modal-backdrop" onClick={() => !deleting && setConfirmOpen(false)}>
					<div className="admin-modal" onClick={(e) => e.stopPropagation()}>
						<div className="admin-modal-header">
							<h4>Xác nhận xóa đơn</h4>
						</div>
						<div className="admin-modal-body">
							<p>Bạn có chắc chắn muốn xóa đơn hàng #{order.id}?</p>
						</div>
						<div className="admin-modal-footer">
							<button
								type="button"
								className="admin-btn admin-btn-secondary"
								onClick={() => setConfirmOpen(false)}
								disabled={deleting}
							>
								Hủy
							</button>
							<button
								type="button"
								className="admin-btn admin-btn-danger"
								onClick={doDelete}
								disabled={deleting}
							>
								{deleting ? 'Đang xóa...' : 'Xóa'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}


