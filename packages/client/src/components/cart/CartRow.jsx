import { Link } from 'react-router-dom';
import GarmentSVG from '../svg/GarmentSVG';
import { formatPrice } from '../../utils/format';

export default function CartRow({ item, onUpdateQty, onRemove }) {
  return (
    <article className="grid grid-cols-[110px_1fr_auto] gap-4 py-4 border-b border-[#ded5cc] items-start max-md:grid-cols-[76px_1fr]">
      <Link to={`/product/${item.productId}`} className="bg-[#e9ded5] aspect-[4/5]">
        <GarmentSVG shape={item.shape} color={item.color} className="w-full h-full" />
      </Link>

      <div>
        <Link to={`/product/${item.productId}`}>
          <h3 className="my-1 font-medium">{item.name}</h3>
        </Link>
        <p className="text-[13px] text-[#756b65]">{item.colorName} / {item.size}</p>
        <div className="inline-flex items-center border border-[#cbbfb5] mt-2">
          <button onClick={() => onUpdateQty(-1)} className="px-3 py-2">−</button>
          <span className="min-w-[20px] text-center text-sm">{item.qty}</span>
          <button onClick={() => onUpdateQty(1)} className="px-3 py-2">+</button>
        </div>
        <button onClick={onRemove} className="block text-xs underline text-[#756b65] mt-1 p-1">Xóa</button>
      </div>

      <strong className="max-md:col-start-2">{formatPrice(item.price * item.qty)}</strong>
    </article>
  );
}

