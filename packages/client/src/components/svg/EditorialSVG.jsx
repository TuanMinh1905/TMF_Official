import { useId } from 'react';

const COLOR_SETS = {
  hero: ['#D9C9B5', '#AAB59B', '#E6D6C3', '#927262', '#9EACC1'],
  olive: ['#D9DCCA', '#AAB59B', '#E6D6C3', '#927262', '#494748'],
  denim: ['#D6DDE5', '#9EACC1', '#E6D6C3', '#494748', '#9EACC1'],
  rose: ['#E7D4CF', '#BA8E91', '#E6D6C3', '#927262', '#BA8E91'],
};

function Person({ x, y, scale, top, bottom, hair, pose }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="472" rx="79" ry="12" fill="#37312c" opacity=".13" />
      <path d="M-27 132L-32 177H34L26 132" fill="#b88f76" />
      <path d="M-46 75Q-52 18 1 18Q49 17 49 79L40 118Q26 145 0 145Q-28 141-40 114Z" fill="#c9a48b" />
      <path d="M-44 88Q-69 44-27 20Q-7 2 27 15Q61 24 52 76L37 60Q16 67-3 43Q-14 62-42 71Z" fill={hair} />
      {pose && (
        <path
          d="M-45 65Q-62 110-51 150L-31 136-39 76M43 61Q65 109 49 158L31 145 41 74"
          fill={hair}
        />
      )}
      <g stroke="#634a40" strokeWidth="1.4" fill="none" strokeLinecap="round">
        <path d="M-25 88l12 -1M14 87l12 1M0 91l-3 13 5 2M-8 118q8 4 17 0" />
      </g>
      <path
        d="M-49 292L-54 454-9 454 0 335 17 454 62 454 51 288Z"
        fill={bottom}
        stroke="#3a3834"
        strokeOpacity=".2"
      />
      <path
        d="M-9 454L-10 468-65 468Q-79 461-54 449ZM17 454L18 469H75Q87 460 62 449Z"
        fill="#f0e9dc"
        stroke="#6e6258"
        strokeOpacity=".35"
      />
      <path
        d="M-29 153L-83 173-102 277-64 288-50 221-51 312Q0 325 54 310L49 222 73 280 107 267 79 172 29 153Q0 173-29 153"
        fill={top}
        stroke="#39362f"
        strokeOpacity=".18"
        strokeWidth="1.4"
      />
      <path d="M-64 276L-69 300Q-66 314-57 307L-49 281M77 278L83 303Q95 312 98 300L98 268" fill="#c9a48b" />
      <g fill="none" stroke="#36352f" strokeOpacity=".2" strokeWidth="1.5">
        <path d="M-29 153Q0 200 29 153M-49 218L-44 182M49 218L44 182M-50 300Q0 312 54 298M-44 335L-48 444M47 335L52 444" />
        {pose && <path d="M0 171V308M-39 199H-10V226H-39" />}
      </g>
      {pose && (
        <g fill="#e4d9ca">
          <circle cx="3" cy="198" r="2" />
          <circle cx="3" cy="229" r="2" />
          <circle cx="3" cy="260" r="2" />
        </g>
      )}
    </g>
  );
}

export default function EditorialSVG({ kind = 'hero', className = '' }) {
  const uid = useId();
  const c = COLOR_SETS[kind] || COLOR_SETS.hero;
  const isHero = kind === 'hero';
  const w = isHero ? 800 : 480;

  return (
    <svg
      viewBox={`0 0 ${w} 560`}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`bg${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={c[0]} />
          <stop offset="1" stopColor={c[2]} />
        </linearGradient>
        <pattern id={`grain${uid}`} width="5" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="2" r=".4" fill="#5c4c39" opacity=".12" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#bg${uid})`} />
      <path d={`M0 0H${isHero ? 230 : 130}V560H0Z`} fill="#fff" opacity=".22" />
      <path
        d={`M${isHero ? 650 : 350} 0H${w}V560H${isHero ? 520 : 280}Z`}
        fill={c[1]}
        opacity=".32"
      />
      <path d={`M0 462H${w}V560H0Z`} fill="#8c7969" opacity=".15" />
      <path d={`M0 460H${w}`} stroke="#8c7969" opacity=".25" />

      {isHero ? (
        <>
          <Person x={275} y={35} scale={1.04} top={c[1]} bottom={c[3]} hair="#39312d" pose={false} />
          <Person x={537} y={65} scale={0.98} top={c[4]} bottom={c[2]} hair="#3c302b" pose={true} />
        </>
      ) : (
        <Person
          x={238}
          y={25}
          scale={1.08}
          top={c[1]}
          bottom={kind === 'rose' ? c[3] : c[2]}
          hair="#39312d"
          pose={kind !== 'denim'}
        />
      )}

      <rect width="100%" height="100%" fill={`url(#grain${uid})`} pointerEvents="none" />
    </svg>
  );
}

