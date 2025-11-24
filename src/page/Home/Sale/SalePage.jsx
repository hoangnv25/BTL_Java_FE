import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { base } from '../../../service/Base.jsx';
import ProductCard from '../../../components/ProductCard';
import Breadcrumb from '../../../components/Breadcrumb';
import './Sale.css';

export default function SalePage() {
    const [sale, setSale] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Fetch all products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${base}/products`);
                if (response.status === 200 && response.data?.result) {
                    setAllProducts(response.data.result || []);
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Có lỗi khi tải danh sách sản phẩm');
            }
        };

        fetchProducts();
    }, []);

    // Fetch sale information (always pick the active one)
    useEffect(() => {
        const fetchSale = async () => {
            try {
                const response = await axios.get(`${base}/sales`);
                if (response.status === 200 && response.data?.result) {
                    const sales = response.data.result;
                    const activeSale = sales.find((s) => s.active);
                    setSale(activeSale || null);
                }
            } catch (err) {
                console.error('Error fetching sale:', err);
                setError('Không thể tải thông tin đợt sale');
            } finally {
                setLoading(false);
            }
        };

        fetchSale();
    }, []);

    // Countdown timer
    useEffect(() => {
        if (!sale) {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
        }

        const endDate = new Date(sale.endDate).getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const difference = endDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [sale]);

    // Helper function: Lấy discount cho sản phẩm từ sale
    const getProductDiscount = useCallback((productId) => {
        if (!sale || !sale.list_product) return 0;
        
        const productInSale = sale.list_product.find(p => 
            (p.id === productId || p.productId === productId)
        );
        
        if (productInSale) {
            return Math.round((productInSale.value || 0) * 100);
        }
        return 0;
    }, [sale]);

    // Helper function: Group variations theo COLOR
    const groupVariationsByColor = useCallback((variations) => {
        if (!Array.isArray(variations) || variations.length === 0) return [];

        const colorMap = {};

        variations.forEach(v => {
            const colorKey = (v.color?.trim().toLowerCase() || 'default');
            
            if (!colorMap[colorKey]) {
                colorMap[colorKey] = {
                    key: colorKey,
                    color: v.color || 'Mặc định',
                    representativeImage: v.image,
                    images: [v.image],
                    sizes: {},
                    totalStock: 0,
                    variationIds: []
                };
            } else {
                if (v.image && !colorMap[colorKey].images.includes(v.image)) {
                    colorMap[colorKey].images.push(v.image);
                }
            }

            colorMap[colorKey].sizes[v.size] = {
                id: v.id,
                stock: v.stockQuantity || 0
            };
            colorMap[colorKey].totalStock += (v.stockQuantity || 0);
            colorMap[colorKey].variationIds.push(v.id);
        });

        return Object.values(colorMap);
    }, []);

    // Filter và transform products để phù hợp với ProductCard
    const saleProducts = useMemo(() => {
        if (!sale || !sale.list_product || !allProducts || allProducts.length === 0) {
            return [];
        }

        // Lấy danh sách product IDs trong sale
        const saleProductIds = sale.list_product.map(p => p.id || p.productId).filter(Boolean);
        
        console.log('Sale product IDs:', saleProductIds);
        console.log('All products:', allProducts.map(p => ({ id: p.productId, title: p.title })));
        
        // Filter products có trong sale
        const filteredProducts = allProducts.filter(product => 
            saleProductIds.includes(product.productId)
        );
        
        console.log('Filtered products:', filteredProducts.map(p => ({ id: p.productId, title: p.title })));

        // Transform products
        return filteredProducts.map(product => {
            // Transform variations: Group theo COLOR
            const list_product_variation = [];
            
            if (product.variations && Array.isArray(product.variations)) {
                const colorGroups = groupVariationsByColor(product.variations);
                
                colorGroups.forEach(group => {
                    if (group.representativeImage) {
                        list_product_variation.push({
                            id_variation: group.variationIds[0],
                            product_id: product.productId,
                            thumbnail: group.representativeImage,
                            color: group.color,
                            colorKey: group.key
                        });
                    }
                });
            }

            // Clean description
            let cleanDescription = (product.description || '').trim();
            cleanDescription = cleanDescription.replace(/\(Đừng xóa\)/gi, '').trim();

            // Get discount từ sale
            const discount = getProductDiscount(product.productId);

            return {
                id: product.productId,
                prod_id: product.productId,
                title: product.title || '',
                price: product.price || 0,
                thumbnail: product.image || '',
                description: cleanDescription,
                rate: 0,
                Discount: discount > 0 ? discount : undefined,
                list_product_variation: list_product_variation
            };
        });
    }, [allProducts, sale, getProductDiscount, groupVariationsByColor]);

    const saleName = sale?.name || 'Sale';
    const saleDescription = sale?.description || '';

    // Breadcrumb items
    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: saleName }
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            
            <div className="sale-page-container">
                {/* Sale header with countdown */}
                <div className="sale-page-header">
                    <div className="sale-page-info">
                        <h1 className="sale-page-title">{saleName.toUpperCase()}</h1>
                        {saleDescription && (
                            <p className="sale-page-description">{saleDescription}</p>
                        )}
                    </div>

                    {sale && (
                        <div className="sale-page-countdown">
                            <h3 className="countdown-title">Thời gian còn lại:</h3>
                            <div className="countdown-timer">
                                <div className="time-box">
                                    <span className="time-number">{String(timeLeft.days).padStart(2, '0')}</span>
                                    <span className="time-label">Ngày</span>
                                </div>
                                <div className="time-box">
                                    <span className="time-number">{String(timeLeft.hours).padStart(2, '0')}</span>
                                    <span className="time-label">Giờ</span>
                                </div>
                                <div className="time-box">
                                    <span className="time-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                    <span className="time-label">Phút</span>
                                </div>
                                <div className="time-box">
                                    <span className="time-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                    <span className="time-label">Giây</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Products grid */}
                <div className="sale-page-products">
                    {loading ? (
                        <div className="sale-page-loading">Đang tải sản phẩm...</div>
                    ) : error ? (
                        <div className="sale-page-error">{error}</div>
                    ) : !sale ? (
                        <div className="sale-page-empty">Không tìm thấy đợt sale này</div>
                    ) : saleProducts.length === 0 ? (
                        <div className="sale-page-empty">Không có sản phẩm nào trong đợt sale này</div>
                    ) : (
                        <div className="na-grid">
                            {saleProducts.map((product) => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product}
                                    fromPage="sale"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

