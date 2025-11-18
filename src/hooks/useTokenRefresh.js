import { useEffect, useRef } from 'react'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { base } from '../service/Base'

export const useTokenRefresh = () => {
  const isRefreshing = useRef(false)
  const lastRefreshTime = useRef(0)

  // Hàm kiểm tra xem token có đang ở trong khoảng 30-60 phút không
  // Tức là thời gian còn lại từ 0-30 phút (đã dùng từ 30-60 phút)
  const shouldRefreshToken = (token) => {
    if (!token) return false

    try {
      const decodedToken = jwtDecode(token)
      const currentTime = Math.floor(Date.now() / 1000) // Thời gian hiện tại (giây)
      const expiration = decodedToken.exp // Thời gian token hết hạn (giây)
      
      // Thời gian còn lại của token (giây)
      const timeRemaining = expiration - currentTime
      
      // 30 phút = 1800 giây, 60 phút = 3600 giây
      // Token sống 60 phút, từ phút 30-60 nghĩa là thời gian còn lại từ 0-30 phút
      // Tức là thời gian còn lại <= 30 phút (1800 giây) và > 0
      const thirtyMinutesInSeconds = 1800
    //   const thirtyMinutesInSeconds = 3540
      
      // Chỉ refresh nếu còn từ 0-30 phút (đã dùng 30-60 phút)
      return timeRemaining > 0 && timeRemaining <= thirtyMinutesInSeconds
    } catch (error) {
      console.error('Error decoding token:', error)
      return false
    }
  }

  // Hàm refresh token
  const refreshToken = async () => {
    const token = localStorage.getItem('token')
    
    if (!token || isRefreshing.current) {
      return
    }

    // Chỉ refresh nếu cách lần refresh trước ít nhất 1 phút (tránh refresh quá nhiều)
    const now = Date.now()
    if (now - lastRefreshTime.current < 60000) {
      return
    }

    if (!shouldRefreshToken(token)) {
      return
    }

    isRefreshing.current = true
    lastRefreshTime.current = now

    try {
      const response = await axios.post(`${base}/auth/refresh`, {
        token: token
      })

      if (response.status === 200 && response.data.code === 0) {
        const newToken = response.data.result.token
        
        // Cập nhật token mới
        localStorage.setItem('token', newToken)
        
        // Decode token mới và cập nhật các thông tin cần thiết
        const decodedToken = jwtDecode(newToken)
        localStorage.setItem('userId', decodedToken.userId)
        
        if (decodedToken.scope && decodedToken.scope.includes('ROLE_ADMIN')) {
          localStorage.setItem('isAdmin', true)
        } else {
          localStorage.setItem('isAdmin', false)
        }

        console.log('Token refreshed successfully')
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
      // Không làm gì nếu refresh thất bại, để user tiếp tục sử dụng token cũ
    } finally {
      isRefreshing.current = false
    }
  }

  // Lắng nghe các sự kiện hoạt động của người dùng
  useEffect(() => {
    const activityEvents = ['click', 'scroll', 'keypress', 'mousemove', 'touchstart']
    let timeoutId = null

    const handleUserActivity = () => {
      // Debounce: chỉ refresh sau 2 giây không có hoạt động (tránh refresh quá nhiều)
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        refreshToken()
      }, 2000)
    }

    // Thêm event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity, { passive: true })
    })

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity)
      })
      clearTimeout(timeoutId)
    }
  }, [])

  return { refreshToken }
}

