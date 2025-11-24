import { Link } from 'react-router-dom'
import '../assets/style/Navbar.css'
import '../assets/style/NavbarPC.css'
import Brand from './Brand'
import { ShoppingCart, User, ChevronDown, MessageCircle, Search, X, LogOut } from 'lucide-react'
import Category from './CategoryNavbar'

function NavbarPC({
  isLoggedIn,
  isAdmin,
  showSearch,
  searchQuery,
  setSearchQuery,
  handleSearchToggle,
  handleSearchSubmit,
  handleLogout,
  navigate,
}) {
  return (
    <header className="navbar-header navbar-pc">
      <nav className="navbar">
        <div className="navbar-brand" onClick={() => navigate('/')}> 
          <Brand />
        </div>

        <ul className="navbar-menu">
          <li><Link to="/newArrivals" className="navbar-link"><strong style={{ textTransform: 'uppercase' }}>Hàng mới về</strong></Link></li>
          <li className="navbar-separator" aria-hidden="true"></li>
          <li><Link to="/sale" className="navbar-link"><strong style={{ textTransform: 'uppercase' }}>Giảm giá</strong></Link></li>
          <li className="navbar-separator" aria-hidden="true"></li>
          <li className="navbar-dropdown">
            <span className="navbar-link"><strong style={{ textTransform: 'uppercase' }}>Danh mục</strong></span>
            <ChevronDown className="navbar-dropdown-icon" size={22} strokeWidth={2} />
            <div className="navbar-dropdown-menu">
              <Category />
            </div>
          </li>

          <li>
            <button 
              className="navbar-link navbar-icon-btn" 
              onClick={handleSearchToggle}
              aria-label="Tìm kiếm" 
              title="Tìm kiếm"
            >
              <Search size={22} strokeWidth={2} />
            </button>
          </li>

          <li><Link to="/user" className="navbar-link" aria-label="Tài khoản" title="Tài khoản"><User size={22} strokeWidth={2} /></Link></li>
          <li><Link to="/cart" className="navbar-link" aria-label="Giỏ hàng" title="Giỏ hàng"><ShoppingCart size={22} strokeWidth={2} /></Link></li>
          <li><Link to="/chat" className="navbar-link" aria-label="Chat" title="Chat"><MessageCircle size={22} strokeWidth={2} /></Link></li>

          {isLoggedIn ? (
            <li><Link to="#" onClick={handleLogout} className="navbar-link"><LogOut size={22} strokeWidth={2} /></Link></li>
          ) : (
            <>
              <li><Link to="/login" className="navbar-link">Đăng nhập</Link></li>
              <li className="navbar-separator" aria-hidden="true"></li>
              <li><Link to="/register" className="signup-btn">Đăng ký</Link></li>
            </>
          )}

          {isAdmin ? (
            <li><Link to="/admin" className="signup-btn">Quản trị</Link></li>
          ) : (
            <></>
          )}
        </ul>
      </nav>

      {showSearch && (
        <div className="search-overlay" onClick={handleSearchToggle}>
          <div className="search-container" onClick={(e) => e.stopPropagation()}>
            <button 
              className="search-close"
              onClick={handleSearchToggle}
              aria-label="Đóng"
            >
              <X size={20} />
            </button>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <Search className="search-icon" size={17} />
              <input
                type="text"
                className="search-input"
                placeholder="Tìm theo tên sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Xóa"
                >
                  <X size={15} />
                </button>
              )}
              <button type="submit" className="search-submit" aria-label="Tìm kiếm">
                <Search size={18} />
              </button>
            </form>
            <div className="search-suggestions">
              <span onClick={() => { setSearchQuery('Áo thun'); }}>Áo thun</span>
              <span onClick={() => { setSearchQuery('Quần tây'); }}>Quần tây</span>
              <span onClick={() => { setSearchQuery('Áo polo'); }}>Áo polo</span>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default NavbarPC


