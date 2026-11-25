import { Link } from 'react-router-dom';
import EditorialSVG from '../components/svg/EditorialSVG';

const LOOKS = [
  { scene: 'olive', title: 'Soft Layers', kicker: 'LOOK 01 / OLIVE', desc: 'Những lớp áo mềm mại, màu olive và oat milk.' },
  { scene: 'denim', title: 'City in Denim', kicker: 'LOOK 02 / DENIM', desc: 'Sắc denim dịu nhẹ cho nhịp sống thành phố.' },
  { scene: 'rose', title: 'Slow Sunday', kicker: 'LOOK 03 / ROSEWOOD', desc: 'Rosewood và cocoa cho một ngày chậm rãi.' },
];

export default function LookbookPage() {
  return (
    <div className="px-[5.2%] pt-9 pb-20 min-h-[65vh]">
      <div className="text-xs text-[#81736b] mb-6">
        <Link to="/" className="hover:underline">Trang chủ</Link> / Lookbook
      </div>

      <div className="mb-8">
        <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">SEOUL EDIT / THE LOOKBOOK</div>
        <h1 className="text-[clamp(32px,4.4vw,62px)] tracking-tight leading-tight font-bold mt-3">
          Mặc theo cách của bạn.
        </h1>
        <p className="text-[#756b65] leading-relaxed max-w-[620px]">
          Ba câu chuyện về sắc màu, chất liệu và những ngày thường tại Seoul.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {LOOKS.map((look, i) => (
          <article key={i} className="bg-muted">
            <div className="aspect-[4/4.5] overflow-hidden">
              <EditorialSVG scene={look.scene} className="w-full h-full" />
            </div>
            <div className="p-5 bg-paper">
              <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">{look.kicker}</div>
              <h3 className="text-[24px] tracking-tight font-bold my-2">{look.title}</h3>
              <p className="text-[#756b65] leading-relaxed mb-4">{look.desc}</p>
              <Link
                to="/catalog"
                className="inline-block bg-ink text-white px-4 py-3.5 font-bold text-[13px] hover:bg-accent transition-colors"
              >
                Mua theo outfit ↗
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
