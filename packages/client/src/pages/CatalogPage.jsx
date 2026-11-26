import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useProductStore from '../store/productStore';
import FilterPanel from '../components/shop/FilterPanel';
import ProductVCard from '../components/shop/ProductVCard';
import GarmentSVG from '../components/svg/GarmentSVG';

export default function CatalogPage() {
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const products = useProductStore((s) => s.products);
  const [searchParams] = useSearchParams();

  const [cat, setCat] = useState(searchParams.get('type') || 'all');
  const [priceRange, setPriceRange] = useState('all');
  const [colorFilter, setColorFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('new');

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = useMemo(() => {
    let list = [...products];

    // Category
    if (cat === 'new') list = list.filter((p) => p.tag === 'NEW');
    else if (cat === 'sale') list = list.filter((p) => p.oldPrice);
    else if (cat !== 'all') list = list.filter((p) => p.type === cat || p.gender === cat);

    // Search
    if (query) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

    // Price
    if (priceRange === 'low') list = list.filter((p) => p.price < 300000);
    else if (priceRange === 'mid') list = list.filter((p) => p.price >= 300000 && p.price <= 500000);
    else if (priceRange === 'high') list = list.filter((p) => p.price > 500000);

    // Color
    if (colorFilter !== 'all') list = list.filter((p) => p.colors?.includes(colorFilter));

    // Sort
    if (sortOrder === 'asc') list.sort((a, b) => a.price - b.price);
    else if (sortOrder === 'desc') list.sort((a, b) => b.price - a.price);

    return list;
  }, [products, cat, priceRange, colorFilter, query, sortOrder]);

  const handleReset = () => {
    setCat('all'); setPriceRange('all'); setColorFilter('all'); setQuery(''); setSortOrder('new');
  };

  const title = cat === 'sale' ? 'Ưu đãi' : cat === 'new' ? 'Hàng mới' : cat !== 'all' ? cat : 'Khám phá tủ đồ';

  return (
    <div className="px-[5.2%] pt-9 pb-20 min-h-[65vh]">
      <div className="text-xs text-[#81736b] mb-6">
        <Link to="/" className="hover:underline">Trang chủ</Link> / Cửa hàng
      </div>

      <div className="bg-hero p-8 mb-7 flex items-center justify-between gap-5">
        <div>
          <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">THE EVERYDAY WARDROBE</div>
          <h1 className="text-[clamp(32px,4.4vw,62px)] tracking-tight leading-tight font-bold mt-3">{title}</h1>
          <p className="text-[#756b65] leading-relaxed max-w-[620px]">
            Màu sắc nhẹ nhàng, phom dáng tự do. Tìm những món đồ vừa vặn với bạn.
          </p>
        </div>
        <div className="w-[190px] max-w-[35%] h-[130px] hidden md:block">
          <GarmentSVG shape="shirt" color="#AAB59B" className="w-full h-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[205px_1fr] gap-8">
        <FilterPanel
          cat={cat} setCat={setCat}
          priceRange={priceRange} setPriceRange={setPriceRange}
          colorFilter={colorFilter} setColorFilter={setColorFilter}
          query={query} setQuery={setQuery}
          onReset={handleReset}
        />

        <div>
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="text-sm text-[#756b65]">{filtered.length} sản phẩm</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-label="Sắp xếp"
              className="border border-[#d8cfc6] bg-white p-2 text-xs"
            >
              <option value="new">Mới nhất</option>
              <option value="asc">Giá tăng dần</option>
              <option value="desc">Giá giảm dần</option>
            </select>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-5">
              {filtered.map((p, i) => (
                <ProductVCard key={p._id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center bg-[#f1ebe4] p-14">
              <h2 className="text-xl font-bold">Không tìm thấy sản phẩm</h2>
              <p className="text-[#756b65] mt-2">Thử thay đổi bộ lọc.</p>
              <button onClick={handleReset} className="bg-ink text-white px-5 py-3 font-bold text-[13px] mt-4">
                Xem cửa hàng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

