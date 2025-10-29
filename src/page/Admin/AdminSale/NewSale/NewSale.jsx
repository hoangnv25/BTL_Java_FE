import { useEffect, useState } from 'react'
import axios from 'axios'
import { base } from '../../../../service/Base'
import { App } from 'antd'
import { Search } from 'lucide-react'
import './NewSale.css'

export default function NewSaleModal({ open = false, onClose, onCreated }) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [stDate, setStDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [productIds, setProductIds] = useState([])
    const [products, setProducts] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loadingProducts, setLoadingProducts] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const { message } = App.useApp();

    useEffect(() => {
        if (open) {
            // Reset form when modal opens
            setName('')
            setDescription('')
            setStDate('')
            setEndDate('')
            setProductIds([])
            setSearchQuery('')
            // Fetch products
            fetchProducts()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    // Filter products based on search query
    const filteredProducts = products.filter(product => {
        const productName = (product.productName || product.name || '').toLowerCase()
        return productName.includes(searchQuery.toLowerCase())
    })

    const fetchProducts = async () => {
        setLoadingProducts(true)
        try {
            const response = await axios.get(`${base}/product`)
            if (response.status === 200) {
                setProducts(response.data.result || [])
            }
        } catch (error) {
            console.log('Error fetching products:', error)
            message.error('Không thể tải danh sách sản phẩm')
        } finally {
            setLoadingProducts(false)
        }
    }

    const toggleProduct = (productId) => {
        setProductIds(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId)
            } else {
                return [...prev, productId]
            }
        })
    }

    const selectAllProducts = () => {
        const filteredIds = filteredProducts.map(p => p.productId)
        const allFilteredSelected = filteredIds.every(id => productIds.includes(id))
        
        if (allFilteredSelected) {
            // Remove all filtered products from selection
            setProductIds(productIds.filter(id => !filteredIds.includes(id)))
        } else {
            // Add all filtered products to selection
            const newIds = [...new Set([...productIds, ...filteredIds])]
            setProductIds(newIds)
        }
    }

    const disabled = !name.trim() || !stDate || !endDate || submitting

    const handleCancel = () => {
        if (submitting) return
        if (typeof onClose === 'function') onClose()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (disabled) return
        
        setSubmitting(true)
        try {
            // Format dates to ISO string
            const formattedStDate = new Date(stDate).toISOString()
            const formattedEndDate = new Date(endDate).toISOString()

            const payload = {
                name: name.trim(),
                description: description.trim(),
                stDate: formattedStDate,
                endDate: formattedEndDate,
                productIds: productIds
            }

            const response = await axios.post(`${base}/sales`, payload, {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200 || response.status === 201) {
                message.success('Tạo khuyến mãi thành công')
                if (typeof onCreated === 'function') onCreated(response.data?.result)
                if (typeof onClose === 'function') onClose()
                return
            }
            message.error(response.data?.message || 'Tạo khuyến mãi thất bại')
        } catch (err) {
            message.error(err?.response?.data?.message || 'Có lỗi khi tạo khuyến mãi')
        } finally {
            setSubmitting(false)
        }
    }

    if (!open) return null

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal">
                <div className="modal-header">
                    <h2 className="modal-title">Tạo khuyến mãi mới</h2>
                </div>
                <form className="modal-body" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Tên khuyến mãi <span className="required">*</span></label>
                        <input
                            id="name"
                            className="form-control"
                            type="text"
                            placeholder="Nhập tên khuyến mãi"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Mô tả</label>
                        <textarea
                            id="description"
                            className="form-control"
                            placeholder="Nhập mô tả khuyến mãi"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="stDate">Ngày bắt đầu <span className="required">*</span></label>
                            <input
                                id="stDate"
                                className="form-control"
                                type="datetime-local"
                                value={stDate}
                                onChange={(e) => setStDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="endDate">Ngày kết thúc <span className="required">*</span></label>
                            <input
                                id="endDate"
                                className="form-control"
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="products-header">
                            <label>Chọn sản phẩm ({productIds.length} đã chọn)</label>
                            <button 
                                type="button" 
                                className="btn-select-all"
                                onClick={selectAllProducts}
                                disabled={loadingProducts || filteredProducts.length === 0}
                            >
                                Chọn tất cả
                            </button>
                        </div>

                        <div className="search-box">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <div className="products-container">
                            {loadingProducts ? (
                                <div className="products-loading">Đang tải sản phẩm...</div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="products-empty">
                                    {searchQuery ? 'Không tìm thấy sản phẩm nào' : 'Không có sản phẩm nào'}
                                </div>
                            ) : (
                                <div className="products-list-checkbox">
                                    {filteredProducts.map((product) => (
                                        <label key={product.productId} className="product-checkbox-item">
                                            <input
                                                type="checkbox"
                                                checked={productIds.includes(product.productId)}
                                                onChange={() => toggleProduct(product.productId)}
                                            />
                                            <span className="product-checkbox-label">
                                                {product.productName || product.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={submitting}>
                            Hủy
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={disabled}>
                            {submitting ? 'Đang tạo...' : 'Tạo khuyến mãi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

