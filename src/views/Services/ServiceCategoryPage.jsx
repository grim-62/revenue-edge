import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { deferGsap } from "../../deferGsap";
import {
  getServiceCategory,
  getAdjacentCategories,
} from "../../data/serviceData";

/* Needs this as the first line of src/index.css:
   @import url("https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&display=swap"); */
const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';

const C = {
  primary: "#001022",
  primaryHover: "#0B3D91",
  primaryLight: "#E8F0FF",
  accent: "#BCD0FF",
  tint: "#F1F6FF",
  textSecondary: "#475569",
  border: "#E2E8F0",
  white: "#fff",
};

const pad = (n) => String(n).padStart(2, "0");

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

const Check = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-3 w-3"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

/* Each word sits in a mask so it can slide up into view */
const Words = ({ text = "" }) =>
  (text || "").split(" ").map((w, i) => (
    <span key={`${w}-${i}`}>
      <span className="inline-block overflow-hidden py-[0.05em] align-bottom">
        <span className="sc-word inline-block will-change-transform">{w}</span>
      </span>{" "}
    </span>
  ));

/* Section titles: words rise when the section scrolls in */
const SectionTitle = ({ text, className = "", id }) => (
  <h2
    id={id}
    aria-label={text}
    style={{ fontFamily: HEADING_FONT, color: C.primary }}
    className={`font-black uppercase leading-[1.02] tracking-[-0.035em] ${className}`}
  >
    <span aria-hidden="true">
      <Words text={text} />
    </span>
  </h2>
);

function PillLink({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-4 rounded-full py-1.5 pl-7 pr-1.5 text-[15px] font-semibold text-white outline-none transition-colors duration-300 hover:bg-[#0B3D91] focus-visible:ring-2 focus-visible:ring-[#0B3D91] focus-visible:ring-offset-2 ${className}`}
      style={{ backgroundColor: C.primary }}
    >
      {children}
      <span
        className="grid h-10 w-10 place-items-center rounded-full"
        style={{ backgroundColor: C.primaryLight, color: C.primary }}
      >
        <Arrow className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
      </span>
    </Link>
  );
}

/* Image with a placeholder that shows until a real image loads */
function ImageSlot({ src, alt = "", label, className = "" }) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [failed, setFailed] = useState(false);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setFailed(false);
  }
  const ok = src && !failed;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {ok ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          draggable={false}
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <div className="absolute inset-3 grid place-items-center rounded-[1.1rem] border-2 border-dashed border-[#93A8D6] px-4 text-center">
          <div>
            <svg
              viewBox="0 0 24 24"
              className="mx-auto h-9 w-9 text-[#0B3D91]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="16" rx="3" />
              <circle cx="9" cy="10" r="1.8" />
              <path d="M4 18l5.5-5.5 4 4 2.5-2.5L20 18" />
            </svg>
            <p
              className="mt-3 text-sm font-semibold"
              style={{ color: C.primary }}
            >
              Image placeholder
            </p>
            {label && <p className="mt-1 text-xs text-[#64748B]">{label}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function Faq({ item, id, open, onToggle }) {
  return (
    <div
      className="sc-faq overflow-hidden rounded-2xl border bg-white transition-colors duration-300"
      style={{ borderColor: open ? C.primary : C.border }}
    >
      <h3>
        <button
          type="button"
          id={`${id}-btn`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91] sm:px-6 sm:text-base"
          style={{ color: C.primary }}
        >
          <span>
            {item.question}
            {item.service && (
              <span className="mt-0.5 block text-xs font-medium text-[#64748B]">
                {item.service}
              </span>
            )}
          </span>
          <span
            className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-300"
            style={{
              backgroundColor: open ? C.primary : C.primaryLight,
              color: open ? "#fff" : C.primary,
            }}
            aria-hidden="true"
          >
            <span className="absolute h-[2px] w-3.5 bg-current" />
            <span
              className={`absolute h-3.5 w-[2px] bg-current transition-transform duration-300 ${open ? "scale-y-0" : "scale-y-100"}`}
            />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-500 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p
            className="max-w-3xl px-5 pb-5 text-[15px] leading-relaxed sm:px-6"
            style={{ color: C.textSecondary }}
          >
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-5 py-20 text-center">
      <div
        className="max-w-xl rounded-[2rem] border bg-white p-10 shadow-[0_30px_70px_-40px_rgba(0,16,34,0.4)]"
        style={{ borderColor: C.border }}
      >
        <span
          className="inline-flex rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{ backgroundColor: C.primaryLight, color: C.primaryHover }}
        >
          Service not found
        </span>
        <h2
          style={{ fontFamily: HEADING_FONT, color: C.primary }}
          className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-black uppercase leading-[1.02] tracking-[-0.035em]"
        >
          Let’s find the right support
        </h2>
        <p
          className="mt-4 text-[15px] leading-relaxed"
          style={{ color: C.textSecondary }}
        >
          We couldn’t find that service area. Browse all of our services
          instead.
        </p>
        <PillLink to="/services" className="mt-8">
          Browse services
        </PillLink>
      </div>
    </div>
  );
}

/* ───────── Redesigned service card ─────────
   One calm colour. A number tile, a dotted corner, a soft 3D tilt that follows the cursor,
   and a pale-blue wave that rises behind the content on hover. Text colours never change. */
function ServiceCard({ item, index, to }) {
  const onMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const inner = e.currentTarget.firstElementChild;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    inner.style.setProperty("--rx", (y * 2).toFixed(3));
    inner.style.setProperty("--ry", (x * 2).toFixed(3));
  };
  const onLeave = (e) => {
    const inner = e.currentTarget.firstElementChild;
    inner.style.setProperty("--rx", 0);
    inner.style.setProperty("--ry", 0);
  };

  return (
    <Link
      to={to}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="sc-card group block rounded-[1.75rem] outline-none [perspective:900px] focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
    >
      <div
        className="relative flex min-h-[19rem] flex-col overflow-hidden rounded-[1.75rem] border bg-white p-7 transition-[transform,box-shadow,border-color] duration-500 ease-out group-hover:border-[#0B3D91] group-hover:shadow-[0_28px_44px_-28px_rgba(0,16,34,0.35)] sm:p-8"
        style={{
          borderColor: C.border,
          transform:
            "rotateX(calc(var(--rx, 0) * -5deg)) rotateY(calc(var(--ry, 0) * 5deg))",
          transformStyle: "preserve-3d",
        }}
      >
        {/* pale-blue wave that rises on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-[-20%] h-[220%] w-[140%] translate-y-full rounded-t-[50%] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 motion-reduce:transition-none"
          style={{ backgroundColor: C.primaryLight }}
        />

        {/* dotted corner */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-32 w-32 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(#9DB5E8 1.3px, transparent 1.4px)",
            backgroundSize: "14px 14px",
            WebkitMaskImage:
              "radial-gradient(circle at 100% 0%, #000 0%, transparent 70%)",
            maskImage:
              "radial-gradient(circle at 100% 0%, #000 0%, transparent 70%)",
          }}
        />

        {/* number tile */}
        <span
          style={{
            fontFamily: HEADING_FONT,
            backgroundColor: C.primaryLight,
            color: C.primaryHover,
          }}
          className="relative grid h-14 w-14 place-items-center rounded-2xl text-xl font-black tracking-[-0.03em] transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-105"
        >
          {pad(index + 1)}
        </span>

        <h3 className="relative mt-auto pt-14 text-[1.45rem] font-bold leading-[1.12] tracking-tight text-[#001022] sm:text-2xl">
          {item.name || item.title}
        </h3>

        <p className="relative mt-3 line-clamp-3 text-sm leading-relaxed text-[#475569]">
          {item.tagline || item.description}
        </p>

        <span className="relative mt-6 flex items-center justify-between text-sm font-semibold text-[#001022]">
          <span className="transition-transform duration-500 ease-out group-hover:translate-x-1">
            View service
          </span>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#001022] text-white transition-colors duration-500">
            <Arrow className="-rotate-45 transition-transform duration-500 group-hover:rotate-0" />
          </span>
        </span>
      </div>
    </Link>
  );
}

/* ───────── Page: one main service (e.g. Tax & Compliance) ───────── */
export default function ServiceCategoryPage({
  categorySlug: propCat,
  contactHref = "/contact",
  images,
}) {
  const params = useParams();
  const categorySlug = propCat || params.categorySlug;
  const category = getServiceCategory(categorySlug);

  const root = useRef(null);
  const [prevSlug, setPrevSlug] = useState(categorySlug);
  const [openFaq, setOpenFaq] = useState(0);
  if (prevSlug !== categorySlug) {
    setPrevSlug(categorySlug);
    setOpenFaq(0);
  }

  useEffect(() => {
    if (!category) return undefined;

    /* If GSAP is slow or fails to load, never leave the first screen hidden */
    const fallback = setTimeout(
      () => root.current?.classList.remove("ab-pending"),
      2500,
    );

    const cleanup = deferGsap((gsap, ScrollTrigger) => {
      const el = root.current;
      if (!el) return undefined;
      const has = (sel) => !!el.querySelector(sel);

      const context = gsap.context(() => {
        const motion = gsap.matchMedia();

        motion.add("(prefers-reduced-motion: no-preference)", () => {
          const once = (trigger, start = "top 80%") => ({
            trigger,
            start,
            once: true,
          });

          /* 1. Hero: card reveal, title rise, image wipes in from the right */
          const hero = gsap
            .timeline({ defaults: { ease: "power4.out" } })
            .from(".sc-hero", { y: 28, opacity: 0, duration: 0.9 })
            .from(".sc-crumb", { x: -24, opacity: 0, duration: 0.6 }, "-=0.6")
            .from(".sc-label", { y: 16, opacity: 0, duration: 0.6 }, "-=0.5")
            .from(
              ".sc-hero .sc-word",
              { yPercent: 115, duration: 1.05, stagger: 0.06 },
              "-=0.35",
            );

          if (has(".sc-herotext"))
            hero.from(
              ".sc-herotext",
              { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 },
              "-=0.6",
            );

          hero.fromTo(
            ".sc-heroimg",
            {
              clipPath: "inset(0% 0% 0% 100% round 1.5rem)",
              opacity: 0,
              x: 40,
            },
            {
              clipPath: "inset(0% 0% 0% 0% round 1.5rem)",
              opacity: 1,
              x: 0,
              duration: 1.2,
              ease: "power3.inOut",
              clearProps: "clipPath,opacity,transform",
            },
            "-=1.2",
          );

          /* 2. Overview card opens, text rises, stats pop one by one */
          gsap
            .timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: once(".sc-overview", "top 82%"),
            })
            .fromTo(
              ".sc-overview",
              {
                clipPath: "inset(10% 5% 10% 5% round 2.5rem)",
                opacity: 0,
                y: 40,
              },
              {
                clipPath: "inset(0% 0% 0% 0% round 2.5rem)",
                opacity: 1,
                y: 0,
                duration: 1.1,
                ease: "power4.out",
                clearProps: "clipPath,opacity,transform",
              },
            )
            .from(
              ".sc-overview-text",
              { y: 28, opacity: 0, duration: 0.8, stagger: 0.12 },
              "-=0.6",
            )
            .from(
              ".sc-stat",
              {
                y: 24,
                scale: 0.94,
                opacity: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: "back.out(1.5)",
              },
              "-=0.5",
            );

          /* 3. Section titles */
          gsap.utils.toArray(".sc-section").forEach((section) => {
            const words = section.querySelectorAll(".sc-title .sc-word");
            if (words.length) {
              gsap.from(words, {
                yPercent: 115,
                duration: 1,
                stagger: 0.05,
                ease: "power4.out",
                scrollTrigger: once(section, "top 82%"),
              });
            }
          });

          gsap.from(".sc-pill", {
            scale: 0.7,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.8)",
            scrollTrigger: once(".sc-pill", "top 92%"),
          });

          /* 4. Service cards: batched so each row lifts in with a clip reveal, staggered */
          if (has(".sc-card")) {
            gsap.set(".sc-card", {
              clipPath: "inset(100% 0% 0% 0% round 1.75rem)",
              y: 40,
            });
            ScrollTrigger.batch(".sc-card", {
              start: "top 90%",
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, {
                  clipPath: "inset(0% 0% 0% 0% round 1.75rem)",
                  y: 0,
                  duration: 1,
                  ease: "power4.out",
                  stagger: 0.1,
                  clearProps: "clipPath,transform",
                }),
            });
          }

          /* 5. Deliverables slide in alternately from the left and right */
          gsap.utils.toArray(".sc-incl").forEach((item, i) => {
            gsap.from(item, {
              x: i % 2 === 0 ? -70 : 70,
              opacity: 0,
              duration: 1,
              ease: "power3.out",
              clearProps: "transform,opacity",
              scrollTrigger: once(item, "top 90%"),
            });
          });

          /* 6. Partner image wipes in from the left, benefits card opens, chips pop */
          if (has(".sc-partnerimg")) {
            gsap.fromTo(
              ".sc-partnerimg",
              { clipPath: "inset(0% 100% 0% 0% round 1.75rem)" },
              {
                clipPath: "inset(0% 0% 0% 0% round 1.75rem)",
                duration: 1.3,
                ease: "power3.inOut",
                clearProps: "clipPath",
                scrollTrigger: once(".sc-partnerimg", "top 85%"),
              },
            );
          }
          gsap
            .timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: once(".sc-partner", "top 80%"),
            })
            .from(".sc-partner", {
              y: 50,
              opacity: 0,
              duration: 1,
              clearProps: "transform,opacity",
            })
            .from(
              ".sc-benefit",
              { x: -24, opacity: 0, duration: 0.7, stagger: 0.07 },
              "-=0.5",
            )
            .from(
              ".sc-chip",
              {
                scale: 0.8,
                opacity: 0,
                duration: 0.6,
                stagger: 0.05,
                ease: "back.out(1.7)",
              },
              "-=0.4",
            );

          /* 7. FAQs */
          gsap.from(".sc-faq", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: once(".sc-faqs", "top 88%"),
          });

          /* 8. Other services slide in from opposite sides */
          gsap.utils.toArray(".sc-other").forEach((card, i) => {
            gsap.from(card, {
              x: i % 2 === 0 ? -80 : 80,
              opacity: 0,
              duration: 1.1,
              ease: "power4.out",
              clearProps: "transform,opacity",
              scrollTrigger: once(card, "top 92%"),
            });
          });

          /* 9. Closing */
          gsap.from(".sc-close .sc-fade", {
            y: 24,
            opacity: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: once(".sc-close", "top 80%"),
          });
          gsap.from(".sc-cta", {
            scale: 0.85,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
            scrollTrigger: once(".sc-cta", "top 94%"),
          });
        });
      }, el);

      el.classList.remove("ab-pending");
      ScrollTrigger.refresh();
      return () => context.revert();
    });

    return () => {
      clearTimeout(fallback);
      if (typeof cleanup === "function") cleanup();
    };
  }, [category]);

  if (!category) return <NotFound />;

  const count = category.items.length;
  const { others } = getAdjacentCategories(category.slug);
  const faqs = category.faqs ?? [];
  const partner = (category.partnerLabel ?? category.name).toLowerCase();

  return (
    <div
      ref={root}
      className="ab-pending overflow-x-clip px-3 pb-10 pt-24 sm:px-5 sm:pt-28"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="sc-crumb mx-auto mb-5 max-w-6xl px-2 text-sm"
          style={{ color: C.textSecondary }}
        >
          <Link to="/" className="transition hover:text-[#001022]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/services" className="transition hover:text-[#001022]">
            Services
          </Link>
          <span className="mx-2">/</span>
          <span aria-current="page" style={{ color: C.primary }}>
            {category.name}
          </span>
        </nav>

        {/* 1. Hero */}
        <section
          className="sc-hero mx-auto max-w-6xl overflow-hidden rounded-[2rem] border px-6 py-12 sm:rounded-[2.5rem] sm:px-12 sm:py-16 md:grid md:grid-cols-[1.3fr_1fr] md:items-center md:gap-10"
          style={{ backgroundColor: C.primaryLight, borderColor: C.border }}
        >
          <div>
            <span
              className="sc-label inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: C.primaryHover }}
            >
              {category.partnerLabel
                ? `${category.partnerLabel} services`
                : "Main service"}
            </span>
            <h1
              aria-label={category.name}
              style={{ fontFamily: HEADING_FONT, color: C.primary }}
              className="mt-6 text-[clamp(2rem,5.2vw,4.5rem)] font-black uppercase leading-[1.02] tracking-[-0.035em]"
            >
              <span aria-hidden="true">
                <Words text={category.name} />
              </span>
            </h1>
            {category.eyebrow && (
              <p
                className="sc-herotext mt-5 text-lg font-semibold leading-snug sm:text-xl"
                style={{ color: C.primaryHover }}
              >
                {category.eyebrow}
              </p>
            )}
            {category.description && (
              <p
                className="sc-herotext mt-4 max-w-lg text-base leading-relaxed"
                style={{ color: C.textSecondary }}
              >
                {category.description}
              </p>
            )}
            <div className="sc-herotext mt-8 flex flex-wrap items-center gap-4">
              <PillLink to={contactHref}>Talk to our team</PillLink>
              <a
                href="#all-services"
                className="rounded-full border bg-white px-5 py-3 text-sm font-semibold outline-none transition-colors hover:bg-[#001022] hover:text-white focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
                style={{ borderColor: C.border, color: C.primary }}
              >
                See all {count} services
              </a>
            </div>
          </div>

          <ImageSlot
            src={images?.hero ?? category.heroImage}
            alt={category.name}
            label="Hero image (e.g. 1200×1000)"
            className="sc-heroimg mx-auto mt-10 aspect-[4/3.5] w-full max-w-md rounded-[1.5rem] md:mt-0"
          />
        </section>

        {/* 2. Overview card */}
        <section
          className="sc-overview mx-auto mt-6 max-w-6xl overflow-hidden rounded-[2rem] px-6 py-12 text-white sm:rounded-[2.5rem] sm:px-12 sm:py-16"
          style={{
            backgroundColor: C.primary,
            backgroundImage:
              "radial-gradient(60% 80% at 10% 0%, rgba(255,255,255,0.16), transparent 70%), radial-gradient(50% 70% at 100% 100%, rgba(0,16,34,0.35), transparent 70%)",
          }}
        >
          <div className="grid gap-8 md:grid-cols-2 md:gap-14">
            <h2
              style={{ fontFamily: HEADING_FONT }}
              className="sc-overview-text text-[clamp(1.6rem,3.2vw,2.6rem)] font-black leading-[1.08] tracking-[-0.03em]"
            >
              {category.intro ??
                `Everything you need for ${category.name.toLowerCase()}.`}
            </h2>
            {category.details && (
              <p className="sc-overview-text text-[15px] leading-relaxed text-white/80 sm:text-base">
                {category.details}
              </p>
            )}
          </div>

          {category.stats?.length > 0 && (
            <dl className="mt-10 grid gap-3 border-t border-white/20 pt-8 sm:grid-cols-3">
              {category.stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="sc-stat rounded-2xl bg-white/10 px-5 py-4"
                >
                  <dt className="sr-only">{label}</dt>
                  <dd className="text-xl font-bold">{value}</dd>
                  <dd className="mt-1 text-sm text-white/70">{label}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        {/* 3. All services in this area */}
        <section
          id="all-services"
          className="sc-section mx-auto mt-24 max-w-6xl scroll-mt-28 px-2 md:mt-32"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              text={`${category.name} services`}
              className="sc-title text-[clamp(1.75rem,4vw,3.25rem)]"
            />
            <span
              className="sc-pill rounded-full px-4 py-2 text-sm font-semibold"
              style={{ backgroundColor: C.primaryLight, color: C.primaryHover }}
            >
              {count} services
            </span>
          </div>

          <div className="sc-grid mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(category?.items ?? []).map((item, i) => (
              <ServiceCard
                key={item.href || item.slug || i}
                item={item}
                index={i}
                to={item.href || `/service/${category.slug}/${item.slug}`}
              />
            ))}
          </div>
        </section>

        {/* 4. What every engagement includes */}
        {category.deliverables?.length > 0 && (
          <section className="sc-section mx-auto mt-24 max-w-6xl px-2 md:mt-32">
            <SectionTitle
              text="What every engagement includes"
              className="sc-title text-center text-[clamp(1.75rem,4vw,3.25rem)]"
            />
            <ol className="mt-10 grid gap-4 sm:grid-cols-2">
              {category.deliverables.map(({ title, desc }, i) => (
                <li
                  key={title}
                  className="sc-incl flex gap-5 rounded-[1.75rem] border bg-white p-7 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_40px_-28px_rgba(0,16,34,0.35)]"
                  style={{ borderColor: C.border }}
                >
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                    style={{
                      backgroundColor: C.primary,
                      fontFamily: HEADING_FONT,
                    }}
                  >
                    {pad(i + 1)}
                  </span>
                  <span>
                    <span
                      className="block text-lg font-bold"
                      style={{ color: C.primary }}
                    >
                      {title}
                    </span>
                    <span
                      className="mt-1.5 block text-[15px] leading-relaxed"
                      style={{ color: C.textSecondary }}
                    >
                      {desc}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* 5. Partner image + who it's for */}
        <section className="mx-auto mt-24 max-w-5xl px-2 md:mt-32">
          <ImageSlot
            src={images?.partner ?? category.partnerImage}
            alt={`${category.name} with Revenue Edge`}
            label="Wide image, 16:7 (e.g. 1600×700)"
            className="sc-partnerimg mb-6 w-full rounded-[1.75rem]"
          />

          <div
            className="sc-partner sc-section rounded-[1.75rem] border p-8 sm:p-12"
            style={{ backgroundColor: C.tint, borderColor: C.border }}
          >
            <SectionTitle
              text={`Your ${partner} partner`}
              className="sc-title text-center text-[clamp(1.75rem,3.8vw,3rem)]"
            />

            {category.benefits?.length > 0 && (
              <ul className="mt-10 grid gap-4 md:grid-cols-2">
                {category.benefits.map((b) => (
                  <li
                    key={b}
                    className="sc-benefit flex gap-3 text-[15px] leading-relaxed"
                    style={{ color: C.textSecondary }}
                  >
                    <span
                      className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white"
                      style={{ backgroundColor: C.primaryHover }}
                    >
                      <Check />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {category.whoItsFor?.length > 0 && (
              <div
                className="mt-10 border-t pt-8"
                style={{ borderColor: C.border }}
              >
                <p className="sc-benefit text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                  A good fit for
                </p>
                <ul className="mt-4 flex flex-wrap justify-center gap-2">
                  {category.whoItsFor.map((a) => (
                    <li
                      key={a}
                      className="sc-chip rounded-full border bg-white px-4 py-2 text-sm font-medium"
                      style={{ borderColor: C.border, color: C.primary }}
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* 6. FAQs */}
        {faqs.length > 0 && (
          <section className="sc-section mx-auto mt-24 max-w-3xl px-2 md:mt-32">
            <SectionTitle
              text="Common questions"
              className="sc-title text-center text-[clamp(1.75rem,4vw,3rem)]"
            />
            <div className="sc-faqs mt-10 space-y-3">
              {faqs.map((f, i) => (
                <Faq
                  key={f.question}
                  item={f}
                  id={`cat-faq-${i}`}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              ))}
            </div>
          </section>
        )}

        {/* 7. Other main services (bottom navigation) */}
        {others?.length > 0 && (
          <section
            className="sc-section mx-auto mt-24 max-w-6xl px-2 md:mt-32"
            aria-labelledby="other-title"
          >
            <SectionTitle
              id="other-title"
              text="Explore other services"
              className="sc-title text-center text-[clamp(1.75rem,4vw,3.25rem)]"
            />

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {others.map((c, i) => {
                const label =
                  i === 0
                    ? "Next"
                    : i === others.length - 1
                      ? "Previous"
                      : null;
                return (
                  <Link
                    key={c.slug}
                    to={c.href}
                    className="sc-other group flex min-h-64 flex-col rounded-[1.75rem] p-8 outline-none transition-[transform,background-color,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:bg-[#001022] hover:shadow-[0_30px_50px_-30px_rgba(0,16,34,0.55)] focus-visible:ring-2 focus-visible:ring-[#0B3D91] sm:p-10"
                    style={{ backgroundColor: C.primaryLight }}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0B3D91] transition-colors duration-500 group-hover:bg-white/10">
                        {label ? `${label} · ` : ""}
                        {c.items?.length ?? 0} services
                      </span>
                    </span>
                    <h3
                      style={{ fontFamily: HEADING_FONT }}
                      className="mt-6 text-[clamp(1.5rem,2.6vw,2.2rem)] font-black uppercase leading-[1.05] tracking-[-0.03em] text-[#001022] transition-colors duration-500 "
                    >
                      {c.name}
                    </h3>
                    {(c.description ?? c.eyebrow) && (
                      <p className="mt-3 line-clamp-2 flex-1 text-[15px] leading-relaxed text-[#475569] transition-colors duration-500 ">
                        {c.description ?? c.eyebrow}
                      </p>
                    )}
                    <span className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-[#001022] transition-colors duration-500 ">
                      Explore {c.name}
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#001022] text-white transition-colors duration-500">
                        <Arrow className="-rotate-45 transition-transform duration-500 group-hover:rotate-0" />
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 8. Closing call to action */}
        <section className="sc-close sc-section mx-auto mb-6 mt-24 max-w-2xl px-2 text-center md:mt-32">
          <SectionTitle
            text="Not sure which service you need?"
            className="sc-title text-[clamp(1.75rem,4vw,3.25rem)]"
          />
          <p
            className="sc-fade mx-auto mt-5 max-w-lg text-[15px] leading-relaxed sm:text-base"
            style={{ color: C.textSecondary }}
          >
            Tell us where you are and what you’re aiming for, and we’ll point
            you to the right support.
          </p>
          <div className="mt-8 flex justify-center">
            <PillLink to={contactHref} className="sc-cta">
              Get in touch
            </PillLink>
          </div>
        </section>
      </div>
    </div>
  );
}
