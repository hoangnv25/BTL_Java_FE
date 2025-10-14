import ProductCard from "../../../components/ProductCard";
import "./NewArrivals.css";

export default function NAinPage() {
  /*
  giả sử fetch api trả về 1 list sản phẩm (Product) được gắn nhẵn là 
  NewArrivals như sau:
  */
  const response = [
    {
      id: 1,
      category: "ABC",
      title: "Sản phẩm 1",
      price: 100000,
      thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
      description: "Description 1",
      rate: 3.5,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
      list_product_variation: [
        {
          id_variation: 1,
          product_id: 1,
          thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
        },
        {
          id_variation: 2,
          product_id: 1,
          thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
        }
      ],
      Discount: 0
  
    },
    {
      id: 2,
      category: "ABC",
      title: "Sản phẩm 2",
      price: 134000,
      thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
      description: "Description 2",
      rate: 3.5,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
      list_product_variation: [
        {
          id_variation: 3,
          product_id: 2,
          thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
        },
        {
          id_variation: 4,
          product_id: 2,
          thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
        }
      ],
      Discount: 10
    },
    {
      id: 3,
      category: "ABC",
      title: "Sản phẩm 3",
      price: 120000,
      thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      description: "Description 3",
      rate: 2.5,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
      list_product_variation: [
        {
          id_variation: 5,
          product_id: 3,
          thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
        }
      ],
      Discount: 0
    },
    {
      id: 4,
      category: "ABC",
      title: "Sản phẩm 4",
      price: 540000,
      thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
      description: "Description 4",
      rate: 4.5,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
      list_product_variation: [
        {
          id_variation: 6,
          product_id: 4,
          thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
        },
        {
          id_variation: 7,
          product_id: 4,
          thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
        }
      ],
      Discount: 0
    }
  ];

  return (
    <section className="na-section">
      <h2 className="na-title">New Arrivals</h2>
      <p className="na-desc">Các sản phẩm mới nhất dành cho bạn</p>
      <div className="na-grid">
        {response.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}