export default function SizeSelector({ sizes, selected, onChange }) {
  return (
    <div className="flex gap-2 mt-2.5 mb-5">
      {sizes.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`min-w-[48px] h-[42px] px-2.5 border text-sm transition-colors ${
            selected === s
              ? 'bg-ink text-white border-ink'
              : 'border-[#ccc] hover:border-ink'
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

