import { useEffect, useState } from 'react'
import axios from 'axios'
import { base } from '../../../../service/Base'
import { App } from 'antd'
import { Search } from 'lucide-react'
import './UpdateSale.css'

export default function UpdateSaleModal({ open = false, onClose, onUpdated, sale }) {
    const [stDate, setStDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [removeProductIds, setRemoveProductIds] = useState([])
    const [addProducts, setAddProducts] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [searchRemoveQuery, setSearchRemoveQuery] = useState('')
    const [searchAddQuery, setSearchAddQuery] = useState('')
    const [loadingProducts, setLoadingProducts] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const { message } = App.useApp();

    useEffect(() => {
        if (open && sale) {
            // Pre-fill dates
            const stDateFormatted = formatDateForInput(sale.stDate)
            const endDateFormatted = formatDateForInput(sale.endDate)
            setStDate(stDateFormatted)
            setEndDate(endDateFormatted)
            setRemoveProductIds([])
            setAddProducts([])
            setSearchRemoveQuery('')
            setSearchAddQuery('')
            // Fetch all products
            fetchProducts()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, sale])

    // Get current product IDs in the sale
    const currentProducts = sale?.list_product || []
    const currentProductIds = currentProducts.map(p => p.productId || p.id)
    
    // Filter current products for remove section
    const filteredRemoveProducts = currentProducts.filter(product => {
        const productName = (product.productName || product.name || '').toLowerCase()
        return productName.includes(searchRemoveQuery.toLowerCase())
    })
    
    // Filter available products for add section
    const availableProducts = allProducts.filter(p => !currentProductIds.includes(p.productId))
    const filteredAddProducts = availableProducts.filter(product => {
        const productName = (product.productName || product.name || '').toLowerCase()
        return productName.includes(searchAddQuery.toLowerCase())
    })

    const formatDateForInput = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
    }

    const fetchProducts = async () => {
        setLoadingProducts(true)
        try {
            const response = await axios.get(`${base}/product`)
            if (response.status === 200) {
                setAllProducts(response.data.result || [])
            }
        } catch (error) {
            console.log('Error fetching products:', error)
            message.error('Không thể tải danh sách sản phẩm')
        } finally {
            setLoadingProducts(false)
        }
    }

    const toggleRemoveProduct = (productId) => {
        setRemoveProductIds(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId)
            } else {
                return [...prev, productId]
            }
        })
    }

    const handleAddProductToggle = (productId) => {
        setAddProducts(prev => {
            const exists = prev.find(p => p.productId === productId)
            if (exists) {
                return prev.filter(p => p.productId !== productId)
            } else {
                return [...prev, { productId, value: 0 }]
            }
        })
    }

    const handleValueChange = (productId, value) => {
        setAddProducts(prev => 
            prev.map(p => p.productId === productId ? { ...p, value: parseFloat(value) || 0 } : p)
        )
    }

    const disabled = !stDate || !endDate || submitting

    const handleCancel = () => {
        if (submitting) return
        if (typeof onClose === 'function') onClose()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (disabled || !sale) return
        
        setSubmitting(true)
        try {
            const formattedStDate = new Date(stDate).toISOString()
            const formattedEndDate = new Date(endDate).toISOString()

            const payload = {
                stDate: formattedStDate,
                endDate: formattedEndDate,
                removeProductIds: removeProductIds,
                addProducts: addProducts
            }

            const response = await axios.put(`${base}/sales/${sale.id}`, payload, {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200 || response.status === 201) {
                message.success('Cập nhật khuyến mãi thành công')
                if (typeof onUpdated === 'function') onUpdated(response.data?.result || sale)
                if (typeof onClose === 'function') onClose()
                return
            }
            message.error(response.data?.message || 'Cập nhật khuyến mãi thất bại')
        } catch (err) {
            message.error(err?.response?.data?.message || 'Có lỗi khi cập nhật khuyến mãi')
        } finally {
            setSubmitting(false)
        }
    }

    if (!open || !sale) return null

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal update-modal">
                <div className="modal-header">
                    <h2 className="modal-title">Cập nhật khuyến mãi: {sale.name}</h2>
                </div>
                <form className="modal-body" onSubmit={handleSubmit}>
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

                    {/* Remove Products Section */}
                    {currentProducts.length > 0 && (
                        <div className="form-group">
                            <label>Xóa sản phẩm khỏi khuyến mãi ({removeProductIds.length} sẽ xóa)</label>
                            
                            <div className="search-box">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    value={searchRemoveQuery}
                                    onChange={(e) => setSearchRemoveQuery(e.target.value)}
                                />
                            </div>

                            <div className="products-container">
                                {filteredRemoveProducts.length === 0 ? (
                                    <div className="products-empty">
                                        {searchRemoveQuery ? 'Không tìm thấy sản phẩm nào' : 'Không có sản phẩm nào'}
                                    </div>
                                ) : (
                                    <div className="products-list-checkbox">
                                        {filteredRemoveProducts.map((product) => (
                                            <label key={product.productId || product.id} className="product-checkbox-item">
                                                <input
                                                    type="checkbox"
                                                    checked={removeProductIds.includes(product.productId || product.id)}
                                                    onChange={() => toggleRemoveProduct(product.productId || product.id)}
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
                    )}

                    {/* Add Products Section */}
                    <div className="form-group">
                        <label>Thêm sản phẩm vào khuyến mãi ({addProducts.length} sẽ thêm)</label>
                        
                        <div className="search-box">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchAddQuery}
                                onChange={(e) => setSearchAddQuery(e.target.value)}
                            />
                        </div>

                        <div className="products-container">
                            {loadingProducts ? (
                                <div className="products-loading">Đang tải sản phẩm...</div>
                            ) : filteredAddProducts.length === 0 ? (
                                <div className="products-empty">
                                    {searchAddQuery ? 'Không tìm thấy sản phẩm nào' : (availableProducts.length === 0 ? 'Không có sản phẩm mới để thêm' : 'Không tìm thấy sản phẩm nào')}
                                </div>
                            ) : (
                                <div className="products-list-with-value">
                                    {filteredAddProducts.map((product) => {
                                        const addedProduct = addProducts.find(p => p.productId === product.productId)
                                        return (
                                            <div key={product.productId} className="product-value-item">
                                                <label className="product-checkbox-inline">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!addedProduct}
                                                        onChange={() => handleAddProductToggle(product.productId)}
                                                    />
                                                    <span className="product-name-inline">
                                                        {product.productName || product.name}
                                                    </span>
                                                </label>
                                                {addedProduct && (
                                                    <input
                                                        type="number"
                                                        className="value-input"
                                                        placeholder="Giá trị giảm (0-1)"
                                                        min="0"
                                                        max="1"
                                                        step="0.01"
                                                        value={addedProduct.value}
                                                        onChange={(e) => handleValueChange(product.productId, e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={submitting}>
                            Hủy
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={disabled}>
                            {submitting ? 'Đang cập nhật...' : 'Cập nhật'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

