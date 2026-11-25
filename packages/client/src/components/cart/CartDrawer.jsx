import useCartStore from '../../store/cartStore';
import useUiStore from '../../store/uiStore';
import GarmentSVG from '../svg/GarmentSVG';
import Modal from '../ui/Modal';
import { formatPrice } from '../../utils/format';

export default function CartDrawer() {
  const { items, isOpen, toggleDrawer, updateQty, removeItem, clearCart } = useCartStore();
  const showToast = useUiStore((s) => s.showToast);

  const totalAmount = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <Modal isOpen={isOpen} onClose={toggleDrawer}>
      <h2 className="text-2xl font-bold mb-4">
        Giỏ hàng ({items.reduce((s, i) => s + i.qty, 0)})
      </h2>

      {items.length === 0 ? (
        <p className="text-[#777] py-8">Giỏ hàng đang trống.</p>
      ) : (
        <>
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="grid grid-cols-[76px_1fr_auto] gap-4 items-center py-3 border-b border-[#ddd]"
            >
              <div className="aspect-square bg-muted flex items-center justify-center">
                <GarmentSVG shape={item.shape} color={item.color} className="w-full h-full" />
              </div>
              <div>
                <strong className="text-sm">{item.name}</strong>
                <p className="text-xs text-[#666] mt-1">
                  Size: {item.size} · {formatPrice(item.price)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
                    className="border border-[#ddd] px-2 py-0.5 text-sm"
                  >
                    −
                  </button>
                  <span className="text-sm">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
                    className="border border-[#ddd] px-2 py-0.5 text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
              <strong className="text-sm">{formatPrice(item.price * item.qty)}</strong>
            </div>
          ))}

          <h3 className="text-lg font-bold mt-4 mb-4">Tạm tính: {formatPrice(totalAmount)}</h3>
          <button
            onClick={() => showToast('Prototype: chưa kết nối thanh toán thật')}
            className="w-full bg-ink text-white py-4 font-bold text-[13px] hover:bg-accent transition-colors"
          >
            Thanh toán thử →
          </button>
        </>
      )}
    </Modal>
  );
}

