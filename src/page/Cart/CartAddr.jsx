import { useEffect, useState } from 'react';
import axios from 'axios';
import { base } from '../../service/Base';
import './Cart.css';
import Address from '../Profile/Address/Address';

export default function CartAddr() {
	const [address, setAddress] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [showAddress, setShowAddress] = useState(false);

	useEffect(() => {
		let mounted = true;
		const token = localStorage.getItem('token');
		(async () => {
			try {
				setLoading(true);
				setError('');
				const res = await axios.get(`${base}/address/default`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!mounted) return;
				if (res.status === 200 && res.data) {
					setAddress(res.data);
				} else {
					setAddress(null);
				}
			} catch (e) {
				setError('Không thể tải địa chỉ mặc định. Vui lòng thử lại.');
				setAddress(null);
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	return (
		<div className="cartaddr-inline">
			<div className="cartaddr-header">
				<h3>Địa chỉ nhận hàng</h3>
				<button
					type="button"
					className="cartaddr-change-btn"
					onClick={() => setShowAddress(true)}
				>
					Đổi địa chỉ
				</button>
			</div>
			<div className="cartaddr-body">
				{loading && (
					<div className="cartaddr-loading">
						<div className="cartaddr-spinner" />
						<p>Đang tải địa chỉ...</p>
					</div>
				)}
				{!loading && error && <div className="cartaddr-error">{error}</div>}
				{!loading && !error && !address && (
					<div className="cartaddr-empty">Chưa có địa chỉ mặc định.</div>
				)}
				{!loading && !error && address && (
					<>
						<div className="cartaddr-line">
							<span className="label">Đường:</span>
							<span className="value">{address.street}</span>
						</div>
						<div className="cartaddr-line">
							<span className="label">Phường/Xã:</span>
							<span className="value">{address.ward}</span>
						</div>
						<div className="cartaddr-line">
							<span className="label">Quận/Huyện:</span>
							<span className="value">{address.city}</span>
						</div>
					</>
				)}
			</div>

			{showAddress && (
				<Address open={showAddress} onClose={() => setShowAddress(false)} />
			)}
		</div>
	);
}
