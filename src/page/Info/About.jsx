import React from 'react';
import './About.css';
import Breadcrumb from '../../components/Breadcrumb';
import { Building2, Users, Award, Heart, Target, Mail } from 'lucide-react';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function About() {
    usePageTitle('Về chúng tôi');
    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Về chúng tôi" }
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div className="about-page">
                <div className="about-container">
                    <section className="about-hero">
                        <h1 className="about-title">Về FASHCO</h1>
                        <p className="about-subtitle">
                            Thương hiệu thời trang uy tín, mang đến những sản phẩm chất lượng cao 
                            với giá cả hợp lý. Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất.
                        </p>
                    </section>

                    <section className="about-mission">
                        <div className="about-section-header">
                            <Target size={32} className="section-icon" />
                            <h2>Sứ mệnh của chúng tôi</h2>
                        </div>
                        <p>
                            FASHCO được thành lập với sứ mệnh mang đến cho khách hàng những sản phẩm thời trang 
                            chất lượng cao, phong cách hiện đại và giá cả hợp lý. Chúng tôi tin rằng mọi người 
                            đều xứng đáng có được những bộ trang phục đẹp, giúp họ tự tin và tỏa sáng.
                        </p>
                    </section>

                    <section className="about-values">
                        <h2 className="section-title">Giá trị cốt lõi</h2>
                        <div className="values-grid">
                            <div className="value-card">
                                <Award size={40} className="value-icon" />
                                <h3>Chất lượng</h3>
                                <p>Cam kết mang đến sản phẩm chất lượng cao, được kiểm tra kỹ lưỡng trước khi đến tay khách hàng.</p>
                            </div>
                            <div className="value-card">
                                <Heart size={40} className="value-icon" />
                                <h3>Khách hàng là trung tâm</h3>
                                <p>Đặt nhu cầu và trải nghiệm của khách hàng lên hàng đầu trong mọi quyết định.</p>
                            </div>
                            <div className="value-card">
                                <Users size={40} className="value-icon" />
                                <h3>Uy tín</h3>
                                <p>Xây dựng niềm tin thông qua sự minh bạch, trung thực và dịch vụ chăm sóc khách hàng xuất sắc.</p>
                            </div>
                            <div className="value-card">
                                <Building2 size={40} className="value-icon" />
                                <h3>Phát triển bền vững</h3>
                                <p>Hướng tới phát triển bền vững, tôn trọng môi trường và cộng đồng.</p>
                            </div>
                        </div>
                    </section>

                    <section className="about-contact">
                        <div className="contact-card">
                            <Mail size={24} />
                            <div>
                                <h3>Liên hệ với chúng tôi</h3>
                                <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi!</p>
                                <a href="/contact" className="contact-link">Đến trang liên hệ →</a>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

