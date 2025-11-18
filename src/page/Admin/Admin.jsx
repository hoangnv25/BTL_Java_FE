import AdminNavbar from './Components/Navbar'
import './Admin.css'
import { Route, Routes, Outlet } from 'react-router-dom'
import AdminCategory from './AdminCategory/AdminCategory'
import AdminSale from './AdminSale/AdminSale'
import GetProduct from './AdminProduct/GetProduct/GetProduct'
import AdminReview from './AdminReview/AdminReview'
import AdminOrder from './AdminOrder/AdminOrder'

export default function Admin() {
    return (
        <div className="admin-page">
            <AdminNavbar />
            <main className="admin-main">
                <Routes>
                    <Route index element={<div>Dashboard</div>} />
                    <Route path="users" element={<div>Users</div>} />
                    <Route path="products" element={<GetProduct />} />
                    <Route path="sales" element={<AdminSale />} />
                    <Route path="cart" element={<div>Cart</div>} />
                    <Route path="orders" element={<AdminOrder />} />
                    <Route path="categories" element={<AdminCategory />} />
                    <Route path="feedback" element={<div>Feedback</div>} />
                    <Route path="reviews" element={<AdminReview />} />
                    <Route path="addresses" element={<div>Addresses</div>} />
                    <Route path="payments" element={<div>Payments</div>} />
                    <Route path="settings" element={<div>Settings</div>} />
                </Routes>
            </main>
        </div>
    )
}