import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrderCard from '../components/account/OrderCard';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try { setOrders(JSON.parse(localStorage.getItem('tmf-orders') || '[]')); } catch {}
  }, []);

  return (
    <div className="px-[5.2%] pt-9 pb-20 min-h-[65vh]">
      <div className="text-xs text-[#81736b] mb-6">
        <Link to="/" className="hover:underline">Trang chủ</Link>
        {' / '}<Link to="/account" className="hover:underline">Tài khoản</Link> / Đơn hàng
      </div>

      <div className="mb-8">
        <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">MY ORDERS</div>
        <h1 className="text-[clamp(32px,4.4vw,62px)] tracking-tight leading-tight font-bold mt-3">
          Đơn hàng của tôi
        </h1>
        <p className="text-[#756b65]">Theo dõi quá trình xử lý và giao hàng.</p>
      </div>

      <div className="bg-[#e1e5da] p-3.5 text-[13px] leading-relaxed mb-5">
        Các trạng thái dưới đây là minh họa, không kết nối đơn vị vận chuyển.
      </div>

      {orders.length > 0 ? (
        orders.map((order, i) => <OrderCard key={i} order={order} />)
      ) : (
        <div className="text-center bg-[#f1ebe4] p-14">
          <h2 className="text-xl font-bold">Chưa có đơn hàng</h2>
          <p className="text-[#756b65] mt-2">Hãy thử đặt một đơn hàng demo để xem giao diện theo dõi.</p>
          <Link to="/catalog" className="inline-block bg-ink text-white px-5 py-3 font-bold text-[13px] mt-4">
            Khám phá sản phẩm
          </Link>
        </div>
      )}
    </div>
  );
}
