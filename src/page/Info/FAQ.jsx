import React, { useState } from 'react';
import './FAQ.css';
import Breadcrumb from '../../components/Breadcrumb';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function FAQ() {
    usePageTitle('Câu hỏi thường gặp');
    const [openIndex, setOpenIndex] = useState(null);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Câu hỏi thường gặp" }
    ];

    const faqs = [
        {
            category: "Đặt hàng",
            questions: [
                {
                    q: "Làm thế nào để đặt hàng?",
                    a: "Bạn có thể đặt hàng trực tuyến trên website bằng cách: 1) Chọn sản phẩm yêu thích, 2) Thêm vào giỏ hàng, 3) Điền thông tin giao hàng và thanh toán, 4) Xác nhận đơn hàng. Hoặc bạn có thể gọi hotline 1900 1234 để đặt hàng qua điện thoại."
                },
                {
                    q: "Tôi có thể chỉnh sửa đơn hàng sau khi đặt không?",
                    a: "Bạn có thể chỉnh sửa hoặc hủy đơn hàng trong vòng 30 phút sau khi đặt hàng (nếu đơn hàng chưa được xử lý). Sau thời gian này, vui lòng liên hệ hotline để được hỗ trợ."
                },
                {
                    q: "Làm sao để kiểm tra trạng thái đơn hàng?",
                    a: "Bạn có thể đăng nhập vào tài khoản và vào mục 'Đơn hàng của tôi' để xem chi tiết và trạng thái đơn hàng. Hoặc liên hệ hotline 1900 1234 với mã đơn hàng của bạn."
                }
            ]
        },
        {
            category: "Thanh toán",
            questions: [
                {
                    q: "Các phương thức thanh toán nào được chấp nhận?",
                    a: "Chúng tôi chấp nhận thanh toán qua: Thẻ tín dụng/ghi nợ (Visa, Mastercard), Ví điện tử (MoMo, ZaloPay), Chuyển khoản ngân hàng, và Thanh toán khi nhận hàng (COD)."
                },
                {
                    q: "Thanh toán có an toàn không?",
                    a: "Hoàn toàn an toàn! Tất cả các giao dịch thanh toán đều được mã hóa SSL/TLS và xử lý qua các cổng thanh toán uy tín. Chúng tôi không lưu trữ thông tin thẻ tín dụng của bạn."
                },
                {
                    q: "Khi nào tôi sẽ được hoàn tiền?",
                    a: "Sau khi chúng tôi nhận được hàng trả và xác nhận sản phẩm đáp ứng điều kiện trả hàng, bạn sẽ được hoàn tiền trong vòng 14 ngày làm việc qua phương thức thanh toán ban đầu."
                }
            ]
        },
        {
            category: "Vận chuyển",
            questions: [
                {
                    q: "Phí vận chuyển là bao nhiêu?",
                    a: "Phí vận chuyển phụ thuộc vào địa chỉ giao hàng và phương thức vận chuyển. Đơn hàng trên 500.000đ được miễn phí vận chuyển trong nội thành. Bạn sẽ thấy phí vận chuyển cụ thể khi thanh toán."
                },
                {
                    q: "Thời gian giao hàng là bao lâu?",
                    a: "Thời gian giao hàng từ 2-5 ngày làm việc tùy theo địa chỉ. Đối với khu vực nội thành, thời gian giao hàng từ 1-2 ngày. Chúng tôi sẽ gửi thông báo khi đơn hàng được giao cho đơn vị vận chuyển."
                },
                {
                    q: "Tôi có thể thay đổi địa chỉ giao hàng không?",
                    a: "Bạn có thể thay đổi địa chỉ giao hàng trong vòng 30 phút sau khi đặt hàng. Sau thời gian này, vui lòng liên hệ hotline để được hỗ trợ."
                }
            ]
        },
        {
            category: "Trả hàng & Đổi hàng",
            questions: [
                {
                    q: "Chính sách trả hàng như thế nào?",
                    a: "Bạn có thể trả hàng trong vòng 7 ngày kể từ ngày nhận hàng. Sản phẩm phải còn nguyên vẹn, chưa sử dụng, có đầy đủ tem mác và hóa đơn. Chi phí vận chuyển trả hàng do khách hàng chịu (trừ trường hợp lỗi từ phía chúng tôi)."
                },
                {
                    q: "Làm thế nào để trả hàng?",
                    a: "Bạn có thể yêu cầu trả hàng qua: 1) Đăng nhập tài khoản và vào mục 'Đơn hàng của tôi', 2) Chọn đơn hàng cần trả và điền lý do, 3) Chúng tôi sẽ liên hệ để xác nhận và hướng dẫn gửi hàng về. Hoặc gọi hotline 1900 1234."
                },
                {
                    q: "Tôi có thể đổi size/ màu sắc không?",
                    a: "Có, bạn có thể đổi size hoặc màu sắc trong vòng 7 ngày kể từ ngày nhận hàng, miễn là sản phẩm còn nguyên vẹn và chưa sử dụng. Vui lòng liên hệ hotline để được hỗ trợ."
                }
            ]
        },
        {
            category: "Tài khoản",
            questions: [
                {
                    q: "Làm thế nào để đăng ký tài khoản?",
                    a: "Bạn có thể đăng ký tài khoản bằng cách: 1) Click vào 'Đăng ký' ở góc trên bên phải, 2) Điền thông tin cá nhân, 3) Xác nhận email (nếu có). Hoặc đăng nhập bằng tài khoản Google/Facebook."
                },
                {
                    q: "Tôi quên mật khẩu, làm sao để lấy lại?",
                    a: "Bạn có thể click vào 'Quên mật khẩu' ở trang đăng nhập, nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu qua email của bạn."
                },
                {
                    q: "Làm sao để cập nhật thông tin cá nhân?",
                    a: "Đăng nhập vào tài khoản, vào mục 'Thông tin cá nhân' và click 'Thay đổi thông tin' để cập nhật. Bạn có thể thay đổi tên, số điện thoại, địa chỉ, v.v."
                }
            ]
        }
    ];

    const toggleQuestion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div className="faq-page">
                <div className="faq-container">
                    <section className="faq-hero">
                        <HelpCircle size={48} className="faq-icon" />
                        <h1 className="faq-title">Câu hỏi thường gặp</h1>
                        <p className="faq-subtitle">
                            Tìm câu trả lời cho các câu hỏi phổ biến về dịch vụ của chúng tôi
                        </p>
                    </section>

                    <div className="faq-content">
                        {faqs.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="faq-category">
                                <h2 className="category-title">{category.category}</h2>
                                <div className="faq-list">
                                    {category.questions.map((item, questionIndex) => {
                                        const index = `${categoryIndex}-${questionIndex}`;
                                        const isOpen = openIndex === index;
                                        return (
                                            <div key={questionIndex} className="faq-item">
                                                <button
                                                    className={`faq-question ${isOpen ? 'open' : ''}`}
                                                    onClick={() => toggleQuestion(index)}
                                                >
                                                    <span>{item.q}</span>
                                                    {isOpen ? (
                                                        <ChevronUp size={20} />
                                                    ) : (
                                                        <ChevronDown size={20} />
                                                    )}
                                                </button>
                                                {isOpen && (
                                                    <div className="faq-answer">
                                                        <p>{item.a}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <section className="faq-contact">
                        <p>Không tìm thấy câu trả lời bạn cần?</p>
                        <a href="/contact" className="faq-contact-link">
                            Liên hệ với chúng tôi →
                        </a>
                    </section>
                </div>
            </div>
        </>
    );
}

