import { formatPrice } from '../../utils/format';

const STEPS = ['✓ Đặt hàng', 'Đóng gói', 'Đang giao', 'Đã nhận'];

export default function OrderCard({ order }) {
  return (
    <article className="border border-[#d8cfc6] p-5 mb-3.5">
      <div className="flex items-center justify-between gap-5">
        <div>
          <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">ORDER / {order.date}</div>
          <h2 className="text-[25px] tracking-tight font-bold">#{order.id}</h2>
        </div>
        <span className="inline-block bg-[#dce3d3] px-2.5 py-1.5 text-xs">Đã xác nhận</span>
      </div>

      <div className="grid grid-cols-4 gap-1 my-6 max-md:grid-cols-2">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className={`border-t-[3px] pt-3 px-1 text-xs ${
              i === 0 ? 'border-[#829174] font-bold' : 'border-[#d4c8bb]'
            }`}
          >
            {step}
          </div>
        ))}
      </div>

      {order.items.map((item, i) => (
        <p key={i} className="text-sm my-1">{item.name} · {item.size} × {item.qty}</p>
      ))}

      <div className="flex justify-between border-t border-[#ddd3c9] pt-4 mt-4 text-[19px] font-bold">
        <span>Tổng tiền</span>
        <span>{formatPrice(order.total)}</span>
      </div>
    </article>
  );
}

