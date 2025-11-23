import { useState, useEffect } from 'react';
import NewArrivals from "./NewArrivals/NAinPage";
import Review from "./Review/Page";
import Sale from "./Sale/Sale";
import homeimg from "../../assets/image/homeimg.png";
import homeimg2 from "../../assets/image/homeimg2.png";
import "./HomePage.css";
import Footer from "./Footer/Footer";
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 740 : false);
    const navigate = useNavigate();
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 740);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="home-page">
            <div className="homeimg-container">
                {/* Ảnh ẩn để lấy chiều cao tự nhiên */}
                <img 
                    src={isMobile ? homeimg2 : homeimg} 
                    alt="" 
                    className="homeimg-hidden"
                    aria-hidden="true"
                />
                <div 
                    className="homeimg-background"
                    style={{
                        backgroundImage: `url(${isMobile ? homeimg2 : homeimg})`
                    }}
                >
                    {isMobile ? (
                        <div className="button_shop_now button_shop_now_mobile" onClick={() => navigate('/category')}></div>
                    ) : (
                        <div className="button_shop_now button_shop_now_desktop" onClick={() => navigate('/category')}></div>
                    )}
                </div>
            </div>

            <Sale />
            <NewArrivals />
            <Review />
            <Footer />
        </div>
    )
}