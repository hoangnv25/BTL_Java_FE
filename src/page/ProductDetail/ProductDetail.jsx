import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ProductFeedback from "./ProductFeedback";
import "./ProductDetail.css";

export default function ProductDetail() {
	const { id } = useParams();

	const RESPONSE = {
		id: 219,
		title: "Ao sai đẹp giếu",
		description: "Đây là mô tả của áo Sai đẹp giếu",
		price: 450000,
		thumbnail: "https://onoff.vn/blog/wp-content/uploads/2024/11/cac-kieu-ao-khoac-nu-mua-dong-1.jpg",
		rate: 3.5,
		discount: 10,
		list_prod_variation: [
			{
				product_id: 219,
				image: "https://onoff.vn/blog/wp-content/uploads/2024/11/cac-kieu-ao-khoac-nu-mua-dong-3.jpg",
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
				image: "https://onoff.vn/blog/wp-content/uploads/2024/11/cac-kieu-ao-khoac-nu-mua-dong-4.jpg",
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

	// Tạo gallery ảnh (ảnh chính + ảnh các biến thể) – mỗi entry có key riêng để
	// không gộp lại dù trùng URL ảnh
    const galleryEntries = useMemo(() => {
		const entries = [];
		if (RESPONSE.thumbnail) {
			entries.push({ key: "main", src: RESPONSE.thumbnail });
		}
        (RESPONSE.list_prod_variation || []).forEach((group, idx) => {
            if (group && group.image) entries.push({ key: `color-${idx}`, src: group.image, variation: group });
		});
		return entries;
	}, [RESPONSE.thumbnail, RESPONSE.list_prod_variation]);

    const [activeKey, setActiveKey] = useState(galleryEntries[0]?.key);
	const activeEntry = useMemo(() => (
		galleryEntries.find(e => e.key === activeKey)
	), [activeKey, galleryEntries]);
	const activeImg = activeEntry?.src || "";
    const firstColorGroup = RESPONSE.list_prod_variation?.[0];
    const [selectedSize, setSelectedSize] = useState(firstColorGroup?.list?.[0]?.size || "");
    const [selectedColor, setSelectedColor] = useState(firstColorGroup?.color || "");
	const [qty, setQty] = useState(1);

	const hasDiscount = RESPONSE.discount && RESPONSE.discount > 0;
	const finalPrice = hasDiscount ? Math.round(RESPONSE.price * (1 - RESPONSE.discount / 100)) : RESPONSE.price;

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

	const full = Math.floor(RESPONSE.rate || 0);
	const hasHalf = (RESPONSE.rate || 0) - full >= 0.5;
	const empty = 5 - full - (hasHalf ? 1 : 0);

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

				<div className="pd-note">ID sản phẩm: {id}</div>
				<ProductFeedback />
			</div>
		</div>
	);
}