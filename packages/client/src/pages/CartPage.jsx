import { useState } from 'react';
import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useUiStore from '../store/uiStore';
import CartRow from '../components/cart/CartRow';
import OrderSummary from '../components/cart/OrderSummary';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const showToast = useUiStore((s) => s.showToast);
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = getSubtotal();
  const shipping = subtotal >= 699000 || !items.length ? 0 : 30000;
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;

  const handleCoupon = (code) => {
    const applied = code === 'FORM10';
    setCouponApplied(applied);
    showToast(applied ? 'Đã áp dụng FORM10' : 'Mã ưu đãi không hợp lệ');
  };

  return (
    <div className="px-[5.2%] pt-9 pb-20 min-h-[65vh]">
      <div className="text-xs text-[#81736b] mb-6">
        <Link to="/" className="hover:underline">Trang chủ</Link> / Giỏ hàng
      </div>

      <div className="mb-8">
        <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">YOUR BAG</div>
        <h1 className="text-[clamp(32px,4.4vw,62px)] tracking-tight leading-tight font-bold mt-3">Giỏ hàng</h1>
        <p className="text-[#756b65]">{items.reduce((s, i) => s + i.qty, 0)} sản phẩm trong giỏ hàng của bạn.</p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_0.8fr] gap-10 items-start">
          <div>
            {items.map((item, i) => (
              <CartRow
                key={i}
                item={item}
                onUpdateQty={(delta) => updateQty(i, delta)}
                onRemove={() => removeItem(i)}
              />
            ))}
            <p className="mt-4">
              <Link to="/catalog" className="text-xs underline text-[#756b65]">← Tiếp tục mua sắm</Link>
            </p>
          </div>

          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            discount={discount}
            total={total}
            showCoupon
            onApplyCoupon={handleCoupon}
            couponApplied={couponApplied}
          >
            <Link
              to="/checkout"
              className="block w-full bg-ink text-white py-4 font-bold text-[13px] text-center mt-4 hover:bg-accent transition-colors"
            >
              Tiến hành thanh toán ↗
            </Link>
          </OrderSummary>
        </div>
      ) : (
        <div className="text-center bg-[#f1ebe4] p-14">
          <h2 className="text-xl font-bold">Giỏ hàng đang trống</h2>
          <p className="text-[#756b65] mt-2">Tìm những món đồ bạn thích và thêm vào giỏ.</p>
          <Link to="/catalog" className="inline-block bg-ink text-white px-5 py-3 font-bold text-[13px] mt-4">
            Khám phá sản phẩm
          </Link>
        </div>
      )}
    </div>
  );
}
