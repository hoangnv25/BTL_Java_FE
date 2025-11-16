import { useNavigate } from 'react-router-dom'
import '../assets/style/Navbar.css'
import { App } from 'antd'
import { useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode";
import NavbarPC from './NavbarPC'
import NavbarMobile from './NavbarMobile'


function Navbar() {
  const { message } = App.useApp();
  const token = localStorage.getItem('token')

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 900 : false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    message.success('Đăng xuất thành công')
    setIsLoggedIn(false)
    setIsAdmin(false)
  }

  const checkLogin = () => {
    if (token) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
      setIsAdmin(false)
    }
  }

  const decodeToken = () => {
    if (token) {
      const decodedToken = jwtDecode(token)
      localStorage.setItem('userId', decodedToken.userId)
      if (decodedToken.scope.includes('ROLE_ADMIN')) {
        localStorage.setItem('isAdmin', true)
        setIsAdmin(true)
      } else {
        localStorage.setItem('isAdmin', false)
        setIsAdmin(false)
      }
      
    }
  }

  useEffect(() => {
    checkLogin()
    decodeToken()
    const handleResize = () => setIsMobile(window.innerWidth <= 900)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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


