import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import HomePage from './page/Home/HomePage.jsx'
import Login from './page/Auth/Login.jsx'
import Register from './page/Auth/Register.jsx'
import Information from './page/Profile/Information.jsx'

function App() {
  return (
    <>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/newArrivals" element={<div>New Arrivals</div>} />
          <Route path="/categories" element={<div>Chỗ này đợi BE để xổ list danh mục xuống</div>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<Information />} />
        </Routes>
      </main>
    </>
  )
}

export default App
