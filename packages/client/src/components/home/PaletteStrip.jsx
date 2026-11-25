const CHIPS = [
  ['Oat', '#E6D6C3'],
  ['Cocoa', '#927262'],
  ['Olive', '#AAB59B'],
  ['Denim', '#9EACC1'],
  ['Rosewood', '#BA8E91'],
  ['Charcoal', '#494748'],
];

export default function PaletteStrip() {
  return (
    <div className="hidden md:flex mx-[3.5%] border-b border-[#d4c9bf] px-4 py-5 items-center justify-between flex-wrap gap-4">
      <strong className="text-[10px] tracking-[1.4px]">THE COLORS OF EVERYDAY</strong>
      <div className="flex gap-3 flex-wrap flex-1 justify-center">
        {CHIPS.map(([name, color]) => (
          <span key={name} className="flex items-center gap-1.5 text-[11px] whitespace-nowrap">
            <i className="inline-block w-5 h-5 rounded-full border border-black/10" style={{ background: color }} />
            {name}
          </span>
        ))}
      </div>
      <small className="text-[#666] text-[11px]">Seoul Earth / 06 shades</small>
    </div>
  );
}

