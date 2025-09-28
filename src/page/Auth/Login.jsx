import './Login.css';
import anhTheLC from '../../assets/image/anh_the_LC.jpg';
import {Eye, EyeOff} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    
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
                    
                    <form className="login-form-element">
                        <div className="login-input-group">
                            <input 
                                type="email" 
                                placeholder="Email" 
                                className="login-form-input"
                            />
                        </div>
                        
                        <div className="login-input-group login-password-group">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Password" 
                                className="login-form-input login-password-input"
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