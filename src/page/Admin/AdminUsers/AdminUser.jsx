import './AdminUser.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { base } from '../../../service/Base'
import { User, Mail, Phone, Search, Calendar } from 'lucide-react'
import { App } from 'antd'
import UserDetailModal from './UserDetailModal'

export default function AdminUser() {
    const { message } = App.useApp()
    const token = localStorage.getItem('token')
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        filterUsers()
    }, [searchQuery, users])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            // Step 1: Fetch list of users
            const response = await axios.get(`${base}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                const usersData = response.data?.result || response.data?.data || response.data || []
                // Filter out user with ID = 1
                const filteredData = Array.isArray(usersData) 
                    ? usersData.filter(user => {
                        const userId = user.id || user.userId
                        return userId !== 1 && userId !== '1'
                    })
                    : []

                // Không fetch avatar nữa vì:
                // - API /users trả về avatar: null cho tất cả users
                // - API /users/${userId} chỉ cho phép xem thông tin của chính mình
                // → Hiển thị fallback icon cho tất cả users
                setUsers(filteredData)
            } else {
                message.error('Không thể tải danh sách người dùng')
                setUsers([])
            }
        } catch (error) {
            console.error('Error fetching users:', error)
            message.error(error?.response?.data?.message || 'Không thể tải danh sách người dùng')
            setUsers([])
        } finally {
            setLoading(false)
        }
    }

    const filterUsers = () => {
        let filtered = [...users]

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(user => {
                const userName = (user.userName || user.fullName || '').toLowerCase()
                const email = (user.email || '').toLowerCase()
                const phone = (user.phoneNumber || user.phone || '').toLowerCase()
                const userId = String(user.id || user.userId || '').toLowerCase()
                
                return userName.includes(query) || 
                       email.includes(query) || 
                       phone.includes(query) ||
                       userId.includes(query)
            })
        }

        setFilteredUsers(filtered)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getUserRole = (user) => {
        const role = user.role || user.roleName || 'USER'
        return role.toUpperCase()
    }

    const getRoleBadgeClass = (role) => {
        const roleUpper = role.toUpperCase()
        if (roleUpper === 'ADMIN') return 'role-badge-admin'
        if (roleUpper === 'USER') return 'role-badge-user'
        return 'role-badge-default'
    }


    const handleUserClick = (user) => {
        setSelectedUser(user)
        setIsModalOpen(true)
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        setSelectedUser(null)
    }

    const handleUserUpdated = (updatedUser) => {
        // Update user in the list
        setUsers(prevUsers => 
            prevUsers.map(u => {
                const userId = u.id || u.userId
                const updatedUserId = updatedUser.id || updatedUser.userId
                if (userId === updatedUserId) {
                    return { ...u, ...updatedUser }
                }
                return u
            })
        )
        // Update selected user
        if (selectedUser) {
            const userId = selectedUser.id || selectedUser.userId
            const updatedUserId = updatedUser.id || updatedUser.userId
            if (userId === updatedUserId) {
                setSelectedUser({ ...selectedUser, ...updatedUser })
            }
        }
    }

    return (
        <div className="admin-user-page">
            <div className="admin-user-header">
                <div className="admin-user-title">
                    <User size={28} />
                    <h1>Quản lý người dùng</h1>
                </div>
                <div className="admin-user-stats">
                    <div className="stat-item">
                        <span className="stat-label">Tổng người dùng</span>
                        <span className="stat-value">{users.length}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Đang hiển thị</span>
                        <span className="stat-value">{filteredUsers.length}</span>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="admin-user-controls">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm theo tên, email, số điện thoại, ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="admin-user-content">
                {loading ? (
                    <div className="admin-user-loading">
                        <div className="spinner"></div>
                        <p>Đang tải danh sách người dùng...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="admin-user-empty">
                        <User size={64} />
                        <h3>Không tìm thấy người dùng</h3>
                        <p>
                            {searchQuery 
                                ? 'Thử thay đổi từ khóa tìm kiếm.' 
                                : 'Chưa có người dùng nào trong hệ thống.'}
                        </p>
                    </div>
                ) : (
                    <div className="admin-users-grid">
                        {filteredUsers.map((user) => {
                            const role = getUserRole(user)
                            // Get avatar from multiple possible fields
                            const userAvatar = user.avatar || user.imageUrl || user.image || user.user_img || null
                            const avatarUrl = userAvatar 
                                ? (userAvatar.startsWith('http') || userAvatar.startsWith('/') || userAvatar.startsWith('data:')
                                    ? userAvatar 
                                    : `${base}/${userAvatar}`)
                                : null

                            return (
                                <div 
                                    key={user.id || user.userId} 
                                    className="admin-user-card"
                                    onClick={() => handleUserClick(user)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {/* Avatar */}
                                    <div className="user-card-avatar">
                                        {avatarUrl ? (
                                            <img 
                                                src={avatarUrl}
                                                alt={user.userName || user.fullName}
                                                onError={(e) => {
                                                    e.target.style.display = 'none'
                                                    e.target.nextSibling.style.display = 'flex'
                                                }}
                                            />
                                        ) : null}
                                        <div className="user-avatar-fallback" style={{ display: avatarUrl ? 'none' : 'flex' }}>
                                            <User size={32} />
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <div className="user-card-info">
                                        <div className="user-card-header">
                                            <h3 className="user-name">
                                                {user.userName || user.fullName || 'Không có tên'}
                                            </h3>
                                            <span className={`role-badge ${getRoleBadgeClass(role)}`}>
                                                {role}
                                            </span>
                                        </div>

                                        <div className="user-details">
                                            {user.email && (
                                                <div className="user-detail-item">
                                                    <Mail size={16} />
                                                    <span>{user.email}</span>
                                                </div>
                                            )}
                                            {user.phoneNumber || user.phone ? (
                                                <div className="user-detail-item">
                                                    <Phone size={16} />
                                                    <span>{user.phoneNumber || user.phone}</span>
                                                </div>
                                            ) : null}
                                            {user.createdAt && (
                                                <div className="user-detail-item">
                                                    <Calendar size={16} />
                                                    <span>{formatDate(user.createdAt)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* User ID */}
                                        <div className="user-card-footer">
                                            <span className="user-id">ID: {user.id || user.userId || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* User Detail Modal */}
            <UserDetailModal
                open={isModalOpen}
                onClose={handleModalClose}
                user={selectedUser}
                onUpdated={handleUserUpdated}
            />
        </div>
    )
}

