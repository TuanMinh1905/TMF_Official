import { Fragment, useMemo, useState } from 'react';
import { formatPrice } from '../../utils/format';

const STATUS_META = {
  pending: {
    label: 'Chờ xử lý',
    badgeClass: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  },
  processing: {
    label: 'Đang xử lý',
    badgeClass: 'bg-blue-100 text-blue-800 border border-blue-300',
  },
  completed: {
    label: 'Hoàn thành',
    badgeClass: 'bg-green-100 text-green-800 border border-green-300',
  },
  cancelled: {
    label: 'Đã hủy',
    badgeClass: 'bg-red-100 text-red-800 border border-red-300',
  },
};

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function safePrice(amount) {
  return formatPrice(Number(amount) || 0);
}

export default function OrderTable({ orders = [], compact = false }) {
  const [expandedId, setExpandedId] = useState(null);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (field) => {
    if (compact) return;
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sortedOrders = useMemo(() => {
    const list = [...orders];
    if (compact) return list;

    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'createdAt') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (sortField === 'totalAmount') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else {
        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [orders, compact, sortField, sortDir]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const renderSortIcon = (field) => {
    if (compact) return null;
    if (sortField !== field) return <span className="text-ink/30 ml-1">↕</span>;
    return <span className="text-accent ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  if (!sortedOrders.length) {
    return (
      <div className="bg-muted/60 border border-[#d8cfc6] p-8 text-center text-sm text-ink/70">
        Chưa có đơn hàng nào trong hệ thống.
      </div>
    );
  }

  return (
    <div className="border border-[#d8cfc6] bg-paper overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[640px]">
        <thead>
          <tr className="bg-muted text-[11px] uppercase tracking-[1.2px] text-ink/80 border-b border-[#d8cfc6]">
            <th
              onClick={() => handleSort('orderNumber')}
              className={`py-3 px-4 font-bold ${!compact ? 'cursor-pointer hover:text-accent select-none' : ''}`}
            >
              Mã đơn{renderSortIcon('orderNumber')}
            </th>
            <th
              onClick={() => handleSort('customerName')}
              className={`py-3 px-4 font-bold ${!compact ? 'cursor-pointer hover:text-accent select-none' : ''}`}
            >
              Khách hàng{renderSortIcon('customerName')}
            </th>
            <th
              onClick={() => handleSort('totalAmount')}
              className={`py-3 px-4 font-bold ${!compact ? 'cursor-pointer hover:text-accent select-none' : ''}`}
            >
              Tổng tiền{renderSortIcon('totalAmount')}
            </th>
            <th
              onClick={() => handleSort('status')}
              className={`py-3 px-4 font-bold ${!compact ? 'cursor-pointer hover:text-accent select-none' : ''}`}
            >
              Trạng thái{renderSortIcon('status')}
            </th>
            <th
              onClick={() => handleSort('createdAt')}
              className={`py-3 px-4 font-bold ${!compact ? 'cursor-pointer hover:text-accent select-none' : ''}`}
            >
              Ngày tạo{renderSortIcon('createdAt')}
            </th>
            <th className="py-3 px-4 font-bold text-right">Chi tiết</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e6ddd4] text-sm">
          {sortedOrders.map((order) => {
            const rowId = order._id || order.orderNumber;
            const isExpanded = expandedId === rowId;
            const statusInfo = STATUS_META[order.status] || {
              label: order.status || 'N/A',
              badgeClass: 'bg-muted text-ink border border-[#d8cfc6]',
            };

            return (
              <Fragment key={rowId}>
                <tr
                  onClick={() => toggleExpand(rowId)}
                  className="hover:bg-muted/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-ink">
                    #{order.orderNumber || rowId}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-ink">{order.customerName || 'Khách vãng lai'}</div>
                    {order.customerEmail && (
                      <div className="text-xs text-ink/60">{order.customerEmail}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-ink">
                    {safePrice(order.totalAmount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusInfo.badgeClass}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-ink/75">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-xs font-bold text-accent">
                    {isExpanded ? 'Thu gọn ▲' : 'Xem ▼'}
                  </td>
                </tr>

                {isExpanded && (
                  <tr className="bg-muted/30">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="bg-paper border border-[#e6ddd4] p-3">
                          <div className="uppercase tracking-wider text-accent font-bold mb-1.5">
                            Thông tin khách hàng
                          </div>
                          <p><span className="text-ink/60">Tên:</span> {order.customerName || '—'}</p>
                          <p><span className="text-ink/60">Email:</span> {order.customerEmail || '—'}</p>
                          <p><span className="text-ink/60">SĐT:</span> {order.customerPhone || '—'}</p>
                        </div>

                        <div className="md:col-span-2 bg-paper border border-[#e6ddd4] p-3">
                          <div className="uppercase tracking-wider text-accent font-bold mb-1.5">
                            Sản phẩm trong đơn ({order.items?.length || 0})
                          </div>
                          {order.items?.length ? (
                            <ul className="divide-y divide-[#eee7df]">
                              {order.items.map((item, idx) => (
                                <li key={idx} className="py-1.5 flex items-center justify-between gap-3">
                                  <span>
                                    <span className="font-semibold">{item.name}</span>
                                    <span className="text-ink/60"> · Size {item.size || 'Free'} × {item.qty}</span>
                                  </span>
                                  <span className="font-bold">
                                    {safePrice((Number(item.price) || 0) * (Number(item.qty) || 1))}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-ink/60">Không có dữ liệu chi tiết sản phẩm.</p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
