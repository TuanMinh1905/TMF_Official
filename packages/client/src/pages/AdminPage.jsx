import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAdminStore from '../store/adminStore';
import StatCard from '../components/admin/StatCard';
import AdminNav from '../components/admin/AdminNav';
import OrderTable from '../components/admin/OrderTable';
import ProductTable from '../components/admin/ProductTable';
import SystemPanel from '../components/admin/SystemPanel';
import RuleButton from '../components/ui/RuleButton';
import { formatPrice } from '../utils/format';

const STATUS_BREAKDOWN = [
  { key: 'pending', label: 'Chờ xử lý', barClass: 'bg-yellow-500', dotClass: 'bg-yellow-500' },
  { key: 'processing', label: 'Đang xử lý', barClass: 'bg-blue-500', dotClass: 'bg-blue-500' },
  { key: 'completed', label: 'Hoàn thành', barClass: 'bg-green-600', dotClass: 'bg-green-600' },
  { key: 'cancelled', label: 'Đã hủy', barClass: 'bg-red-500', dotClass: 'bg-red-500' },
];

export default function AdminPage() {
  const {
    stats,
    orders,
    products,
    outbox,
    loading,
    activeTab,
    setActiveTab,
    fetchStats,
    fetchOrders,
    fetchProducts,
    fetchOutbox,
  } = useAdminStore();

  const refreshAll = () => {
    fetchStats();
    fetchOrders();
    fetchProducts();
    fetchOutbox();
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const totalProducts = stats?.totalProducts ?? products.length;
  const totalOrders = stats?.totalOrders ?? orders.length;
  const revenue = stats?.revenue ?? 0;
  const ordersByStatus = stats?.ordersByStatus || {
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
  };
  const completedOrders = ordersByStatus.completed ?? 0;

  const recentOrders = (
    stats?.recentOrders?.length ? stats.recentOrders : orders
  ).slice(0, 5);

  const displayOrders = orders.length > 0 ? orders : (stats?.recentOrders || []);
  const statusTotal = Object.values(ordersByStatus).reduce((sum, n) => sum + (Number(n) || 0), 0);

  return (
    <section className="relative px-[5.2%] pt-8 pb-20 min-h-[75vh] bg-paper text-ink">
      <RuleButton section="admin" />

      <div className="text-xs text-[#81736b] mb-5">
        <Link to="/" className="hover:underline">Trang chủ</Link>
        {' / '}
        <span>Admin</span>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4 mb-7 pr-8">
        <div>
          <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">
            TMF CONTROL CENTER
          </div>
          <h1 className="text-[clamp(28px,3.6vw,46px)] tracking-tight leading-tight font-bold mt-2">
            Admin Dashboard
          </h1>
          <p className="text-sm text-[#756b65] mt-1">
            Quản lý tổng quan, đơn hàng, sản phẩm và hạ tầng xử lý nền.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshAll}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-ink text-white px-4 py-2.5 text-xs font-bold tracking-wide hover:bg-accent transition-colors disabled:opacity-60"
        >
          <span>{loading ? 'Đang tải...' : '↻ Làm mới dữ liệu'}</span>
        </button>
      </div>

      <AdminNav activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon="👕"
              value={totalProducts}
              label="Tổng sản phẩm"
              trend="Catalog"
            />
            <StatCard
              icon="📦"
              value={totalOrders}
              label="Tổng đơn hàng"
              trend="Orders"
            />
            <StatCard
              icon="💰"
              value={formatPrice(Number(revenue) || 0)}
              label="Doanh thu"
              trend="VND"
            />
            <StatCard
              icon="✅"
              value={completedOrders}
              label="Đơn hoàn thành"
              trend={totalOrders > 0 ? `${Math.round((completedOrders / totalOrders) * 100)}%` : '0%'}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-ink">Đơn hàng gần đây (5 mới nhất)</h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-accent hover:underline"
                >
                  Xem tất cả →
                </button>
              </div>
              <OrderTable orders={recentOrders} compact />
            </div>

            <div className="bg-paper border border-[#d8cfc6] p-5 h-fit">
              <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">
                ORDER BREAKDOWN
              </div>
              <h2 className="text-base font-bold text-ink mt-1 mb-4">
                Đơn hàng theo trạng thái
              </h2>

              <div className="space-y-4">
                {STATUS_BREAKDOWN.map((item) => {
                  const count = Number(ordersByStatus[item.key]) || 0;
                  const pct = statusTotal > 0 ? Math.round((count / statusTotal) * 100) : 0;

                  return (
                    <div key={item.key}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="inline-flex items-center gap-2 font-semibold text-ink">
                          <span className={`w-2 h-2 rounded-full ${item.dotClass}`} />
                          {item.label}
                        </span>
                        <span className="font-bold text-ink">
                          {count} <span className="text-ink/55 font-normal">({pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted overflow-hidden">
                        <div
                          className={`h-full ${item.barClass} transition-all duration-300`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h2 className="text-base font-bold text-ink">
              Danh sách đơn hàng ({displayOrders.length})
            </h2>
            <span className="text-xs text-ink/60">
              Click vào tiêu đề cột để sắp xếp, click vào từng dòng để xem chi tiết.
            </span>
          </div>
          <OrderTable orders={displayOrders} />
        </div>
      )}

      {activeTab === 'products' && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h2 className="text-base font-bold text-ink">
              Danh sách sản phẩm ({products.length})
            </h2>
            <span className="text-xs text-ink/60">
              Trạng thái kho và bảng giá niêm yết (VND).
            </span>
          </div>
          <ProductTable products={products} />
        </div>
      )}

      {activeTab === 'system' && <SystemPanel outbox={outbox} />}
    </section>
  );
}
