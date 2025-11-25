import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../assets/style/NavbarMobile.css'
import Category from './CategoryNavbar'
import { Home, MessageCircle, User, List, Sparkles, LayoutDashboard, X } from 'lucide-react'

function NavbarMobile({
  isLoggedIn,
  isAdmin,
  handleLogout,
  navigate,
  unreviewedCount,
}) {
  const [showCategories, setShowCategories] = useState(false)
  const location = useLocation()
  const isChatPage = location.pathname.startsWith('/chat')
  const isProductDetailPage = location.pathname.startsWith('/product/')
  const shouldHideNav = isChatPage || isProductDetailPage

  const closeAll = () => {
    setShowCategories(false)
  }

  useEffect(() => {
    if (typeof document === 'undefined') return
    const body = document.body
    if (!shouldHideNav) {
      body.classList.add('has-bottom-nav')
    } else {
      body.classList.remove('has-bottom-nav')
    }
    return () => {
      body.classList.remove('has-bottom-nav')
    }
  }, [shouldHideNav])

  if (shouldHideNav) {
    return null
  }

  return (
    <>
      <nav className="bottom-nav">
        {!isAdmin ? (
          <>
            <button className="bottom-item" onClick={() => { closeAll(); setShowCategories(true) }} aria-label="Danh mục">
              <List size={22} />
              <span>Danh mục</span>
            </button>

            <Link className="bottom-item" to="/newArrivals" aria-label="Hàng mới">
              <Sparkles size={22} />
              <span>Mới về</span>
            </Link>

            {/* Placeholder chiếm cột giữa để tránh chồng lấn với FAB */}
            <span>
              <span className="bottom-spacer" aria-hidden="true" />
              <span className="bottom-item-text">Trang chủ</span>
            </span>
            <button className="fab" onClick={() => navigate('/')} aria-label="Trang chủ">
              <Home size={26} />
            </button>

            <Link className="bottom-item" to="/chat" aria-label="Chat">
              <MessageCircle size={22} />
              <span>Chat</span>
            </Link>

            <Link className="bottom-item bottom-item-profile" to="/user" aria-label="Cá nhân">
              <div className="bottom-item-icon-wrapper">
                <User size={22} />
                {unreviewedCount > 0 && (
                  <span className="bottom-item-badge"></span>
                )}
              </div>
              <span>Cá nhân</span>
            </Link>
          </>
        ) : (
          <>
            <button className="bottom-item" onClick={() => navigate('/')} aria-label="Trang chủ">
              <Home size={22} />
              <span>Home</span>
            </button>

            <button className="bottom-item" onClick={() => { closeAll(); setShowCategories(true) }} aria-label="Danh mục">
              <List size={22} />
              <span>Danh mục</span>
            </button>

            {/* Placeholder chiếm cột giữa để tránh chồng lấn với FAB */}
            <span>
              <span className="bottom-spacer" aria-hidden="true" />
              <span className="bottom-item-text">Quản trị</span>
            </span>

            <button className="fab" onClick={() => navigate('/admin')} aria-label="Quản trị">
              <LayoutDashboard size={26} />
            </button>

            <Link className="bottom-item" to="/chat" aria-label="Chat">
              <MessageCircle size={22} />
              <span>Chat</span>
            </Link>

            <Link className="bottom-item bottom-item-profile" to="/user" aria-label="Cá nhân">
              <div className="bottom-item-icon-wrapper">
                <User size={22} />
                {unreviewedCount > 0 && (
                  <span className="bottom-item-badge"></span>
                )}
              </div>
              <span>Cá nhân</span>
            </Link>
          </>
        )}
      </nav>

      {showCategories && (
        <div className="mb-overlay" onClick={closeAll}>
          <div className="mb-sheet" onClick={(e) => e.stopPropagation()}>
            <button className="mb-sheet-close" onClick={closeAll} aria-label="Đóng">
              <X size={20} />
            </button>
            <div className="mb-sheet-header">Danh mục</div>
            <div className="mb-sheet-content">
              <ul className="mb-cat-list">
                <li>
                  <Link to="/newArrivals" onClick={closeAll}>Hàng mới về</Link>
                </li>
              </ul>
              <Category closeAll={closeAll} />
            </div>
          </div>
        </div>
      )}

      {/* Không cần overlay Cá nhân: chuyển thẳng tới /user */}
    </>
  )
}

export default NavbarMobile


