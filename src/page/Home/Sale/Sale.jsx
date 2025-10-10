import { useState, useEffect } from "react";
import "./Sale.css";

export default function Sale() {
    // Dữ liệu mẫu cho phần Sale - thông tin khuyến mãi và danh sách sản phẩm
    const RESPONSE = {
        id: 1,
        title: "Sale cuối năm",                   
        value: "50",                              
        description: "Sale cuối năm, sale siêu hót hú hú hú",
        pre_st_date: "10/10/2025",
        st_date: "13/10/2025",                    
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
    };

    // State quản lý đếm ngược và carousel
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 }); // Thời gian còn lại
    const [currentSlide, setCurrentSlide] = useState(0); // Slide hiện tại trong carousel
    const [salePhase, setSalePhase] = useState('preparing'); // 'preparing' hoặc 'selling'
    const [isNotified, setIsNotified] = useState(false); // Trạng thái đã đăng ký thông báo

    // useEffect xử lý đếm ngược thời gian chuẩn bị sale và thời gian sale
    useEffect(() => {
        // Hàm chuyển đổi định dạng ngày từ dd/mm/yyyy thành yyyy-mm-dd để JavaScript hiểu
        const convertDateFormat = (dateStr) => {
            const [day, month, year] = dateStr.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        };
        
        const PRE_START_DATE = new Date(convertDateFormat(RESPONSE.pre_st_date)).getTime(); // Ngày bắt đầu chuẩn bị
        const startDate = new Date(convertDateFormat(RESPONSE.st_date)).getTime(); // Ngày bắt đầu sale
        const endDate = new Date(convertDateFormat(RESPONSE.end_date)).getTime(); // Ngày kết thúc sale
        
        // Timer chạy mỗi giây để cập nhật đếm ngược
        const timer = setInterval(() => {
            const now = new Date().getTime(); // Thời gian hiện tại
            
            if (now < startDate) {
                // Giai đoạn chuẩn bị sale: đếm ngược từ hiện tại đến ngày bắt đầu sale
                setSalePhase('preparing');
                const difference = startDate - now;
                
                if (difference > 0) {
                    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                    
                    setTimeLeft({ days, hours, minutes, seconds });
                } else {
                    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                }
            } else if (now >= startDate && now < endDate) {
                // Giai đoạn đang sale: đếm ngược từ hiện tại đến ngày kết thúc sale
                setSalePhase('selling');
                const difference = endDate - now;
                
                if (difference > 0) {
                    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                    
                    setTimeLeft({ days, hours, minutes, seconds });
                } else {
                    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                }
            } else {
                // Sale đã kết thúc
                setSalePhase('ended');
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        }, 1000);

        return () => clearInterval(timer); // Cleanup timer khi component unmount
    }, [RESPONSE.pre_st_date, RESPONSE.st_date, RESPONSE.end_date]);

    // Hàm chuyển slide tiếp theo (vòng lặp)
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % RESPONSE.list_product.length);
    };

    // Hàm chuyển slide trước đó (vòng lặp)
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + RESPONSE.list_product.length) % RESPONSE.list_product.length);
    };

    // Hàm xử lý đăng ký thông báo
    const handleNotifyMe = () => {
        setIsNotified(true);
        // Có thể thêm logic gửi email thông báo ở đây
    };

    return (
        <section className="sale-section">
            <div className="sale-container">
                {/* Cột trái: Thông tin khuyến mãi + đếm ngược */}
                <div className="sale-info">
                    {/* Tiêu đề và mô tả khuyến mãi */}
                    <h2 className="sale-title">
                        {salePhase === 'preparing' ? 'CHUẨN BỊ SALE CUỐI NĂM' : 
                         salePhase === 'selling' ? RESPONSE.title.toUpperCase() : 
                         'SALE ĐÃ KẾT THÚC'}
                    </h2>
                    <p className="sale-description">
                        {salePhase === 'preparing' ? 'Sale sắp bắt đầu! Hãy chuẩn bị để săn deal hot nhất!' :
                         salePhase === 'selling' ? RESPONSE.description :
                         'Cảm ơn bạn đã tham gia chương trình khuyến mãi!'}
                    </p>
                    <button 
                        className="sale-btn" 
                        onClick={salePhase === 'preparing' ? handleNotifyMe : undefined}
                    >
                        {salePhase === 'preparing' ? 
                            (isNotified ? 'Đã đăng ký thông báo' : 'Thông báo cho tôi') :
                         salePhase === 'selling' ? 'Mua ngay' :
                         'Xem sản phẩm khác'}
                    </button>
                    
                    {/* Thông báo xác nhận đăng ký */}
                    {salePhase === 'preparing' && isNotified && (
                        <div className="notification-message">
                            <p>✅ Chúng tôi sẽ thông báo cho bạn qua email khi sale bắt đầu!</p>
                        </div>
                    )}
                    
                    {/* Phần đếm ngược thời gian */}
                    <div className="countdown-section">
                        <h3 className="countdown-title">
                            {salePhase === 'preparing' ? 'Sale sẽ bắt đầu sau:' :
                             salePhase === 'selling' ? 'Hãy nhanh tay để mua hàng ngay!' :
                             'Sale đã kết thúc'}
                        </h3>
                        {salePhase !== 'ended' && (
                            <div className="countdown-timer">
                                {/* Ô hiển thị số ngày còn lại */}
                                <div className="time-box">
                                    <span className="time-number">{String(timeLeft.days).padStart(2, '0')}</span>
                                    <span className="time-label">Ngày</span>
                                </div>
                                {/* Ô hiển thị số giờ còn lại */}
                                <div className="time-box">
                                    <span className="time-number">{String(timeLeft.hours).padStart(2, '0')}</span>
                                    <span className="time-label">Giờ</span>
                                </div>
                                {/* Ô hiển thị số phút còn lại */}
                                <div className="time-box">
                                    <span className="time-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                    <span className="time-label">Phút</span>
                                </div>
                                {/* Ô hiển thị số giây còn lại */}
                                <div className="time-box">
                                    <span className="time-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                    <span className="time-label">Giây</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cột phải: Carousel sản phẩm */}
                <div className="sale-carousel">
                    {/* Container chứa các slide */}
                    <div className="carousel-container">
                        {/* Track chứa tất cả slide, di chuyển theo currentSlide */}
                        <div 
                            className="carousel-track" 
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {/* Render từng slide sản phẩm */}
                            {RESPONSE.list_product.map((product, index) => (
                                <div key={product.id} className="carousel-slide">
                                    <img src={product.thumbnail} alt={`Sản phẩm ${product.id}`} />
                                    {/* Overlay hiển thị thông tin khuyến mãi */}
                                    <div className="slide-overlay">
                                        <span className="slide-number">{String(index + 1).padStart(2, '0')} — Sale cuối năm</span>
                                        <span className="slide-discount">{RESPONSE.value}% OFF</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Điều khiển carousel: nút prev/next và dots indicator */}
                    <div className="carousel-controls">
                        <button className="carousel-btn prev" onClick={prevSlide}>‹</button>
                        <button className="carousel-btn next" onClick={nextSlide}>›</button>
                        {/* Dots indicator - hiển thị slide hiện tại */}
                        <div className="carousel-dots">
                            {RESPONSE.list_product.map((_, index) => (
                                <button
                                    key={index}
                                    className={`dot ${index === currentSlide ? 'active' : ''}`}
                                    onClick={() => setCurrentSlide(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}