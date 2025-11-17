import './Login.css';
import anhTheLC from '../../assets/image/anh_the_LC.jpg';
import {Eye, EyeOff} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { App } from 'antd';
import { login } from '../../service/Auth';
import { OAuthConfig } from '../../configurations/configuration';

export default function Login() {
    const { message } = App.useApp();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const target = e.target;
        const { name, value } = target;
        if (!name) return; // ignore changes from elements without a name
        setFormData(prev => {
            const next = { ...prev, [name]: value };
            if (Object.prototype.hasOwnProperty.call(next, '')) {
                delete next[''];
            }
            return next;
        });
    };
    
    const handleLogin = async (e) => {
        e.preventDefault();
        const payload = { fullName: formData.fullName, password: formData.password };
        try {
            await login(payload);
            message.success('Đăng nhập thành công');
            window.location.href = '/';
        } catch (error) {
            message.error(error?.message || 'Đăng nhập thất bại');
        }
    }

    const handleGoogleLogin = async () => {
        const callBackUrl = `${window.location.origin}/auth/OAuth`;
        const authUrl = OAuthConfig.Google.authUri;
        const googleClientId = OAuthConfig.Google.clientId;

        const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
            callBackUrl
        )}&response_type=code&client_id=${googleClientId}&scope=openid%20profile%20email`;

        console.log('OAuth Redirect URL:', targetUrl);
        console.log('Callback URL:', callBackUrl);

        // Lưu provider vào sessionStorage
        sessionStorage.setItem('oauthProvider', 'google');

        window.location.href = targetUrl;
    }

    const handleFacebookLogin = async () => {
        const callBackUrl = `${window.location.origin}/auth/OAuth`;
        const authUrl = "https://www.facebook.com/v18.0/dialog/oauth";
        const facebookClientId = OAuthConfig.Facebook.clientId;

        const targetUrl = `${authUrl}?client_id=${facebookClientId}&redirect_uri=${encodeURIComponent(
            callBackUrl
        )}&response_type=code&scope=public_profile,email`;

        // Lưu provider vào sessionStorage
        sessionStorage.setItem('oauthProvider', 'facebook');

        window.location.href = targetUrl;
    }

    return (
        <div className="login-container">
            {/* Left side - Image */}
            <div className="login-image">
                <img src={anhTheLC} alt="Background" />
            </div>
            
            {/* Right side - Login Form */}
            <div className="login-form-container">
                <div className="login-form">
                    <h1 className="brand-name">LOK SHOP</h1>
                    <h2 className="login-title">Đăng nhập</h2>        
                    
                    <form className="login-form-element" onSubmit={handleLogin}>
                        <div className="login-input-group">
                            <input 
                                type="text" 
                                name="fullName"
                                placeholder="Fullname" 
                                className="login-form-input"
                                value={formData.fullName}
                                onChange={handleInputChange}
                            />
                        </div>
                        
                        <div className="login-input-group login-password-group">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password"
                                placeholder="Password" 
                                className="login-form-input login-password-input"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <button 
                                type="button" 
                                className="login-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        
                        <div className="login-button-group">
                            <button type="submit" className="login-signin-btn">
                                Đăng nhập
                            </button>

                            <button type="button" className="login-facebook-btn" onClick={handleFacebookLogin}>
                                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                                    <path d="M18 9.007a9 9 0 1 1-10.222-8.874V1h3.333v2.765A6.94 6.94 0 0 0 9 3.653c1.043 0 2.043.26 2.947.734V1.5h3.334v6.21h-2.501a4.93 4.93 0 0 0 2.143 3.262l-1.006 1.755A6.93 6.93 0 0 1 9 12.653a6.93 6.93 0 0 1-6.002-3.518L1.495 9.75a9 9 0 0 1 9-9.006Z" fill="#1877F2"/>
                                    <path d="M13.332 5.802h1.996V4.207H13.33a2.65 2.65 0 0 0-2.646 2.646V7.45H9.003V9.14h1.647v4.914H13.33v-4.914h2.005l.29-1.595h-2.295V5.802Z" fill="#fff"/>
                                </svg>
                                Đăng nhập với Facebook
                            </button>

                            <button type="button" className="login-google-btn" onClick={handleGoogleLogin}>
                                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                                    <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
                                    <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                                    <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
                                </svg>
                                Đăng nhập với Google
                            </button>
                            
                            <button type="button" className="login-register-btn" onClick={() => navigate('/register')}>
                                Đăng ký
                            </button>
                        </div>
                        
                        <div className="login-forgot-password">
                            <a href="#" className="login-forgot-link">Quên mật khẩu?</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}