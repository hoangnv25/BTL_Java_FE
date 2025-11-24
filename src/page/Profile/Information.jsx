import './Information.css'
import axios from 'axios';
import { base } from '../../service/Base';
import { useEffect, useState } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom'
import NotLoggedIn from '../../components/NotLoggedIn';
import Breadcrumb from '../../components/Breadcrumb';
import Address from './Address/Address';
import Order from './Order/Order';
import UpdateInformation from './UpdateInformation/UpdateInformation';
import UpdatePassword from './UpdatePassword/UpdatePassword';

import ReviewList from './Review/ReviewList';
import { getToken } from '../../service/LocalStorage';
import { User, Phone, Mail, UserCircle, Lock, LogOut, MessageSquare, MapPin } from 'lucide-react';
import { logout } from '../../service/Auth';

export default function Information() {
    const token = getToken()
    const [searchParams] = useSearchParams()
    
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 900 : false)
    const [showUpdate, setShowUpdate] = useState(false);
    const [showUpdatePassword, setShowUpdatePassword] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [showAddress, setShowAddress] = useState(false);
    const location = useLocation();

    // Check query params để tự động mở tab
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'review') {
            setShowReview(true);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!loading && location.hash === '#orders') {
            const ordersEl = document.getElementById('orders');
            if (ordersEl) {
                ordersEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [location, loading]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 900)
        window.addEventListener('resize', handleResize)

        if (!token) {
            setLoading(false);
            return () => { window.removeEventListener('resize', handleResize) }
        }
        (async () => {
            const response = await axios.get(`${base}/users/myInfor`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 200) {
                setUserData(response.data);
                setLoading(false);
            }
        })();
        return () => { window.removeEventListener('resize', handleResize) }
    }, [token]);

    // Breadcrumb items
    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Thông tin cá nhân" }
    ];

    if (!token) {
        if (isMobile) {
            return (
                <>
                    <Breadcrumb items={breadcrumbItems} />
                    <div style={{ padding: '16px', display: 'flex', gap: '12px' }}>
                        <Link to="/login" style={{ flex: 1, textAlign: 'center', padding: '10px 12px', border: '1px solid #e5e5e5', borderRadius: '10px', textDecoration: 'none', color: '#111', background: '#f5f5f5' }}>Đăng nhập</Link>
                        <Link to="/register" style={{ flex: 1, textAlign: 'center', padding: '10px 12px', border: '1px solid #111', borderRadius: '10px', textDecoration: 'none', color: '#fff', background: '#111' }}>Đăng ký</Link>
                    </div>
                </>
            )
        }
        return <NotLoggedIn />
    }

    return (
        loading ? (
            <>
                <Breadcrumb items={breadcrumbItems} />
                <div className="profile-loading">
                    <div className="loading-spinner"></div>
                    <p>Đang tải thông tin...</p>
                </div>
            </>
        ) : (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div className="profile-container">
                <div className="profile-layout">
                    <aside className="sidebar">
                        <div className="sidebar-header">
                            <div className="hello">TRANG TÀI KHOẢN</div>
                            <div className="greeting">
                                <UserCircle size={20} />
                                <span>Xin chào, <strong>{userData.userName || userData.fullName || 'Người dùng'}</strong>!</span>
                            </div>
                        </div>
                        <nav className="sidebar-nav">
                            <button className="active">
                                <UserCircle size={18} />
                                <span>Thông tin tài khoản</span>
                            </button>
                            <button className="primary" onClick={() => setShowUpdate(true)}>
                                <User size={18} />
                                <span>Thay đổi thông tin</span>
                            </button>
                            <button className="primary" onClick={() => setShowUpdatePassword(true)}>
                                <Lock size={18} />
                                <span>Đổi mật khẩu</span>
                            </button>
                            <button className="primary" onClick={() => setShowReview(true)}>
                                <MessageSquare size={18} />
                                <span>Review</span>
                            </button>

                            <button className="primary" onClick={() => setShowAddress(true)}>
                                <MapPin size={18} />
                                <span>Địa chỉ</span>
                            </button>
                                
                            <button className="logout" onClick={async () => {
                                try {
                                    await logout();
                                } catch (error) {
                                    console.error(error);
                                } finally {
                                    window.location.href = '/';
                                }
                            }}>
                                <LogOut size={18} />
                                <span>Đăng xuất</span>

                            </button>
                        </nav>
                    </aside>

                    <main className="content">
                        <div className="content-header">
                            <h2 className="section-title">
                                <UserCircle size={24} />
                                <span>Thông tin tài khoản</span>
                            </h2>
                        </div>
                        <section className="user-info">
                            <div className="user-avatar-wrapper">
                                <div className="user-avatar">
                                    <img src={userData.avatar || '/ava_user.webp'} alt="User avatar" />
                                </div>
                                {!userData.avatar && (
                                    <div className="avatar-badge">
                                        <User size={16} />
                                    </div>
                                )}
                            </div>
                            <div className="user-details">
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <UserCircle size={20} />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">Tên tài khoản</span>
                                        <span className="detail-value">{userData.userName || userData.fullName || 'Người dùng'}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <Phone size={20} />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">Điện thoại</span>
                                        <span className="detail-value">{userData.phoneNumber || '—'}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <Mail size={20} />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">Email</span>
                                        <span className="detail-value">{userData.email || '—'}</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>

                    <Order />
                </div>
            </div>

            
            {showUpdate && (
                <UpdateInformation
                    open={showUpdate}
                    user={userData}
                    onClose={() => setShowUpdate(false)}
                    onUpdated={(updated) => {
                        if (updated) setUserData(updated);
                        setShowUpdate(false);
                    }}
                />
            )}
            {showUpdatePassword && (
                <UpdatePassword
                    open={showUpdatePassword}
                    user={userData}
                    onClose={() => setShowUpdatePassword(false)}
                />
            )}
            {showReview && (
                <ReviewList
                    open={showReview}
                    onClose={() => setShowReview(false)}
                />
            )}
            {showAddress && (
                <Address
                    open={showAddress}
                    onClose={() => setShowAddress(false)}
                />
            )}
        </>
    ))
}