import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function SuccessPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try { setOrders(JSON.parse(localStorage.getItem('tmf-orders') || '[]')); } catch {}
  }, []);

  const latestOrder = orders[0];

  return (
    <div className="px-[5.2%] pt-9 pb-20 min-h-[65vh]">
      <div className="text-xs text-[#81736b] mb-6">
        <Link to="/" className="hover:underline">Trang chủ</Link> / Xác nhận đơn hàng
      </div>

      <div className="mb-8">
        <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">THANK YOU / FORM.</div>
        <h1 className="text-[clamp(32px,4.4vw,62px)] tracking-tight leading-tight font-bold mt-3">
          {latestOrder ? 'Cảm ơn bạn!' : 'Xác nhận đơn hàng'}
        </h1>
      </div>

      <div className="text-center bg-[#f1ebe4] p-14">
        <div className="text-[48px] text-[#829174]">✓</div>
        <h2 className="text-xl font-bold mt-3">
          {latestOrder ? 'Đặt hàng demo thành công' : 'Chưa có đơn hàng'}
        </h2>
        <p className="text-[#756b65] mt-2">
          {latestOrder ? `Mã đơn: #${latestOrder.id}` : 'Hãy thử quy trình thanh toán.'}
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Link to="/orders" className="bg-ink text-white px-5 py-3 font-bold text-[13px] hover:bg-accent transition-colors">
            Xem đơn hàng
          </Link>
          <Link to="/catalog" className="border border-[#bfb2a7] px-5 py-3 text-sm">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}

