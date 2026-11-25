import { Link } from 'react-router-dom';
import GarmentSVG from '../svg/GarmentSVG';
import useProductStore from '../../store/productStore';
import { formatPrice } from '../../utils/format';

const BG = ['#ebdfde', '#e2e5db', '#e1e5eb', '#e9e0d4'];

export default function ProductVCard({ product, index }) {
  const favorites = useProductStore((s) => s.favorites);
  const toggleFavorite = useProductStore((s) => s.toggleFavorite);
  const isFav = favorites.has(product._id);

  return (
    <article className="relative min-w-0">
      <button
        onClick={() => toggleFavorite(product._id)}
        className="absolute right-2 top-2 bg-paper rounded-full w-[34px] h-[34px] text-[21px] z-10 flex items-center justify-center"
        aria-label={`Yêu thích ${product.name}`}
      >
        {isFav ? <span className="text-red-600">♥</span> : '♡'}
      </button>

      <Link
        to={`/product/${product._id}`}
        className="block aspect-[4/5] flex items-center justify-center overflow-hidden"
        style={{ background: BG[index % 4] }}
      >
        <GarmentSVG shape={product.shape} color={product.color} className="w-full h-full" />
      </Link>

      {product.tag && (
        <span className="absolute top-2.5 left-2.5 bg-paper px-2 py-1 text-[10px] font-bold tracking-wide">
          {product.tag}
        </span>
      )}

      <Link to={`/product/${product._id}`}>
        <h3 className="font-medium my-2 text-[15px]">{product.name}</h3>
      </Link>
      <p className="text-xs text-[#766d64]">{product.gender} · {product.type}</p>
      <div className="font-bold text-sm mt-1">
        {formatPrice(product.price)}
        {product.oldPrice && (
          <span className="font-normal line-through text-[#897e75] ml-2 text-[13px]">
            {formatPrice(product.oldPrice)}
          </span>
        )}
      </div>
      <div className="flex gap-1.5 mt-2">
        {product.colors?.map((c, i) => (
          <i
            key={i}
            className="inline-block w-[19px] h-[19px] rounded-full border border-ink/25"
            style={{ background: c }}
          />
        ))}
      </div>
    </article>
  );
}

