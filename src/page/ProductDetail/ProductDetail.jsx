import { useParams } from "react-router-dom";
import ProductFeedback from "./ProductFeedback";
import "./ProductDetail.css";
export default function ProductDetail() {

    const { id } = useParams();
    const response = {
        id: 219,
        title: "Ao sai đẹp giếu",
        description: "Đây là mô tả của áo Sai đẹp giếu",
        price: 450000,
        thumbnail: "https://onoff.vn/blog/wp-content/uploads/2024/11/cac-kieu-ao-khoac-nu-mua-dong-1.jpg",
        rate: 3.5,
        discount: 10,
        list_prod_variation: [
            {
                id_variation: 1,
                product_id: 219,
                image: "https://onoff.vn/blog/wp-content/uploads/2024/11/cac-kieu-ao-khoac-nu-mua-dong-3.jpg",
                size: "XL",
                color: "Be",
                stock_quantity: 12
            },
            {
                id_variation: 2,
                product_id: 219,
                image: "https://onoff.vn/blog/wp-content/uploads/2024/11/cac-kieu-ao-khoac-nu-mua-dong-4.jpg",
                size: "XL",
                color: "Lam",
                stock_quantity: 3
            },
            {
                id_variation: 3,
                product_id: 219,
                image: "https://onoff.vn/blog/wp-content/uploads/2024/11/cac-kieu-ao-khoac-nu-mua-dong-4.jpg",
                size: "L",
                color: "Lam",
                stock_quantity: 0
            },
            {
                id_variation: 4,
                product_id: 219,
                image: "https://onoff.vn/blog/wp-content/uploads/2024/11/cac-kieu-ao-khoac-nu-mua-dong-4.jpg",
                size: "M",
                color: "Lam",
                stock_quantity: 5
            }
        ]
    }
    return (
        <div>
            <h1>Product Detail</h1>
            <h1>{id}</h1>

            <h3> Bây giờ giả sử mình có id là như trên rồi, thì mình có thể fetch api để lấy thông tin sản phẩm theo id</h3>
            <p>Json mô tả sản phẩm như trên, làm giao diện nha</p>
            <p>Gồm hiển thị mấy thông tin trên, nút mua ngay, nút thêm vào giỏ (chỉ nút thôi, click ko làm gì cả), mất cái màu mè khác Dũng muốn</p>

            <ProductFeedback />
        </div>
    )
}