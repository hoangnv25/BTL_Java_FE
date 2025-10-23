import './AdminCategory.css'
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { base } from '../../../service/Base'
import { toast } from 'react-toastify'

export default function AdminCategory() {
    const [categories, setCategories] = useState([])

    const fetchCategories = async () => {
        const response = await axios.get(`${base}/category`)
        if (response.status === 200) {
            setCategories(response.data.result)
            toast.success(response.data.message)
            return
        }
        else {
            toast.error(response.data.message)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleEditCategory = (category) => {
        toast.info(`Sửa: ${category.categoryName}`)
    }

    const handleDeleteCategory = (category) => {
        toast.info(`Xóa: ${category.categoryName}`)
    }

    const handleAddParent = () => {
        toast.info('Thêm danh mục cha')
    }

    const handleAddChild = (parentCategory) => {
        toast.info(`Thêm danh mục con cho: ${parentCategory.categoryName}`)
    }

    const buildCategoryTree = (flatCategories) => {
        if (!Array.isArray(flatCategories) || flatCategories.length === 0) return []

        // Two-level optimization: partition parents and children once, then map
        const parents = []
        const childrenByParent = new Map()

        for (const cat of flatCategories) {
            const parentId = cat.parentId ?? cat.perentId ?? 0
            if (!parentId || parentId === 0) {
                parents.push({ ...cat, children: [] })
            } else {
                const list = childrenByParent.get(parentId) || []
                list.push(cat)
                childrenByParent.set(parentId, list)
            }
        }

        // Attach children (only one level deep)
        for (const parent of parents) {
            const kids = childrenByParent.get(parent.categoryId) || []
            parent.children = kids.map((c) => ({ ...c, children: [] }))
        }

        return parents
    }

    const categoryTree = useMemo(() => buildCategoryTree(categories), [categories])

    const renderTree = (nodes) => {
        if (!nodes || nodes.length === 0) return null
        return (
            <ul className="admin-category-tree">
                {nodes.map((node) => (
                    <li key={node.categoryId} className="category-item">
                        <div className="category-row level-1">
                            <span className="category-name">{node.categoryName}</span>
                            <div className="category-right">
                                {typeof node.productCount === 'number' && (
                                    <span className="category-count">{node.productCount}</span>
                                )}
                                <div className="category-actions">
                                    <button className="btn btn-edit" onClick={() => handleEditCategory(node)}>Sửa</button>
                                    <button className="btn btn-delete" onClick={() => handleDeleteCategory(node)}>Xóa</button>
                                </div>
                            </div>
                        </div>
                        <ul className="children-list">
                            {(node.children || []).map((child) => (
                                <li key={child.categoryId} className="category-item">
                                    <div className="category-row level-2">
                                        <span className="category-name">{child.categoryName}</span>
                                        <div className="category-right">
                                            {typeof child.productCount === 'number' && (
                                                <span className="category-count">{child.productCount}</span>
                                            )}
                                            <div className="category-actions">
                                                <button className="btn btn-edit" onClick={() => handleEditCategory(child)}>Sửa</button>
                                                <button className="btn btn-delete" onClick={() => handleDeleteCategory(child)}>Xóa</button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            <li className="category-add-item">
                                <button type="button" className="category-add-row add-child" onClick={() => handleAddChild(node)}>
                                    <span className="add-icon" aria-hidden="true">+</span>
                                    Thêm danh mục con
                                </button>
                            </li>
                        </ul>
                    </li>
                ))}
                <li className="category-add-item">
                    <button type="button" className="category-add-row add-parent" onClick={() => handleAddParent()}>
                        <span className="add-icon" aria-hidden="true">+</span>
                        Thêm danh mục cha
                    </button>
                </li>
            </ul>
        )
    }

    return (
        <div className="admin-category-container">
            <h1 className="admin-category-title">Danh mục</h1>
            <div className="admin-category-actions">
                
            </div>
            {categoryTree && categoryTree.length > 0 ? (
                renderTree(categoryTree)
            ) : (
                <p>Không có danh mục.</p>
            )}
        </div>
    )
}