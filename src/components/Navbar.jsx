import { useNavigate } from 'react-router-dom'
import '../assets/style/Navbar.css'
import { App } from 'antd'
import { useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode";
import NavbarPC from './NavbarPC'
import NavbarMobile from './NavbarMobile'
import { getToken, removeToken } from '../service/LocalStorage'


function Navbar() {
  const { message } = App.useApp();

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 900 : false)
  const navigate = useNavigate()

  const handleLogout = () => {
    removeToken()
    localStorage.clear()
    message.success('Đăng xuất thành công')
    setIsLoggedIn(false)
    setIsAdmin(false)
  }

  const checkLogin = () => {
    const token = getToken()
    if (token) {
      setIsLoggedIn(true)
      decodeToken(token)
    } else {
      setIsLoggedIn(false)
      setIsAdmin(false)
    }
  }

  const decodeToken = (token) => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        if (decodedToken.scope.includes('ROLE_ADMIN')) {
          localStorage.setItem('isAdmin', true)
          setIsAdmin(true)
        } else {
          localStorage.setItem('isAdmin', false)
          setIsAdmin(false)
        }
      } catch (error) {
        console.error('Error decoding token:', error)
        setIsAdmin(false)
      }
    }
  }

  useEffect(() => {
    checkLogin()
    
    // Lắng nghe sự kiện thay đổi token
    const handleTokenChange = () => {
      checkLogin()
    }
    
    window.addEventListener('tokenChanged', handleTokenChange)
    
    const handleResize = () => setIsMobile(window.innerWidth <= 900)
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('tokenChanged', handleTokenChange)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleSearchToggle = () => {
    setShowSearch(!showSearch)
    if (showSearch) {
      setSearchQuery('')
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results page with query
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  return (
    isMobile ? (
      <NavbarMobile
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        handleLogout={handleLogout}
        navigate={navigate}
      />
    ) : (
      <NavbarPC
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        showSearch={showSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearchToggle={handleSearchToggle}
        handleSearchSubmit={handleSearchSubmit}
        handleLogout={handleLogout}
        navigate={navigate}
      />
    )
  )
}

export default Navbar


