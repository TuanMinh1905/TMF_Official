const TABS = [
  { id: 'overview', label: 'Tổng quan', icon: '📊' },
  { id: 'orders', label: 'Đơn hàng', icon: '📦' },
  { id: 'products', label: 'Sản phẩm', icon: '👕' },
  { id: 'system', label: 'Hệ thống', icon: '⚙️' },
];

export default function AdminNav({ activeTab, onTabChange }) {
  return (
    <nav
      aria-label="Admin tabs"
      className="flex flex-wrap gap-2 border-b border-[#d8cfc6] pb-3 mb-6"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-bold transition-colors border ${
              isActive
                ? 'bg-accent text-white border-accent'
                : 'bg-paper text-ink border-[#d8cfc6] hover:bg-muted'
            }`}
          >
            <span aria-hidden="true">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
