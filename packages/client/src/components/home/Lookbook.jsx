import EditorialSVG from '../svg/EditorialSVG';
import RuleButton from '../ui/RuleButton';
import useProductStore from '../../store/productStore';

const LOOKS = [
  { eyebrow: 'LOOK 01 / OLIVE', title: 'Soft Layers', kind: 'olive', filter: 'look-olive' },
  { eyebrow: 'LOOK 02 / DENIM', title: 'City in Denim', kind: 'denim', filter: 'look-denim' },
  { eyebrow: 'LOOK 03 / ROSEWOOD', title: 'Slow Sunday', kind: 'rose', filter: 'look-rose' },
];

export default function Lookbook() {
  const setFilter = useProductStore((s) => s.setFilter);

  const handleSet = (filter) => {
    setFilter(filter);
    document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="lookbook" className="relative bg-[#f0eae3] px-[5.2%] pt-14 pb-14">
      <RuleButton section="lookbook" />
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-bold tracking-[2.4px] uppercase text-accent">
            02 / THE FORM JOURNAL
          </span>
          <h2 className="text-[clamp(30px,3.2vw,48px)] tracking-[-2px] leading-tight font-bold mt-2">
            Ways to wear.
          </h2>
          <p className="text-[13px] text-[#756b65] mt-2">Ba cách phối đồ, một tinh thần tự do.</p>
        </div>
        <span className="hidden md:inline text-[10px] tracking-[2px] text-accent">LOOKBOOK / 003</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
        {LOOKS.map((look) => (
          <article key={look.kind}>
            <div className="aspect-square md:aspect-[4/4.5] overflow-hidden">
              <EditorialSVG kind={look.kind} className="w-full h-full" />
            </div>
            <div className="p-4 pb-5 bg-paper relative">
              <span className="text-[11px] font-bold tracking-[2.4px] text-accent">{look.eyebrow}</span>
              <h3 className="text-2xl tracking-[-1px] mt-2 mb-4 font-bold">{look.title}</h3>
              <button
                onClick={() => handleSet(look.filter)}
                className="border-b border-ink pb-0.5 text-xs font-bold"
              >
                Mua theo set ↗
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

