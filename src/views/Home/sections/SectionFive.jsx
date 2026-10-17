import { useEffect, useRef } from "react";
import { deferGsap } from "../../../deferGsap";

const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';

const C = { primary: "#001022", primaryHover: "#0B3D91", border: "#E2E8F0" };

const IMAGES = {
   coins: "https://i.pinimg.com/1200x/8f/18/78/8f187809951d3b96d74b2b7301465907.jpg",
   calc: "https://i.pinimg.com/736x/ad/a4/c7/ada4c737671b77d821b8b5d96d07e8d7.jpg",
   chart: "https://i.pinimg.com/1200x/e2/3f/12/e23f12d9dbe5b2ab3e986be1c80668e7.jpg",
}

/* "@name" = sketch chip inside the sentence */
const TEXT = [
  "CASH", "FLOW", "SURPRISES,", "@coins", "TAX-TIME", "PANIC", "AND", "ENDLESS", "@calc", "PAPERWORK?",
  "WE’VE", "HANDLED", "IT", "ALL", "BEFORE,", "AND", "WE", "KNOW", "EXACTLY", "HOW", "TO", "HELP.", "@chart",
];

/* Plain-text version for screen readers (the visual words are split up) */
const PLAIN = TEXT.filter((t) => !t.startsWith("@")).join(" ");

function Chip({ name }) {
  const image = IMAGES[name];
  if (!image) return null;
  return (
    <span className="ks-chip group relative top-[-0.02em] mx-[0.05em] inline-block h-[0.82em] w-[1.3em] align-middle">
        <img src={image} alt="" draggable={false} className="h-full w-full object-cover rounded-2xl scale-110" />
    </span>
  );
}

/* Each word sits in a mask so it can slide up into view */
const Word = ({ children }) => (
  <span className="inline-block overflow-hidden py-[0.05em] align-bottom">
    <span className="ks-word inline-block will-change-transform">{children}</span>
  </span>
);

export default function SectionFive() {
  const root = useRef(null);

  useEffect(
    () =>
      deferGsap((gsap, ScrollTrigger) => {
        const ctx = gsap.context(() => {
          const mm = gsap.matchMedia();

          mm.add("(prefers-reduced-motion: no-preference)", () => {
            gsap
              .timeline({
                defaults: { ease: "power4.out" },
                scrollTrigger: { trigger: ".ks-card", start: "top 75%", once: true },
              })
              /* card lifts in, then words rise and chips pop */
              .from(".ks-card", { y: 40, opacity: 0, duration: 0.9, clearProps: "transform,opacity" })
              .from(".ks-word", { yPercent: 115, duration: 0.9, stagger: 0.03 }, "-=0.5")
              .from(
                ".ks-chip",
                { scale: 0.4, rotate: -12, opacity: 0, duration: 0.8, ease: "back.out(1.8)", stagger: 0.15 },
                "<0.2"
              )
              /* start the idle float only after everything has landed */
              .add(() => {
                gsap.to(".ks-float", {
                  y: -4,
                  duration: 2.4,
                  ease: "sine.inOut",
                  yoyo: true,
                  repeat: -1,
                  stagger: { each: 0.35, from: "random" },
                });
              });
          });
        }, root);

        ScrollTrigger.refresh();
        return () => ctx.revert();
      }),
    []
  );

  return (
    <section ref={root} className="overflow-x-clip px-3 py-6 sm:px-5">
      <div className="mx-auto max-w-[1400px]">
        <div
          className="ks-card relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:rounded-[2.5rem] sm:px-12 md:py-24"
          style={{
            backgroundColor: C.primary,
            backgroundImage:
              "radial-gradient(60% 80% at 15% 0%, rgba(255,255,255,0.16), transparent 70%), radial-gradient(50% 70% at 100% 100%, rgba(0,16,34,0.35), transparent 70%)",
          }}
        >
          <p
            aria-label={PLAIN}
            style={{ fontFamily: HEADING_FONT }}
            className="mx-auto max-w-5xl text-[clamp(1.75rem,4.8vw,4.1rem)] font-black uppercase leading-[1.08] tracking-[-0.03em] text-white [text-wrap:balance]"
          >
            <span aria-hidden="true">
              {TEXT.map((t, i) => (
                <span key={i}>
                  {t.startsWith("@") ? <Chip name={t.slice(1)} /> : <Word>{t}</Word>}{" "}
                </span>
              ))}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}