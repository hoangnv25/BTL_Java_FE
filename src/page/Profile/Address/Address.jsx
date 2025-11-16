import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { base } from '../../../service/Base';
import './Address.css';
import { X, MapPin, Trash2, CheckCircle } from 'lucide-react';

export default function Address({ open, onClose }) {
	if (!open) return null;

	const [addresses, setAddresses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [street, setStreet] = useState('');
	const [ward, setWard] = useState('');
	const [city, setCity] = useState('');
	const [defaultAddress, setDefaultAddress] = useState(false);
	const [creating, setCreating] = useState(false);
	const [showCreate, setShowCreate] = useState(false);
	const [deletingId, setDeletingId] = useState(null);
	const [updatingId, setUpdatingId] = useState(null);

	useEffect(() => {
		let mounted = true;
		const token = localStorage.getItem('token');
		(async () => {
			try {
				setLoading(true);
				const res = await axios.get(`${base}/address`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!mounted) return;
				if (res.status === 200 && Array.isArray(res.data)) {
					setAddresses(res.data);
				} else {
					setError('Không lấy được danh sách địa chỉ.');
				}
			} catch (e) {
				setError('Lỗi khi tải địa chỉ. Vui lòng thử lại.');
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [open]);

	const reloadAddresses = async () => {
		const token = localStorage.getItem('token');
		try {
			setLoading(true);
			const res = await axios.get(`${base}/address`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (res.status === 200 && Array.isArray(res.data)) {
				setAddresses(res.data);
			}
		} catch (e) {
			setError('Không lấy được danh sách địa chỉ sau khi thêm.');
		} finally {
			setLoading(false);
		}
	};

	const resetForm = () => {
		setStreet('');
		setWard('');
		setCity('');
		setDefaultAddress(false);
	};

	const handleCreate = async (e) => {
		e.preventDefault();
		setError('');
		if (!street.trim() || !ward.trim() || !city.trim()) {
			setError('Vui lòng nhập đầy đủ đường, phường/xã, quận/huyện.');
			return;
		}
		const token = localStorage.getItem('token');
		try {
			setCreating(true);
			await axios.post(
				`${base}/address`,
				{
					street: street.trim(),
					ward: ward.trim(),
					city: city.trim(),
					defaultAddress: !!defaultAddress,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			);
			resetForm();
			await reloadAddresses();
			setShowCreate(false);
		} catch (e) {
			setError('Không thể thêm địa chỉ. Vui lòng thử lại.');
		} finally {
			setCreating(false);
		}
	};

	const defaultAddressId =
		addresses.find((a) => a._default)?.address_id ?? null;

	const handleDelete = async (e, id) => {
		e.preventDefault();
		e.stopPropagation();
		setError('');
		const token = localStorage.getItem('token');
		try {
			setDeletingId(id);
			await axios.delete(`${base}/address/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			await reloadAddresses();
		} catch (e) {
			setError('Không thể xoá địa chỉ. Vui lòng thử lại.');
		} finally {
			setDeletingId(null);
		}
	};

	const handleSetDefault = async (e, id) => {
		e.preventDefault();
		e.stopPropagation();
		setError('');
		const token = localStorage.getItem('token');
		try {
			setUpdatingId(id);
			await axios.put(
				`${base}/address/${id}`,
				{
					defaultAddress: true,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			);
			await reloadAddresses();
		} catch (e) {
			setError('Không thể đặt địa chỉ mặc định. Vui lòng thử lại.');
		} finally {
			setUpdatingId(null);
		}
	};

	const modalContent = (
		<div className="addr-modal-backdrop" onClick={onClose}>
			<div className="addr-modal" onClick={(e) => e.stopPropagation()}>
				<div className="addr-modal-header">
					<div className="addr-title">
						<MapPin size={20} />
						<span>Quản trị địa chỉ</span>
					</div>
					<button className="addr-icon-btn" onClick={onClose} aria-label="Đóng">
						<X size={18} />
					</button>
				</div>

				<div className="addr-modal-body">
					{!showCreate && (
						<div className="addr-actions">
							<button type="button" className="addr-btn" onClick={() => setShowCreate(true)}>
								Thêm địa chỉ mới
							</button>
						</div>
					)}

					{showCreate && (
						<form className="addr-form" onSubmit={handleCreate}>
							<div className="addr-form-row">
								<label className="addr-label">Đường</label>
								<input
									className="addr-input"
									placeholder="Ví dụ: Đường số 3"
									value={street}
									onChange={(e) => setStreet(e.target.value)}
								/>
							</div>
							<div className="addr-form-row">
								<label className="addr-label">Phường/Xã</label>
								<input
									className="addr-input"
									placeholder="Ví dụ: Phường XYZ"
									value={ward}
									onChange={(e) => setWard(e.target.value)}
								/>
							</div>
							<div className="addr-form-row">
								<label className="addr-label">Quận/Huyện</label>
								<input
									className="addr-input"
									placeholder="Ví dụ: Quận 36"
									value={city}
									onChange={(e) => setCity(e.target.value)}
								/>
							</div>
							<div className="addr-form-row addr-form-inline">
								<label className="addr-checkbox">
									<input
										type="checkbox"
										checked={defaultAddress}
										onChange={(e) => setDefaultAddress(e.target.checked)}
									/>
									<span>Đặt làm địa chỉ mặc định</span>
								</label>
							</div>
							<div className="addr-actions">
								<button type="submit" className="addr-btn" disabled={creating}>
									{creating ? 'Đang thêm...' : 'Thêm địa chỉ'}
								</button>
								<button
									type="button"
									className="addr-btn addr-btn-secondary"
									onClick={() => {
										resetForm();
										setShowCreate(false);
										setError('');
									}}
								>
									Huỷ
								</button>
							</div>
						</form>
					)}

					{loading && (
						<div className="addr-loading">
							<div className="addr-spinner" />
							<p>Đang tải địa chỉ...</p>
						</div>
					)}

					{!loading && error && <div className="addr-error">{error}</div>}

					{!loading && addresses.length === 0 && (
						<div className="addr-empty">
							<p>Bạn chưa có địa chỉ nào.</p>
						</div>
					)}

					{!loading && addresses.length > 0 && (
						<ul className="addr-list">
							{addresses.map((addr) => (
								<li key={addr.address_id} className="addr-item">
									<div className="addr-row">
										<div className="addr-info">
											<div className="addr-line">
												<span className="addr-street">{addr.street}</span>
											</div>
											<div className="addr-sub">
												<span>{addr.ward}</span>
												<span> • </span>
												<span>{addr.city}</span>
											</div>
										</div>
										<div className="addr-right">
											{addr._default && (
												<span className="addr-badge">Mặc định</span>
											)}
											{!addr._default && (
												<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
													<button
														type="button"
														onClick={(e) => handleSetDefault(e, addr.address_id)}
														disabled={updatingId === addr.address_id}
														aria-label="Đặt làm mặc định"
														title="Đặt làm mặc định"
														style={{ 
															display: 'flex',
															alignItems: 'center',
															gap: '4px',
															padding: '4px 8px',
															border: '1px solid #1890ff',
															borderRadius: '4px',
															background: 'transparent',
															color: updatingId === addr.address_id ? '#ccc' : '#1890ff',
															cursor: updatingId === addr.address_id ? 'not-allowed' : 'pointer',
															opacity: updatingId === addr.address_id ? 0.5 : 1,
															fontSize: '12px',
															transition: 'all 0.2s'
														}}
													>
														<CheckCircle size={14} />
														<span>Đặt mặc định</span>
													</button>
													<button
														type="button"
														className="addr-delete-btn"
														onClick={(e) => handleDelete(e, addr.address_id)}
														disabled={deletingId === addr.address_id}
														aria-label="Xóa địa chỉ"
														title="Xóa địa chỉ"
													>
														<Trash2 size={16} />
													</button>
												</div>
											)}
										</div>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>

				<div className="addr-modal-footer">
					<button className="addr-btn" onClick={onClose}>
						Đóng
					</button>
				</div>
			</div>
		</div>
	);

	// Render modal at document.body to avoid ancestor stacking-context (e.g., transform/sticky) issues
	return createPortal(modalContent, document.body);
}


