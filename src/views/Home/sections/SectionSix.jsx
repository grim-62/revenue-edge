import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CoinsArt, ChartArt } from "./Sketches";

gsap.registerPlugin(ScrollTrigger);

/* Needs this as the first line of src/index.css:
   @import url("https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&display=swap"); */
const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';

const C = {
  primary: "#001022",
  primaryHover: "#0B3D91",
  primaryLight: "#E8F0FF",
  accent: "#BCD0FF",
  textSecondary: "#475569",
  border: "#E2E8F0",
};

/* PLACEHOLDERS: replace with real client reviews (with permission) before launch,
   or pass your own with <SectionSix reviews={[...]} /> */
const PLACEHOLDER_REVIEWS = [
  { name: "Client name", role: "Business owner", rating: 5, text: "Replace this with a real client review. Two or three sentences work best." },
  { name: "Client name", role: "Investor", rating: 5, text: "Replace this with a real client review. Two or three sentences work best." },
  { name: "Client name", role: "Finance director", rating: 5, text: "Replace this with a real client review. Two or three sentences work best." },
  { name: "Client name", role: "Founder", rating: 5, text: "Replace this with a real client review. Two or three sentences work best." },
];

const Star = ({ filled }) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill={filled ? "#F5B301" : "#E2E8F0"} aria-hidden="true">
    <path d="M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.2l-5.7 3 1.1-6.3L2.8 9.5l6.4-.9L12 2.8z" />
  </svg>
);

const Chevron = ({ dir }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
  </svg>
);

const Arrow = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={`h-4 w-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function SectionSix({ reviews = PLACEHOLDER_REVIEWS, contactHref = "#contact" }) {
  const root = useRef(null);
  const track = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  const scrollByPage = (dir) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".tm-head > *", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".tm-head", start: "top 85%" },
        });
        gsap.from(".tm-card", {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".tm-track", start: "top 88%" },
        });
        gsap.from(".tm-promo", {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".tm-promo", start: "top 88%" },
        });
        gsap.from(".tm-promo .draw", {
          strokeDashoffset: 1,
          duration: 1.4,
          ease: "power2.inOut",
          stagger: 0.012,
          scrollTrigger: { trigger: ".tm-promo", start: "top 80%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="testimonials" ref={root} className="px-3 py-6 sm:px-5">
      <div className="mx-auto max-w-[1400px] px-2 py-16 sm:px-6 md:py-24">
        {/* Header + arrows */}
        <div className="tm-head mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2
              style={{ fontFamily: HEADING_FONT, color: C.primary }}
              className="text-[clamp(2rem,4.6vw,4rem)] font-black uppercase leading-[1] tracking-[-0.035em]"
            >
              What our clients say
            </h2>
            <p className="mt-5 text-base leading-relaxed" style={{ color: C.textSecondary }}>
              Trusted by business owners, investors and corporate teams.
            </p>
          </div>
          <div className="flex gap-3">
            {["left", "right"].map((dir) => (
              <button
                key={dir}
                type="button"
                aria-label={dir === "left" ? "Previous reviews" : "Next reviews"}
                disabled={dir === "left" ? edge.start : edge.end}
                onClick={() => scrollByPage(dir === "left" ? -1 : 1)}
                className="grid h-12 w-12 place-items-center rounded-full border bg-white outline-none transition-colors duration-300 hover:bg-[#001022] hover:text-white focus-visible:ring-2 focus-visible:ring-[#0B3D91] disabled:pointer-events-none disabled:opacity-35"
                style={{ borderColor: C.primary, color: C.primary }}
              >
                <Chevron dir={dir} />
              </button>
            ))}
          </div>
        </div>

        {/* Review track */}
        <div
          ref={track}
          onScroll={measure}
          className="tm-track mx-auto mt-10 flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          tabIndex={0}
          aria-label="Client reviews"
        >
          {reviews.map((r, i) => (
            <figure
              key={`${r.name}-${i}`}
              className="tm-card flex shrink-0 basis-[85%] snap-start flex-col rounded-3xl border bg-white p-6 sm:basis-[46%] lg:basis-[31.5%]"
              style={{ borderColor: C.border }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="grid h-11 w-11 place-items-center rounded-full text-sm font-bold"
                  style={{ backgroundColor: C.primaryLight, color: C.primaryHover }}
                  aria-hidden="true"
                >
                  {r.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <figcaption>
                  <span className="block text-[15px] font-semibold" style={{ color: C.primary }}>
                    {r.name}
                  </span>
                  <span className="block text-xs" style={{ color: C.textSecondary }}>
                    {r.role}
                  </span>
                </figcaption>
              </div>
              <div className="mt-4 flex gap-0.5" role="img" aria-label={`${r.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} filled={n <= r.rating} />
                ))}
              </div>
              <blockquote className="mt-4 text-[15px] leading-relaxed" style={{ color: C.textSecondary }}>
                {r.text}
              </blockquote>
            </figure>
          ))}
        </div>

        {/* Promo banner */}
        <div
          className="tm-promo mx-auto mt-14 max-w-6xl overflow-hidden rounded-[2rem] px-6 py-10 sm:px-12 sm:py-14 md:grid md:grid-cols-[1.4fr_1fr] md:items-center md:gap-10"
          style={{ backgroundColor: C.accent }}
        >
          <div>
            <h3
              style={{ fontFamily: HEADING_FONT, color: C.primary }}
              className="text-[clamp(1.6rem,3.4vw,2.9rem)] font-black uppercase leading-[1.04] tracking-[-0.03em]"
            >
              Spend less time on admin. More on your business.
            </h3>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: "#1E293B" }}>
              Hand the paperwork to us and get back to running, and growing, what you’ve built.
            </p>
            <a
              href={contactHref}
              className="group mt-7 inline-flex items-center gap-4 rounded-full py-1.5 pl-7 pr-1.5 text-[15px] font-semibold text-white outline-none transition-colors duration-300 hover:bg-[#0B3D91] focus-visible:ring-2 focus-visible:ring-[#0B3D91] focus-visible:ring-offset-2"
              style={{ backgroundColor: C.primary }}
            >
              Get in touch
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white" style={{ color: C.primary }}>
                <Arrow className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
              </span>
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-4 md:mt-0">
            <div className="h-32 w-32 sm:h-40 sm:w-40">
              <CoinsArt />
            </div>
            <div className="hidden h-32 w-32 sm:block sm:h-40 sm:w-40">
              <ChartArt />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}