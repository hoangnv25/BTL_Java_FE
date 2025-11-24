import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, CreditCard, Building2, ShoppingBag, HelpCircle, Shield } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Phần trên - Thông tin chính */}
                <div className="footer-top">
                    <div className="footer-section">
                        <h3 className="footer-title">Về chúng tôi</h3>
                        <p className="footer-description">
                            FASHCO - Thương hiệu thời trang uy tín, mang đến những sản phẩm chất lượng cao 
                            với giá cả hợp lý. Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất.
                        </p>
                        <div className="footer-social-icons">
                            <a href="https://www.facebook.com/vu.tuan.670443" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="https://www.youtube.com/@tuanvu4556" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="YouTube">
                                <Youtube size={20} />
                            </a>
                            <a href="tel:0979457219" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="YouTube">
                                <Phone size={20} />
                            </a>
                            <a href="mailto:support@fashco.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Email">
                                <Mail size={20} />
                            </a>
                            <a href="https://www.google.com/maps/place/FASHCO/@10.7763889,106.6972222,17z/data=!3m1!4b1!4m6!3m5!1s0x31a09981da4dd0ed:0x7f846e868bc4d67d!8m2!3d10.7763889!4d106.6994109!16s%2Fg%2F11c400zkgb?entry=ttu&g_ep=EgoyMDI1MTEyMi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Google Maps">
                                <MapPin size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Hệ thống cửa hàng</h3>
                        <div className="footer-store-list">
                            <div className="footer-store-item">
                                <MapPin size={16} className="footer-store-icon" />
                                <div>
                                    <strong>Hà Nội</strong>
                                    <p>123 Đường ABC, Quận XYZ</p>
                                </div>
                            </div>
                            <div className="footer-store-item">
                                <MapPin size={16} className="footer-store-icon" />
                                <div>
                                    <strong>TP. Hồ Chí Minh</strong>
                                    <p>456 Đường DEF, Quận UVW</p>
                                </div>
                            </div>
                            <div className="footer-store-item">
                                <MapPin size={16} className="footer-store-icon" />
                                <div>
                                    <strong>Đà Nẵng</strong>
                                    <p>789 Đường GHI, Quận RST</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Liên kết hữu ích</h3>
                        <ul className="footer-links">
                            <li><Link to="/">Trang chủ</Link></li>
                            <li><Link to="/newArrivals">Hàng mới về</Link></li>
                            <li><Link to="/category">Danh mục sản phẩm</Link></li>
                            <li><Link to="/about">Về chúng tôi</Link></li>
                            <li><Link to="/contact">Liên hệ</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Liên hệ</h3>
                        <div className="footer-contact-info">
                            <div className="footer-contact-item">
                                <Phone size={16} className="footer-contact-icon" />
                                <span>Hotline: 1900 1234</span>
                            </div>
                            <div className="footer-contact-item">
                                <Mail size={16} className="footer-contact-icon" />
                                <span>Email: support@fashco.com</span>
                            </div>
                            <div className="footer-contact-item">
                                <MapPin size={16} className="footer-contact-icon" />
                                <span>123 Đường ABC, Quận XYZ, Hà Nội</span>
                            </div>
                        </div>
                        <div className="footer-support-info">
                            <div className="footer-support-item">
                                <Shield size={16} />
                                <span>Bảo hành chính hãng</span>
                            </div>
                            <div className="footer-support-item">
                                <HelpCircle size={16} />
                                <span>Hỗ trợ 24/7</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Phần giữa - Phương thức thanh toán */}
                {/* <div className="footer-middle">
                    <h3 className="footer-payment-title">Phương thức thanh toán</h3>
                    <div className="footer-payment-methods">
                        <div className="footer-payment-item">
                            <CreditCard size={24} />
                            <span>Thẻ tín dụng</span>
                        </div>
                        <div className="footer-payment-item">
                            <div className="footer-payment-icon footer-payment-icon-visa">VISA</div>
                        </div>
                        <div className="footer-payment-item">
                            <div className="footer-payment-icon footer-payment-icon-momo">MoMo</div>
                        </div>
                        <div className="footer-payment-item">
                            <div className="footer-payment-icon footer-payment-icon-zalopay">ZaloPay</div>
                        </div>
                        <div className="footer-payment-item">
                            <div className="footer-payment-icon footer-payment-icon-cod">COD</div>
                        </div>
                    </div>
                </div> */}

                {/* Phần dưới - Bản quyền */}
                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p>&copy; 2025 FASHCO. All rights reserved.</p>
                        <div className="footer-bottom-links">
                            <Link to="/privacy">Chính sách bảo mật</Link>
                            <span>|</span>
                            <Link to="/terms">Điều khoản sử dụng</Link>
                            <span>|</span>
                            <Link to="/shipping">Chính sách vận chuyển</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}