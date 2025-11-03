import { useLocation, useParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard'
import Breadcrumb from '../../components/Breadcrumb'
import './CategoryProduct.css'

export default function CategoryProduct() {
    const location = useLocation()
    const { state } = location
    const { id } = useParams()

    // Breadcrumb items
    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Danh mục", path: "/" }, // Can link to category list if available
        { label: state?.name || "Sản phẩm" }
    ];

    const response = {
        "message": "abc",
        "category_name": "Áo thun nam",
        "image_category": "https://nhaantoan.com/wp-content/uploads/2022/08/Banner-WEB-Slider-KM-Tang-Ao-Thun-Team-02-scaled.jpg",
        "list_product" : [
            {
                prod_id: 1,
                title: "Áo abc",
                price: 400000,
                thumbnail: "https://bizweb.dktcdn.net/100/415/697/products/mc1-0224920e-c953-4129-a4b3-d79b600e15fa.jpg?v=1637916532137",
                description: "Đây là mô tả mô tả mô tả mô tả mô tả mô tả mô tả",
                rate: 3.5,
                discount: 0,
                list_product_variation: [
                  {
                    thumbnail: "https://bizweb.dktcdn.net/100/415/697/products/mc1-0224920e-c953-4129-a4b3-d79b600e15fa.jpg?v=1637916532137",
                  },
                  {
                    thumbnail: "https://bizweb.dktcdn.net/100/415/697/products/mc1-0224920e-c953-4129-a4b3-d79b600e15fa.jpg?v=1637916532137",
                  }
                ]
            },
            {
                prod_id: 2,
                title: "Áo abc",
                price: 400000,
                thumbnail: "https://bizweb.dktcdn.net/100/415/697/products/mc1-0224920e-c953-4129-a4b3-d79b600e15fa.jpg?v=1637916532137",
                description: "Đây là mô tả mô tả mô tả mô tả mô tả mô tả mô tả",
                rate: 3.5,
                discount: 0,
            }
        ]
    }
    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div>
                <h1>{state?.name || 'Danh mục sản phẩm'}</h1>
            <img className="na-image-category" src={response.image_category} alt={response.category_name} />
            <div className="na-grid">
                {response.list_product.map((product) => (
                <ProductCard key={product.prod_id} product={product} />
                ))}
            </div>
            </div>
        </>
    )
}