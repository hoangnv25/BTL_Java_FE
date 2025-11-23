import React from 'react';
import './Shipping.css';
import Breadcrumb from '../../components/Breadcrumb';
import { Truck, Package, Clock, MapPin, DollarSign, Shield } from 'lucide-react';

export default function Shipping() {
    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Chính sách vận chuyển" }
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div className="shipping-page">
                <div className="shipping-container">
                    <section className="shipping-hero">
                        <Truck size={48} className="shipping-icon" />
                        <h1 className="shipping-title">Chính sách vận chuyển</h1>
                        <p className="shipping-subtitle">
                            Thông tin chi tiết về phí vận chuyển, thời gian giao hàng và các quy định liên quan
                        </p>
                    </section>

                    <div className="shipping-content">
                        <section className="shipping-section">
                            <div className="section-header">
                                <DollarSign size={28} />
                                <h2>1. Phí vận chuyển</h2>
                            </div>
                            <div className="shipping-info-grid">
                                <div className="info-card">
                                    <h3>Miễn phí vận chuyển</h3>
                                    <p>Đơn hàng từ <strong>500.000đ</strong> trở lên được miễn phí vận chuyển trong nội thành.</p>
                                </div>
                                <div className="info-card">
                                    <h3>Nội thành</h3>
                                    <p>Phí vận chuyển: <strong>30.000đ</strong> cho đơn hàng dưới 500.000đ</p>
                                </div>
                                <div className="info-card">
                                    <h3>Ngoại thành</h3>
                                    <p>Phí vận chuyển: <strong>50.000đ - 100.000đ</strong> tùy theo khoảng cách</p>
                                </div>
                                <div className="info-card">
                                    <h3>Toàn quốc</h3>
                                    <p>Phí vận chuyển: <strong>80.000đ - 150.000đ</strong> tùy theo địa chỉ</p>
                                </div>
                            </div>
                        </section>

                        <section className="shipping-section">
                            <div className="section-header">
                                <Clock size={28} />
                                <h2>2. Thời gian giao hàng</h2>
                            </div>
                            <div className="timeline">
                                <div className="timeline-item">
                                    <div className="timeline-marker"></div>
                                    <div className="timeline-content">
                                        <h3>Nội thành Hà Nội, TP.HCM</h3>
                                        <p>1-2 ngày làm việc</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-marker"></div>
                                    <div className="timeline-content">
                                        <h3>Khu vực lân cận</h3>
                                        <p>2-3 ngày làm việc</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-marker"></div>
                                    <div className="timeline-content">
                                        <h3>Các tỉnh thành khác</h3>
                                        <p>3-5 ngày làm việc</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-marker"></div>
                                    <div className="timeline-content">
                                        <h3>Vùng sâu, vùng xa</h3>
                                        <p>5-7 ngày làm việc</p>
                                    </div>
                                </div>
                            </div>
                            <div className="note-box">
                                <p>
                                    <strong>Lưu ý:</strong> Thời gian giao hàng được tính từ khi đơn hàng được xác nhận 
                                    và thanh toán thành công. Thời gian có thể thay đổi trong các dịp lễ, Tết hoặc 
                                    do điều kiện thời tiết bất thường.
                                </p>
                            </div>
                        </section>

                        <section className="shipping-section">
                            <div className="section-header">
                                <Package size={28} />
                                <h2>3. Quy trình giao hàng</h2>
                            </div>
                            <div className="process-steps">
                                <div className="process-step">
                                    <div className="step-number">1</div>
                                    <div className="step-content">
                                        <h3>Xác nhận đơn hàng</h3>
                                        <p>Sau khi đặt hàng thành công, bạn sẽ nhận được email xác nhận đơn hàng trong vòng 30 phút.</p>
                                    </div>
                                </div>
                                <div className="process-step">
                                    <div className="step-number">2</div>
                                    <div className="step-content">
                                        <h3>Chuẩn bị hàng</h3>
                                        <p>Chúng tôi sẽ chuẩn bị và đóng gói hàng hóa cẩn thận trong vòng 24 giờ.</p>
                                    </div>
                                </div>
                                <div className="process-step">
                                    <div className="step-number">3</div>
                                    <div className="step-content">
                                        <h3>Giao cho đơn vị vận chuyển</h3>
                                        <p>Hàng sẽ được giao cho đơn vị vận chuyển và bạn sẽ nhận được mã vận đơn để theo dõi.</p>
                                    </div>
                                </div>
                                <div className="process-step">
                                    <div className="step-number">4</div>
                                    <div className="step-content">
                                        <h3>Giao hàng</h3>
                                        <p>Nhân viên giao hàng sẽ liên hệ trước khi giao. Vui lòng kiểm tra hàng trước khi ký nhận.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="shipping-section">
                            <div className="section-header">
                                <MapPin size={28} />
                                <h2>4. Khu vực giao hàng</h2>
                            </div>
                            <p>Chúng tôi giao hàng toàn quốc, bao gồm:</p>
                            <div className="delivery-areas">
                                <div className="area-group">
                                    <h3>Miền Bắc</h3>
                                    <p>Hà Nội, Hải Phòng, Quảng Ninh, Hải Dương, Hưng Yên, Thái Bình, Nam Định, Ninh Bình, và các tỉnh lân cận</p>
                                </div>
                                <div className="area-group">
                                    <h3>Miền Trung</h3>
                                    <p>Đà Nẵng, Huế, Quảng Nam, Quảng Ngãi, Bình Định, Phú Yên, Khánh Hòa, và các tỉnh lân cận</p>
                                </div>
                                <div className="area-group">
                                    <h3>Miền Nam</h3>
                                    <p>TP. Hồ Chí Minh, Cần Thơ, Đồng Nai, Bình Dương, Long An, Tiền Giang, An Giang, và các tỉnh lân cận</p>
                                </div>
                            </div>
                        </section>

                        <section className="shipping-section">
                            <div className="section-header">
                                <Shield size={28} />
                                <h2>5. Lưu ý khi nhận hàng</h2>
                            </div>
                            <ul className="shipping-notes">
                                <li>Vui lòng kiểm tra kỹ hàng hóa trước khi ký nhận</li>
                                <li>Kiểm tra số lượng, chất lượng, và tình trạng sản phẩm</li>
                                <li>Nếu có bất kỳ vấn đề nào, vui lòng từ chối nhận hàng và liên hệ ngay với chúng tôi</li>
                                <li>Giữ lại hóa đơn và mã vận đơn để tra cứu khi cần</li>
                                <li>Đối với đơn hàng COD, vui lòng chuẩn bị đủ tiền mặt</li>
                            </ul>
                        </section>

                        <section className="shipping-section">
                            <div className="section-header">
                                <Truck size={28} />
                                <h2>6. Đơn vị vận chuyển</h2>
                            </div>
                            <p>
                                Chúng tôi hợp tác với các đơn vị vận chuyển uy tín như: Giao Hàng Nhanh (GHN), 
                                Giao Hàng Tiết Kiệm (GHTK), Viettel Post, và các đơn vị khác để đảm bảo 
                                hàng hóa được giao đến bạn một cách an toàn và nhanh chóng.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

