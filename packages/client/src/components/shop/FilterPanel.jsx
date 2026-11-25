const CATEGORIES = [
  ['all', 'Tất cả'], ['new', 'Hàng mới'],
  ['Áo thun', 'Áo thun'], ['Áo sơ mi', 'Áo sơ mi'],
  ['Quần', 'Quần'], ['Áo khoác', 'Áo khoác'],
  ['Phụ kiện', 'Phụ kiện'], ['sale', 'Sale'],
];

const PRICES = [
  ['all', 'Tất cả'], ['low', 'Dưới 300.000₫'],
  ['mid', '300.000₫ – 500.000₫'], ['high', 'Trên 500.000₫'],
];

const COLORS = [
  ['#E6D6C3', 'Oat'], ['#927262', 'Cocoa'], ['#AAB59B', 'Olive'],
  ['#9EACC1', 'Denim'], ['#BA8E91', 'Rosewood'], ['#494748', 'Charcoal'],
];

export default function FilterPanel({ cat, setCat, priceRange, setPriceRange, colorFilter, setColorFilter, query, setQuery, onReset }) {
  return (
    <aside className="border-r border-[#e4d9d0] pr-5">
      <h3 className="flex items-center justify-between m-0 mb-3">
        Bộ lọc
        <button onClick={onReset} className="text-xs underline text-[#756b65]">Đặt lại</button>
      </h3>

      <input
        type="search"
        placeholder="Tìm sản phẩm..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2.5 border border-[#d6cbc1] bg-white text-sm"
      />

      <fieldset className="border-0 border-t border-[#ded6ce] mt-4 pt-4 p-0">
        <legend className="font-bold pr-2 text-[13px]">Danh mục</legend>
        {CATEGORIES.map(([value, label]) => (
          <label key={value} className="block my-2.5 text-[13px] cursor-pointer">
            <input
              type="radio" name="cat" value={value}
              checked={cat === value}
              onChange={() => setCat(value)}
              className="accent-accent mr-1.5"
            />
            {label}
          </label>
        ))}
      </fieldset>

      <fieldset className="border-0 border-t border-[#ded6ce] mt-4 pt-4 p-0">
        <legend className="font-bold pr-2 text-[13px]">Giá bán</legend>
        {PRICES.map(([value, label]) => (
          <label key={value} className="block my-2.5 text-[13px] cursor-pointer">
            <input
              type="radio" name="price" value={value}
              checked={priceRange === value}
              onChange={() => setPriceRange(value)}
              className="accent-accent mr-1.5"
            />
            {label}
          </label>
        ))}
      </fieldset>

      <fieldset className="border-0 border-t border-[#ded6ce] mt-4 pt-4 p-0">
        <legend className="font-bold pr-2 text-[13px]">Màu sắc</legend>
        <button
          onClick={() => setColorFilter('all')}
          className={`text-xs border px-2 py-1 mb-2 ${colorFilter === 'all' ? 'border-ink font-bold' : 'border-[#bfb2a7]'}`}
        >
          Tất cả
        </button>
        <div className="flex flex-wrap gap-2 mt-1">
          {COLORS.map(([hex, name]) => (
            <button
              key={hex}
              title={name}
              aria-label={name}
              onClick={() => setColorFilter(hex)}
              className="w-[19px] h-[19px] rounded-full border border-ink/25"
              style={{
                background: hex,
                outline: colorFilter === hex ? '1px solid #494748' : 'none',
                outlineOffset: '3px',
              }}
            />
          ))}
        </div>
      </fieldset>
    </aside>
  );
}

