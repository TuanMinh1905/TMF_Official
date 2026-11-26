import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useProductStore from '../store/productStore';
import useCartStore from '../store/cartStore';
import useUiStore from '../store/uiStore';
import GarmentSVG from '../components/svg/GarmentSVG';
import ProductVCard from '../components/shop/ProductVCard';
import { formatPrice } from '../utils/format';

const COLOR_NAMES = {
  '#E6D6C3': 'Oat Milk', '#927262': 'Cocoa', '#AAB59B': 'Olive',
  '#9EACC1': 'Denim', '#BA8E91': 'Rosewood', '#494748': 'Charcoal',
};

export default function ProductPage() {
  const { id } = useParams();
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const products = useProductStore((s) => s.products);
  const favorites = useProductStore((s) => s.favorites);
  const toggleFavorite = useProductStore((s) => s.toggleFavorite);
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useUiStore((s) => s.showToast);

  const product = products.find((p) => p._id === id);

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => {
    if (product) { setSelectedColor(product.color); setSelectedSize(''); }
  }, [product]);

  if (!product) {
    return (
      <div className="px-[5.2%] pt-9 pb-20 min-h-[65vh] text-center py-20">
        <h2 className="text-xl font-bold">Sản phẩm không tồn tại</h2>
        <p className="text-[#756b65] mt-2">Mời bạn xem các sản phẩm khác.</p>
        <Link to="/catalog" className="inline-block bg-ink text-white px-5 py-3 font-bold text-[13px] mt-4">
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  const sizes = product.sizes || (product.shape === 'bag' ? ['One size'] : ['S', 'M', 'L', 'XL']);
  const isFav = favorites.has(product._id);
  const related = products.filter((p) => p._id !== product._id).slice(0, 3);

  const handleAdd = () => {
    if (!selectedSize) { showToast('Vui lòng chọn kích cỡ.'); return; }
    addItem(product, selectedSize, 1);
    showToast('Đã thêm vào giỏ hàng');
  };

  return (
    <div className="px-[5.2%] pt-9 pb-20 min-h-[65vh]">
      <div className="text-xs text-[#81736b] mb-6">
        <Link to="/" className="hover:underline">Trang chủ</Link>
        {' / '}
        <Link to="/catalog" className="hover:underline">Sản phẩm</Link>
        {' / '}{product.name}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-14">
        {/* Left — visuals */}
        <div>
          <div className="bg-[#e9ded5] aspect-square flex items-center justify-center">
            <GarmentSVG shape={product.shape} color={selectedColor} className="w-[80%] h-[80%]" />
          </div>
          <div className="flex gap-2 mt-3">
            {product.colors?.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className="w-[82px] h-[82px] bg-[#e9ded5] border flex items-center justify-center"
                style={{ borderColor: c === selectedColor ? '#494748' : '#d0c1b3' }}
              >
                <GarmentSVG shape={product.shape} color={c} className="w-full h-full" />
              </button>
            ))}
          </div>
          <p className="text-xs text-[#756b65] leading-relaxed mt-3">
            Minh họa sản phẩm · màu sắc mang tính tham khảo
          </p>
        </div>

        {/* Right — info */}
        <div>
          <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">
            FORM. ESSENTIALS / {product.tag || 'EVERYDAY'}
          </div>
          <h1 className="text-[clamp(30px,3.4vw,48px)] font-bold tracking-tight mt-3">{product.name}</h1>
          <p className="text-[#756b65] mt-1">Unisex · Relaxed fit</p>
          <h2 className="text-[22px] font-bold mt-3 mb-4">
            {formatPrice(product.price)}
            {product.oldPrice && (
              <span className="font-normal line-through text-[#897e75] ml-3 text-base">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </h2>
          <p className="text-[#666] leading-relaxed mb-6">
            {product.description || 'Thiết kế tối giản, mềm mại và dễ kết hợp cùng những món đồ yêu thích mỗi ngày.'}
          </p>

          {/* Colors */}
          <p className="font-bold text-sm mb-2">Màu sắc: {COLOR_NAMES[selectedColor] || selectedColor}</p>
          <div className="flex gap-2 mb-6">
            {product.colors?.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className="w-[30px] h-[30px] rounded-full border border-ink/25"
                style={{
                  background: c,
                  outline: c === selectedColor ? '1px solid #494748' : 'none',
                  outlineOffset: '3px',
                }}
                aria-label={COLOR_NAMES[c] || c}
              />
            ))}
          </div>

          {/* Sizes */}
          <p className="font-bold text-sm">Kích cỡ</p>
          <div className="flex gap-2 my-2.5">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`border px-4 py-3 text-sm min-w-[48px] ${
                  s === selectedSize
                    ? 'bg-ink text-white border-ink'
                    : 'border-[#bfb2a7]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button onClick={handleAdd} className="w-full bg-ink text-white py-4 font-bold text-[13px] mt-4 hover:bg-accent transition-colors">
            Thêm vào giỏ hàng ↗
          </button>

          <button
            onClick={() => toggleFavorite(product._id)}
            className="w-full border border-[#bfb2a7] px-4 py-3 mt-2 text-sm"
          >
            {isFav ? '♥ Đã yêu thích' : '♡ Lưu sản phẩm'}
          </button>

          <div className="bg-[#e1e5da] p-3.5 text-[13px] leading-relaxed mt-4">
            Giao hàng toàn quốc · Chính sách đổi trả minh họa 14 ngày
          </div>

          {/* Accordions */}
          <details open className="border-t border-[#ddd3c9] py-4 mt-4">
            <summary className="cursor-pointer font-semibold">Chi tiết sản phẩm</summary>
            <p className="leading-relaxed text-[#756b65] mt-2">
              Phom dáng thoải mái, màu sắc trung tính dễ phối. Thông số và chất liệu sẽ được cập nhật khi có hàng thật.
            </p>
          </details>
          <details className="border-t border-[#ddd3c9] py-4">
            <summary className="cursor-pointer font-semibold">Chất liệu & bảo quản</summary>
            <p className="leading-relaxed text-[#756b65] mt-2">
              Giặt nhẹ, phơi trong bóng râm. Thông tin chỉ để minh họa giao diện.
            </p>
          </details>
          <details className="border-t border-[#ddd3c9] py-4">
            <summary className="cursor-pointer font-semibold">Bảng kích thước (minh họa)</summary>
            <table className="w-full border-collapse text-[13px] mt-2">
              <thead>
                <tr><th className="p-2.5 border-b border-[#ddd3c9] text-left">Size</th><th className="p-2.5 border-b border-[#ddd3c9] text-left">Ngang (cm)</th><th className="p-2.5 border-b border-[#ddd3c9] text-left">Dài (cm)</th></tr>
              </thead>
              <tbody>
                {['S', 'M', 'L', 'XL'].map((s, i) => (
                  <tr key={s}><td className="p-2.5 border-b border-[#ddd3c9]">{s}</td><td className="p-2.5 border-b border-[#ddd3c9]">{50 + i * 3}</td><td className="p-2.5 border-b border-[#ddd3c9]">{65 + i * 2}</td></tr>
                ))}
              </tbody>
            </table>
          </details>
          <details className="border-t border-[#ddd3c9] py-4">
            <summary className="cursor-pointer font-semibold">Giao hàng & đổi trả</summary>
            <p className="leading-relaxed text-[#756b65] mt-2">
              Phí giao hàng demo 30.000₫, miễn phí từ 699.000₫.
            </p>
          </details>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="text-[25px] font-bold tracking-tight mb-5">Có thể bạn cũng thích</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-5">
            {related.map((p, i) => (
              <ProductVCard key={p._id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

