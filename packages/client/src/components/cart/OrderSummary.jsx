import { useState } from 'react';
import { formatPrice } from '../../utils/format';

export default function OrderSummary({
  subtotal, shipping, discount, total,
  showItems = false, items = [],
  showCoupon = false, onApplyCoupon, couponApplied = false,
  children,
}) {
  const [code, setCode] = useState(couponApplied ? 'FORM10' : '');

  const handleCoupon = (e) => {
    e.preventDefault();
    onApplyCoupon?.(code.trim().toUpperCase());
  };

  return (
    <aside className="bg-muted p-6">
      <h2 className="text-[25px] tracking-tight mt-0 mb-4 font-bold">Tóm tắt đơn hàng</h2>

      {showItems && items.map((item, i) => (
        <div key={i} className="flex justify-between gap-2.5 my-4 text-sm">
          <span>{item.name} × {item.qty}</span>
          <b>{formatPrice(item.price * item.qty)}</b>
        </div>
      ))}

      <div className="flex justify-between gap-2.5 my-4 text-sm">
        <span>Tạm tính</span>
        <b>{formatPrice(subtotal)}</b>
      </div>
      <div className="flex justify-between gap-2.5 my-4 text-sm">
        <span>Giao hàng (dự kiến)</span>
        <span>{shipping ? formatPrice(shipping) : 'Miễn phí'}</span>
      </div>
      <div className="flex justify-between gap-2.5 my-4 text-sm">
        <span>Giảm giá</span>
        <span>−{formatPrice(discount)}</span>
      </div>
      <div className="flex justify-between gap-2.5 border-t border-[#cfc2b7] pt-4 text-[19px] font-bold">
        <span>Tổng cộng</span>
        <span>{formatPrice(total)}</span>
      </div>

      {showCoupon && (
        <>
          <form onSubmit={handleCoupon} className="flex gap-2 mt-4">
            <input
              aria-label="Mã ưu đãi"
              placeholder="Mã ưu đãi"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 min-w-0 border border-[#d8cfc6] bg-white p-3 text-sm"
            />
            <button className="border border-[#bfb2a7] px-4 py-3 text-sm">Áp dụng</button>
          </form>
          <p className="text-xs text-[#756b65] leading-relaxed mt-2">Thử mã FORM10 để giảm 10%.</p>
        </>
      )}

      {children}
    </aside>
  );
}

