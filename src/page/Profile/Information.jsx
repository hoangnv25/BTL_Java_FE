import './Information.css'
import axios from 'axios';
import { base } from '../../service/Base';
import { useEffect, useState } from 'react';

export default function Information() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
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
    return (
        loading ? (
            <div>Loading...</div>
        ) : (
        <div className="profile-container">
            <section className="user-info">
                <div className="user-avatar">
                    <img src="/ava_user.webp" alt="User avatar" />
                </div>
                <div className="user-details">
                    <div className="user-name">{userData.fullName}</div>
                    <div className="user-email">{userData.email}</div>
                    <div className="user-phone">{userData.phoneNumber}</div>
                    
                </div>
            </section>
        </div>
       
    ))
}