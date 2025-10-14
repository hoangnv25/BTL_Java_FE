import "../assets/style/ProductCard.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
	// Tính toán giá sau giảm (nếu có). Dùng Math.round để làm tròn số tiền hiển thị.
	const hasDiscount = product.Discount && product.Discount > 0;
	const finalPrice = hasDiscount
		? Math.round(product.price * (1 - product.Discount / 100))
		: product.price;

	// Ảnh đang hiển thị: ưu tiên ảnh chính, nếu thiếu thì lấy ảnh đầu của variation
	const initialImage = product.thumbnail || product?.list_product_variation?.[0]?.thumbnail || "";
	const [currentImage, setCurrentImage] = useState(initialImage);
	// Khóa biến thể đang chọn: "main" cho mẫu chính, hoặc id_variation cho biến thể
	const [selectedKey, setSelectedKey] = useState("main");

	// Gộp mẫu chính + các variation; giữ tất cả (kể cả trùng thumbnail) để mỗi nút độc lập
	const allVariations = useMemo(() => {
		const mainItem = { key: "main", thumbnail: product.thumbnail };
		const others = Array.isArray(product.list_product_variation)
			? product.list_product_variation.map(v => ({ key: v.id_variation, thumbnail: v.thumbnail }))
			: [];
		return [mainItem, ...others].filter(v => Boolean(v.thumbnail));
	}, [product.thumbnail, product.list_product_variation]);
	
	const navigate = useNavigate();
	const gotoProductDetail = (id) => {
		navigate(`/product/${id}`);
	}

	return (
		<div className="product-card" onClick={() => { gotoProductDetail(product.id); }}>
			<div className="product-thumb">
				{/* Ảnh sản phẩm theo biến thể đang chọn */}
				<img src={currentImage} alt={product.title} />
				{hasDiscount && (
					// Nhãn Discount nổi bật ở góc ảnh
					<span className="badge-discount">-{product.Discount}%</span>
				)}
			</div>
			<div className="product-body">
				{/* 2 cột: trái (tiêu đề + mô tả), phải (rating + giá) */}
				<div className="product-content">
					<div className="product-info">
						<h3 className="product-title">{product.title}</h3>
						{/* Mô tả rút gọn 2 dòng */}
						<p className="product-desc">{product.description}</p>
					</div>
					<div className="product-meta">
						{/* Rating hỗ trợ nửa sao (0.5) */}
						<div className="product-rating">
						{(() => {
							const full = Math.floor(product.rate || 0);
							const hasHalf = (product.rate || 0) - full >= 0.5;
							const empty = 5 - full - (hasHalf ? 1 : 0);
							return (
								<>
									{Array.from({ length: full }).map((_, i) => (
										<span key={"f"+i} className="star on">★</span>
									))}
									{hasHalf && <span className="star half">★</span>}
									{Array.from({ length: empty }).map((_, i) => (
										<span key={"e"+i} className="star">★</span>
									))}
								</>
							);
						})()}
						</div>
						{/* Hiển thị giá: có giảm giá thì hiện giá gốc + giá sau giảm, ngược lại chỉ một giá */}
						<div className="product-price">
							{hasDiscount ? (
								<>
									<span className="price-old">{product.price.toLocaleString()}₫</span>
									<span className="price-now">{finalPrice.toLocaleString()}₫</span>
								</>
							) : (
								<span className="price-normal">{finalPrice.toLocaleString()}₫</span>
							)}
						</div>
					</div>
				</div>
				{/* giá đã chuyển lên product-meta */}
				{/* Danh sách thumbnail biến thể (mẫu chính + các variation) */}
				{allVariations.length > 0 && (
					<div className="variant-list" role="list">
						{allVariations.map((v) => {
							const isActive = v.key === selectedKey;
							return (
								<button
									key={v.key}
									className={"variant-thumb" + (isActive ? " active" : "")}
									aria-label="Chọn biến thể"
									onClick={() => { setCurrentImage(v.thumbnail); setSelectedKey(v.key); }}
									type="button"
								>
									<img src={v.thumbnail} alt="variation" />
								</button>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
