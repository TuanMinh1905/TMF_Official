import { useState } from 'react';
import { SECTION_RULES } from '../../data/rules';

export default function RuleButton({ section }) {
  const [open, setOpen] = useState(false);
  const rule = SECTION_RULES[section];
  if (!rule) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-ink/10 hover:bg-ink/20 flex items-center justify-center text-xs font-bold text-ink/60 transition-colors"
        title="Xem quy tắc"
      >
        ?
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-5"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-xl w-7 h-7 flex items-center justify-center hover:bg-muted rounded-full"
            >
              ×
            </button>
            <h3 className="font-bold text-lg mb-2 pr-8">📖 {rule.title}</h3>
            <p className="text-sm text-[#666] mb-4 leading-relaxed">{rule.purpose}</p>
            <strong className="text-xs tracking-wider uppercase text-accent">Cách sử dụng:</strong>
            <ol className="mt-2 space-y-2">
              {rule.steps.map((step, i) => (
                <li key={i} className="text-sm text-[#555] flex gap-2">
                  <span className="text-accent font-bold">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </>
  );
}

