import useUiStore from '../../store/uiStore';
import useProductStore from '../../store/productStore';
import useCartStore from '../../store/cartStore';
import GarmentSVG from '../svg/GarmentSVG';
import SizeSelector from './SizeSelector';
import Modal from '../ui/Modal';
import { formatPrice } from '../../utils/format';
import { useState } from 'react';

export default function ProductDetail() {
  const productDetailId = useUiStore((s) => s.productDetailId);
  const closeProductDetail = useUiStore((s) => s.closeProductDetail);
  const showToast = useUiStore((s) => s.showToast);
  const products = useProductStore((s) => s.products);
  const addItem = useCartStore((s) => s.addItem);

  const product = products.find((p) => p._id === productDetailId);
  const [selectedSize, setSelectedSize] = useState('M');

  if (!product) return null;

  const sizes = product.sizes || (product.shape === 'bag' ? ['One size'] : ['S', 'M', 'L', 'XL']);

  const handleAdd = () => {
    addItem(product, selectedSize, 1);
    closeProductDetail();
    showToast('Đã thêm vào giỏ hàng');
  };

  return (
    <Modal isOpen={!!productDetailId} onClose={closeProductDetail}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square flex items-center justify-center bg-muted">
          <GarmentSVG shape={product.shape} color={product.color} className="w-[80%] h-[80%]" />
        </div>
        <div>
          <span className="text-[11px] font-bold tracking-[2.4px] text-accent uppercase">
            TMF / {product.type}
          </span>
          <h2 className="text-[28px] font-bold mt-3 mb-2">{product.name}</h2>
          <div className="text-[22px] font-bold mb-4">
            {formatPrice(product.price)}
            {product.oldPrice && (
              <span className="font-normal line-through text-[#888] ml-3 text-base">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <p className="text-[#666] leading-relaxed mb-6">
            {product.description || 'Thiết kế dễ phối, phom dáng thoải mái. Thông tin sản phẩm mẫu dùng để thử trải nghiệm mua sắm.'}
          </p>
          <strong className="text-sm">Chọn kích cỡ</strong>
          <SizeSelector
            sizes={sizes}
            selected={selectedSize}
            onChange={setSelectedSize}
          />
          <button
            onClick={handleAdd}
            className="w-full bg-ink text-white py-4 font-bold text-[13px] mt-4 hover:bg-accent transition-colors"
          >
            Thêm vào giỏ hàng →
          </button>
          <p className="text-sm text-[#666] mt-4">
            Giao hàng toàn quốc · Đổi trả 14 ngày (minh họa)
          </p>
        </div>
      </div>
    </Modal>
  );
}

