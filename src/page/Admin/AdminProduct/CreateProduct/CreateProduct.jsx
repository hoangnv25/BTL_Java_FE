import { useState, useEffect } from 'react'
import axios from 'axios'
import { base } from '../../../../service/Base'
import { App, Select } from 'antd'
import { Upload, X, Plus, Trash2 } from 'lucide-react'
import './CreateProduct.css'

export default function CreateProductModal({ open = false, onClose, onCreated }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [categoryId, setCategoryId] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [categories, setCategories] = useState([])
    const [loadingCategories, setLoadingCategories] = useState(false)
    const [variations, setVariations] = useState([])

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

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                message.error('Vui lòng chọn file ảnh')
                return
            }
            setImageFile(file)
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
        setCategoryId(null)
        setImageFile(null)
        setImagePreview(null)
        setVariations([])
    }

    // Variation management
    const handleAddVariation = () => {
        setVariations([...variations, {
            id: Date.now(), // temporary ID
            size: '',
            color: '',
            stockQuantity: '',
            imageFile: null,
            imagePreview: null
        }])
    }

    const handleRemoveVariation = (id) => {
        setVariations(variations.filter(v => v.id !== id))
    }

    const handleVariationChange = (id, field, value) => {
        setVariations(variations.map(v => {
            if (v.id === id) {
                return { ...v, [field]: value }
            }
            return v
        }))
    }

    const handleVariationImageChange = (id, e) => {
        const file = e.target.files[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                message.error('Vui lòng chọn file ảnh')
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setVariations(variations.map(v => {
                    if (v.id === id) {
                        return { ...v, imageFile: file, imagePreview: reader.result }
                    }
                    return v
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveVariationImage = (id) => {
        setVariations(variations.map(v => {
            if (v.id === id) {
                return { ...v, imageFile: null, imagePreview: null }
            }
            return v
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!title.trim()) {
            message.error('Vui lòng nhập tên sản phẩm')
            return
        }

        if (!price || parseFloat(price) <= 0) {
            message.error('Vui lòng nhập giá hợp lệ')
            return
        }

        setSubmitting(true)
        try {
            const formData = new FormData()
            formData.append('title', title.trim())
            formData.append('description', description.trim())
            formData.append('price', parseFloat(price))
            
            if (categoryId) {
                formData.append('categoryId', parseInt(categoryId))
            }
            
            if (imageFile) {
                formData.append('image', imageFile)
            }

            const response = await axios.post(`${base}/products`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200 || response.status === 201) {
                const createdProduct = response.data?.result
                const productId = createdProduct?.productId || createdProduct?.id

                // Create variations if any
                if (variations.length > 0 && productId) {
                    try {
                        const validVariations = variations.filter(v => v.size && v.color && v.stockQuantity)
                        
                        if (validVariations.length === 0) {
                            message.warning('Vui lòng điền đầy đủ thông tin cho biến thể (Size, Color, Số lượng)')
                            return
                        }

                        console.log('📦 Creating variations:', validVariations.length)
                        
                        const variationPromises = validVariations.map(async (variation, index) => {
                            try {
                                const variationFormData = new FormData()
                                variationFormData.append('productId', productId)
                                variationFormData.append('size', variation.size.trim())
                                variationFormData.append('color', variation.color.trim())
                                variationFormData.append('stockQuantity', parseInt(variation.stockQuantity))
                                
                                if (variation.imageFile) {
                                    variationFormData.append('image', variation.imageFile)
                                }

                                console.log(`📤 Creating variation ${index + 1}/${validVariations.length}:`, {
                                    productId,
                                    size: variation.size.trim(),
                                    color: variation.color.trim(),
                                    stockQuantity: parseInt(variation.stockQuantity),
                                    hasImage: !!variation.imageFile
                                })

                                const response = await axios.post(`${base}/variations`, variationFormData, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                                    }
                                })

                                console.log(`✅ Variation ${index + 1} created:`, response.data)
                                return { success: true, variation, response: response.data }
                            } catch (err) {
                                console.error(`❌ Error creating variation ${index + 1}:`, {
                                    variation,
                                    error: err.response?.data || err.message,
                                    status: err.response?.status
                                })
                                return { 
                                    success: false, 
                                    variation, 
                                    error: err.response?.data || { message: err.message } 
                                }
                            }
                        })

                        const results = await Promise.all(variationPromises)
                        const successCount = results.filter(r => r.success).length
                        const failCount = results.filter(r => !r.success).length

                        if (failCount === 0) {
                            message.success(`Tạo sản phẩm và ${successCount} biến thể thành công`)
                        } else {
                            // Show detailed error messages
                            results.forEach((result, index) => {
                                if (!result.success) {
                                    const errorMsg = result.error?.message || result.error?.result?.message || 'Không xác định'
                                    message.error(`Biến thể ${index + 1} (${result.variation.size}/${result.variation.color}): ${errorMsg}`)
                                }
                            })
                            
                            if (successCount > 0) {
                                message.warning(`Tạo sản phẩm thành công. ${successCount} biến thể thành công, ${failCount} biến thể thất bại`)
                            } else {
                                message.error(`Tạo sản phẩm thành công nhưng không thể tạo biến thể: ${results[0]?.error?.message || results[0]?.error?.result?.message || 'Vui lòng kiểm tra lại'}`)
                            }
                        }
                    } catch (variationError) {
                        console.error('❌ Unexpected error creating variations:', variationError)
                        const errorMsg = variationError?.response?.data?.message || 
                                       variationError?.response?.data?.result?.message ||
                                       variationError?.message || 
                                       'Vui lòng thử lại'
                        message.warning(`Tạo sản phẩm thành công nhưng có lỗi khi tạo biến thể: ${errorMsg}`)
                    }
                } else {
                    message.success('Tạo sản phẩm thành công')
                }

                resetForm()
                if (typeof onCreated === 'function') onCreated(createdProduct)
                if (typeof onClose === 'function') onClose()
                return
            }
            message.error(response.data?.message || 'Tạo sản phẩm thất bại')
        } catch (err) {
            console.error('Error creating product:', err)
            message.error(err?.response?.data?.message || 'Có lỗi khi tạo sản phẩm')
        } finally {
            setSubmitting(false)
        }
    }

    if (!open) return null

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal create-product-modal">
                <div className="modal-header">
                    <h2 className="modal-title">Tạo sản phẩm mới</h2>
                    <button className="btn-close" onClick={handleCancel} disabled={submitting}>×</button>
                </div>
                <form className="modal-body" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Tên sản phẩm <span className="required">*</span></label>
                        <input
                            id="title"
                            className="form-control"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nhập tên sản phẩm"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Mô tả</label>
                        <textarea
                            id="description"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Nhập mô tả sản phẩm"
                            rows="4"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">Giá (VNĐ) <span className="required">*</span></label>
                            <input
                                id="price"
                                className="form-control"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Nhập giá"
                                min="0"
                                step="1000"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="categoryId">Danh mục</label>
                            <Select
                                id="categoryId"
                                className="category-select"
                                value={categoryId}
                                onChange={(value) => setCategoryId(value)}
                                placeholder="Chọn danh mục (optional)"
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
                                    <span>Click để chọn ảnh</span>
                                    <span className="upload-hint">PNG, JPG, JPEG (Max 5MB)</span>
                                </label>
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
                            </div>
                        )}
                    </div>

                    {/* Variations Section */}
                    <div className="variations-section">
                        <div className="variations-header">
                            <label>Biến thể sản phẩm (Tùy chọn)</label>
                            <button
                                type="button"
                                className="btn-add-variation"
                                onClick={handleAddVariation}
                                disabled={submitting}
                            >
                                <Plus size={16} />
                                Thêm biến thể
                            </button>
                        </div>
                        
                        {variations.length > 0 && (
                            <div className="variations-list">
                                {variations.map((variation, index) => (
                                    <div key={variation.id} className="variation-item">
                                        <div className="variation-header-item">
                                            <h4>Biến thể #{index + 1}</h4>
                                            <button
                                                type="button"
                                                className="btn-remove-variation"
                                                onClick={() => handleRemoveVariation(variation.id)}
                                                disabled={submitting}
                                                title="Xóa biến thể"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        
                                        <div className="variation-form-grid">
                                            <div className="form-group">
                                                <label htmlFor={`size-${variation.id}`}>Size <span className="required">*</span></label>
                                                <input
                                                    id={`size-${variation.id}`}
                                                    className="form-control"
                                                    type="text"
                                                    value={variation.size}
                                                    onChange={(e) => handleVariationChange(variation.id, 'size', e.target.value)}
                                                    placeholder="VD: M, L, XL"
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor={`color-${variation.id}`}>Màu sắc <span className="required">*</span></label>
                                                <input
                                                    id={`color-${variation.id}`}
                                                    className="form-control"
                                                    type="text"
                                                    value={variation.color}
                                                    onChange={(e) => handleVariationChange(variation.id, 'color', e.target.value)}
                                                    placeholder="VD: Đen, Trắng"
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor={`stock-${variation.id}`}>Số lượng tồn kho <span className="required">*</span></label>
                                                <input
                                                    id={`stock-${variation.id}`}
                                                    className="form-control"
                                                    type="number"
                                                    value={variation.stockQuantity}
                                                    onChange={(e) => handleVariationChange(variation.id, 'stockQuantity', e.target.value)}
                                                    placeholder="Nhập số lượng"
                                                    min="0"
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor={`variation-image-${variation.id}`}>Hình ảnh biến thể</label>
                                                {!variation.imagePreview ? (
                                                    <div className="variation-image-upload-area">
                                                        <input
                                                            id={`variation-image-${variation.id}`}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleVariationImageChange(variation.id, e)}
                                                            className="image-input"
                                                        />
                                                        <label htmlFor={`variation-image-${variation.id}`} className="variation-image-upload-label">
                                                            <Upload size={20} />
                                                            <span>Chọn ảnh</span>
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="variation-image-preview-container">
                                                        <img src={variation.imagePreview} alt="Variation preview" className="variation-image-preview" />
                                                        <button
                                                            type="button"
                                                            className="btn-remove-image"
                                                            onClick={() => handleRemoveVariationImage(variation.id)}
                                                            title="Xóa ảnh"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={submitting}>
                            Hủy
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Đang tạo...' : 'Tạo sản phẩm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

