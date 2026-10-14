import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { serviceCategories } from "../../data/serviceData";

gsap.registerPlugin(ScrollTrigger);

/* Needs this as the first line of src/index.css:
   @import url("https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&display=swap"); */
const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';

const C = {
  primary: "#001022",
  primaryHover: "#0B3D91",
  primaryLight: "#E8F0FF",
  tint: "#F1F6FF",
  accent: "#BCD0FF",
  textSecondary: "#475569",
  border: "#E2E8F0",
  ink: "#0F172A",
};

/* Photo for the big image section: save it as  public/services/team.jpg
   (or pass  images={{ team: "/your/photo.jpg" }} ). A sketch shows if it's missing. */
const DEFAULT_IMAGES = { team: "/services/team.jpg" };

const INTRO =
  "Accounting, tax and advisory services tailored to you — whether you’re growing a business, building wealth, or navigating corporate complexity.";

/* ───────── Pen sketches with a soft-blue accent ───────── */
const P = (props) => (
  <path pathLength="1" strokeDasharray="1" className="draw" {...props} />
);
const Accent = (props) => <path className="sp-accent" stroke="none" fill={C.accent} {...props} />;

const BARS = [
  [22, 20],
  [38, 32],
  [54, 46],
  [70, 60],
];

const ChartG = () => (
  <g>
    {BARS.map(([x, h]) => (
      <Accent key={`a${x}`} d={`M${x} 86V${86 - h}h11v${h}z`} />
    ))}
    <P d="M12 12v74h80" />
    {BARS.map(([x, h]) => (
      <P key={x} d={`M${x} 86V${86 - h}h11v${h}`} />
    ))}
    <P d="M16 58L42 40l14 8 30-30" />
    <P d="M74 18h12v12" />
  </g>
);

const CoinsG = () => (
  <g transform="rotate(-6 50 50)">
    <Accent d="M20 32a30 9 0 1 0 60 0a30 9 0 1 0-60 0" />
    {[74, 60, 46].map((y) => (
      <g key={y}>
        <P d={`M20 ${y}v8a30 9 0 0 0 60 0v-8`} />
        <P d={`M20 ${y}a30 9 0 1 0 60 0a30 9 0 1 0-60 0`} />
      </g>
    ))}
    <P d="M20 32v8a30 9 0 0 0 60 0v-8" />
    <P d="M20 32a30 9 0 1 0 60 0a30 9 0 1 0-60 0" />
    <P d="M54 28c-5-3-11-1-9 3s10 2 9 6-8 4-11 1M49 24v16" strokeWidth="1.8" />
  </g>
);

const CalcG = () => (
  <g>
    <g transform="rotate(-8 50 50)">
      <Accent d="M27 20h46v15H27z" />
      <P d="M22 14h56a4 4 0 0 1 4 4v62a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z" />
      <P d="M27 20h46v15H27z" />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2].map((c) => (
          <P key={`${r}-${c}`} d={`M${28 + c * 16} ${42 + r * 10}h11v6h-11z`} strokeWidth="1.6" />
        ))
      )}
    </g>
    <P d="M70 96L94 58M74 98L98 60M94 58l4 2" />
  </g>
);

const Svg = ({ viewBox = "0 0 100 100", children, className = "h-full w-full" }) => (
  <svg
    viewBox={viewBox}
    fill="none"
    stroke={C.ink}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${className} overflow-visible`}
    aria-hidden="true"
  >
    {children}
  </svg>
);

/* Big sketch cluster with radiating arcs (the hero illustration) */
const HeroArt = () => (
  <Svg viewBox="0 0 260 190">
    {[70, 88, 106].map((r) => (
      <P key={r} d={`M${140 - r} 100A${r} ${r} 0 0 1 ${140 + r} 100`} strokeWidth="1.3" />
    ))}
    <g transform="translate(78 8) scale(1.35)">
      <ChartG />
    </g>
    <g transform="translate(-2 78) scale(0.85)">
      <CalcG />
    </g>
    <g transform="translate(168 90) scale(0.9)">
      <CoinsG />
    </g>
  </Svg>
);

/* ───────── Small pieces ───────── */
const Arrow = ({ className = "" }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    className={`h-4 w-4 ${className}`}
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Words = ({ text }) =>
  text.split(" ").map((w, i) => (
    <span key={i}>
      <span className="inline-block overflow-hidden py-[0.05em] align-bottom">
        <span className="sp-word inline-block will-change-transform">{w}</span>
      </span>{" "}
    </span>
  ));

const SectionTitle = ({ children, className = "" }) => (
  <h2
    style={{ fontFamily: HEADING_FONT, color: C.primary }}
    className={`font-black uppercase leading-[1.02] tracking-[-0.035em] ${className}`}
  >
    {children}
  </h2>
);

/* Row button (Pal's long yellow buttons) */
function Row({ href, title, note, meta }) {
  return (
    <a
      href={href}
      className="sp-row group flex items-center justify-between gap-4 rounded-2xl border border-[#DCE5F1] bg-[#E8F0FF] px-6 py-5 text-[#001022] shadow-[0_4px_18px_-14px_rgba(0,16,34,0.3)] transition-all duration-300 hover:border-[#001022] hover:bg-[#001022] hover:pl-8 hover:shadow-[0_14px_32px_-18px_rgba(0,16,34,0.45)] sm:py-6"
    >
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-lg font-semibold transition-colors duration-300 group-hover:text-white sm:text-xl">
            {title}
          </span>
          {meta && (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0B3D91] transition-colors duration-300 group-hover:bg-white/10 group-hover:text-white">
              {meta}
            </span>
          )}
        </span>
        {note && (
          <span className="mt-1.5 block text-sm leading-relaxed text-[#475569] transition-colors duration-300 group-hover:text-white/70">
            {note}
          </span>
        )}
      </span>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[#001022] transition-colors duration-300 group-hover:bg-white">
        <Arrow className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
      </span>
    </a>
  );
}

/* ───────── Page ───────── */
export default function ServicesPage({ categorySlug, images = DEFAULT_IMAGES, contactHref = "/contact" }) {
  const root = useRef(null);
  const [photoFailed, setPhotoFailed] = useState(false);

  const activeCategory = serviceCategories.find(({ slug }) => slug === categorySlug);
  const heroTitle = activeCategory ? activeCategory.name : "Tax advice that actually makes sense.";
  const heroLabel = activeCategory?.eyebrow ?? "Services";
  const intro = activeCategory?.description ?? INTRO;
  const otherCategories = serviceCategories.filter(({ slug }) => slug !== categorySlug);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(".sp-label", { y: 16, opacity: 0, duration: 0.6 })
          .from(".sp-word", { yPercent: 115, duration: 1, stagger: 0.06 }, "-=0.3")
          .from(".sp-heroart", { scale: 0.9, opacity: 0, duration: 0.9, ease: "back.out(1.5)" }, "-=0.8")
          .from(".sp-heroart .draw", { strokeDashoffset: 1, duration: 1.3, ease: "power2.inOut", stagger: 0.012 }, "<")
          .from(".sp-heroart .sp-accent", { opacity: 0, duration: 0.6 }, "-=0.5")
          .from(".sp-intro", { y: 20, opacity: 0, duration: 0.7 }, "-=0.8");

        gsap.to(".sp-float", { y: -6, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });

        gsap.utils.toArray(".sp-reveal").forEach((el) => {
          gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%" },
          });
        });

        gsap.utils.toArray(".sp-sketch").forEach((el) => {
          gsap.from(el.querySelectorAll(".draw"), {
            strokeDashoffset: 1,
            duration: 1.3,
            ease: "power2.inOut",
            stagger: 0.015,
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });

        gsap.set(".sp-row", { opacity: 0, y: 30 });
        ScrollTrigger.batch(".sp-row", {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", overwrite: true }),
        });

        const img = root.current?.querySelector(".sp-photo img");
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -7, scale: 1.15 },
            {
              yPercent: 7,
              scale: 1.15,
              ease: "none",
              scrollTrigger: { trigger: ".sp-photo", start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        }
      });
    }, root);
    return () => ctx.revert();
  }, [categorySlug]);

  return (
    <div ref={root} className="px-3 pb-10 pt-24 sm:px-5 sm:pt-28">
      <div className="mx-auto max-w-[1400px]">
        {/* 1. Hero card */}
        <div
          className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border px-6 py-12 sm:rounded-[2.5rem] sm:px-12 sm:py-16 md:grid md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10"
          style={{ backgroundColor: C.primaryLight, borderColor: C.border }}
        >
          <div>
            {activeCategory && (
              <nav aria-label="Breadcrumb" className="mb-5 text-sm" style={{ color: C.textSecondary }}>
                <a href="/" className="transition hover:text-[#001022]">Home</a>
                <span className="mx-2">/</span>
                <a href="/services" className="transition hover:text-[#001022]">Services</a>
              </nav>
            )}
            <span
              className="sp-label inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: C.primary }}
            >
              {heroLabel}
            </span>
            <h1
              aria-label={heroTitle}
              style={{ fontFamily: HEADING_FONT, color: C.primary }}
              className="mt-6 text-[clamp(2rem,5.2vw,4.4rem)] font-black uppercase leading-[1.02] tracking-[-0.035em]"
            >
              <span aria-hidden="true">
                <Words text={heroTitle} />
              </span>
            </h1>
          </div>
          <div className="sp-heroart sp-float mx-auto mt-10 h-52 w-full max-w-sm md:mt-0 md:h-72">
            <HeroArt />
          </div>
        </div>

        {/* 2. Intro */}
        <p
          className="sp-intro mx-auto mt-12 max-w-2xl px-2 text-center text-xl font-semibold leading-snug sm:text-2xl"
          style={{ color: C.primary }}
        >
          {intro}
        </p>

        {/* 3. Explore (categories on the overview, services inside a category) */}
        <section className="mx-auto mt-20 max-w-3xl px-2 md:mt-28" aria-labelledby="explore-title">
          <SectionTitle className="sp-reveal text-center text-[clamp(1.75rem,3.6vw,2.75rem)]">
            <span id="explore-title">{activeCategory ? `${activeCategory.name} services` : "Explore our services"}</span>
          </SectionTitle>
          <div className="mt-8 space-y-3">
            {activeCategory
              ? activeCategory.items.map((s) => (
                  <Row key={s.href} href={s.href} title={s.name} note={s.description} />
                ))
              : serviceCategories.map((c) => (
                  <Row
                    key={c.slug}
                    href={c.href}
                    title={c.name}
                    note={c.description}
                    meta={`${c.items.length} ${c.items.length === 1 ? "service" : "services"}`}
                  />
                ))}
          </div>

          {activeCategory && otherCategories.length > 0 && (
            <>
              <SectionTitle className="sp-reveal mt-16 text-center text-[clamp(1.5rem,3vw,2.25rem)]">
                Explore other areas
              </SectionTitle>
              <div className="mt-6 space-y-3">
                {otherCategories.map((c) => (
                  <Row key={c.slug} href={c.href} title={c.name} meta={`${c.items.length} services`} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* 4. Built around you */}
        <section className="mx-auto mt-24 max-w-2xl px-2 text-center md:mt-32">
          <SectionTitle className="sp-reveal text-[clamp(2rem,4.4vw,3.5rem)]">Built around you</SectionTitle>
          <p className="sp-reveal mt-6 text-lg font-semibold leading-snug" style={{ color: C.primary }}>
            Numbers shouldn’t keep you up at night. You need an accountant who explains things plainly and plans ahead.
          </p>
          <p className="sp-reveal mt-4 text-[15px] leading-relaxed" style={{ color: C.textSecondary }}>
            Whether you’re scaling a business, growing a portfolio or reporting to a board, we bring proactive advice,
            clear communication and transparent pricing, so every decision is made with confidence.
          </p>
        </section>

        {/* 5. Sketch + stage-of-growth heading */}
        <section className="mx-auto mt-20 max-w-3xl px-2 text-center md:mt-28">
          <div className="sp-sketch sp-reveal mx-auto h-32 w-32">
            <Svg>
              <g transform="translate(0 4)">
                <CoinsG />
              </g>
              <P d="M84 8l-4 7M92 18l-7 2M76 2v7" strokeWidth="1.4" />
            </Svg>
          </div>
          <SectionTitle className="sp-reveal mt-6 text-[clamp(1.75rem,4vw,3.25rem)]">
            The right support for every stage of growth
          </SectionTitle>
          <p className="sp-reveal mx-auto mt-5 max-w-lg text-[15px] leading-relaxed" style={{ color: C.textSecondary }}>
            We’ve organised our services around the people we work with: growing businesses, investors and individuals,
            and corporate enterprises.
          </p>
        </section>

        {/* 6. Why clients choose us */}
        <section
          className="sp-reveal mx-auto mt-20 max-w-5xl rounded-[1.75rem] border p-8 sm:p-12 md:mt-28 md:grid md:grid-cols-2 md:gap-12"
          style={{ backgroundColor: C.tint, borderColor: C.border }}
        >
          <SectionTitle className="text-[clamp(1.75rem,3.6vw,3rem)]">Why clients choose Revenue Edge</SectionTitle>
          <div className="mt-8 md:mt-0">
            <p className="text-lg font-semibold leading-snug" style={{ color: C.primary }}>
              Registered tax agents, upfront fixed pricing and proactive advice, from people who care about your
              results as much as you do.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed" style={{ color: C.textSecondary }}>
              Tell us where you are and where you want to be, and we’ll map out the next move together.
            </p>
            <a
              href={contactHref}
              className="group mt-8 inline-flex items-center gap-4 rounded-full py-1.5 pl-7 pr-1.5 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-[#0B3D91]"
              style={{ backgroundColor: C.primary }}
            >
              Book a consultation
              <span
                className="grid h-10 w-10 place-items-center rounded-full"
                style={{ backgroundColor: C.primaryLight, color: C.primary }}
              >
                <Arrow className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
              </span>
            </a>
          </div>
        </section>

        {/* 7. Big photo */}
        <div
          className="sp-photo sp-reveal relative mx-auto mt-10 aspect-[16/10] max-w-5xl overflow-hidden rounded-[1.75rem]"
          style={{ backgroundColor: C.primaryLight }}
        >
          {images?.team && !photoFailed ? (
            <img
              src={images.team}
              alt="Revenue Edge accountants walking and talking with a client"
              draggable={false}
              onError={() => setPhotoFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center p-10">
              <div className="h-full max-h-80 w-full max-w-md">
                <HeroArt />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}