import { useState, useEffect } from 'react'
import axios from 'axios'
import { base } from '../../../../service/Base'
import { App, Select } from 'antd'
import { Upload, X, Search } from 'lucide-react'
import './UpdateProduct.css'

export default function UpdateProductModal({ open = false, onClose, onUpdated, product }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [removeImage, setRemoveImage] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [categories, setCategories] = useState([])
    const [loadingCategories, setLoadingCategories] = useState(false)

    const { message } = App.useApp()

    // Fetch categories when modal opens
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true)
            try {
                const response = await axios.get(`${base}/category`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (response.status === 200) {
                    setCategories(response.data.result || [])
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
                message.error('Không thể tải danh sách danh mục')
            } finally {
                setLoadingCategories(false)
            }
        }

        if (open) {
            fetchCategories()
        }
    }, [open, message])

    // Pre-fill form when product changes
    useEffect(() => {
        if (product) {
            setTitle(product.title || '')
            setDescription(product.description || '')
            setPrice(product.price ? product.price.toString() : '')
            setCategoryId(product.categoryId || null)
            setImagePreview(product.image || null)
            setImageFile(null)
            setRemoveImage(false)
        }
    }, [product])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                message.error('Vui lòng chọn file ảnh')
                return
            }
            setImageFile(file)
            setRemoveImage(false)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveImage = () => {
        setImageFile(null)
        setImagePreview(null)
        setRemoveImage(true)
    }

    const handleCancel = () => {
        if (submitting) return
        resetForm()
        if (typeof onClose === 'function') onClose()
    }

    const resetForm = () => {
        setTitle('')
        setDescription('')
        setPrice('')
        setCategoryId('')
        setImageFile(null)
        setImagePreview(null)
        setRemoveImage(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!product || !product.productId) {
            message.error('Không tìm thấy thông tin sản phẩm')
            return
        }

        // Build FormData with only changed fields
        const formData = new FormData()
        let hasChanges = false

        // Check if title changed
        if (title.trim() && title.trim() !== product.title) {
            formData.append('title', title.trim())
            hasChanges = true
        }

        // Check if description changed
        if (description.trim() !== (product.description || '')) {
            formData.append('description', description.trim())
            hasChanges = true
        }

        // Check if price changed
        if (price && parseFloat(price) !== product.price) {
            if (parseFloat(price) <= 0) {
                message.error('Giá phải lớn hơn 0')
                return
            }
            formData.append('price', parseFloat(price))
            hasChanges = true
        }

        // Check if categoryId changed
        const newCategoryId = categoryId ? parseInt(categoryId) : null
        const oldCategoryId = product.categoryId || null
        if (newCategoryId !== oldCategoryId) {
            if (newCategoryId) {
                formData.append('categoryId', newCategoryId)
            }
            hasChanges = true
        }

        // Check if image changed (new file selected or removed)
        if (imageFile) {
            formData.append('image', imageFile)
            hasChanges = true
        } else if (removeImage && product.image) {
            // User wants to remove the existing image
            formData.append('image', '')
            hasChanges = true
        }

        if (!hasChanges) {
            message.warning('Không có thay đổi nào để cập nhật')
            return
        }

        setSubmitting(true)
        try {
            const response = await axios.put(`${base}/products/${product.productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200 || response.status === 201) {
                message.success('Cập nhật sản phẩm thành công')
                resetForm()
                if (typeof onUpdated === 'function') onUpdated(response.data?.result)
                if (typeof onClose === 'function') onClose()
                return
            }
            message.error(response.data?.message || 'Cập nhật sản phẩm thất bại')
        } catch (err) {
            console.error('Error updating product:', err)
            message.error(err?.response?.data?.message || 'Có lỗi khi cập nhật sản phẩm')
        } finally {
            setSubmitting(false)
        }
    }

    if (!open) return null

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal update-product-modal">
                <div className="modal-header">
                    <h2 className="modal-title">Cập nhật sản phẩm</h2>
                    <button className="btn-close" onClick={handleCancel} disabled={submitting}>×</button>
                </div>
                <form className="modal-body" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Tên sản phẩm</label>
                        <input
                            id="title"
                            className="form-control"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nhập tên sản phẩm mới"
                        />
                        {product?.title && (
                            <span className="current-value">Hiện tại: {product.title}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Mô tả</label>
                        <textarea
                            id="description"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Nhập mô tả mới"
                            rows="4"
                        />
                        {product?.description && (
                            <span className="current-value">Hiện tại: {product.description}</span>
                        )}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">Giá (VNĐ)</label>
                            <input
                                id="price"
                                className="form-control"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Nhập giá mới"
                                min="0"
                                step="1000"
                            />
                            {product?.price && (
                                <span className="current-value">
                                    Hiện tại: {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(product.price)}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="categoryId">Danh mục</label>
                            <Select
                                id="categoryId"
                                className="category-select"
                                value={categoryId}
                                onChange={(value) => setCategoryId(value)}
                                placeholder="Chọn danh mục mới"
                                showSearch
                                allowClear
                                loading={loadingCategories}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={(() => {
                                    // Sort categories: parents first, then children grouped under their parents
                                    const parents = categories.filter(cat => !cat.parentId || cat.parentId === 0)
                                    const children = categories.filter(cat => cat.parentId && cat.parentId !== 0)
                                    
                                    const sorted = []
                                    
                                    // Add orphan children first (with warning)
                                    const orphans = children.filter(child => 
                                        !parents.some(p => p.categoryId === (child.parentId || child.perentId))
                                    )
                                    orphans.forEach(orphan => {
                                        sorted.push({
                                            value: orphan.categoryId,
                                            label: `⚠️ ${orphan.categoryName || orphan.name} (Lỗi dữ liệu)`,
                                            parentId: orphan.parentId || orphan.perentId,
                                            isParent: false,
                                            isOrphan: true
                                        })
                                    })
                                    
                                    parents.forEach(parent => {
                                        sorted.push({
                                            value: parent.categoryId,
                                            label: parent.categoryName || parent.name,
                                            parentId: 0,
                                            isParent: true
                                        })
                                        
                                        // Add children of this parent
                                        const parentChildren = children.filter(child => 
                                            (child.parentId || child.perentId) === parent.categoryId
                                        )
                                        parentChildren.forEach(child => {
                                            sorted.push({
                                                value: child.categoryId,
                                                label: child.categoryName || child.name,
                                                parentId: child.parentId || child.perentId,
                                                isParent: false
                                            })
                                        })
                                    })
                                    
                                    return sorted
                                })()}
                                optionRender={(option) => {
                                    const isChild = !option.data.isParent
                                    const isOrphan = option.data.isOrphan
                                    return (
                                        <div style={{ 
                                            paddingLeft: isChild ? '20px' : '0',
                                            color: isOrphan ? '#d32f2f' : 'inherit',
                                            fontWeight: isOrphan ? '600' : 'normal'
                                        }}>
                                            {isChild && !isOrphan && '└─ '}
                                            {option.data.label}
                                        </div>
                                    )
                                }}
                            />
                            {product?.categoryId && (
                                <span className="current-value">
                                    Hiện tại: {categories.find(c => c.categoryId === product.categoryId)?.categoryName || 
                                              categories.find(c => c.categoryId === product.categoryId)?.name || 
                                              product.categoryId}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Hình ảnh sản phẩm</label>
                        
                        {!imagePreview ? (
                            <div className="image-upload-area">
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="image-input"
                                />
                                <label htmlFor="image" className="image-upload-label">
                                    <Upload size={32} />
                                    <span>{removeImage ? 'Chọn ảnh mới để thay thế' : 'Click để chọn ảnh mới'}</span>
                                    <span className="upload-hint">PNG, JPG, JPEG (Max 5MB)</span>
                                </label>
                                {removeImage && (
                                    <button
                                        type="button"
                                        className="btn-undo-remove-inline"
                                        onClick={() => {
                                            setRemoveImage(false)
                                            setImagePreview(product?.image || null)
                                        }}
                                    >
                                        Hoàn tác - Giữ ảnh cũ
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="image-preview-container">
                                <img src={imagePreview} alt="Preview" className="image-preview" />
                                <button
                                    type="button"
                                    className="btn-remove-image"
                                    onClick={handleRemoveImage}
                                    title="Xóa ảnh"
                                >
                                    <X size={16} />
                                </button>
                                {imageFile && (
                                    <span className="image-changed-badge">Ảnh mới</span>
                                )}
                                {removeImage && (
                                    <span className="image-removed-badge">Ảnh cũ sẽ bị xóa</span>
                                )}
                            </div>
                        )}
                        {product?.image && !removeImage && !imageFile && imagePreview && (
                            <span className="current-value">Ảnh hiện tại</span>
                        )}
                    </div>

                    <div className="update-note">
                        💡 <strong>Lưu ý:</strong> Chỉ cần điền vào các trường muốn thay đổi
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={submitting}>
                            Hủy
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Đang cập nhật...' : 'Cập nhật'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

