import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { base } from '../../../service/Base'
import './AdminDashboard.css'
import { Calendar, Filter } from 'lucide-react'

export default function AdminDashboard() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filterType, setFilterType] = useState('week') // 'week' hoặc 'month'
    const [selectedWeek, setSelectedWeek] = useState(null) // null = tuần hiện tại
    const [selectedMonth, setSelectedMonth] = useState(null) // null = tháng hiện tại
    const token = localStorage.getItem('token')

    // Fetch all orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`${base}/all-orders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                
                if (response.status === 200 && response.data?.result) {
                    setOrders(response.data.result)
                } else {
                    setError('Không thể tải dữ liệu đơn hàng')
                }
            } catch (err) {
                console.error('Error fetching orders:', err)
                setError(err?.response?.data?.message || 'Có lỗi khi tải dữ liệu')
            } finally {
                setLoading(false)
            }
        }

        if (token) {
            fetchOrders()
        }
    }, [token])

    // Lọc đơn đã hoàn thành
    const completedOrders = useMemo(() => {
        return orders.filter(order => order.status === 'COMPLETED')
    }, [orders])

    // Tính doanh thu hàng ngày trong tuần
    const weeklyRevenue = useMemo(() => {
        const today = new Date()
        let startDate = new Date(today)
        
        // Nếu có selectedWeek, tính từ tuần đó
        if (selectedWeek) {
            startDate = new Date(selectedWeek)
        } else {
            // Tuần hiện tại: 7 ngày gần nhất
            startDate.setDate(today.getDate() - 6)
        }
        
        startDate.setHours(0, 0, 0, 0)
        
        const weekData = []
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate)
            date.setDate(startDate.getDate() + i)
            date.setHours(0, 0, 0, 0)
            
            const nextDate = new Date(date)
            nextDate.setDate(nextDate.getDate() + 1)
            
            const dayOrders = completedOrders.filter(order => {
                const orderDate = new Date(order.orderDate)
                return orderDate >= date && orderDate < nextDate
            })
            
            const revenue = dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
            
            const dayName = date.toLocaleDateString('vi-VN', { weekday: 'short' })
            const dayNumber = date.getDate()
            const month = date.getMonth() + 1
            
            weekData.push({
                date: `${dayNumber}/${month}`,
                dayName,
                revenue,
                count: dayOrders.length,
                fullDate: date
            })
        }
        
        return weekData
    }, [completedOrders, selectedWeek])

    // Tính doanh thu hàng ngày trong tháng
    const monthlyRevenue = useMemo(() => {
        const today = new Date()
        let targetMonth = today.getMonth()
        let targetYear = today.getFullYear()
        
        // Nếu có selectedMonth, dùng tháng đó
        if (selectedMonth) {
            targetMonth = selectedMonth.getMonth()
            targetYear = selectedMonth.getFullYear()
        }
        
        const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate()
        
        const monthData = []
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(targetYear, targetMonth, day)
            date.setHours(0, 0, 0, 0)
            
            const nextDate = new Date(date)
            nextDate.setDate(nextDate.getDate() + 1)
            
            const dayOrders = completedOrders.filter(order => {
                const orderDate = new Date(order.orderDate)
                return orderDate >= date && orderDate < nextDate
            })
            
            const revenue = dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
            
            monthData.push({
                date: day,
                revenue,
                count: dayOrders.length
            })
        }
        
        return monthData
    }, [completedOrders, selectedMonth])

    // Tạo danh sách các tuần có dữ liệu
    const availableWeeks = useMemo(() => {
        if (completedOrders.length === 0) return []
        
        const weeks = new Set()
        completedOrders.forEach(order => {
            const orderDate = new Date(order.orderDate)
            // Lấy thứ 2 của tuần chứa ngày này
            const monday = new Date(orderDate)
            const dayOfWeek = orderDate.getDay()
            const diff = orderDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
            monday.setDate(diff)
            monday.setHours(0, 0, 0, 0)
            weeks.add(monday.toISOString())
        })
        
        return Array.from(weeks)
            .map(iso => new Date(iso))
            .sort((a, b) => b.getTime() - a.getTime())
    }, [completedOrders])

    // Tạo danh sách các tháng có dữ liệu
    const availableMonths = useMemo(() => {
        if (completedOrders.length === 0) return []
        
        const months = new Set()
        completedOrders.forEach(order => {
            const orderDate = new Date(order.orderDate)
            const monthStart = new Date(orderDate.getFullYear(), orderDate.getMonth(), 1)
            months.add(monthStart.toISOString())
        })
        
        return Array.from(months)
            .map(iso => new Date(iso))
            .sort((a, b) => b.getTime() - a.getTime())
    }, [completedOrders])

    // Tính tổng doanh thu (theo filter)
    const totalRevenue = useMemo(() => {
        if (filterType === 'week') {
            return weeklyRevenue.reduce((sum, day) => sum + day.revenue, 0)
        } else {
            return monthlyRevenue.reduce((sum, day) => sum + day.revenue, 0)
        }
    }, [filterType, weeklyRevenue, monthlyRevenue])

    // Tính tổng số đơn (theo filter)
    const totalOrders = useMemo(() => {
        if (filterType === 'week') {
            return weeklyRevenue.reduce((sum, day) => sum + day.count, 0)
        } else {
            return monthlyRevenue.reduce((sum, day) => sum + day.count, 0)
        }
    }, [filterType, weeklyRevenue, monthlyRevenue])

    // Tìm giá trị max để scale biểu đồ
    const maxWeeklyRevenue = Math.max(...weeklyRevenue.map(d => d.revenue), 1)
    const maxMonthlyRevenue = Math.max(...monthlyRevenue.map(d => d.revenue), 1)

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="dashboard-loading">Đang tải dữ liệu...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="admin-dashboard">
                <div className="dashboard-error">{error}</div>
            </div>
        )
    }

    // Format date cho select
    const formatWeekLabel = (date) => {
        const endDate = new Date(date)
        endDate.setDate(date.getDate() + 6)
        return `${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} - ${endDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
    }

    const formatMonthLabel = (date) => {
        return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
    }

    const getChartTitle = () => {
        if (filterType === 'week') {
            if (selectedWeek) {
                const endDate = new Date(selectedWeek)
                endDate.setDate(selectedWeek.getDate() + 6)
                return `Doanh thu tuần: ${formatWeekLabel(selectedWeek)}`
            }
            return 'Doanh thu 7 ngày gần nhất'
        } else {
            if (selectedMonth) {
                return `Doanh thu tháng: ${formatMonthLabel(selectedMonth)}`
            }
            return `Doanh thu tháng: ${new Date().toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}`
        }
    }

    return (
        <div className="admin-dashboard">
            <h1>Dashboard - Báo cáo doanh thu</h1>
            
            {/* Filter Controls */}
            <div className="dashboard-filters">
                <div className="filter-group">
                    <label className="filter-label">
                        <Filter size={16} />
                        <span>Loại báo cáo:</span>
                    </label>
                    <select 
                        className="filter-select"
                        value={filterType}
                        onChange={(e) => {
                            setFilterType(e.target.value)
                            setSelectedWeek(null)
                            setSelectedMonth(null)
                        }}
                    >
                        <option value="week">Theo tuần</option>
                        <option value="month">Theo tháng</option>
                    </select>
                </div>

                {filterType === 'week' && (
                    <div className="filter-group">
                        <label className="filter-label">
                            <Calendar size={16} />
                            <span>Chọn tuần:</span>
                        </label>
                        <select 
                            className="filter-select"
                            value={selectedWeek ? selectedWeek.toISOString() : ''}
                            onChange={(e) => {
                                if (e.target.value) {
                                    setSelectedWeek(new Date(e.target.value))
                                } else {
                                    setSelectedWeek(null)
                                }
                            }}
                        >
                            <option value="">Tuần hiện tại (7 ngày gần nhất)</option>
                            {availableWeeks.map((week, index) => (
                                <option key={index} value={week.toISOString()}>
                                    {formatWeekLabel(week)}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {filterType === 'month' && (
                    <div className="filter-group">
                        <label className="filter-label">
                            <Calendar size={16} />
                            <span>Chọn tháng:</span>
                        </label>
                        <select 
                            className="filter-select"
                            value={selectedMonth ? selectedMonth.toISOString() : ''}
                            onChange={(e) => {
                                if (e.target.value) {
                                    setSelectedMonth(new Date(e.target.value))
                                } else {
                                    setSelectedMonth(null)
                                }
                            }}
                        >
                            <option value="">Tháng hiện tại</option>
                            {availableMonths.map((month, index) => (
                                <option key={index} value={month.toISOString()}>
                                    {formatMonthLabel(month)}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            
            {/* Tổng quan */}
            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-label">Tổng doanh thu</div>
                    <div className="stat-value">{formatCurrency(totalRevenue)}</div>
                    <div className="stat-note">
                        {filterType === 'week' ? 'Trong tuần đã chọn' : 'Trong tháng đã chọn'}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Tổng đơn hàng</div>
                    <div className="stat-value">{totalOrders}</div>
                    <div className="stat-note">
                        {filterType === 'week' ? 'Trong tuần đã chọn' : 'Trong tháng đã chọn'}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Đơn hàng trung bình</div>
                    <div className="stat-value">
                        {totalOrders > 0 
                            ? formatCurrency(totalRevenue / totalOrders)
                            : formatCurrency(0)
                        }
                    </div>
                    <div className="stat-note">
                        {filterType === 'week' ? 'Trong tuần đã chọn' : 'Trong tháng đã chọn'}
                    </div>
                </div>
            </div>

            {/* Biểu đồ doanh thu */}
            <div className="dashboard-chart">
                <h2>{getChartTitle()}</h2>
                <div className={`chart-container ${filterType === 'month' ? 'chart-container-monthly' : ''}`}>
                    {filterType === 'week' ? (
                        <div className="chart-bars">
                            {weeklyRevenue.map((day, index) => (
                                <div key={index} className="chart-bar-wrapper">
                                    <div className="chart-bar-container">
                                        <div 
                                            className="chart-bar"
                                            style={{ 
                                                height: `${(day.revenue / maxWeeklyRevenue) * 100}%`,
                                                minHeight: day.revenue > 0 ? '4px' : '0'
                                            }}
                                        >
                                            <div className="chart-bar-tooltip">
                                                <div>{formatCurrency(day.revenue)}</div>
                                                <div>{day.count} đơn</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="chart-label">
                                        <div className="chart-day-name">{day.dayName}</div>
                                        <div className="chart-day-date">{day.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="chart-bars chart-bars-monthly">
                            {monthlyRevenue.map((day, index) => (
                                <div key={index} className="chart-bar-wrapper chart-bar-wrapper-monthly">
                                    <div className="chart-bar-container">
                                        <div 
                                            className="chart-bar"
                                            style={{ 
                                                height: `${(day.revenue / maxMonthlyRevenue) * 100}%`,
                                                minHeight: day.revenue > 0 ? '2px' : '0'
                                            }}
                                        >
                                            <div className="chart-bar-tooltip">
                                                <div>{formatCurrency(day.revenue)}</div>
                                                <div>{day.count} đơn</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="chart-label chart-label-monthly">
                                        {day.date}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
