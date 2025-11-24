import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar.jsx'
import HomePage from './page/Home/HomePage.jsx'
import Login from './page/Auth/Login.jsx'
import Register from './page/Auth/Register.jsx'
import OAuthCallback from './page/Auth/OAuthCallback.jsx'
import Information from './page/Profile/Information.jsx'
import NAinPage from './page/Home/NewArrivals/NAinPage.jsx'
import SalePage from './page/Home/Sale/SalePage.jsx'
import ProductDetail from './page/ProductDetail/ProductDetail.jsx'
import Cart from './page/Cart/Cart.jsx'
import FloatingCartLink from './components/FloatingCartLink.jsx'
import CategoryProduct from './page/Category/CategoryProduct.jsx'
import FullProduct from './page/FullProduct/FullProduct.jsx'
import Admin from './page/Admin/Admin.jsx'
import Chat from './page/Chat/Chat.jsx'
import SearchResults from './page/Search/SearchResults.jsx'
import About from './page/Info/About.jsx'
import Contact from './page/Info/Contact.jsx'
import Privacy from './page/Info/Privacy.jsx'
import Terms from './page/Info/Terms.jsx'
import FAQ from './page/Info/FAQ.jsx'
import Shipping from './page/Info/Shipping.jsx'
import { useTokenRefresh } from './hooks/useTokenRefresh'

function App() {
  useTokenRefresh()

  return (
    <>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/newArrivals" element={<NAinPage />} /> {/*tạm để ở đây*/}
          <Route path="/sale" element={<SalePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/category" element={<FullProduct />} />
          <Route path="/category/:id" element={<CategoryProduct />} />
          <Route path="/search" element={<SearchResults />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/OAuth" element={<OAuthCallback />} />
          <Route path="/user" element={<Information />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/chat/*" element={<Chat />} />

          <Route path="/admin/*" element={<Admin />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping" element={<Shipping />} />
        </Routes>
      </main>
      <FloatingCartLink />
    </>
  )
}

export default App
