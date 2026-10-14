/* Shared pen-sketch illustrations (used by SectionFour–SectionSeven).
   Every stroke has the class "draw" so GSAP can animate strokeDashoffset 1 → 0. */

export const INK = "#0F172A";

export const Pen = (props) => (
  <path pathLength="1" strokeDasharray="1" className="draw" {...props} />
);

export const SketchFrame = ({ children, className = "h-full w-full", strokeWidth = 2.4 }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    stroke={INK}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${className} overflow-visible`}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const BARS = [
  [22, 20],
  [38, 32],
  [54, 46],
  [70, 60],
];

export const ChartArt = (props) => (
  <SketchFrame {...props}>
    <Pen d="M12 12v74h80" />
    {BARS.map(([x, h]) => (
      <g key={x}>
        <Pen d={`M${x} 86V${86 - h}h11v${h}`} />
        <Pen d={`M${x} ${84 - h / 3}l11 -6M${x} ${84 - (2 * h) / 3}l11 -6`} strokeWidth="1.2" />
      </g>
    ))}
    <Pen d="M16 58L42 40l14 8 30-30" />
    <Pen d="M74 18h12v12" />
  </SketchFrame>
);

export const CoinsArt = (props) => (
  <SketchFrame {...props}>
    <g transform="rotate(-6 50 50)">
      {[74, 60, 46].map((y) => (
        <g key={y}>
          <Pen d={`M20 ${y}v8a30 9 0 0 0 60 0v-8`} />
          <Pen d={`M20 ${y}a30 9 0 1 0 60 0a30 9 0 1 0-60 0`} />
        </g>
      ))}
      <Pen d="M20 32v8a30 9 0 0 0 60 0v-8" />
      <Pen d="M20 32a30 9 0 1 0 60 0a30 9 0 1 0-60 0" />
      <Pen d="M54 28c-5-3-11-1-9 3s10 2 9 6-8 4-11 1M49 24v16" strokeWidth="2" />
    </g>
  </SketchFrame>
);

export const CalcArt = (props) => (
  <SketchFrame {...props}>
    <g transform="rotate(-8 50 50)">
      <Pen d="M22 14h56a4 4 0 0 1 4 4v62a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z" />
      <Pen d="M27 20h46v15H27z" />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2].map((c) => (
          <Pen key={`${r}-${c}`} d={`M${28 + c * 16} ${42 + r * 10}h11v6h-11z`} strokeWidth="1.8" />
        ))
      )}
    </g>
    <Pen d="M70 96L94 58M74 98L98 60M94 58l4 2" />
  </SketchFrame>
);

export const SKETCHES = { chart: ChartArt, coins: CoinsArt, calc: CalcArt };