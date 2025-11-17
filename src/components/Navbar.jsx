import { useNavigate } from 'react-router-dom'
import '../assets/style/Navbar.css'
import { App, Modal } from 'antd'
import { useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode";
import { logout } from '../service/Auth'
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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    setIsLogoutModalOpen(true)
  }

  const confirmLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      message.success('Đăng xuất thành công')
      setIsLoggedIn(false)
      setIsAdmin(false)
      setIsLogoutModalOpen(false)
      navigate('/')
    } catch (error) {
      message.error(error?.message || 'Đăng xuất thất bại')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const cancelLogout = () => {
    setIsLogoutModalOpen(false)
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
    <>
      {isMobile ? (
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
      )}
      <Modal
        title="Xác nhận đăng xuất"
        open={isLogoutModalOpen}
        onOk={confirmLogout}
        onCancel={cancelLogout}
        okText="Đăng xuất"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: isLoggingOut }}
        cancelButtonProps={{ disabled: isLoggingOut }}
        closable={!isLoggingOut}
      >
        <p>Bạn có muốn đăng xuất không?</p>
      </Modal>
    </>
  )
}

export default Navbar


