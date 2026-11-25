import useProductStore from '../../store/productStore';

const FILTERS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'Áo thun', label: 'Áo thun' },
  { value: 'Áo sơ mi', label: 'Áo sơ mi' },
  { value: 'Quần', label: 'Quần' },
  { value: 'Áo khoác', label: 'Áo khoác' },
  { value: 'Phụ kiện', label: 'Phụ kiện' },
  { value: 'sale', label: 'Sale' },
];

export default function Filters() {
  const filter = useProductStore((s) => s.filter);
  const sort = useProductStore((s) => s.sort);
  const setFilter = useProductStore((s) => s.setFilter);
  const setSort = useProductStore((s) => s.setSort);

  return (
    <div className="flex gap-2 flex-wrap mb-6">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => setFilter(f.value)}
          className={`border px-4 py-2 text-xs transition-colors ${
            filter === f.value
              ? 'bg-ink text-white border-ink'
              : 'border-[#d5cdc5] hover:border-ink'
          }`}
        >
          {f.label}
        </button>
      ))}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="ml-auto border border-[#d5cdc5] px-2 py-2 text-xs bg-paper"
      >
        <option value="newest">Mới nhất</option>
        <option value="price_asc">Giá tăng dần</option>
        <option value="price_desc">Giá giảm dần</option>
      </select>
    </div>
  );
}

