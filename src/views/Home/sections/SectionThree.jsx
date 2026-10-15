import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  ink: "#0F172A",
};

/* ───────── Content (edit freely) ───────── */
const CATEGORIES = [
  {
    id: "business",
    title: "Business Services",
    art: "chart",
    tag: "Built to Scale from Day 1",
    intro:
      "Transformational financial management, operational clarity, and proactive tax architecture for founders, operators, and enterprises.",
    items: [
      "Accounting & Bookkeeping",
      "Business Advisory",
      "Business Start-Up",
      "Business Coaching",
      "Tax Planning & Lodgement",
      "Payroll & Superannuation",
    ],
  },
  {
    id: "personal",
    title: "Personal & Wealth",
    art: "coins",
    tag: "Grow Wealth, Keep the ATO Happy",
    intro:
      "High-level property portfolio planning, SMSF compliance, and capital gains minimization for investors and individuals.",
    items: ["Property Tax & Depreciation", "SMSF & Wealth Structuring", "Estate & Asset Protection"],
  },
  {
    id: "corporate",
    title: "Corporate Services",
    art: "calc",
    tag: "Board-Level Reporting",
    intro:
      "M&A due diligence, corporate valuations, statutory audits, and board-level reporting for enterprises that need strategic financial brains.",
    items: ["Corporate Governance", "Valuations & Forensics", "Statutory Audits", "Inter-Entity Tax"],
  },
];

const TOTAL = CATEGORIES.reduce((n, c) => n + c.items.length, 0);

/* ───────── Pen-sketch art ─────────
   The "draw" animation is pure CSS: the stroke is hidden until the row's data-open is true. */
const P = (props) => (
  <path
    pathLength="1"
    strokeDasharray="1"
    className="[stroke-dashoffset:1] transition-[stroke-dashoffset] duration-[1100ms] ease-in-out group-data-[open=true]/panel:[stroke-dashoffset:0] motion-reduce:[stroke-dashoffset:0] motion-reduce:transition-none"
    {...props}
  />
);

const Frame = ({ children }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    stroke={C.ink}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-full w-full"
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

const CalcArt = () => (
  <Frame>
    <g transform="rotate(-8 50 50)">
      <P d="M22 14h56a4 4 0 0 1 4 4v62a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z" />
      <P d="M27 20h46v15H27z" />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2].map((c) => (
          <P key={`${r}-${c}`} d={`M${28 + c * 16} ${42 + r * 10}h11v6h-11z`} strokeWidth="1.6" />
        ))
      )}
    </g>
    <P d="M70 96L94 58M74 98L98 60M94 58l4 2" />
  </Frame>
);

const ChartArt = () => (
  <Frame>
    <P d="M12 12v74h80" />
    {BARS.map(([x, h]) => (
      <g key={x}>
        <P d={`M${x} 86V${86 - h}h11v${h}`} />
        <P d={`M${x} ${84 - h / 3}l11 -6M${x} ${84 - (2 * h) / 3}l11 -6`} strokeWidth="1.1" />
      </g>
    ))}
    <P d="M16 58L42 40l14 8 30-30" />
    <P d="M74 18h12v12" />
  </Frame>
);

const CoinsArt = () => (
  <Frame>
    <g transform="rotate(-6 50 50)">
      {[74, 60, 46].map((y) => (
        <g key={y}>
          <P d={`M20 ${y}v8a30 9 0 0 0 60 0v-8`} />
          <P d={`M20 ${y}a30 9 0 1 0 60 0a30 9 0 1 0-60 0`} />
        </g>
      ))}
      <P d="M20 32v8a30 9 0 0 0 60 0v-8" />
      <P d="M20 32a30 9 0 1 0 60 0a30 9 0 1 0-60 0" />
      <P d="M54 28c-5-3-11-1-9 3s10 2 9 6-8 4-11 1M49 24v16" strokeWidth="1.9" />
    </g>
  </Frame>
);

const ART = { chart: ChartArt, coins: CoinsArt, calc: CalcArt };

const ArrowUpRight = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={`h-4 w-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

const PlusMinus = ({ open }) => (
  <span
    className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors duration-300 group-hover:bg-[#001022] group-hover:text-white"
    style={{ borderColor: C.primary }}
    aria-hidden="true"
  >
    <span className="absolute h-[2px] w-4 bg-current" />
    <span
      className={`absolute h-4 w-[2px] bg-current transition-transform duration-300 ${open ? "scale-y-0" : "scale-y-100"}`}
    />
  </span>
);

/* ───────── One accordion row (memoised: only the rows that change re-render) ───────── */
const CategoryRow = memo(function CategoryRow({ cat, index, isOpen, img, href, onHover, onClick }) {
  const Art = ART[cat.art];

  return (
    <div
      data-open={isOpen}
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(index)}
      className="sv-row group/panel border-t"
      style={{ borderColor: C.primary }}
    >
      <h3>
        <button
          type="button"
          id={`btn-${cat.id}`}
          aria-expanded={isOpen}
          aria-controls={`panel-${cat.id}`}
          onClick={(e) => onClick(index, e.detail)}
          className="group flex w-full items-center justify-between gap-6 py-7 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91] md:py-9"
          style={{ color: C.primary }}
        >
          <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-2xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1 md:text-4xl">
              {cat.title}
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: C.primaryLight, color: C.primaryHover }}
            >
              {cat.items.length} services
            </span>
          </span>
          <PlusMinus open={isOpen} />
        </button>
      </h3>

      <div
        id={`panel-${cat.id}`}
        role="region"
        aria-labelledby={`btn-${cat.id}`}
        inert={!isOpen ? "" : undefined}
        className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="grid gap-10 pb-12 pt-2 md:grid-cols-2 md:items-center md:gap-16">
            {/* services list */}
            <div>
              <p className="max-w-md text-base leading-relaxed" style={{ color: C.textSecondary }}>
                {cat.intro}
              </p>
              <ul className="mt-8">
                {cat.items.map((item, n) => (
                  <li
                    key={item}
                    className="-translate-x-4 opacity-0 transition-[opacity,transform] duration-500 ease-out group-data-[open=true]/panel:translate-x-0 group-data-[open=true]/panel:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none"
                    style={{ transitionDelay: isOpen ? `${120 + n * 60}ms` : "0ms" }}
                  >
                    <Link
                      to={href}
                      className="group/item relative flex items-center justify-between gap-4 border-b py-4 text-[17px] font-medium outline-none transition-[padding] duration-300 hover:pl-2 focus-visible:pl-2"
                      style={{ borderColor: C.border, color: C.primary }}
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="w-6 text-xs font-semibold text-[#94A3B8]">
                          {String(n + 1).padStart(2, "0")}
                        </span>
                        {item}
                      </span>
                      <span
                        className="grid h-8 w-8 place-items-center rounded-full opacity-0 transition-opacity duration-300 group-hover/item:opacity-100 group-focus-visible/item:opacity-100"
                        style={{ backgroundColor: C.primary, color: "#fff" }}
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>

                      {/* progress line: fills slowly on hover, retracts quickly on leave */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-px left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-[#0B3D91] to-[#001022] transition-transform duration-300 ease-out group-hover/item:scale-x-100 group-hover/item:duration-[900ms] group-focus-visible/item:scale-x-100 group-focus-visible/item:duration-[900ms] motion-reduce:transition-none"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* illustration */}
            <div
              className="relative mx-auto aspect-[5/4] w-full max-w-lg scale-90 -rotate-[5deg] rounded-[2rem] border p-10 opacity-0 transition-[opacity,transform] duration-700 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-data-[open=true]/panel:scale-100 group-data-[open=true]/panel:rotate-0 group-data-[open=true]/panel:opacity-100 group-data-[open=true]/panel:delay-150 motion-reduce:scale-100 motion-reduce:rotate-0 motion-reduce:opacity-100 motion-reduce:transition-none sm:p-14"
              style={{ backgroundColor: C.primaryLight, borderColor: C.border }}
            >
              {img ? (
                <img src={img} alt="" draggable={false} loading="lazy" className="h-full w-full object-contain mix-blend-multiply" />
              ) : (
                <Art />
              )}
              <span
                className="absolute bottom-5 left-5 -rotate-3 rounded-full border bg-white px-4 py-2 text-xs font-semibold shadow-[0_8px_24px_-10px_rgba(0,16,34,0.35)]"
                style={{ borderColor: C.border, color: C.primary }}
              >
                {cat.tag}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

/* ───────── Section ─────────
   Rows start closed. Hovering a row opens it (and closes the others); leaving the list closes all.
   Touch devices and keyboards use tap / Enter to toggle. */
export default function SectionThree({ images, allServicesHref = "/services" }) {
  const root = useRef(null);
  const timer = useRef(0);
  const [open, setOpen] = useState(-1);

  const onHover = useCallback((i) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(i), 90); // small delay avoids flicker when the mouse just passes by
  }, []);

  const onLeave = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(-1), 180);
  }, []);

  const onClick = useCallback((i, detail) => {
    clearTimeout(timer.current);
    const hoverDevice = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    // mouse click keeps the hovered row open; tap and keyboard toggle it
    setOpen((prev) => (hoverDevice && detail > 0 ? i : prev === i ? -1 : i));
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  /* scroll-in (only GSAP left in this section) */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".sv-head > *", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".sv-head", start: "top 85%" },
        });
        gsap.from(".sv-row", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".sv-list", start: "top 82%" },
        });
        gsap.from(".sv-cta", {
          y: 20,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".sv-cta", start: "top 95%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  /* the page height changes when a row opens/closes: refresh triggers once it settles (debounced) */
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 650);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <section id="services" ref={root} className="bg-white px-3 py-6 sm:px-5">
      <div className="mx-auto max-w-[1400px] px-2 py-16 sm:px-6 md:py-24">
        {/* Header */}
        <div className="sv-head mx-auto flex max-w-3xl flex-col items-center text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{ borderColor: C.border, color: C.primary }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: C.primaryHover }} />
            Capability Matrix
          </span>
          <h2
            style={{ fontFamily: HEADING_FONT, color: C.primary }}
            className="mt-5 text-[clamp(2.4rem,7vw,6rem)] font-black uppercase leading-[1] tracking-[-0.035em]"
          >
            Our Services
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: C.textSecondary }}>
            End-to-end financial expertise, delivered by one dedicated team. {TOTAL} services across three areas.
          </p>
        </div>

        {/* Accordion */}
        <div
          className="sv-list mt-14 border-b md:mt-20"
          style={{ borderColor: C.primary }}
          onPointerLeave={(e) => e.pointerType === "mouse" && onLeave()}
        >
          {CATEGORIES.map((cat, i) => (
            <CategoryRow
              key={cat.id}
              cat={cat}
              index={i}
              isOpen={open === i}
              img={images?.[cat.art]}
              href={allServicesHref}
              onHover={onHover}
              onClick={onClick}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex justify-center">
          <Link
            to={allServicesHref}
            className="sv-cta group inline-flex items-center gap-4 rounded-full py-1.5 pl-7 pr-1.5 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-[#0B3D91]"
            style={{ backgroundColor: C.primary }}
          >
            See All Services
            <span className="grid h-10 w-10 place-items-center rounded-full" style={{ backgroundColor: C.primaryLight, color: C.primary }}>
              <ArrowUpRight className="transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}