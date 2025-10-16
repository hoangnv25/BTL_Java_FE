import { useLocation, useParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard'
import './CategoryProduct.css'

export default function CategoryProduct() {
    const location = useLocation()
    const { state } = location
    const { id } = useParams()

    const response = {
        "message": "abc",
        "data" : [
            {
                prod_id: 1,
                title: "Áo abc",
                price: 400000,
                thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
                description: "Đây là mô tả mô tả mô tả mô tả mô tả mô tả mô tả",
                rate: 3.5,
                discount: 0,
                list_product_variation: [
                  {
                    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
                  },
                  {
                    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
                  }
                ]
            },
            {
                prod_id: 2,
                title: "Áo abc",
                price: 400000,
                thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
                description: "Đây là mô tả mô tả mô tả mô tả mô tả mô tả mô tả",
                rate: 3.5,
                discount: 0,
            }
        ]
    }
    return (
        <div>
            <h1>{state?.name || 'Danh mục sản phẩm'}</h1>
            <div className="na-grid">
                {response.data.map((product) => (
                <ProductCard key={product.prod_id} product={product} />
                ))}
            </div>
        </div>
    )
}