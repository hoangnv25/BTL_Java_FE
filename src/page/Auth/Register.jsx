import './Register.css';
import anhTheLC from '../../assets/image/anh_the_LC.jpg';
import {Eye, EyeOff} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        roles: ["USER1"]
    });

    // {
    //     "fullName":"user",
    //     "email":"tuan1234444@gmail.com",
    //     "password":"user",
    //     "phoneNumber":"098192492311",
    //     "roles":["USER1"]
    // }

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }
        // Handle registration logic here
        console.log('Registration data:', formData);
        toast.success('Đăng ký thành công!');
    };

    return (
        <div className="register-container">
            {/* Left side - Image */}
            <div className="register-image">
                <img src={anhTheLC} alt="Background" />
            </div>
            
            {/* Right side - Register Form */}
            <div className="register-form-container">
                <div className="register-form">
                    <h1 className="brand-name">LOK SHOP</h1>
                    <h2 className="register-title">Đăng ký</h2>
                   
                    <form className="register-form-element" onSubmit={handleSubmit}>
                        <div className="register-input-group">
                            <input 
                                type="text" 
                                name="fullName"
                                placeholder="Họ và tên" 
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
                                name="phone"
                                placeholder="Số điện thoại" 
                                className="register-form-input"
                                value={formData.phone}
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
                            
                            <button type="button" className="register-login-btn" onClick={() => navigate('/login')}>
                                Đăng nhập
                            </button>
                        </div>
                        
                        <div className="register-login-link">
                            <p>Đã có tài khoản? <a href="#" onClick={() => navigate('/login')}>Đăng nhập ngay</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}