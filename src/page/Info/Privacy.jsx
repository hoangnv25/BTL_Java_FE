import React from 'react';
import './Privacy.css';
import Breadcrumb from '../../components/Breadcrumb';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function Privacy() {
    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Chính sách bảo mật" }
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div className="privacy-page">
                <div className="privacy-container">
                    <section className="privacy-hero">
                        <Shield size={48} className="privacy-icon" />
                        <h1 className="privacy-title">Chính sách bảo mật</h1>
                        <p className="privacy-updated">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>
                    </section>

                    <div className="privacy-content">
                        <section className="privacy-section">
                            <div className="section-header">
                                <Lock size={28} />
                                <h2>1. Thu thập thông tin</h2>
                            </div>
                            <p>
                                Chúng tôi thu thập thông tin cá nhân của bạn khi bạn đăng ký tài khoản, đặt hàng, 
                                hoặc liên hệ với chúng tôi. Thông tin thu thập bao gồm:
                            </p>
                            <ul>
                                <li>Họ và tên, địa chỉ email, số điện thoại</li>
                                <li>Địa chỉ giao hàng</li>
                                <li>Thông tin thanh toán (được mã hóa an toàn)</li>
                                <li>Lịch sử mua hàng và sở thích</li>
                            </ul>
                        </section>

                        <section className="privacy-section">
                            <div className="section-header">
                                <Eye size={28} />
                                <h2>2. Sử dụng thông tin</h2>
                            </div>
                            <p>Chúng tôi sử dụng thông tin của bạn để:</p>
                            <ul>
                                <li>Xử lý đơn hàng và giao dịch</li>
                                <li>Cải thiện dịch vụ và trải nghiệm khách hàng</li>
                                <li>Gửi thông tin về sản phẩm mới và khuyến mãi (nếu bạn đồng ý)</li>
                                <li>Hỗ trợ khách hàng và giải quyết khiếu nại</li>
                                <li>Tuân thủ các yêu cầu pháp lý</li>
                            </ul>
                        </section>

                        <section className="privacy-section">
                            <div className="section-header">
                                <Shield size={28} />
                                <h2>3. Bảo vệ thông tin</h2>
                            </div>
                            <p>
                                Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn bằng các biện pháp bảo mật 
                                tiên tiến, bao gồm:
                            </p>
                            <ul>
                                <li>Mã hóa SSL/TLS cho tất cả các giao dịch</li>
                                <li>Hệ thống bảo mật nhiều lớp</li>
                                <li>Kiểm tra và cập nhật bảo mật thường xuyên</li>
                                <li>Giới hạn quyền truy cập thông tin chỉ cho nhân viên có thẩm quyền</li>
                            </ul>
                        </section>

                        <section className="privacy-section">
                            <div className="section-header">
                                <FileText size={28} />
                                <h2>4. Chia sẻ thông tin</h2>
                            </div>
                            <p>
                                Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba, 
                                trừ các trường hợp:
                            </p>
                            <ul>
                                <li>Đối tác vận chuyển và thanh toán (chỉ thông tin cần thiết)</li>
                                <li>Yêu cầu pháp lý từ cơ quan có thẩm quyền</li>
                                <li>Bảo vệ quyền lợi và an toàn của chúng tôi và người dùng khác</li>
                            </ul>
                        </section>

                        <section className="privacy-section">
                            <div className="section-header">
                                <Lock size={28} />
                                <h2>5. Quyền của bạn</h2>
                            </div>
                            <p>Bạn có quyền:</p>
                            <ul>
                                <li>Truy cập và xem thông tin cá nhân của mình</li>
                                <li>Yêu cầu chỉnh sửa hoặc xóa thông tin</li>
                                <li>Từ chối nhận email marketing</li>
                                <li>Yêu cầu xuất dữ liệu cá nhân</li>
                            </ul>
                        </section>

                        <section className="privacy-section">
                            <div className="section-header">
                                <FileText size={28} />
                                <h2>6. Cookie</h2>
                            </div>
                            <p>
                                Chúng tôi sử dụng cookie để cải thiện trải nghiệm của bạn trên website. 
                                Bạn có thể tắt cookie trong cài đặt trình duyệt, nhưng điều này có thể 
                                ảnh hưởng đến một số chức năng của website.
                            </p>
                        </section>

                        <section className="privacy-section">
                            <div className="section-header">
                                <Shield size={28} />
                                <h2>7. Liên hệ</h2>
                            </div>
                            <p>
                                Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ với chúng tôi:
                            </p>
                            <ul>
                                <li>Email: support@fashco.com</li>
                                <li>Điện thoại: 1900 1234</li>
                                <li>Địa chỉ: 123 Đường ABC, Quận XYZ, Hà Nội</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

