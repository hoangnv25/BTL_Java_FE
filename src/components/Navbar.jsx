import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import '../assets/style/Navbar.css'
import Brand from './Brand'
import { ShoppingCart, User } from 'lucide-react'

function Navbar() {
  const navigate = useNavigate()

  return (
    <header className="navbar-header">
      <nav className="navbar">
        <div className="navbar-brand" onClick={() => navigate('/')}>
          <Brand />
        </div>

        <ul className="navbar-menu">
          <li><Link to="/" className="navbar-link">Trang chủ</Link></li>
          <li><Link to="/newArrivals" className="navbar-link">Hàng mới dề</Link></li>
          <li><Link to="/categories" className="navbar-link">Danh mục</Link></li>
          <li><Link to="/login" className="navbar-link">Đăng nhập</Link></li>
          <li><Link to="/register" className="signup-btn">Đăng ký</Link></li>
          <li><Link to="/user" className="navbar-link" aria-label="Tài khoản" title="Tài khoản"><User size={22} strokeWidth={2} /></Link></li>
          <li><Link to="/cart" className="navbar-link" aria-label="Giỏ hàng" title="Giỏ hàng"><ShoppingCart size={22} strokeWidth={2} /></Link></li>
        </ul>

      </nav>
    </header>
  )
}

export default Navbar


