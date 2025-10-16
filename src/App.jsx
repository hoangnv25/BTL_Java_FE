import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar.jsx'
import HomePage from './page/Home/HomePage.jsx'
import Login from './page/Auth/Login.jsx'
import Register from './page/Auth/Register.jsx'
import Information from './page/Profile/Information.jsx'
import ChangeInfo from './page/Profile/ChangeInfo.jsx'
import Change_Password from './page/Profile/Change_Password.jsx'
import NAinPage from './page/Home/NewArrivals/NAinPage.jsx'
import ProductDetail from './page/ProductDetail/ProductDetail.jsx'
import Cart from './page/Cart/Cart.jsx'
import FloatingCartLink from './components/FloatingCartLink.jsx'
import CategoryProduct from './page/Category/CategoryProduct.jsx'

function App() {
  return (
    <>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/newArrivals" element={<NAinPage />} /> {/*tạm để ở đây*/}
          <Route path="/categories" element={<div>Chỗ này đợi BE để xổ list danh mục xuống</div>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<Information />} />
          <Route path="/user/info" element={<ChangeInfo />} />
          <Route path="/user/password" element={<Change_Password />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/category/:id" element={<CategoryProduct />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
      <FloatingCartLink />
    </>
  )
}

export default App
