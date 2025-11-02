import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { base } from "../../service/Base.jsx";
import ProductFeedback from "./ProductFeedback";
import "./ProductDetail.css";

export default function ProductDetail() {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch product data from API
	useEffect(() => {
		const fetchProduct = async () => {
			if (!id) {
				setError("Không tìm thấy ID sản phẩm");
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError(null);
				const response = await axios.get(`${base}/products/${id}`);

				if (response.data && response.data.code === 1000 && response.data.result) {
					const productData = response.data.result;
					setProduct(productData);
				} else {
					setError("Không thể tải thông tin sản phẩm");
				}
			} catch (err) {
				console.error("Error fetching product:", err);
				setError(err?.response?.data?.message || "Có lỗi khi tải thông tin sản phẩm");
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [id]);

	// Transform API data to component format
	const RESPONSE = useMemo(() => {
		if (!product) return null;

		// API có thể trả về "listVariations" (đã nhóm sẵn theo màu) hoặc "variations" (array phẳng)
		let list_prod_variation = [];
		
		if (product.listVariations && Array.isArray(product.listVariations)) {
			// Format mới: listVariations đã được nhóm sẵn theo màu sắc
			list_prod_variation = product.listVariations.map((group) => ({
				product_id: group.productId || product.productId,
				image: group.image || product.image,
				color: group.color,
				list: (group.list || []).map((item) => ({
					id_variation: item.idVariation || item.id,
					size: item.size,
					stock_quantity: item.stockQuantity || 0
				}))
			}));
		} else if (product.variations && Array.isArray(product.variations)) {
			// Format cũ: variations là array phẳng, cần group theo màu
			const variationsByColor = {};
			
			product.variations.forEach((variation) => {
				if (!variation.color) return;
				
				if (!variationsByColor[variation.color]) {
					variationsByColor[variation.color] = {
						product_id: product.productId,
						image: variation.image || product.image,
						color: variation.color,
						list: []
					};
				}
				
				variationsByColor[variation.color].list.push({
					id_variation: variation.id,
					size: variation.size,
					stock_quantity: variation.stockQuantity || 0
				});
			});
			
			list_prod_variation = Object.values(variationsByColor);
		}

		return {
			id: product.productId,
			title: product.title || "",
			description: product.description || "",
			price: product.price || 0,
			thumbnail: product.image || "",
			rate: 0, // API không trả về rate, mặc định 0
			discount: product.saleValue ? Math.round(product.saleValue * 100) : 0, // Convert 0.90 to 90
			list_prod_variation: list_prod_variation
		};
	}, [product]);

	// Tạo gallery ảnh (ảnh chính + ảnh các biến thể) – mỗi entry có key riêng để
	// không gộp lại dù trùng URL ảnh
    const galleryEntries = useMemo(() => {
		if (!RESPONSE) return [];
		const entries = [];
		if (RESPONSE.thumbnail) {
			entries.push({ key: "main", src: RESPONSE.thumbnail });
		}
        (RESPONSE.list_prod_variation || []).forEach((group, idx) => {
            if (group && group.image) entries.push({ key: `color-${idx}`, src: group.image, variation: group });
		});
		return entries;
	}, [RESPONSE]);

    const [activeKey, setActiveKey] = useState(null);
	const activeEntry = useMemo(() => {
		if (!activeKey) return null;
		return galleryEntries.find(e => e.key === activeKey);
	}, [activeKey, galleryEntries]);
	
	// Set initial activeKey when galleryEntries changes
	useEffect(() => {
		if (galleryEntries.length > 0 && !activeKey) {
			setActiveKey(galleryEntries[0]?.key);
		}
	}, [galleryEntries, activeKey]);

	const activeImg = activeEntry?.src || "";
    const firstColorGroup = RESPONSE?.list_prod_variation?.[0];
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
	const [qty, setQty] = useState(1);

	// Initialize selectedSize and selectedColor when firstColorGroup is available
	useEffect(() => {
		if (firstColorGroup && !selectedSize && !selectedColor) {
			setSelectedSize(firstColorGroup.list?.[0]?.size || "");
			setSelectedColor(firstColorGroup.color || "");
		}
	}, [firstColorGroup, selectedSize, selectedColor]);

	const hasDiscount = RESPONSE?.discount && RESPONSE.discount > 0;
	const finalPrice = RESPONSE ? (hasDiscount ? Math.round(RESPONSE.price * (1 - RESPONSE.discount / 100)) : RESPONSE.price) : 0;

    const selectedVariation = activeEntry?.variation; // nhóm theo màu hiện tại
    const sizes = useMemo(() => {
        return selectedVariation?.list?.map(item => item.size) || [];
    }, [selectedVariation]);

    // Đồng bộ color/size theo nhóm màu đang active
	useEffect(() => {
        if (selectedVariation) {
            setSelectedColor(selectedVariation.color);
            if (!selectedVariation.list?.some(i => i.size === selectedSize)) {
                const nextSize = selectedVariation.list?.[0]?.size || "";
                setSelectedSize(nextSize);
            }
        }
	}, [selectedVariation, selectedSize]);

	const full = Math.floor(RESPONSE?.rate || 0);
	const hasHalf = (RESPONSE?.rate || 0) - full >= 0.5;
	const empty = 5 - full - (hasHalf ? 1 : 0);

	// Loading state - Skeleton loading
	if (loading) {
		return (
			<div className="pd-container">
				{/* Gallery skeleton */}
				<div className="pd-gallery">
					<div className="pd-main skeleton-image">
						<div className="skeleton-placeholder"></div>
					</div>
				</div>

				{/* Info skeleton */}
				<div className="skeleton-content">
					<div className="skeleton-line skeleton-meta"></div>
					<div className="skeleton-line skeleton-title"></div>
					<div className="skeleton-line skeleton-rating"></div>
					<div className="skeleton-line skeleton-price"></div>
					<div className="skeleton-line skeleton-description"></div>
					<div className="skeleton-line skeleton-description-short"></div>
					
					<div className="skeleton-options">
						<div className="skeleton-line skeleton-option-label"></div>
						<div className="skeleton-dots">
							<div className="skeleton-dot"></div>
							<div className="skeleton-dot"></div>
						</div>
					</div>
					
					<div className="skeleton-options">
						<div className="skeleton-line skeleton-option-label"></div>
						<div className="skeleton-chips">
							<div className="skeleton-chip"></div>
							<div className="skeleton-chip"></div>
							<div className="skeleton-chip"></div>
						</div>
					</div>
					
					<div className="skeleton-actions">
						<div className="skeleton-button"></div>
						<div className="skeleton-button secondary"></div>
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (error || !RESPONSE) {
		return (
			<div className="pd-container">
				<div style={{ textAlign: "center", padding: "40px", color: "#d32f2f" }}>
					<p>{error || "Không tìm thấy sản phẩm"}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="pd-container">
			{/* Gallery trái */}
			<div className="pd-gallery">
				<div className="pd-main">
					<img src={activeImg} alt={RESPONSE.title} />
				</div>
			</div>

			{/* Thông tin phải */}
			<div>
				<div className="pd-meta">LOK SHOP</div>
				<h1 className="pd-title">{RESPONSE.title}</h1>
				<div className="pd-meta">
					<div>
						{Array.from({ length: full }).map((_, i) => (<span key={"f"+i}>★</span>))}
						{hasHalf && <span>☆</span>}
						{Array.from({ length: empty }).map((_, i) => (<span key={"e"+i}>☆</span>))}
					</div>
					<span>({RESPONSE.rate})</span>
				</div>
				<div className="pd-price">
					{hasDiscount && <span className="pd-badge">SAVE {RESPONSE.discount}%</span>}
					{hasDiscount && <span className="old">{RESPONSE.price.toLocaleString()}₫</span>}
					<span className="now">{finalPrice.toLocaleString()}₫</span>
				</div>
				<p>{RESPONSE.description}</p>

                <div className="pd-options">
                    {/* Màu sắc: <color> và các nút tròn chọn variation */}
                    <div className="opt-row" style={{ alignItems: "flex-start", flexDirection: "column" }}>
                        <span>Màu sắc: <strong>{selectedColor}</strong></span>
					{galleryEntries.some(e => e.key !== "main" && e.variation) && (
						<div className="pd-variations">
							<div className="pd-variation-dots">
                                {galleryEntries.filter(e => e.key !== "main" && e.variation).map(e => (
                                    <span key={e.key} className="var-dot-wrap">
                                        <span className="var-tooltip">{e.variation.color}</span>
                                        <button
                                            className={"var-dot" + (activeKey === e.key ? " active" : "")}
                                            style={{ backgroundImage: `url(${e.src})` }}
                                            aria-label={`Chọn ${e.variation.color}`}
                                            onClick={() => {
                                                setActiveKey(e.key);
                                                setSelectedColor(e.variation.color);
                                                const sz = e.variation.list?.[0]?.size || "";
                                                setSelectedSize(sz);
                                            }}
                                            type="button"
                                        />
                                    </span>
                                ))}
							</div>
						</div>
					)}
                    </div>

                    {/* Kích thước: <size> và danh sách size của màu đang chọn */}
                    <div className="opt-row" style={{ alignItems: "flex-start", flexDirection: "column" }}>
                        <span>Kích thước: <strong>{selectedSize}</strong></span>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                            {sizes.map(s => (
                                <button key={s} className={"chip" + (selectedSize === s ? " active" : "")} onClick={() => setSelectedSize(s)} type="button">{s}</button>
                            ))}
                        </div>
                    </div>

					{/* Tồn kho theo size + color đang chọn */}
                    {(() => {
                        const matched = selectedVariation?.list?.find(i => i.size === selectedSize);
                        const qtyText = matched ? (matched.stock_quantity > 0 ? `Còn ${matched.stock_quantity} sản phẩm` : "Hết hàng") : "Không có tồn kho cho lựa chọn này";
						return <div className="opt-row" style={{ color: "#666" }}>Stock: {qtyText}</div>;
					})()}
					<div className="opt-row">
						<span>Quantity:</span>
						<div className="qty">
							<button type="button" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
							<input readOnly value={qty} />
							<button type="button" onClick={() => setQty(q => q + 1)}>+</button>
						</div>
					</div>
				</div>

				<div className="pd-actions">
					<button className="btn" type="button">Add to cart</button>
					<button className="btn secondary" type="button">Buy now</button>
				</div>

				<ProductFeedback />
			</div>
		</div>
	);
}