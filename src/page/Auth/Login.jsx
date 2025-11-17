import './Login.css';
import anhTheLC from '../../assets/image/anh_the_LC.jpg';
import {Eye, EyeOff} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { App } from 'antd';
import { login } from '../../service/Auth';

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