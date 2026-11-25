import GarmentSVG from '../svg/GarmentSVG';
import RuleButton from '../ui/RuleButton';
import useProductStore from '../../store/productStore';

const CATS = [
  { label: 'Áo thun', filter: 'Áo thun', shape: 'tee', color: '#BA8E91', bg: '#e7d8d1' },
  { label: 'Áo sơ mi', filter: 'Áo sơ mi', shape: 'shirt', color: '#AAB59B', bg: '#dce1d4' },
  { label: 'Quần', filter: 'Quần', shape: 'jeans', color: '#9EACC1', bg: '#dfe3ea' },
  { label: 'Áo khoác', filter: 'Áo khoác', shape: 'cardigan', color: '#E6D6C3', bg: '#e9e0d4' },
];

export default function Categories() {
  const setFilter = useProductStore((s) => s.setFilter);

  const handleClick = (filter) => {
    setFilter(filter);
    document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative px-[5.2%] pt-16 pb-10">
      <RuleButton section="categories" />
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-bold tracking-[2.4px] uppercase text-accent">
            01 / THE ESSENTIALS
          </span>
          <h2 className="text-[clamp(30px,3.2vw,48px)] tracking-[-2px] leading-tight font-bold mt-2">
            Everyday staples.
          </h2>
          <p className="text-[13px] text-[#756b65] mt-2">Những món đồ dễ mặc, dễ phối.</p>
        </div>
        <button
          onClick={() => handleClick('all')}
          className="text-xs font-bold underline underline-offset-4 whitespace-nowrap"
        >
          Tất cả danh mục ↗
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CATS.map((cat) => (
          <button
            key={cat.label}
            onClick={() => handleClick(cat.filter)}
            className="text-left"
          >
            <div
              className="aspect-[1.6] flex items-center justify-center overflow-hidden"
              style={{ background: cat.bg }}
            >
              <GarmentSVG shape={cat.shape} color={cat.color} className="w-[80%] h-[80%] scale-90" />
            </div>
            <strong className="flex justify-between py-3 text-[15px] font-medium border-b border-black/15">
              {cat.label} <span>↗</span>
            </strong>
          </button>
        ))}
      </div>
    </section>
  );
}

