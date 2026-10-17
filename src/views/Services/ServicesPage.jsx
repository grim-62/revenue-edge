import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { deferGsap } from "../../deferGsap";
import {
  accordionCategories,
  allServices,
  getServiceCategory,
  serviceCategories,
} from "../../data/serviceData";
import ServicesAccordion from "./ServicesAccordion";

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

const ART_CYCLE = ["chart", "coins", "calc"];
const ACCORDION_CATEGORIES = serviceCategories.map((c, i) => ({
  id: c.slug,
  title: c.name,
  href: c.href,
  art: c.art ?? ART_CYCLE[i % ART_CYCLE.length],
  tag: c.tag ?? c.eyebrow,
  intro: c.description,
  items: c.items.map((s) => ({ name: s.name, description: s.description, href: s.href })),
}));

const INTRO =
  "Accounting, tax and advisory services tailored to you — whether you’re growing a business, building wealth, or navigating corporate complexity.";

const HERO_TITLES = {
  default: "Financial clarity designed for growth.",
  tax: "Proactive tax planning built for growth.",
  accounting: "Accurate records designed for growth.",
  "business-advisory": "Strategic business guidance for growth.",
};

/* Each word sits in a mask so it can slide up into view */
const Words = ({ text = "" }) =>
  (text || "").split(" ").map((w, i) => (
    <span key={`${w}-${i}`}>
      <span className="inline-block overflow-hidden py-[0.05em] align-bottom">
        <span className="sv-word inline-block will-change-transform">{w}</span>
      </span>{" "}
    </span>
  ));

/* Words that light up one by one as you scroll */
const ScrubWords = ({ text = "" }) =>
  (text || "").split(" ").map((w, i) => (
    <span key={`${w}-${i}`}>
      <span className="sv-scrub">{w}</span>{" "}
    </span>
  ));

const SectionTitle = ({ children, className = "" }) => (
  <h2
    aria-label={children}
    style={{ fontFamily: HEADING_FONT, color: C.primary }}
    className={`font-black uppercase leading-[1.02] tracking-[-0.035em] ${className}`}
  >
    <span aria-hidden="true">
      <Words text={children} />
    </span>
  </h2>
);

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

export default function ServicesPage({ categorySlug: propCat }) {
  const root = useRef(null);
  const params = useParams();
  const categorySlug = propCat || params.categorySlug;

  const activeCategory = categorySlug ? getServiceCategory(categorySlug) : null;
  const heroLabel = activeCategory
    ? activeCategory.tag ?? activeCategory.eyebrow ?? activeCategory.name
    : "Capability Matrix";
  const heroTitle = activeCategory
    ? HERO_TITLES[activeCategory.slug] ?? `${activeCategory.name} built for your growth.`
    : HERO_TITLES.default;
  const intro = activeCategory
    ? activeCategory.description ?? activeCategory.intro ?? INTRO
    : INTRO;

  const restingIndex = categorySlug
    ? accordionCategories.findIndex((c) => c.id === categorySlug)
    : -1;

  useEffect(() => {
    /* If GSAP is slow or fails to load, never leave the first screen hidden */
    const fallback = setTimeout(() => root.current?.classList.remove("ab-pending"), 2500);

    const cleanup = deferGsap((gsap, ScrollTrigger) => {
      const el = root.current;
      if (!el) return undefined;

      const context = gsap.context(() => {
        const motion = gsap.matchMedia();

        motion.add("(prefers-reduced-motion: no-preference)", () => {
          const once = (trigger, start = "top 80%") => ({ trigger, start, once: true });

          /* 1. Hero: card reveal, word lift, image wipes in from the right */
          gsap
            .timeline({ defaults: { ease: "power4.out" } })
            .from(".sv-hero", { y: 28, opacity: 0, duration: 0.9 })
            .from(".sv-crumb", { x: -24, opacity: 0, duration: 0.6 }, "-=0.6")
            .from(".sv-label", { y: 16, opacity: 0, duration: 0.6 }, "-=0.55")
            .from(".sv-hero .sv-word", { yPercent: 115, duration: 1.05, stagger: 0.06 }, "-=0.35")
            .fromTo(
              ".sv-hero-imgwrap",
              { clipPath: "inset(0% 0% 0% 100%)", opacity: 0 },
              { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.2, ease: "power3.inOut", clearProps: "clipPath,opacity" },
              "-=0.8"
            )
            .from(".sv-hero-imgwrap img", { scale: 1.35, duration: 1.7, ease: "power3.out" }, "<");

          gsap.to(".sv-hero-imgwrap img", {
            yPercent: 10,
            ease: "none",
            scrollTrigger: { trigger: ".sv-hero", start: "top top", end: "bottom top", scrub: true },
          });

          /* 2. Intro: words light up with scroll */
          const introWords = gsap.utils.toArray(".sv-intro .sv-scrub");
          gsap.set(introWords, { opacity: 0.2 });
          gsap.to(introWords, {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: ".sv-intro", start: "top 88%", end: "bottom 60%", scrub: true },
          });

          /* 3. Services header + accordion */
          gsap.from(".sv-head > *", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: once(".sv-head", "top 85%"),
          });
          gsap.from(".sv-accordion", {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: once(".sv-accordion", "top 90%"),
          });

          /* 4. Built around you: rules draw across, title rises, copy lights up */
          gsap.from(".sv-line", {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.4,
            ease: "power3.inOut",
            stagger: 0.15,
            scrollTrigger: once(".sv-built", "top 88%"),
          });
          gsap.from(".sv-built .sv-word", {
            yPercent: 115,
            duration: 1,
            stagger: 0.05,
            ease: "power4.out",
            scrollTrigger: once(".sv-built", "top 78%"),
          });
          const builtWords = gsap.utils.toArray(".sv-built .sv-scrub");
          gsap.set(builtWords, { opacity: 0.2 });
          gsap.to(builtWords, {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: ".sv-built-copy", start: "top 82%", end: "bottom 55%", scrub: true },
          });
          gsap.from(".sv-built .sv-fade", {
            y: 24,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: once(".sv-built-copy", "top 78%"),
          });

          /* 5. Stage of growth: photo wipes in from the left, text follows, photo drifts */
          const photo = ".sv-stage-photo";
          gsap
            .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: once(".sv-stage", "top 78%") })
            .fromTo(
              photo,
              { clipPath: "inset(0% 100% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut", clearProps: "clipPath" }
            )
            .from(".sv-stage .sv-word", { yPercent: 115, duration: 0.9, stagger: 0.05, ease: "power4.out" }, "-=0.7")
            .from(".sv-stage .sv-fade", { y: 24, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.6");

          gsap.fromTo(
            ".sv-stage-photo img",
            { yPercent: -6, scale: 1.15 },
            {
              yPercent: 6,
              scale: 1.15,
              ease: "none",
              scrollTrigger: { trigger: ".sv-stage", start: "top bottom", end: "bottom top", scrub: true },
            }
          );

          /* 6. Why clients choose us: card opens, title slides from left, copy from right, button pops */
          gsap
            .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: once(".sv-why", "top 82%") })
            .fromTo(
              ".sv-why",
              { clipPath: "inset(10% 5% 10% 5% round 2rem)", opacity: 0, y: 40 },
              { clipPath: "inset(0% 0% 0% 0% round 1.75rem)", opacity: 1, y: 0, duration: 1.1, ease: "power4.out", clearProps: "clipPath,opacity,transform" }
            )
            .from(".sv-why .sv-word", { yPercent: 115, duration: 0.9, stagger: 0.05, ease: "power4.out" }, "-=0.6")
            .from(".sv-why .sv-fade", { x: 40, opacity: 0, duration: 0.8, stagger: 0.12 }, "-=0.7");

          gsap.from(".sv-cta", {
            scale: 0.85,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
            scrollTrigger: once(".sv-cta", "top 94%"),
          });
        });
      }, el);

      /* start states are now set by GSAP, so the CSS "hidden until ready" state can go */
      el.classList.remove("ab-pending");
      ScrollTrigger.refresh();

      return () => context.revert();
    });

    return () => {
      clearTimeout(fallback);
      if (typeof cleanup === "function") cleanup();
    };
  }, [categorySlug]);

  return (
    <div ref={root} className="ab-pending min-h-screen overflow-x-clip pb-20 pt-24 sm:pt-28">
      {/* 1. Hero Card */}
      <div
        className="sv-hero mx-4 max-w-6xl overflow-hidden rounded-[2rem] border px-6 py-12 sm:rounded-[2.5rem] sm:px-12 sm:py-16 md:mx-auto md:grid md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10"
        style={{ backgroundColor: C.primaryLight, borderColor: C.border }}
      >
        <div>
          {activeCategory && (
            <nav aria-label="Breadcrumb" className="sv-crumb mb-5 text-sm" style={{ color: C.textSecondary }}>
              <Link to="/" className="transition hover:text-[#001022]">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/services" className="transition hover:text-[#001022]">Services</Link>
            </nav>
          )}
          <span
            className="sv-label inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em]"
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

        <div className="sv-hero-imgwrap relative mx-auto mt-10 h-52 w-full max-w-md overflow-hidden rounded-[1.5rem] md:mt-0 md:h-96">
          <img src="/img1.jpg" alt="" draggable={false} className="h-full w-full scale-110 object-cover" />
        </div>
      </div>

      {/* 2. Intro */}
      <p
        className="sv-intro mx-auto mt-12 max-w-2xl px-2 text-center text-xl font-semibold leading-snug sm:text-2xl"
        style={{ color: C.primary }}
      >
        <ScrubWords text={intro} />
      </p>

      {/* 3. Services Accordion Section */}
      <section id="services" className="mt-10 bg-white px-3 pb-20 sm:px-5">
        <div className="mx-auto max-w-[1400px] px-2 py-8 sm:px-6 md:py-16">
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
              End-to-end financial expertise, delivered by one dedicated team. {allServices.length} services across three areas.
            </p>
          </div>

          <div className="sv-accordion mt-14 md:mt-20">
            <ServicesAccordion categories={ACCORDION_CATEGORIES} restingIndex={restingIndex} />
          </div>
        </div>
      </section>

      {/* 4. Built around you */}
      <section className="sv-built relative mx-auto mt-24 max-w-3xl px-2 py-14 text-center md:mt-32 md:py-20">
        <span aria-hidden="true" className="sv-line absolute left-0 top-0 h-px w-full bg-slate-300" />
        <span aria-hidden="true" className="sv-line absolute bottom-0 left-0 h-px w-full bg-slate-300" />

        <SectionTitle className="text-[clamp(2rem,4.4vw,3.5rem)]">Built around you</SectionTitle>
        <div className="sv-built-copy">
          <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-snug" style={{ color: C.primary }}>
            <ScrubWords text="Numbers shouldn’t keep you up at night. You need an accountant who explains things plainly and plans ahead." />
          </p>
          <p className="sv-fade mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed" style={{ color: C.textSecondary }}>
            Whether you’re scaling a business, growing a portfolio or reporting to a board, we bring proactive advice,
            clear communication and transparent pricing, so every decision is made with confidence.
          </p>
        </div>
      </section>

      {/* 5. Photo left, text right */}
      <section className="sv-stage mx-auto mt-16 grid max-w-5xl items-center gap-10 px-4 md:mt-24 md:grid-cols-2 md:gap-16">
        <div className="sv-stage-photo mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-[1.5rem] bg-[#E8F0FF] sm:rounded-[2rem]">
          <img
            className="h-full w-full object-cover"
            src="./bookgirl.png"
            alt="Illustration of a person reading a book"
            draggable={false}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
        <div className="text-center md:text-left">
          <SectionTitle className="text-[clamp(1.75rem,3.6vw,3rem)]">
            The right support for every stage of growth
          </SectionTitle>
          <p className="sv-fade mt-5 max-w-lg text-[15px] leading-relaxed" style={{ color: C.textSecondary }}>
            We’ve organised our services around the people we work with: growing businesses, investors and individuals,
            and corporate enterprises.
          </p>
        </div>
      </section>

      {/* 6. Why clients choose us */}
      <section
        className="sv-why mx-4 mt-20 max-w-5xl rounded-[1.75rem] border p-8 sm:p-12 md:mx-auto md:mt-28 md:grid md:grid-cols-2 md:gap-12"
        style={{ backgroundColor: C.tint, borderColor: C.border }}
      >
        <SectionTitle className="text-[clamp(1.75rem,3.6vw,3rem)]">Why clients choose Revenue Edge</SectionTitle>
        <div className="mt-8 md:mt-0">
          <p className="sv-fade text-lg font-semibold leading-snug" style={{ color: C.primary }}>
            Registered tax agents, upfront fixed pricing and proactive advice, from people who care about your
            results as much as you do.
          </p>
          <p className="sv-fade mt-4 text-[15px] leading-relaxed" style={{ color: C.textSecondary }}>
            Tell us where you are and where you want to be, and we’ll map out the next move together.
          </p>
          <Link
            to="/contact"
            className="sv-cta group mt-8 inline-flex items-center gap-4 rounded-full py-1.5 pl-7 pr-1.5 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-[#0B3D91] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3D91]"
            style={{ backgroundColor: C.primary }}
          >
            Book a consultation
            <span className="grid h-10 w-10 place-items-center rounded-full" style={{ backgroundColor: C.primaryLight, color: C.primary }}>
              <Arrow className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}