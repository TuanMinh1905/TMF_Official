import GarmentSVG from '../svg/GarmentSVG';
import useProductStore from '../../store/productStore';
import useUiStore from '../../store/uiStore';
import { formatPrice } from '../../utils/format';

const BG_COLORS = ['#ebdfde', '#e2e5db', '#e1e5eb', '#ede7df'];

export default function ProductCard({ product, index }) {
  const favorites = useProductStore((s) => s.favorites);
  const toggleFavorite = useProductStore((s) => s.toggleFavorite);
  const openProductDetail = useUiStore((s) => s.openProductDetail);
  const isFav = favorites.has(product._id);

  return (
    <article className="relative min-w-0">
      <button
        onClick={() => toggleFavorite(product._id)}
        className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-paper text-xl flex items-center justify-center"
        aria-label="Yêu thích"
      >
        {isFav ? <span className="text-red-600">♥</span> : '♡'}
      </button>

      <button
        onClick={() => openProductDetail(product._id)}
        className="w-full text-left"
      >
        <div
          className="aspect-[4/5] flex items-center justify-center overflow-hidden relative"
          style={{ background: BG_COLORS[index % 4] }}
        >
          <GarmentSVG shape={product.shape} color={product.color} className="w-[85%] h-[85%]" />
          {product.tag && (
            <span className="absolute top-3 left-3 bg-paper px-2 py-1.5 text-[9px] font-bold tracking-wider">
              {product.tag}
            </span>
          )}
        </div>
        <h3 className="text-[15px] font-medium mt-3 mb-1 truncate">{product.name}</h3>
        <div className="text-[11px] text-[#787870]">
          {product.gender} · {product.shape === 'bag' ? 'Canvas' : 'Everyday fit'}
        </div>
        <div className="font-bold text-sm mt-2">
          {formatPrice(product.price)}
          {product.oldPrice && (
            <span className="font-normal line-through text-[#888] ml-2 text-xs">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
        <div className="flex gap-1.5 mt-2.5">
          {product.colors?.map((c, i) => (
            <i
              key={i}
              className="inline-block w-[17px] h-[17px] rounded-full border border-black/15"
              style={{ background: c }}
            />
          ))}
        </div>
      </button>
    </article>
  );
}

