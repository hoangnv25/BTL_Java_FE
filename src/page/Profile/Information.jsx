import './Information.css'
import { Link } from 'react-router-dom'

export default function Information() {
    const userData = {
        "id": 1,
        "full_name": "Đinh Việt Dũng",
        "email": "john.doe@example.com",
        "phone_number": "1234567890",
        "role": "Customer"
    }

    // Dữ liệu trạng thái đơn hàng
    const orderStats = [
        { title: "Đơn hàng chờ xử lý", count: 2, icon: "⏳" },
        { title: "Đang xử lý", count: 1, icon: "🔄" },
        { title: "Đang giao hàng", count: 3, icon: "🚚" },
        { title: "Đã giao hàng", count: 15, icon: "✅" }
    ]

    // Dữ liệu đơn hàng gần đây
    const recentOrders = [
        { id: "ORD001", product: "Áo thun nam cao cấp", date: "2024-01-15", status: "delivered", statusText: "Đã giao hàng" },
        { id: "ORD002", product: "Quần jean nữ", date: "2024-01-14", status: "shipped", statusText: "Đang giao hàng" },
        { id: "ORD003", product: "Áo len nam", date: "2024-01-13", status: "processing", statusText: "Đang xử lý" },
        { id: "ORD004", product: "Áo phông nam", date: "2024-01-12", status: "pending", statusText: "Chờ xử lý" }
    ]

    const getStatusClass = (status) => {
        switch(status) {
            case 'pending': return 'status-pending'
            case 'processing': return 'status-processing'
            case 'shipped': return 'status-shipped'
            case 'delivered': return 'status-delivered'
            default: return 'status-pending'
        }
    }

    return (
        <div className="profile-container">
            <div className="profile-title">
                <h1>Thông tin cá nhân</h1>
            </div>
            <div className="profile-breadcrumb">
                Trang chủ {'>'} Tài Khoản {'>'} Thông tin cá nhân
            </div>

            <div className="profile-content">
                <aside className="profile-sidebar">
                    <div className="sidebar-section">
                        <div className="sidebar-title">Tài khoản</div>
                        <div className="sidebar-content expanded">
                            <Link to="/user/info" className="sidebar-link">Thông tin cá nhân</Link>
                            <Link to="/user/password" className="sidebar-link">Đổi mật khẩu</Link>
                        </div>
                    </div>
                    <div className="sidebar-section">
                        <div className="sidebar-title">Đơn hàng</div>
                        <div className="sidebar-content expanded">
                            <a href="#" className="sidebar-link">Lịch sử đơn hàng</a>
                            <a href="#" className="sidebar-link">Đơn hàng đang xử lý</a>
                            <a href="#" className="sidebar-link">Trả hàng/Hoàn tiền</a>
                        </div>
                    </div>
                    <div className="sidebar-section">
                        <div className="sidebar-title">Yêu thích</div>
                        <div className="sidebar-content expanded">
                            <a href="#" className="sidebar-link">Sản phẩm yêu thích</a>
                            <a href="#" className="sidebar-link">Danh sách mong muốn</a>
                        </div>
                    </div>
                    <div className="sidebar-section">
                        <div className="sidebar-title">Hỗ trợ</div>
                        <div className="sidebar-content expanded">
                            <a href="#" className="sidebar-link">Liên hệ</a>
                            <a href="#" className="sidebar-link">Trung tâm trợ giúp</a>
                        </div>
                    </div>
                </aside>

                <main>
                    <div className="user-info">
                        <div className="user-avatar">
                            <img src="/ava_user.webp" alt="Avatar" />
                        </div>
                        <div className="user-details">
                            <h2 className="user-name">{userData.full_name}</h2>
                            <p className="user-email">{userData.email}</p>
                            <p className="user-phone">{userData.phone_number}</p>
                            <span className="user-role">{userData.role}</span>
                        </div>
                    </div>

                    <div className="order-status">
                        <h3>Trạng thái đơn hàng</h3>
                        <div className="status-cards">
                            {orderStats.map((stat, index) => (
                                <div key={index} className="status-card">
                                    <div className="status-icon">{stat.icon}</div>
                                    <div className="status-title">{stat.title}</div>
                                    <div className="status-count">{stat.count}</div>
                                    <div className="status-description">đơn hàng</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="recent-orders">
                        <h3>Đơn hàng gần đây</h3>
                        {recentOrders.map((order, index) => (
                            <div key={index} className="order-item">
                                <div className="order-info">
                                    <h4>{order.product}</h4>
                                    <p>Mã đơn hàng: {order.id}</p>
                                    <p>Ngày đặt: {order.date}</p>
                                </div>
                                <span className={`order-status-badge ${getStatusClass(order.status)}`}>
                                    {order.statusText}
                                </span>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

            <footer className="profile-footer">
                <div className="footer-content">
                    <div className="footer-logo">LOK SHOP</div>
                    <div className="footer-copyright">Copyright 2024 LOK SHOP. All rights reserved.</div>
                    <div className="footer-links">
                        <a href="/">Home</a>
                        <a href="/shop">Shop</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}