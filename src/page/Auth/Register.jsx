import './Register.css';
import anhTheLC from '../../assets/image/anh_the_LC.jpg';
import {Eye, EyeOff} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { App } from 'antd';
import { setToken } from '../../service/LocalStorage';
import { login as loginService, register as registerService } from '../../service/Auth';
import { OAuthConfig } from '../../configurations/configuration';

export default function Register() {
    const { message } = App.useApp();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        roles: ["USER1"]
    });

    const autoLogin = async () => {
        const payload = { 
            fullName: formData.fullName, 
            password: formData.password
        };
        
        try {
            message.loading('Đang đăng nhập...');
            await loginService(payload);
            message.success('Đăng nhập thành công');
            window.location.href = '/';
        } catch (error) {
            message.error(error?.message || 'Đăng nhập thất bại');
        }
    };

    const handleGoogleRegister = () => {
        const callBackUrl = `${window.location.origin}/auth/OAuth`;
        const authUrl = OAuthConfig.Google.authUri;
        const googleClientId = OAuthConfig.Google.clientId;

        const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
            callBackUrl
        )}&response_type=code&client_id=${googleClientId}&scope=openid%20profile%20email`;

        sessionStorage.setItem('oauthProvider', 'google');
        window.location.href = targetUrl;
    };


    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            message.error('Mật khẩu xác nhận không khớp!');
            return;
        }

        const payload = new FormData();
        payload.append("username", formData.fullName);
        payload.append("email", formData.email);
        payload.append("password", formData.password);
        payload.append("phoneNumber", formData.phoneNumber);
        // payload.append("roles", ["USER"]);

        try {
            await registerService(payload);
            message.success('Đăng ký thành công!');
            await autoLogin();
        } catch (error) {
            message.error(error?.message || 'Đăng ký thất bại!');
        }
    };

    return (
        <div className="register-container">
            {/* Left side - Image */}
            {/* <div className="register-image">
                <img src={anhTheLC} alt="Background" />
            </div> */}
            
            {/* Right side - Register Form */}
            <div className="register-form-container">
                <div className="register-form">
                    {/* <h1 className="brand-name">FASHCO SHOP</h1> */}
                    <h1 className="login-title">Đăng ký</h1> 
                    <p className="login-description">Nhâp thông tin đăng ký của bạn</p>
                   
                    <form className="register-form-element" onSubmit={handleSubmit}>
                        <div className="register-input-group">
                            <input 
                                type="text" 
                                name="fullName"
                                placeholder="Tên tài khoản" 
                                className="register-form-input"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="register-input-group">
                            <input 
                                type="email" 
                                name="email"
                                placeholder="Email" 
                                className="register-form-input"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="register-input-group">
                            <input 
                                type="tel" 
                                name="phoneNumber"
                                placeholder="Số điện thoại" 
                                className="register-form-input"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="register-input-group register-password-group">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password"
                                placeholder="Mật khẩu" 
                                className="register-form-input register-password-input"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <button 
                                type="button" 
                                className="register-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        
                        <div className="register-input-group register-password-group">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                name="confirmPassword"
                                placeholder="Xác nhận mật khẩu" 
                                className="register-form-input register-password-input"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                            <button 
                                type="button" 
                                className="register-password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        
                        <div className="register-button-group">
                            <button type="submit" className="register-submit-btn">
                                Đăng ký
                            </button>

                            <button type="button" className="register-google-btn" onClick={handleGoogleRegister}>
                                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                                    <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
                                    <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                                    <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
                                </svg>
                                Đăng ký với Google
                            </button>
                            
                            <button type="button" className="register-login-btn" onClick={() => navigate('/login')}>
                                Đăng nhập
                            </button>
                        </div>
                        
                        <div className="register-login-link">
                            <p>Đã có tài khoản? <a href="#" onClick={() => navigate('/login')}>Đăng nhập ngay</a></p>
                        </div>

                        <p className="login-description">Bằng cách đăng ký, bạn đồng ý với <a href="/terms" target="_blank" rel="noopener noreferrer">Điều khoản sử dụng</a> của chúng tôi</p>
                    </form>
                </div>
            </div>
        </div>
    );
}