export default function Sale() {
    const response = {
        id: 1,
        title: "Sale cuối năm",
        value: "50",
        description: "Sale cuối năm, sale siêu hót hú hú hú",
        st_date: "10/10/2025",
        end_date: "15/10/2025",
        list_product: [
            {
                id: 1,
                thumbnail: "https://product.hstatic.net/1000360022/product/ao-thun-nam-hoa-tiet-in-phoi-mau-predator-form-oversize_0c5655ad3680475496d654529c6fd55d_1024x1024.jpg"
            },
            {
                id: 2,
                thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
            },
            {
                id: 3,
                thumbnail: "https://www.google.com.vn/url?sa=i&url=https%3A%2F%2Fteelab.vn%2Fao-thun-teelab-ha-noi-tra-da&psig=AOvVaw0QCw21edeb9HJRtQIG7xRp&ust=1759950770739000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCNDl0tflkpADFQAAAAAdAAAAABAE",
            },
            {
                id: 4,
                thumbnail: "https://bizweb.dktcdn.net/100/415/697/products/mc1-0224920e-c953-4129-a4b3-d79b600e15fa.jpg?v=1637916532137",
            },
            {
                id: 5,
                thumbnail: "https://bizweb.dktcdn.net/100/467/909/products/1904762-blk-2.jpg?v=1726316893717",
            }
        ]
    }
    return (
        // chủ yếu sử lý đếm ngược với st với end_date cho oke là được nha, còn lại cứ làm tương tự figma
        <div>Saleeeeeeee</div>
    )
}