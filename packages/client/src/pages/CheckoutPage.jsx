import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useUiStore from '../store/uiStore';
import OrderSummary from '../components/cart/OrderSummary';
import { formatPrice } from '../utils/format';

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const showToast = useUiStore((s) => s.showToast);
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const shipping = subtotal >= 699000 || !items.length ? 0 : 30000;
  const total = subtotal + shipping;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!items.length) return;

    const order = {
      id: 'FM' + Date.now().toString().slice(-8),
      date: new Date().toLocaleDateString('vi-VN'),
      items: items.map((x) => ({ ...x })),
      total,
    };

    try {
      const existing = JSON.parse(localStorage.getItem('tmf-orders') || '[]');
      existing.unshift(order);
      localStorage.setItem('tmf-orders', JSON.stringify(existing));
    } catch {}

    clearCart();
    navigate('/success');
  };

  if (!items.length) {
    return (
      <div className="px-[5.2%] pt-9 pb-20 min-h-[65vh]">
        <div className="text-center bg-[#f1ebe4] p-14 mt-10">
          <h2 className="text-xl font-bold">Chưa có sản phẩm</h2>
          <p className="text-[#756b65] mt-2">Vui lòng thêm sản phẩm trước khi thanh toán.</p>
          <Link to="/catalog" className="inline-block bg-ink text-white px-5 py-3 font-bold text-[13px] mt-4">
            Khám phá sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-[5.2%] pt-9 pb-20 min-h-[65vh]">
      <div className="text-xs text-[#81736b] mb-6">
        <Link to="/" className="hover:underline">Trang chủ</Link>
        {' / '}<Link to="/cart" className="hover:underline">Giỏ hàng</Link> / Thanh toán
      </div>

      <div className="mb-8">
        <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">CHECKOUT / 01</div>
        <h1 className="text-[clamp(32px,4.4vw,62px)] tracking-tight leading-tight font-bold mt-3">Thanh toán</h1>
        <p className="text-[#756b65] leading-relaxed max-w-[620px]">
          Thông tin giao hàng và phương thức thanh toán.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_0.8fr] gap-10 items-start">
        <form onSubmit={handleSubmit}>
          {/* Panel 1 */}
          <div className="border border-[#ded5cc] p-6 mb-5">
            <h2 className="text-[25px] tracking-tight font-bold mt-0 mb-4">01 / Thông tin liên hệ</h2>
            <label className="flex flex-col gap-1.5 mb-4 text-[13px] font-semibold">
              Họ và tên
              <input name="name" type="text" required className="border border-[#d8cfc6] bg-white p-3 text-ink w-full font-normal" />
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5 mb-4 text-[13px] font-semibold">
                Email
                <input name="email" type="email" required className="border border-[#d8cfc6] bg-white p-3 text-ink w-full font-normal" />
              </label>
              <label className="flex flex-col gap-1.5 mb-4 text-[13px] font-semibold">
                Số điện thoại
                <input name="phone" type="tel" required className="border border-[#d8cfc6] bg-white p-3 text-ink w-full font-normal" />
              </label>
            </div>
          </div>

          {/* Panel 2 */}
          <div className="border border-[#ded5cc] p-6 mb-5">
            <h2 className="text-[25px] tracking-tight font-bold mt-0 mb-4">02 / Địa chỉ giao hàng</h2>
            <label className="flex flex-col gap-1.5 mb-4 text-[13px] font-semibold">
              Tỉnh / Thành phố
              <input name="city" type="text" required className="border border-[#d8cfc6] bg-white p-3 text-ink w-full font-normal" />
            </label>
            <label className="flex flex-col gap-1.5 mb-4 text-[13px] font-semibold">
              Phường / Xã
              <input name="ward" type="text" required className="border border-[#d8cfc6] bg-white p-3 text-ink w-full font-normal" />
            </label>
            <label className="flex flex-col gap-1.5 mb-4 text-[13px] font-semibold">
              Số nhà, tên đường
              <input name="address" type="text" required className="border border-[#d8cfc6] bg-white p-3 text-ink w-full font-normal" />
            </label>
            <label className="flex flex-col gap-1.5 mb-4 text-[13px] font-semibold">
              Ghi chú (không bắt buộc)
              <textarea name="note" rows="3" className="border border-[#d8cfc6] bg-white p-3 text-ink w-full font-normal" />
            </label>
            <div className="bg-[#e1e5da] p-3.5 text-[13px] leading-relaxed">
              Giao hàng tiêu chuẩn · dự kiến 2–5 ngày (demo)
            </div>
          </div>

          {/* Panel 3 */}
          <div className="border border-[#ded5cc] p-6 mb-5">
            <h2 className="text-[25px] tracking-tight font-bold mt-0 mb-4">03 / Thanh toán</h2>
            <label className="block border border-[#d8cec4] p-3.5 my-2.5 text-sm cursor-pointer">
              <input type="radio" name="payment" value="COD" defaultChecked className="accent-accent mr-2" />
              Thanh toán khi nhận hàng (COD)
            </label>
            <label className="block border border-[#d8cec4] p-3.5 my-2.5 text-sm cursor-pointer">
              <input type="radio" name="payment" value="transfer" className="accent-accent mr-2" />
              Chuyển khoản (mô phỏng)
            </label>
          </div>

          <button type="submit" className="w-full bg-ink text-white py-4 font-bold text-[13px] hover:bg-accent transition-colors">
            Xác nhận đặt hàng demo ↗
          </button>
          <p className="text-xs text-[#756b65] leading-relaxed mt-3">
            Chỉ nhập thông tin giả lập để thử thiết kế. Không có giao dịch thật.
          </p>
        </form>

        <OrderSummary
          subtotal={subtotal}
          shipping={shipping}
          discount={0}
          total={total}
          showItems
          items={items}
        >
          <p className="text-xs text-[#756b65] leading-relaxed mt-3">
            Đây là đơn hàng mô phỏng, không phát sinh thanh toán thật.
          </p>
        </OrderSummary>
      </div>
    </div>
  );
}
