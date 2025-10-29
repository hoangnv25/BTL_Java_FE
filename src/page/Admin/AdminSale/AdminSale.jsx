import axios from 'axios'
import { base } from '../../../service/Base'
import { useEffect, useState } from 'react'
import { App } from 'antd'
import { Plus, Pencil, ChevronRight, ChevronDown, Trash2 } from 'lucide-react'
import './AdminSale.css'
import NewSaleModal from './NewSale/NewSale'
import UpdateSaleModal from './UpdateSale/UpdateSale'
import ConfirmDialog from '../Components/ConfirmDialog'


export default function AdminSale() {
    const [_sales, setSales] = useState([]);
    const [expandedSaleId, setExpandedSaleId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [saleToDelete, setSaleToDelete] = useState(null);
    const { message } = App.useApp();
    
    useEffect(() => {
        const controller = new AbortController();
        
        const fetchSales = async () => {
            try {
                const response = await axios.get(`${base}/sales`, {
                    signal: controller.signal,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (response.status === 200) {
                    setSales(response.data.result);
                    console.log(response.data.result);
                }
            } catch (error) {
                if (error.name === 'CanceledError') {
                    console.log('Request was cancelled');
                    return;
                }
                console.log(error)
                message.error('Tải danh sách khuyến mãi thất bại');
            }
        }
        
        fetchSales()
        
        return () => {
            controller.abort();
        }
    }, [message])

    const toggleExpand = (saleId) => {
        setExpandedSaleId(expandedSaleId === saleId ? null : saleId);
    }

    const handleSaleCreated = (newSale) => {
        setSales([newSale, ..._sales]);
    }

    const handleEditClick = (sale) => {
        setSelectedSale(sale);
        setIsUpdateModalOpen(true);
    }

    const handleSaleUpdated = (updatedSale) => {
        setSales(_sales.map(s => s.id === updatedSale.id ? updatedSale : s));
    }

    const handleDeleteClick = (sale) => {
        setSaleToDelete(sale)
        setIsConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!saleToDelete) return

        setIsConfirmOpen(false)

        try {
            const response = await axios.delete(`${base}/sales/${saleToDelete.id}`, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200 || response.status === 204) {
                message.success('Xóa khuyến mãi thành công')
                setSales(_sales.filter(s => s.id !== saleToDelete.id))
                setSaleToDelete(null)
                return
            }
            message.error(response.data?.message || 'Xóa khuyến mãi thất bại')
        } catch (err) {
            message.error(err?.response?.data?.message || 'Có lỗi khi xóa khuyến mãi')
        }
    }

    const handleCancelDelete = () => {
        setIsConfirmOpen(false)
        setSaleToDelete(null)
    }

    return (
        <div className="admin-sale-container">
            <div className="admin-sale-header">
                <h1>Quản Lý Khuyến Mãi</h1>
                <button className="btn-create-sale" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} />
                    <span>Tạo khuyến mãi mới</span>
                </button>
            </div>
            
            <div className="sales-grid">
                {_sales.map((sale) => (
                    <div key={sale.id} className={`sale-card ${sale.active ? 'active' : 'inactive'}`}>
                        <div className="sale-card-header">
                            <h2 className="sale-name">{sale.name}</h2>
                            <span className={`sale-status ${sale.active ? 'status-active' : 'status-inactive'}`}>
                                {sale.active ? 'Hoạt động' : 'Không hoạt động'}
                            </span>
                        </div>
                        
                        <div className="sale-card-body">
                            <p className="sale-description">{sale.description || 'Không có mô tả'}</p>
                            
                            <div className="sale-dates">
                                <div className="date-item">
                                    <span className="date-label">Ngày bắt đầu:</span>
                                    <span className="date-value">
                                        {new Date(sale.stDate).toLocaleDateString('vi-VN')} {new Date(sale.stDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="date-item">
                                    <span className="date-label">Ngày kết thúc:</span>
                                    <span className="date-value">
                                        {new Date(sale.endDate).toLocaleDateString('vi-VN')} {new Date(sale.endDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>

                            <div className="sale-actions">
                                <button 
                                    className="btn-edit-sale"
                                    onClick={() => handleEditClick(sale)}
                                    title="Sửa"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button 
                                    className="btn-delete-sale"
                                    onClick={() => handleDeleteClick(sale)}
                                    title="Xóa"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <button 
                                    className="btn-view-products"
                                    onClick={() => toggleExpand(sale.id)}
                                >
                                    {expandedSaleId === sale.id ? (
                                        <>
                                            <ChevronDown size={16} />
                                            <span>Ẩn ({sale.list_product.length})</span>
                                        </>
                                    ) : (
                                        <>
                                            <ChevronRight size={16} />
                                            <span>Xem ({sale.list_product.length})</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {expandedSaleId === sale.id && (
                                <div className="products-list">
                                    {sale.list_product.length > 0 ? (
                                        <div className="products-grid">
                                            {sale.list_product.map((product, index) => (
                                                <div key={index} className="product-item">
                                                    {product.productName || product.name || product}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="no-products">Chưa có sản phẩm nào trong khuyến mãi này</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            <NewSaleModal 
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={handleSaleCreated}
            />

            <UpdateSaleModal 
                open={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onUpdated={handleSaleUpdated}
                sale={selectedSale}
            />

            <ConfirmDialog
                open={isConfirmOpen}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa khuyến mãi "${saleToDelete?.name}"?`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    )
}