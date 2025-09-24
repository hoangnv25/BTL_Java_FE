import { Link } from 'react-router-dom'
import '../assets/style/Navbar.css'

function Navbar() {
  return (
    <header className="navbar-header">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">LOK SHOP</Link>

        <ul className="navbar-menu">
          <li><Link to="/" className="navbar-link">Trang chủ</Link></li>
          <li><Link to="/newArrivals" className="navbar-link">Hàng mới dề</Link></li>
          <li><Link to="/categories" className="navbar-link">Danh mục</Link></li>
          <li><Link to="/login" className="navbar-link">Đăng nhập</Link></li>
          <li><Link to="/register" className="signup-btn">Đăng ký</Link></li>
        </ul>

      </nav>
    </header>
  )
}

export default Navbar


