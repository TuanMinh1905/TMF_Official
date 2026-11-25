import { useEffect } from 'react';
import useProductStore from '../../store/productStore';
import ProductCard from './ProductCard';
import Filters from './Filters';
import RuleButton from '../ui/RuleButton';

export default function ProductGrid() {
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const getFiltered = useProductStore((s) => s.getFiltered);
  const filter = useProductStore((s) => s.filter);
  const searchQuery = useProductStore((s) => s.searchQuery);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const products = getFiltered();

  const title = searchQuery
    ? 'Kết quả tìm kiếm'
    : filter === 'all'
    ? 'Mới lên kệ'
    : filter === 'sale'
    ? 'Ưu đãi'
    : filter === 'fav'
    ? 'Sản phẩm yêu thích'
    : filter;

  return (
    <section id="shop" className="relative px-[5.2%] pt-16 pb-10">
      <RuleButton section="shop" />
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-bold tracking-[2.4px] uppercase text-accent">
            03 / THE LATEST DROP
          </span>
          <h2 className="text-[clamp(30px,3.2vw,48px)] tracking-[-2px] leading-tight font-bold mt-2">
            {title}
          </h2>
          <p className="text-[13px] text-[#756b65] mt-1">{products.length} sản phẩm</p>
        </div>
        <button
          onClick={() => useProductStore.getState().setFilter('all')}
          className="text-xs font-bold underline underline-offset-4 whitespace-nowrap"
        >
          Tất cả sản phẩm ↗
        </button>
      </div>

      <Filters />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3.5 gap-y-6">
        {products.length > 0 ? (
          products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
        ) : (
          <div className="col-span-full text-[#777] py-10 text-center">
            Không có sản phẩm phù hợp.
          </div>
        )}
      </div>
    </section>
  );
}

