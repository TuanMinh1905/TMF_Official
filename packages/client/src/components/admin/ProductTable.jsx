import { formatPrice } from '../../utils/format';

function safePrice(value) {
  if (value === null || value === undefined || value === '') return '—';
  return formatPrice(Number(value) || 0);
}

export default function ProductTable({ products = [] }) {
  if (!products.length) {
    return (
      <div className="bg-muted/60 border border-[#d8cfc6] p-8 text-center text-sm text-ink/70">
        Chưa có sản phẩm nào để hiển thị.
      </div>
    );
  }

  return (
    <div className="border border-[#d8cfc6] bg-paper overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[680px]">
        <thead>
          <tr className="bg-muted text-[11px] uppercase tracking-[1.2px] text-ink/80 border-b border-[#d8cfc6]">
            <th className="py-3 px-4 font-bold">Tên</th>
            <th className="py-3 px-4 font-bold">Loại</th>
            <th className="py-3 px-4 font-bold">Giá</th>
            <th className="py-3 px-4 font-bold">Giá cũ</th>
            <th className="py-3 px-4 font-bold">Kho</th>
            <th className="py-3 px-4 font-bold">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e6ddd4] text-sm">
          {products.map((product) => {
            const inStock = product.inStock !== false;
            const sizesLabel = Array.isArray(product.sizes) && product.sizes.length > 0
              ? product.sizes.join(', ')
              : 'One size';

            return (
              <tr key={product._id || product.name} className="hover:bg-muted/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: product.color || '#E6D6C3' }}
                      title={product.color}
                    />
                    <div>
                      <div className="font-bold text-ink">{product.name}</div>
                      {product.tag && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-accent">
                          {product.tag}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-ink/80">
                  <div>{product.type}</div>
                  <div className="text-xs text-ink/55">{product.gender || 'Unisex'}</div>
                </td>
                <td className="py-3.5 px-4 font-bold text-ink">
                  {safePrice(product.price)}
                </td>
                <td className="py-3.5 px-4 text-ink/55 line-through">
                  {product.oldPrice ? safePrice(product.oldPrice) : <span className="no-underline">—</span>}
                </td>
                <td className="py-3.5 px-4 text-xs text-ink/80">
                  <span className="font-semibold">Size:</span> {sizesLabel}
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`}
                      aria-hidden="true"
                    />
                    <span className={inStock ? 'text-green-700' : 'text-red-700'}>
                      {inStock ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
