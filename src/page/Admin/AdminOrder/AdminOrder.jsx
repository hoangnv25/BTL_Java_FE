import './AdminOrder.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { base } from '../../../service/Base';
import AdminOrderItem from './AdminOrderItem';
import { Package, Search, ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';

export default function AdminOrder() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [query, setQuery] = useState('');
	const [sortField, setSortField] = useState('orderDate');
	const [sortDir, setSortDir] = useState('desc'); // 'asc' | 'desc'
	const [statusFilter, setStatusFilter] = useState('ALL'); // ALL | PENDING | APPROVED | SHIPPING | COMPLETED | CANCELED
	const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL'); // ALL | COMPLETED | PENDING_VNPAY | PENDING_CASH | FAILED | NONE | CANCELED

	useEffect(() => {
		let mounted = true;
		const token = localStorage.getItem('token');
		(async () => {
			try {
				setLoading(true);
				const res = await axios.get(`${base}/all-orders`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!mounted) return;
				if (res.status === 200 && res.data && Array.isArray(res.data.result)) {
					setOrders(res.data.result);
				} else {
					setOrders([]);
				}
			} catch (e) {
				setError('Không thể tải danh sách đơn hàng.');
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	const normalize = (v) => (v ?? '').toString().toLowerCase();

	const matchesQuery = (o, q) => {
		if (!q) return true;
		const ql = q.toLowerCase();
		const fields = [
			o.id,
			o.userId,
			o.userFullName,
			o.fullAddress,
			o.phoneNumber,
			o.note,
			o.status,
			o.totalAmount,
			o.orderDate,
		];
		// search in order details names/colors/sizes
		if (Array.isArray(o.orderDetails)) {
			o.orderDetails.forEach((d) => {
				fields.push(d.productName, d.color, d.size);
			});
		}
		return fields.some((f) => normalize(f).includes(ql));
	};

	const getSortValue = (o, field) => {
		switch (field) {
			case 'id':
				return Number(o.id) || 0;
			case 'userFullName':
				return normalize(o.userFullName);
			case 'orderDate':
				return Date.parse(o.orderDate) || 0;
			case 'totalAmount':
				return Number(o.totalAmount) || 0;
			case 'status':
				return normalize(o.status);
			default:
				return normalize(o[field] ?? '');
		}
	};

	const getPaymentStatusForFilter = (order) => {
		// Nếu đơn bị hủy, payment status là CANCELED
		if (order.status === 'CANCELED') {
			return 'CANCELED';
		}
		// Nếu không có paymentStatus và paymentMethod, là chưa thanh toán
		if (!order.paymentStatus && !order.paymentMethod) {
			return 'NONE';
		}
		// Nếu paymentStatus là PENDING, phân biệt theo paymentMethod
		if (order.paymentStatus === 'PENDING') {
			if (order.paymentMethod === 'CASH') {
				return 'PENDING_CASH'; // Thanh toán khi nhận hàng
			}
			if (order.paymentMethod === 'VNPAY') {
				return 'PENDING_VNPAY'; // Chờ thanh toán VNPay
			}
			return 'PENDING'; // Trường hợp khác (fallback)
		}
		// Trả về paymentStatus nếu có (COMPLETED, FAILED)
		return order.paymentStatus || 'NONE';
	};

	const filteredSorted = [...orders]
		.filter((o) => matchesQuery(o, query))
		.filter((o) => (statusFilter === 'ALL' ? true : o.status === statusFilter))
		.filter((o) => {
			if (paymentStatusFilter === 'ALL') return true;
			const paymentStatus = getPaymentStatusForFilter(o);
			return paymentStatus === paymentStatusFilter;
		})
		.sort((a, b) => {
			const va = getSortValue(a, sortField);
			const vb = getSortValue(b, sortField);
			if (va < vb) return sortDir === 'asc' ? -1 : 1;
			if (va > vb) return sortDir === 'asc' ? 1 : -1;
			return 0;
		});

	const toggleSort = (field) => {
		if (sortField === field) {
			setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortField(field);
			setSortDir('asc');
		}
	};

	const SortIcon = ({ field }) =>
		sortField !== field ? <ChevronsUpDown size={14} /> : sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;

	return (
		<div className="admin-orders-page">
			<div className="admin-orders-header">
				<h2>
					<Package size={20} />
					<span>Tất cả đơn hàng</span>
				</h2>
			</div>

			<div className="admin-orders-controls">
				<div className="admin-search">
					<Search size={16} />
					<input
						placeholder="Tìm theo mã, khách, SĐT, địa chỉ, trạng thái, sản phẩm..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>
			</div>

			<div className="admin-orders-table">
				<div className="admin-orders-head">
					<button className="head-cell sortable" onClick={() => toggleSort('id')}>
						<span>Mã đơn hàng</span>
						<SortIcon field="id" />
					</button>
					<button className="head-cell sortable" onClick={() => toggleSort('userFullName')}>
						<span>Khách hàng</span>
						<SortIcon field="userFullName" />
					</button>
					<button className="head-cell sortable" onClick={() => toggleSort('orderDate')}>
						<span>Ngày đặt</span>
						<SortIcon field="orderDate" />
					</button>
					<button className="head-cell sortable" onClick={() => toggleSort('totalAmount')}>
						<span>Tổng tiền</span>
						<SortIcon field="totalAmount" />
					</button>
					<div className="head-cell head-cell-filter">
						<label>TT thanh toán</label>
						<select
							value={paymentStatusFilter}
							onChange={(e) => setPaymentStatusFilter(e.target.value)}
							onClick={(e) => e.stopPropagation()}
						>
							<option value="ALL">Tất cả</option>
							<option value="COMPLETED">Đã thanh toán</option>
							<option value="PENDING_VNPAY">Chờ thanh toán</option>
							<option value="PENDING_CASH">Thanh toán khi nhận hàng</option>
							<option value="FAILED">Thanh toán thất bại</option>
							<option value="CANCELED">Đã hủy</option>
						</select>
					</div>
					<div className="head-cell head-cell-filter">
						<label>Trạng thái</label>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							onClick={(e) => e.stopPropagation()}
						>
							<option value="ALL">Tất cả</option>
							<option value="PENDING">Chờ xử lý</option>
							<option value="APPROVED">Đã xác nhận</option>
							<option value="SHIPPING">Đang giao</option>
							<option value="COMPLETED">Hoàn thành</option>
							<option value="CANCELED">Đã hủy</option>
						</select>
					</div>
					<span></span>
				</div>

				{loading && (
					<div className="admin-orders-empty">
						<div className="admin-orders-spinner" />
						<p>Đang tải...</p>
					</div>
				)}

				{!loading && error && (
					<div className="admin-orders-empty">
						<p>{error}</p>
					</div>
				)}

				{!loading && !error && orders.length === 0 && (
					<div className="admin-orders-empty">
						<Package size={48} />
						<p>Chưa có đơn hàng nào</p>
					</div>
				)}

				{!loading && !error && filteredSorted.length > 0 && (
					<div className="admin-orders-body">
						{filteredSorted.map((o) => (
							<AdminOrderItem
								key={o.id}
								order={o}
								onDeleted={(id) => {
									// remove from source orders so filters reflect immediately
									setOrders((prev) => prev.filter((x) => x.id !== id));
								}}
							/>
						))}
					</div>
				)}

				{!loading && !error && filteredSorted.length === 0 && orders.length > 0 && (
					<div className="admin-orders-empty">
						<p>Không tìm thấy đơn hàng phù hợp.</p>
					</div>
				)}
			</div>
		</div>
	);
}