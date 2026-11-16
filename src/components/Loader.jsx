/* Typewriter loader (From Uiverse.io by Nawsome), packaged as one self-contained React file.
   Usage:
     <Loader />                      centred in its parent (60vh tall by default)
     <Loader minHeight="100vh" />    centred in a taller area
     <Loader fullScreen />           centred over the whole page
     <Loader inline />               just the loader, no centring wrapper
     <Loader label="Sending…" showLabel />  shows the text under the animation */

const KEY_SHADOW =
  "15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key)";

/* One key presses down per step: [index of the pressed key, new y offset, y offset of its row] */
const KEY_ROWS = [
  [15, 0], [30, 0], [45, 0], [60, 0], [75, 0], [90, 0], // top row
  [22, 10], [37, 10], [52, 10], [60, 10], [68, 10], [83, 10], // bottom row
];
const pressed = (index, dy) =>
  KEY_ROWS.map(([x, y], i) => `${x}px ${i === index ? dy : y}px 0 var(--key)`).join(", ");

const KEYBOARD_FRAMES = `
  5%, 12%, 21%, 30%, 39%, 48%, 57%, 66%, 75%, 84% { box-shadow: ${KEY_SHADOW}; }
  9%  { box-shadow: ${pressed(0, 2)}; }
  18% { box-shadow: ${pressed(3, 2)}; }
  27% { box-shadow: ${pressed(6, 12)}; }
  36% { box-shadow: ${KEY_ROWS.map(([x, y], i) => `${x}px ${[8, 9, 10].includes(i) ? 12 : y}px 0 var(--key)`).join(", ")}; }
  45% { box-shadow: ${pressed(5, 2)}; }
  54% { box-shadow: ${pressed(1, 2)}; }
  63% { box-shadow: ${pressed(11, 12)}; }
  72% { box-shadow: ${pressed(2, 2)}; }
  81% { box-shadow: ${pressed(7, 12)}; }
`;

const CSS = `
.typewriter {
  --blue: #5C86FF;
  --blue-dark: #275EFE;
  --key: #fff;
  --paper: #EEF0FD;
  --text: #D3D4EC;
  --tool: #FBC56C;
  --duration: 3s;
  position: relative;
  animation: bounce05 var(--duration) linear infinite;
}

.typewriter .slide {
  width: 92px;
  height: 20px;
  border-radius: 3px;
  margin-left: 14px;
  transform: translateX(14px);
  background: linear-gradient(var(--blue), var(--blue-dark));
  animation: slide05 var(--duration) ease infinite;
}

.typewriter .slide:before,
.typewriter .slide:after,
.typewriter .slide i:before {
  content: "";
  position: absolute;
  background: var(--tool);
}

.typewriter .slide:before { width: 2px; height: 8px; top: 6px; left: 100%; }
.typewriter .slide:after  { left: 94px; top: 3px; height: 14px; width: 6px; border-radius: 3px; }

.typewriter .slide i {
  display: block;
  position: absolute;
  right: 100%;
  width: 6px;
  height: 4px;
  top: 4px;
  background: var(--tool);
}

.typewriter .slide i:before { right: 100%; top: -2px; width: 4px; border-radius: 2px; height: 14px; }

.typewriter .paper {
  position: absolute;
  left: 24px;
  top: -26px;
  width: 40px;
  height: 46px;
  border-radius: 5px;
  background: var(--paper);
  transform: translateY(46px);
  animation: paper05 var(--duration) linear infinite;
}

.typewriter .paper:before {
  content: "";
  position: absolute;
  left: 6px;
  right: 6px;
  top: 7px;
  border-radius: 2px;
  height: 4px;
  transform: scaleY(0.8);
  background: var(--text);
  box-shadow: 0 12px 0 var(--text), 0 24px 0 var(--text), 0 36px 0 var(--text);
}

.typewriter .keyboard {
  width: 120px;
  height: 56px;
  margin-top: -10px;
  z-index: 1;
  position: relative;
}

.typewriter .keyboard:before,
.typewriter .keyboard:after { content: ""; position: absolute; }

.typewriter .keyboard:before {
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 7px;
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  transform: perspective(10px) rotateX(2deg);
  transform-origin: 50% 100%;
}

.typewriter .keyboard:after {
  left: 2px;
  top: 25px;
  width: 11px;
  height: 4px;
  border-radius: 2px;
  box-shadow: ${KEY_SHADOW};
  animation: keyboard05 var(--duration) linear infinite;
}

@keyframes bounce05 {
  85%, 92%, 100% { transform: translateY(0); }
  89% { transform: translateY(-4px); }
  95% { transform: translateY(2px); }
}

@keyframes slide05 {
  5% { transform: translateX(14px); }
  15%, 30% { transform: translateX(6px); }
  40%, 55% { transform: translateX(0); }
  65%, 70% { transform: translateX(-4px); }
  80%, 89% { transform: translateX(-12px); }
  100% { transform: translateX(14px); }
}

@keyframes paper05 {
  5% { transform: translateY(46px); }
  20%, 30% { transform: translateY(34px); }
  40%, 55% { transform: translateY(22px); }
  65%, 70% { transform: translateY(10px); }
  80%, 85% { transform: translateY(0); }
  92%, 100% { transform: translateY(46px); }
}

@keyframes keyboard05 {${KEYBOARD_FRAMES}}

@media (prefers-reduced-motion: reduce) {
  .typewriter,
  .typewriter .slide,
  .typewriter .paper,
  .typewriter .keyboard:after { animation: none; }
  .typewriter .paper { transform: translateY(22px); }
}
`;

export default function Loader({
  fullScreen = false,
  inline = false,          // true = no centring wrapper, just the loader itself
  minHeight = "60vh",      // height of the area it centres itself in
  label = "Loading",
  showLabel = false,
  className = "",
}) {
  const loader = (
    <div role="status" aria-live="polite" className={`flex flex-col items-center justify-center ${className}`}>
      <style>{CSS}</style>
      {/* the keyboard is 120px wide, so a fixed-width box keeps the whole machine on the centre line */}
      <div className="typewriter" aria-hidden="true" style={{ width: 120 }}>
        <div className="slide"><i /></div>
        <div className="paper" />
        <div className="keyboard" />
      </div>
      {showLabel ? (
        <span className="mt-6 text-center text-sm font-semibold text-slate-600">{label}</span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] grid place-items-center bg-white/90 backdrop-blur-sm">
        {loader}
      </div>
    );
  }

  if (inline) return loader;

  /* default: centred horizontally and vertically inside its parent */
  return (
    <div className="grid w-full place-items-center" style={{ minHeight }}>
      {loader}
    </div>
  );
}