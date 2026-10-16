import { useEffect, useRef } from "react";
import { SKETCHES } from "./Sketches";
import { deferGsap } from "../../../deferGsap";

const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';

const C = { primary: "#001022", primaryHover: "#0B3D91", border: "#E2E8F0" };

/* "@name" = sketch chip inside the sentence */
const TEXT = [
  "CASH", "FLOW", "SURPRISES,", "@coins", "TAX-TIME", "PANIC", "AND", "ENDLESS", "@calc", "PAPERWORK?",
  "WE’VE", "HANDLED", "IT", "ALL", "BEFORE,", "AND", "WE", "KNOW", "EXACTLY", "HOW", "TO", "HELP.", "@chart",
];

function Chip({ name }) {
  const Art = SKETCHES[name];
  return (
    <span className="ks-chip group relative top-[-0.02em] mx-[0.05em] inline-block h-[0.82em] w-[1.3em] align-middle">
      <span
        className="ks-float block h-full w-full rounded-full border bg-white p-[0.12em] shadow-[0_10px_28px_-12px_rgba(0,16,34,0.5)] transition-transform duration-500 ease-out group-hover:-rotate-3 group-hover:scale-105"
        style={{ borderColor: C.border }}
      >
        <Art />
      </span>
    </span>
  );
}

const Word = ({ children }) => (
  <span className="inline-block overflow-hidden py-[0.05em] align-bottom">
    <span className="ks-word inline-block will-change-transform">{children}</span>
  </span>
);

export default function SectionFive() {
  const root = useRef(null);

  useEffect(() => deferGsap((gsap) => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            defaults: { ease: "power4.out" },
            scrollTrigger: { trigger: ".ks-card", start: "top 70%" },
          })
          .from(".ks-word", { yPercent: 115, duration: 0.9, stagger: 0.03 })
          .from(".ks-chip", { scale: 0.4, rotate: -12, opacity: 0, duration: 0.8, ease: "back.out(1.8)", stagger: 0.15 }, "-=0.9")
          .from(".ks-card .draw", { strokeDashoffset: 1, duration: 1.2, ease: "power2.inOut", stagger: 0.012 }, "<");

        gsap.to(".ks-float", {
          y: -4,
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.35, from: "random" },
        });
      });
    }, root);
    return () => ctx.revert();
  }), []);

  return (
    <section ref={root} className="px-3 py-6 sm:px-5">
      <div className="mx-auto max-w-[1400px]">
        <div
          className="ks-card relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:rounded-[2.5rem] sm:px-12 md:py-24"
          style={{
            backgroundColor: C.primaryHover,
            backgroundImage:
              "radial-gradient(60% 80% at 15% 0%, rgba(255,255,255,0.16), transparent 70%), radial-gradient(50% 70% at 100% 100%, rgba(0,16,34,0.35), transparent 70%)",
          }}
        >
          <p
            style={{ fontFamily: HEADING_FONT }}
            className="mx-auto max-w-5xl text-[clamp(1.75rem,4.8vw,4.1rem)] font-black uppercase leading-[1.08] tracking-[-0.03em] text-white [text-wrap:balance]"
          >
            {TEXT.map((t, i) => (
              <span key={i}>
                {t.startsWith("@") ? <Chip name={t.slice(1)} /> : <Word>{t}</Word>} {" "}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}