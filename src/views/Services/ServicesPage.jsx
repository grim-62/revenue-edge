import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  accordionCategories,
  allServices,
  getServiceCategory,
  serviceCategories,
} from "../../data/serviceData";
import ServicesAccordion from "./ServicesAccordion";
import { CalcArt, ChartArt, CoinsArt, SKETCHES } from "../Home/sections/Sketches";

gsap.registerPlugin(ScrollTrigger);

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

/* Shape the data for the hover dropdown. Add  art / tag  to a category in serviceData to override these. */
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

/* ───────── Pen sketches with a soft-blue accent ───────── */
const P = (props) => (
  <path pathLength="1" strokeDasharray="1" className="draw" {...props} />
);
const Accent = (props) => <path className="sp-accent" stroke="none" fill={C.accent} {...props} />;

const Words = ({ text = "" }) =>
  (text || "").split(" ").map((w, i) => (
    <span key={`${w}-${i}`}>
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

export default function ServicesPage({ categorySlug: propCat, images = DEFAULT_IMAGES }) {
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
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (root.current?.querySelector(".sv-head")) {
          gsap.from(".sv-head > *", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: ".sv-head", start: "top 85%" },
          });
        }

        if (root.current?.querySelector(".sp-word")) {
          gsap.from(".sp-word", {
            yPercent: 110,
            duration: 0.9,
            stagger: 0.04,
            ease: "power4.out",
          });
        }

        gsap.utils.toArray(".sp-reveal").forEach((el) => {
          gsap.from(el, {
            y: 35,
            opacity: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });
      });
    }, root);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [categorySlug]);

  return (
    <div ref={root} className="min-h-screen pb-20 pt-24  sm:pt-28">
      {/* 1. Hero Card */}
      <div
        className="mx-4 md:mx-auto mix-blend-overlay max-w-6xl overflow-hidden rounded-[2rem] border px-6 py-12 sm:rounded-[2.5rem] sm:px-12 sm:py-16 md:grid md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10"
        style={{ backgroundColor: C.primaryLight, borderColor: C.border }}
      >
        <div>
          {activeCategory && (
            <nav aria-label="Breadcrumb" className="mb-5 text-sm" style={{ color: C.textSecondary }}>
              <Link to="/" className="transition hover:text-[#001022]">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/services" className="transition hover:text-[#001022]">Services</Link>
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
        <div className="sp-heroart sp-float mx-auto  h-52 w-full max-w-md md:h-96">
          {/* Her0 image /> */}
          <img src="/img1.jpg" alt="" className="w-full h-full object-cover " />
        </div>
      </div>

      {/* 2. Intro */}
      <p
        className="sp-intro mx-auto mt-12 max-w-2xl px-2 text-center text-xl font-semibold leading-snug sm:text-2xl"
        style={{ color: C.primary }}
      >
        {intro}
      </p>

      {/* 3. Services Accordion Section */}
      <section id="services" className="px-3 pb-20 mt-10 sm:px-5 bg-white">
        <div className="mx-auto max-w-[1400px] px-2 py-8 sm:px-6 md:py-16">
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
              End-to-end financial expertise, delivered by one dedicated team. {allServices.length} services across three areas.
            </p>
          </div>

          {/* Accordion */}
          <div className="mt-14 md:mt-20">
            <ServicesAccordion categories={ACCORDION_CATEGORIES} restingIndex={restingIndex} />
          </div>
        </div>
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
          <img
            src="/Coins.png"
            alt="Coins"
            draggable={false}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
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
        className="sp-reveal mx-4 md:mx-auto mt-20 max-w-5xl rounded-[1.75rem] border p-8 sm:p-12 md:mt-28 md:grid md:grid-cols-2 md:gap-12"
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
          <Link
            to="/contact"
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
          </Link>
        </div>
      </section>

      {/* 7. Big photo */}
      {/* <div
        className="sp-photo sp-reveal relative mx-auto mt-10 aspect-[16/10] max-w-5xl overflow-hidden rounded-[1.75rem]"
        style={{ backgroundColor: C.primaryLight }}
      >
        <img
          src={'/img12.jpg'}
          alt="Revenue Edge accountants walking and talking with a client"
          draggable={false}
          onError={(e) => {
            e.currentTarget.src = "/img1.jpg";
          }}
          className="h-full w-full object-cover"
        />
      </div> */}
    </div>
  );
}