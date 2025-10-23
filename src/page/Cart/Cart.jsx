const response_cart = {
    "user_id": 1, // thật ra mình ko dùng
    "message": "success",
    "result": [
      {
        "product_id": 123,
        "product_variation_id": 1,
        "quantity": 2
      },
      {
        "product_id": 456,
        "product_variation_id": 2, 
        "quantity": 1
      },
      {
        "product_id": 789,
        "product_variation_id": 3,
        "quantity": 3
      }
    ]
  }

const response_product = {
    id: 219,
    title: "Ao sai đẹp giếu",
    description: "Đây là mô tả của áo Sai đẹp giếu",
    price: 450000,
    thumbnail: "https://product.hstatic.net/1000360022/product/ao-thun-nam-hoa-tiet-in-phoi-mau-predator-form-oversize_0c5655ad3680475496d654529c6fd55d_1024x1024.jpg",
    rate: 3.5,
    discount: 10,
    list_prod_variation: [
        {
            product_id: 219,
            image: "https://product.hstatic.net/1000210295/product/artboard_1_copy_11_3e793cf980cf44fb95a9544bd8220992_master.jpg",
            color: "Be",
            list: [
                {
                    id_variation: 1,
                    size: "XL",
                    stock_quantity: 12

                },
                {
                    id_variation: 2,
                    size: "L",
                    stock_quantity: 10
                }
            ]
        },
        {
            product_id: 219,
            image: "https://bizweb.dktcdn.net/100/415/697/products/mc1-0224920e-c953-4129-a4b3-d79b600e15fa.jpg?v=1637916532137",
            color: "Lam",
            list: [
                {
                    id_variation: 3,
                    size: "XL",
                    stock_quantity: 12

                },
                {
                    id_variation: 4,
                    size: "L",
                    stock_quantity: 0
                },
                {
                    id_variation: 5,
                    size: "M",
                    stock_quantity: 5
                }
            ]
        }			
    ]
};

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import "./Cart.css";

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderNote, setOrderNote] = useState("");
    const [selectedItems, setSelectedItems] = useState(new Set());
    const navigate = useNavigate();

    // Fetch cart data theo yêu cầu
    useEffect(() => {
        const fetchCartData = async () => {
            try {
                setLoading(true);
                // TODO: Thay thế bằng API call thực tế
                // const response = await fetch('/cart');
                // const cartData = await response.json();
                
                // Mock: Giả sử fetch cart data thành công
                const cartData = response_cart;
                
                if (cartData.message === "success") {
                    // Với mỗi cái trong result, lấy prod_id ra và fetch tiếp api product/prod_id
                    const itemsWithDetails = await Promise.all(
                        cartData.result.map(async (item) => {
                            // TODO: Thay thế bằng API call thực tế
                            // const productResponse = await fetch(`/product/${item.product_id}`);
                            // const productData = await productResponse.json();
                            
                            // Mock: Giả sử mỗi lần fetch trả về response_product như trên
                            const productData = response_product;
                            
                            // Tìm variation tương ứng
                            const selectedVariation = findVariationById(productData, item.product_variation_id);
                            
                            return {
                                ...item,
                                product: productData,
                                selectedVariation: selectedVariation
                            };
                        })
                    );
                    
                    setCartItems(itemsWithDetails);
                }
            } catch (error) {
                console.error("Error fetching cart data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartData();
    }, []);

    // Helper function để tìm variation theo ID
    const findVariationById = (product, variationId) => {
        for (const colorGroup of product.list_prod_variation) {
            for (const variation of colorGroup.list) {
                if (variation.id_variation === variationId) {
                    return {
                        ...variation,
                        color: colorGroup.color,
                        image: colorGroup.image
                    };
                }
            }
        }
        return null;
    };

    // Tính tổng tiền chỉ cho những item được chọn
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const itemKey = `${item.product_id}-${item.product_variation_id}`;
            if (selectedItems.has(itemKey)) {
                const price = item.product.price;
                const discount = item.product.discount || 0;
                const finalPrice = price * (1 - discount / 100);
                return total + (finalPrice * item.quantity);
            }
            return total;
        }, 0);
    };

    // Toggle chọn/bỏ chọn item
    const toggleItemSelection = (productId, variationId) => {
        const itemKey = `${productId}-${variationId}`;
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemKey)) {
                newSet.delete(itemKey);
            } else {
                newSet.add(itemKey);
            }
            return newSet;
        });
    };

    // Chọn tất cả
    const selectAll = () => {
        const allKeys = cartItems.map(item => `${item.product_id}-${item.product_variation_id}`);
        setSelectedItems(new Set(allKeys));
    };

    // Bỏ chọn tất cả
    const deselectAll = () => {
        setSelectedItems(new Set());
    };

    // Cập nhật số lượng
    const updateQuantity = (productId, variationId, newQuantity) => {
        if (newQuantity < 1) return;
        
        setCartItems(prev => 
            prev.map(item => 
                item.product_id === productId && item.product_variation_id === variationId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    // Xóa item khỏi cart
    const removeItem = (productId, variationId) => {
        setCartItems(prev => 
            prev.filter(item => 
                !(item.product_id === productId && item.product_variation_id === variationId)
            )
        );
    };

    // Xử lý checkout (tạm thôi, sau bổ sung sau)
    const handleCheckout = () => {
        const selectedItemsList = cartItems.filter(item => {
            const itemKey = `${item.product_id}-${item.product_variation_id}`;
            return selectedItems.has(itemKey);
        });
        
        if (selectedItemsList.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
            return;
        }
        
        console.log("Checkout with selected items:", selectedItemsList);
        console.log("Order note:", orderNote);
        alert("Tính năng thanh toán đang được phát triển!");
    };

    if (loading) {
        return (
            <div className="cart-container">
                <div className="loading">Đang tải giỏ hàng...</div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="cart-container">
                <div className="empty-cart">
                    <div className="empty-cart-icon">
                        <div className="shopping-bag">🛍️</div>
                        <div className="empty-x">❌</div>
                    </div>
                    <h2>Giỏ Hàng Của Bạn Đang Trống</h2>
                    <p>Mua Sắm Ngay tại trang chủ nhé!!!</p>
                    <button 
                        className="shop-now-btn"
                        onClick={() => navigate('/')}
                    >
                        Mua sắm ngay
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1>Giỏ hàng</h1>
            
            <div className="cart-content">
                <div className="cart-items">
                    {/* Select All Controls */}
                    <div className="select-all-controls">
                        <button onClick={selectAll} className="select-all-btn">
                            Chọn tất cả
                        </button>
                        <button onClick={deselectAll} className="deselect-all-btn">
                            Bỏ chọn tất cả
                        </button>
                    </div>
                    
                    {cartItems.map((item) => {
                        const itemKey = `${item.product_id}-${item.product_variation_id}`;
                        const isSelected = selectedItems.has(itemKey);
                        
                        return (
                            <div key={itemKey} className={`cart-item ${isSelected ? 'selected' : ''}`}>
                                <div className="item-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleItemSelection(item.product_id, item.product_variation_id)}
                                    />
                                </div>
                                
                                <button 
                                    className="remove-item"
                                    onClick={() => removeItem(item.product_id, item.product_variation_id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            
                            <div className="product-image">
                                <img 
                                    src={item.selectedVariation?.image || item.product.thumbnail} 
                                    alt={item.product.title}
                                    onError={(e) => {
                                        e.target.src = item.product.thumbnail;
                                    }}
                                />
                            </div>
                            
                            <div className="product-info">
                                <h3 className="product-title">{item.product.title}</h3>
                                <div className="product-variant">
                                    {item.selectedVariation?.color} / {item.selectedVariation?.size}
                                </div>
                                <div className="product-price">
                                    {item.product.discount ? (
                                        <>
                                            <span className="price-old">
                                                {item.product.price.toLocaleString()}₫
                                            </span>
                                            <span className="price-now">
                                                {Math.round(item.product.price * (1 - item.product.discount / 100)).toLocaleString()}₫
                                            </span>
                                        </>
                                    ) : (
                                        <span className="price-normal">
                                            {item.product.price.toLocaleString()}₫
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="quantity-controls">
                                <button 
                                    onClick={() => updateQuantity(item.product_id, item.product_variation_id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="quantity">{item.quantity}</span>
                                <button 
                                    onClick={() => updateQuantity(item.product_id, item.product_variation_id, item.quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        );
                    })}
                    
                    <div className="order-notes">
                        <h3>Ghi chú đơn hàng</h3>
                        <textarea
                            value={orderNote}
                            onChange={(e) => setOrderNote(e.target.value)}
                            placeholder="Nhập ghi chú cho đơn hàng..."
                        />
                    </div>
                </div>
                
                <div className="order-summary">
                    <div className="total-section">
                        <h3>TỔNG CỘNG</h3>
                        <div className="total-amount">
                            {calculateTotal().toLocaleString()}₫
                        </div>
                    </div>
                    
                    <button 
                        className="checkout-btn"
                        onClick={handleCheckout}
                    >
                        Thanh Toán
                    </button>
                </div>
            </div>
        </div>
    );
}