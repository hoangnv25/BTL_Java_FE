const response_cart = {
    "user_id": 1, // thật ra mình ko dùng
    "message": "success",
    "result": [
      {
        "product_id": 123,
        "product_variation_id": 1,
        "quantity": 2
      },
      {
        "product_id": 456,
        "product_variation_id": 2, 
        "quantity": 1
      },
      {
        "product_id": 789,
        "product_variation_id": 3,
        "quantity": 3
      }
    ]
  }

const response_product = {
    id: 219,
    title: "Ao sai đẹp giếu",
    description: "Đây là mô tả của áo Sai đẹp giếu",
    price: 450000,
    thumbnail: "https://product.hstatic.net/1000360022/product/ao-thun-nam-hoa-tiet-in-phoi-mau-predator-form-oversize_0c5655ad3680475496d654529c6fd55d_1024x1024.jpg",
    rate: 3.5,
    discount: 10,
    list_prod_variation: [
        {
            product_id: 219,
            image: "https://product.hstatic.net/1000210295/product/artboard_1_copy_11_3e793cf980cf44fb95a9544bd8220992_master.jpg",
            color: "Be",
            list: [
                {
                    id_variation: 1,
                    size: "XL",
                    stock_quantity: 12

                },
                {
                    id_variation: 2,
                    size: "L",
                    stock_quantity: 10
                }
            ]
        },
        {
            product_id: 219,
            image: "https://bizweb.dktcdn.net/100/415/697/products/mc1-0224920e-c953-4129-a4b3-d79b600e15fa.jpg?v=1637916532137",
            color: "Lam",
            list: [
                {
                    id_variation: 3,
                    size: "XL",
                    stock_quantity: 12

                },
                {
                    id_variation: 4,
                    size: "L",
                    stock_quantity: 0
                },
                {
                    id_variation: 5,
                    size: "M",
                    stock_quantity: 5
                }
            ]
        }			
    ]
};

export default function Cart() {
  return <div>
            <h1>Giỏ hàng</h1>
            <p>Giả sử khi vào đây, mình sẽ fetch api GET tới /cart để lấy dữ liệu trả về là response_cart như trên</p>
            <p>Với mỗi cái {} trong result ấy, mình sẽ lấy prod_id ra và fetch tiếp api product/prod_id giống ichan lấy data ở phần product detail ấy.</p>
            <p>GIả sử mỗi lần fetch đó trả về như trên (tạm thời coi như /product/prod_id nào cũng trả về response_product như trên) </p>
            <p>Với mỗi response như trên, lấy đúng vari và hiện ra giao diện</p>
            <h2>Làm luôn phần có nút thanh toán nhé(xử lý tạm thôi, sau bổ sung sau)</h2>
        </div>;
}