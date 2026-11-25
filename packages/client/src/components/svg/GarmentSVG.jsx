import { useId } from 'react';

const PATHS = {
  tee: 'M102 70 65 82 28 131 72 158 94 132 94 254 226 254 226 132 248 158 292 131 255 82 218 70Q160 111 102 70Z',
  shirt: 'M116 62 72 82 38 220 79 234 105 135 105 270 215 270 215 135 241 234 282 220 248 82 204 62 160 83Z',
  jeans: 'M106 46 214 46 229 280 169 280 160 137 151 280 91 280Z',
  hoodie: 'M115 85Q107 23 160 23Q213 23 205 85L247 94 279 228 236 240 215 151 215 270 105 270 105 151 84 240 41 228 73 94Z',
  bag: 'M95 106H225L244 263H76Z',
  polo: 'M106 65 68 80 27 133 73 162 97 132 93 258 227 258 223 132 247 162 293 133 252 80 214 65 160 86Z',
  cardigan: 'M117 63 76 83 42 222 80 235 106 143 103 269 217 269 214 143 240 235 278 222 244 83 203 63 160 133Z',
};

function Details({ shape }) {
  const map = {
    tee: <path d="M102 70Q160 129 218 70M94 132 101 95M226 132 219 95M94 242H226" />,
    polo: (
      <>
        <path d="M106 65 132 108 160 86 188 108 214 65M160 86V150M98 246H222" />
        <circle cx="164" cy="115" r="2" />
        <circle cx="164" cy="133" r="2" />
      </>
    ),
    shirt: <path d="M116 62 135 108 160 83 185 108 204 62M160 83V270M108 123H144V157H108" />,
    jeans: <path d="M106 61H214M106 81Q138 101 143 64M214 81Q182 101 177 64M160 61V139M100 270H150M170 270H220" />,
    hoodie: <path d="M115 85Q160 112 205 85M145 99 141 143M175 99 179 143M125 194H195L207 234H113Z" />,
    bag: <path d="M115 106V80Q115 39 160 39Q205 39 205 80V106" strokeWidth="10" fill="none" />,
    cardigan: (
      <>
        <path d="M117 63 160 133 203 63M160 133V269M105 251H215M48 212 82 224M238 224 272 212" />
        <circle cx="165" cy="155" r="3" />
        <circle cx="165" cy="190" r="3" />
        <circle cx="165" cy="225" r="3" />
      </>
    ),
  };
  return map[shape] || null;
}

export default function GarmentSVG({ shape, color, className = '' }) {
  const uid = useId();
  const gradId = `g${uid}`;
  const d = PATHS[shape];
  if (!d) return null;

  return (
    <svg
      viewBox="0 0 320 320"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffffff" stopOpacity=".19" />
          <stop offset="1" stopColor="#000000" stopOpacity=".13" />
        </linearGradient>
      </defs>
      <ellipse cx="160" cy="284" rx="95" ry="9" fill="#000" opacity=".06" />
      <path d={d} fill={color} stroke="#272723" strokeOpacity=".22" strokeWidth="1.4" />
      <path d={d} fill={`url(#${gradId})`} />
      <g
        fill="none"
        stroke="#2a2926"
        strokeOpacity=".28"
        strokeWidth="1.8"
        strokeLinejoin="round"
      >
        <Details shape={shape} />
      </g>
    </svg>
  );
}

