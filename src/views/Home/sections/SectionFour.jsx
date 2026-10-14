import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChartArt } from "./Sketches";

gsap.registerPlugin(ScrollTrigger);

/* Needs this as the first line of src/index.css:
   @import url("https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&display=swap"); */
const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';

const C = {
  primary: "#001022",
  primaryHover: "#0B3D91",
  primaryLight: "#E8F0FF",
  textSecondary: "#475569",
  border: "#E2E8F0",
};

/* Photo: save it as  public/why/team.jpg  (or pass  image="/your/photo.jpg" ).
   A sketch shows if the photo is missing. */
const REASONS = [
  {
    title: "Registered tax agents you can rely on",
    body: "Your tax, compliance and lodgements are handled by registered professionals, so the work is accurate and on time.",
  },
  {
    title: "Fixed, upfront pricing",
    body: "You know what you’re paying before we start. No hourly-rate surprises at the end of the year.",
  },
  {
    title: "Proactive advice, not just compliance",
    body: "We plan with you through the year, so tax time holds no surprises and decisions are made early.",
  },
  {
    title: "Plain English, always",
    body: "Clear explanations without the jargon, so you understand every number and every decision.",
  },
  {
    title: "Built around your goals",
    body: "Business owners, investors and corporate teams each get an approach shaped around where they’re headed.",
  },
];

const Plus = ({ open }) => (
  <span
    className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
      open ? "bg-white/15 text-white" : "bg-white text-[#001022]"
    }`}
    aria-hidden="true"
  >
    <span className="absolute h-[2px] w-3.5 bg-current" />
    <span className={`absolute h-3.5 w-[2px] bg-current transition-transform duration-300 ${open ? "scale-y-0" : "scale-y-100"}`} />
  </span>
);

export default function SectionFour({ image = "/why/team.jpg" }) {
  const root = useRef(null);
  const [open, setOpen] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".wc-head > *", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".wc-head", start: "top 85%" },
        });
        gsap.from(".wc-photo", {
          y: 60,
          opacity: 0,
          scale: 0.95,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".wc-grid", start: "top 80%" },
        });
        gsap.from(".wc-item", {
          x: 40,
          opacity: 0,
          duration: 0.7,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: ".wc-grid", start: "top 80%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="why-choose-us" ref={root} className="px-3 py-6 sm:px-5">
      <div className="mx-auto max-w-[1400px] px-2 py-16 sm:px-6 md:py-24">
        <div className="wc-head mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2
            style={{ fontFamily: HEADING_FONT, color: C.primary }}
            className="text-[clamp(2.2rem,5.4vw,4.75rem)] font-black uppercase leading-[1] tracking-[-0.035em]"
          >
            Why choose us?
          </h2>
          <p className="mt-6 text-base leading-relaxed sm:text-lg" style={{ color: C.textSecondary }}>
            We’re an accounting firm for people who want clarity, not complexity. Straight answers, fair pricing and
            advice that looks ahead, so you can focus on what you do best.
          </p>
        </div>

        <div className="wc-grid mx-auto mt-14 grid max-w-6xl items-center gap-8 md:mt-20 lg:grid-cols-2 lg:gap-14">
          {/* photo */}
          <div
            className="wc-photo relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] border"
            style={{ backgroundColor: C.primaryLight, borderColor: C.border }}
          >
            {image && !failed ? (
              <img
                src={image}
                alt="The Revenue Edge team"
                loading="lazy"
                draggable={false}
                onError={() => setFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center p-14">
                <div className="h-full max-h-64 w-full max-w-64">
                  <ChartArt />
                </div>
              </div>
            )}
          </div>

          {/* reasons */}
          <ul className="space-y-3">
            {REASONS.map((r, i) => {
              const isOpen = open === i;
              return (
                <li key={r.title} className="wc-item">
                  <div
                    className="overflow-hidden rounded-2xl transition-colors duration-300"
                    style={{ backgroundColor: isOpen ? C.primary : C.primaryLight, color: isOpen ? "#fff" : C.primary }}
                  >
                    <h3>
                      <button
                        type="button"
                        id={`why-btn-${i}`}
                        aria-expanded={isOpen}
                        aria-controls={`why-panel-${i}`}
                        onClick={() => setOpen(isOpen ? -1 : i)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91] sm:px-6 sm:text-base"
                      >
                        {r.title}
                        <Plus open={isOpen} />
                      </button>
                    </h3>
                    <div
                      id={`why-panel-${i}`}
                      role="region"
                      aria-labelledby={`why-btn-${i}`}
                      inert={!isOpen}
                      className={`grid transition-[grid-template-rows] duration-400 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-sm leading-relaxed text-white/75 sm:px-6 sm:text-[15px]">{r.body}</p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}