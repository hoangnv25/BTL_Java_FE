import React from 'react';
import './Terms.css';
import Breadcrumb from '../../components/Breadcrumb';
import { FileText, Scale, AlertCircle, CheckCircle } from 'lucide-react';

export default function Terms() {
    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Điều khoản sử dụng" }
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div className="terms-page">
                <div className="terms-container">
                    <section className="terms-hero">
                        <Scale size={48} className="terms-icon" />
                        <h1 className="terms-title">Điều khoản sử dụng</h1>
                        <p className="terms-updated">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>
                    </section>

                    <div className="terms-content">
                        <section className="terms-section">
                            <div className="section-header">
                                <FileText size={28} />
                                <h2>1. Chấp nhận điều khoản</h2>
                            </div>
                            <p>
                                Bằng việc truy cập và sử dụng website FASHCO, bạn đồng ý tuân thủ và bị ràng buộc 
                                bởi các điều khoản và điều kiện sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào 
                                của các điều khoản này, vui lòng không sử dụng website của chúng tôi.
                            </p>
                        </section>

                        <section className="terms-section">
                            <div className="section-header">
                                <CheckCircle size={28} />
                                <h2>2. Đăng ký tài khoản</h2>
                            </div>
                            <p>Khi đăng ký tài khoản, bạn cam kết:</p>
                            <ul>
                                <li>Cung cấp thông tin chính xác, đầy đủ và cập nhật</li>
                                <li>Bảo mật thông tin đăng nhập của bạn</li>
                                <li>Chịu trách nhiệm cho mọi hoạt động diễn ra dưới tài khoản của bạn</li>
                                <li>Thông báo ngay cho chúng tôi nếu phát hiện vi phạm bảo mật</li>
                            </ul>
                        </section>

                        <section className="terms-section">
                            <div className="section-header">
                                <FileText size={28} />
                                <h2>3. Đặt hàng và thanh toán</h2>
                            </div>
                            <p>
                                Khi đặt hàng, bạn đồng ý:
                            </p>
                            <ul>
                                <li>Thanh toán đầy đủ giá trị đơn hàng theo phương thức đã chọn</li>
                                <li>Cung cấp thông tin giao hàng chính xác</li>
                                <li>Chấp nhận giá cả và điều kiện bán hàng tại thời điểm đặt hàng</li>
                                <li>Chúng tôi có quyền từ chối hoặc hủy đơn hàng trong một số trường hợp đặc biệt</li>
                            </ul>
                        </section>

                        <section className="terms-section">
                            <div className="section-header">
                                <AlertCircle size={28} />
                                <h2>4. Quyền sở hữu trí tuệ</h2>
                            </div>
                            <p>
                                Tất cả nội dung trên website, bao gồm nhưng không giới hạn ở văn bản, hình ảnh, logo, 
                                thiết kế, đều thuộc quyền sở hữu của FASHCO hoặc được cấp phép sử dụng. Bạn không được:
                            </p>
                            <ul>
                                <li>Sao chép, phân phối hoặc sử dụng lại nội dung mà không có sự cho phép</li>
                                <li>Sử dụng thương hiệu hoặc logo của chúng tôi cho mục đích thương mại</li>
                                <li>Xâm phạm quyền sở hữu trí tuệ của chúng tôi hoặc bên thứ ba</li>
                            </ul>
                        </section>

                        <section className="terms-section">
                            <div className="section-header">
                                <Scale size={28} />
                                <h2>5. Trả hàng và hoàn tiền</h2>
                            </div>
                            <p>
                                Chính sách trả hàng và hoàn tiền của chúng tôi:
                            </p>
                            <ul>
                                <li>Bạn có thể trả hàng trong vòng 7 ngày kể từ ngày nhận hàng</li>
                                <li>Sản phẩm phải còn nguyên vẹn, chưa sử dụng, có đầy đủ tem mác</li>
                                <li>Chi phí vận chuyển trả hàng do khách hàng chịu (trừ trường hợp lỗi từ phía chúng tôi)</li>
                                <li>Hoàn tiền sẽ được thực hiện trong vòng 14 ngày làm việc sau khi nhận được hàng trả</li>
                            </ul>
                        </section>

                        <section className="terms-section">
                            <div className="section-header">
                                <AlertCircle size={28} />
                                <h2>6. Giới hạn trách nhiệm</h2>
                            </div>
                            <p>
                                FASHCO không chịu trách nhiệm cho:
                            </p>
                            <ul>
                                <li>Thiệt hại gián tiếp, ngẫu nhiên hoặc hậu quả phát sinh từ việc sử dụng website</li>
                                <li>Lỗi kỹ thuật hoặc gián đoạn dịch vụ ngoài tầm kiểm soát</li>
                                <li>Hành vi của người dùng khác hoặc bên thứ ba</li>
                            </ul>
                        </section>

                        <section className="terms-section">
                            <div className="section-header">
                                <FileText size={28} />
                                <h2>7. Thay đổi điều khoản</h2>
                            </div>
                            <p>
                                Chúng tôi có quyền thay đổi các điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực 
                                ngay sau khi được đăng tải trên website. Việc bạn tiếp tục sử dụng website sau khi có thay đổi 
                                được coi là bạn đã chấp nhận các điều khoản mới.
                            </p>
                        </section>

                        <section className="terms-section">
                            <div className="section-header">
                                <Scale size={28} />
                                <h2>8. Liên hệ</h2>
                            </div>
                            <p>
                                Nếu bạn có câu hỏi về các điều khoản này, vui lòng liên hệ:
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

