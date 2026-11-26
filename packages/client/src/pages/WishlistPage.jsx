import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProductStore from '../store/productStore';
import ProductVCard from '../components/shop/ProductVCard';

export default function WishlistPage() {
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const products = useProductStore((s) => s.products);
  const favorites = useProductStore((s) => s.favorites);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const favProducts = products.filter((p) => favorites.has(p._id));

  return (
    <div className="px-[5.2%] pt-9 pb-20 min-h-[65vh]">
      <div className="text-xs text-[#81736b] mb-6">
        <Link to="/" className="hover:underline">Trang chủ</Link> / Yêu thích
      </div>

      <div className="mb-8">
        <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">SAVED FOR LATER</div>
        <h1 className="text-[clamp(32px,4.4vw,62px)] tracking-tight leading-tight font-bold mt-3">
          Sản phẩm yêu thích
        </h1>
        <p className="text-[#756b65]">{favProducts.length} sản phẩm đã lưu.</p>
      </div>

      {favProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-5">
          {favProducts.map((p, i) => (
            <ProductVCard key={p._id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center bg-[#f1ebe4] p-14">
          <h2 className="text-xl font-bold">Chưa có sản phẩm yêu thích</h2>
          <p className="text-[#756b65] mt-2">Bấm trái tim để lưu món đồ bạn thích.</p>
          <Link to="/catalog" className="inline-block bg-ink text-white px-5 py-3 font-bold text-[13px] mt-4">
            Khám phá sản phẩm
          </Link>
        </div>
      )}
    </div>
  );
}

