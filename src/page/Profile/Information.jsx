import './Information.css'
import axios from 'axios';
import { base } from '../../service/Base';
import { useEffect, useState } from 'react';
import NotLoggedIn from '../../components/NotLoggedIn';
import Breadcrumb from '../../components/Breadcrumb';

export default function Information() {
    const token = localStorage.getItem('token')
    if (!token) {
        return <NotLoggedIn />
    }

    
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const getUserInfo = async () => {
        const response = await axios.get(`${base}/users/myInfor`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
        });
        if (response.status === 200) {
            setUserData(response.data);
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    // Breadcrumb items
    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Thông tin cá nhân" }
    ];

    return (
        loading ? (
            <>
                <Breadcrumb items={breadcrumbItems} />
                <div>Loading...</div>
            </>
        ) : (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div className="profile-container">
            <section className="user-info">
                <div className="user-avatar">
                    <img src="/ava_user.webp" alt="User avatar" />
                </div>
                <div className="user-details">
                    <div className="user-name">{userData.userName}</div>
                    <div className="user-email">{userData.email}</div>
                    <div className="user-phone">{userData.phoneNumber}</div>
                    
                </div>
            </section>
            </div>
        </>
    ))
}