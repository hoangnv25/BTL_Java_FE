import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import '../assets/style/FloatingCart.css'

function FloatingCartLink() {
  const location = useLocation()
  const currentPath = location.pathname

  const allowedStatic = new Set(['/', '/newArrivals', '/user'])
  const allowedPatterns = [/^\/category\/[^/]+$/, /^\/product\/[^/]+$/]

  const shouldShow =
    allowedStatic.has(currentPath) ||
    allowedPatterns.some((pattern) => pattern.test(currentPath))

  return (
    shouldShow ? (
      <Link to="/cart" className="floating-cart" aria-label="Mở giỏ hàng" title="Giỏ hàng">
        <ShoppingCart size={24} strokeWidth={2.5} />
      </Link>
    ) : null
  )
}

export default FloatingCartLink


