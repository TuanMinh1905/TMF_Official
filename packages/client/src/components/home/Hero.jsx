import EditorialSVG from '../svg/EditorialSVG';
import RuleButton from '../ui/RuleButton';
import useProductStore from '../../store/productStore';

export default function Hero() {
  const setFilter = useProductStore((s) => s.setFilter);

  const scrollToShop = () => {
    setFilter('all');
    document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="top" className="relative mx-[3.5%] grid grid-cols-1 md:grid-cols-[42%_58%] bg-hero overflow-hidden">
      <RuleButton section="hero" />
      <div className="flex flex-col items-start justify-center px-[7%] py-10 md:px-[12%] md:py-14 relative z-10">
        <span className="text-[11px] font-bold tracking-[2.4px] uppercase text-accent">
          THE EVERYDAY EDIT — VOL. 03
        </span>
        <h1 className="text-[clamp(45px,5.3vw,84px)] leading-[0.98] tracking-[-0.066em] font-bold mt-5 mb-5 text-[#393638] whitespace-pre-line">
          {'Dress easy.\nFeel like you.'}
        </h1>
        <p className="text-[15px] leading-relaxed text-[#5e5551] max-w-[310px] mb-7">
          Những gam màu dịu, phom dáng tự do. Tủ đồ unisex cho những ngày bình thường nhưng không nhàm chán.
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={scrollToShop}
            className="bg-ink text-white py-[15px] px-5 font-bold text-[13px] inline-flex items-center gap-5 hover:bg-accent transition-colors"
          >
            Mua sắm ngay <span>↗</span>
          </button>
          <a
            href="#lookbook"
            className="text-xs font-bold underline underline-offset-4"
          >
            Xem lookbook ↘
          </a>
        </div>
        <div className="absolute bottom-5 text-[10px] tracking-[2px] text-[#756357]">
          03 &nbsp;/&nbsp; SEOUL EARTH
        </div>
      </div>
      <div className="relative min-h-[300px] md:min-h-[530px] bg-[#c6b9a7] overflow-hidden">
        <EditorialSVG kind="hero" className="w-full h-full object-cover" />
        <span className="absolute bottom-4 right-4 text-ink text-[10px] tracking-[2px] bg-paper/75 px-2 py-1.5">
          LOOK 01 / 02 · ILLUSTRATION
        </span>
      </div>
    </section>
  );
}

