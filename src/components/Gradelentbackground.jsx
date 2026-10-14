import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Colours sampled from your shader: soft blue base, lavender-grey on the left,
   deeper blue swirl, peach glow, white light bottom-right. */
const BASE = "#C6D6FA";

/* Each blob is a big soft radial gradient that drifts slowly.
   x/y are % of the blob's own size, d = seconds for one drift. */
const BLOBS = [
  // lavender-grey, left
  { color: "218,215,232", a: 0.95, size: "75vmax", left: "-25%", top: "5%", x: 14, y: -8, s: 1.12, r: 12, d: 22 },
  // deeper blue swirl, top-centre
  { color: "168,192,248", a: 0.9, size: "62vmax", left: "18%", top: "-32%", x: -12, y: 14, s: 1.15, r: -25, d: 18 },
  // light blue, right
  { color: "190,208,251", a: 0.95, size: "70vmax", left: "48%", top: "-10%", x: -10, y: 10, s: 1.1, r: 18, d: 26 },
  // deeper blue ribbon, centre-right
  { color: "170,194,248", a: 0.75, size: "50vmax", left: "42%", top: "25%", x: 10, y: -12, s: 1.2, r: 30, d: 20 },
  // peach glow, lower-left
  { color: "255,229,208", a: 1, size: "52vmax", left: "8%", top: "38%", x: 18, y: -14, s: 1.15, r: -15, d: 24 },
  // white light, bottom-right
  { color: "245,249,255", a: 1, size: "48vmax", left: "62%", top: "62%", x: -14, y: -8, s: 1.2, r: 10, d: 28 },
];

/**
 * Full-website animated gradient background (no video, no export needed).
 * Fixed to the viewport, so it covers the whole page at any length.
 *   speed – 1 is calm; 0.5 slower, 2 faster
 *   drift – how far the gradient shifts while scrolling (0 turns it off)
 */
export default function GradientBackground({ speed = 1, drift = 6 }) {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray(".gb-blob").forEach((el, i) => {
          const b = BLOBS[i];
          gsap
            .to(el, {
              xPercent: b.x,
              yPercent: b.y,
              scale: b.s,
              rotate: b.r,
              duration: b.d / speed,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            })
            .progress(Math.random()); // each blob starts at a different point
        });

        if (drift > 0) {
          gsap.fromTo(
            ".gb-layer",
            { yPercent: -drift },
            {
              yPercent: drift,
              ease: "none",
              scrollTrigger: {
                trigger: document.documentElement,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
              },
            }
          );
        }
      });
    }, root);
    return () => ctx.revert();
  }, [speed, drift]);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: BASE }}
    >
      <div className="gb-layer absolute inset-[-8%] will-change-transform">
        {BLOBS.map((b, i) => (
          <div
            key={i}
            className="gb-blob absolute rounded-full will-change-transform"
            style={{
              width: b.size,
              height: b.size,
              left: b.left,
              top: b.top,
              background: `radial-gradient(circle at center, rgba(${b.color},${b.a}) 0%, rgba(${b.color},0) 68%)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}