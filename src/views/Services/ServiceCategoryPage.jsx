import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getServiceCategory, getAdjacentCategories } from "../../data/serviceData";

gsap.registerPlugin(ScrollTrigger);

/* Needs this as the first line of src/index.css:
   @import url("https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&display=swap"); */
const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';

const C = {
  primary: "#001022",
  primaryHover: "#0B3D91",
  primaryLight: "#E8F0FF",
  tint: "#F1F6FF",
  textSecondary: "#475569",
  border: "#E2E8F0",
  white: "#fff",
};

const pad = (n) => String(n).padStart(2, "0");

/* ───────── Small pieces ───────── */
const Arrow = ({ className = "" }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${className}`} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const Words = ({ text = "" }) =>
  (text || "").split(" ").map((w, i) => (
    <span key={`${w}-${i}`}>
      <span className="inline-block overflow-hidden py-[0.05em] align-bottom">
        <span className="sc-word inline-block will-change-transform">{w}</span>
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

function PillLink({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-4 rounded-full py-1.5 pl-7 pr-1.5 text-[15px] font-semibold text-white outline-none transition-colors duration-300 hover:bg-[#0B3D91] focus-visible:ring-2 focus-visible:ring-[#0B3D91] focus-visible:ring-offset-2 ${className}`}
      style={{ backgroundColor: C.primary }}
    >
      {children}
      <span className="grid h-10 w-10 place-items-center rounded-full" style={{ backgroundColor: C.primaryLight, color: C.primary }}>
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
    <div 
        className={`relative overflow-hidden ${className} `} 
        // style={{ backgroundColor: C.primaryLight }}
    >
      {ok ? (
        <img src={src} alt={alt} loading="lazy" draggable={false} onError={() => setFailed(true)} className="h-full w-full  object-contain" />
      ) : (
        <div className="absolute inset-3 grid place-items-center rounded-[1.1rem] border-2 border-dashed border-[#93A8D6] px-4 text-center">
          <div>
            <svg viewBox="0 0 24 24" className="mx-auto h-9 w-9 text-[#0B3D91]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="16" rx="3" />
              <circle cx="9" cy="10" r="1.8" />
              <path d="M4 18l5.5-5.5 4 4 2.5-2.5L20 18" />
            </svg>
            <p className="mt-3 text-sm font-semibold" style={{ color: C.primary }}>Image placeholder</p>
            {label && <p className="mt-1 text-xs text-[#64748B]">{label}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function Faq({ item, id, open, onToggle }) {
  return (
    <div className="sc-reveal overflow-hidden rounded-2xl border bg-white transition-colors duration-300" style={{ borderColor: open ? C.primary : C.border }}>
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
            {item.service && <span className="mt-0.5 block text-xs font-medium text-[#64748B]">{item.service}</span>}
          </span>
          <span
            className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-300"
            style={{ backgroundColor: open ? C.primary : C.primaryLight, color: open ? "#fff" : C.primary }}
            aria-hidden="true"
          >
            <span className="absolute h-[2px] w-3.5 bg-current" />
            <span className={`absolute h-3.5 w-[2px] bg-current transition-transform duration-300 ${open ? "scale-y-0" : "scale-y-100"}`} />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        inert={!open ? "" : undefined}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="max-w-3xl px-5 pb-5 text-[15px] leading-relaxed sm:px-6" style={{ color: C.textSecondary }}>
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
      <div className="max-w-xl rounded-[2rem] border bg-white p-10 shadow-[0_30px_70px_-40px_rgba(0,16,34,0.4)]" style={{ borderColor: C.border }}>
        <span className="inline-flex rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ backgroundColor: C.primaryLight, color: C.primaryHover }}>
          Service not found
        </span>
        <SectionTitle className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)]">Let’s find the right support</SectionTitle>
        <p className="mt-4 text-[15px] leading-relaxed" style={{ color: C.textSecondary }}>
          We couldn’t find that service area. Browse all of our services instead.
        </p>
        <PillLink to="/services" className="mt-8">Browse services</PillLink>
      </div>
    </div>
  );
}

/* ───────── Page: one main service (e.g. Tax & Compliance) ───────── */
export default function ServiceCategoryPage({ categorySlug: propCat, contactHref = "/contact", images }) {
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
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(".sc-label", { y: 16, opacity: 0, duration: 0.6 })
          .from(".sc-word", { yPercent: 115, duration: 1, stagger: 0.05 }, "-=0.3")
          .from(".sc-heroimg", { y: 40, opacity: 0, scale: 0.95, duration: 1 }, "-=0.8");

        if (root.current?.querySelector(".sc-herotext")) {
          tl.from(".sc-herotext", { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.8");
        }

        gsap.utils.toArray(".sc-reveal").forEach((el) => {
          gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: el, start: "top 92%" },
          });
        });

        if (root.current?.querySelector(".sc-card")) {
          gsap.from(".sc-card", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.07,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: ".sc-grid", start: "top 88%" },
          });
        }

        if (root.current?.querySelector(".sc-incl")) {
          gsap.from(".sc-incl", {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: ".sc-incls", start: "top 90%" },
          });
        }

        if (root.current?.querySelector(".sc-other")) {
          gsap.from(".sc-other", {
            y: 50,
            opacity: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: ".sc-others", start: "top 95%" },
          });
        }
      });
    }, root);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [category]);

  if (!category) return <NotFound />;

  const count = category.items.length;
  const { others } = getAdjacentCategories(category.slug);
  const faqs = category.faqs ?? [];
  const partner = (category.partnerLabel ?? category.name).toLowerCase();

  return (
    <div ref={root} className="px-3 pb-10 pt-24 sm:px-5 sm:pt-28">
      <div className="mx-auto max-w-[1400px]">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mx-auto mb-5 max-w-6xl px-2 text-sm" style={{ color: C.textSecondary }}>
          <Link to="/" className="transition hover:text-[#001022]">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/services" className="transition hover:text-[#001022]">Services</Link>
          <span className="mx-2">/</span>
          <span aria-current="page" style={{ color: C.primary }}>{category.name}</span>
        </nav>

        {/* 1. Hero */}
        <section
          className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border px-6 py-12 sm:rounded-[2.5rem] sm:px-12 sm:py-16 md:grid md:grid-cols-[1.3fr_1fr] md:items-center md:gap-10"
          style={{ backgroundColor: C.primaryLight, borderColor: C.border }}
        >
          <div>
            <span className="sc-label inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.primaryHover }}>
              {category.partnerLabel ? `${category.partnerLabel} services` : "Main service"}
            </span>
            <h1
              aria-label={category.name}
              style={{ fontFamily: HEADING_FONT, color: C.primary }}
              className="mt-6 text-[clamp(2rem,5.2vw,4.5rem)] font-black uppercase leading-[1.02] tracking-[-0.035em]"
            >
              <span aria-hidden="true"><Words text={category.name} /></span>
            </h1>
            {category.eyebrow && (
              <p className="sc-herotext mt-5 text-lg font-semibold leading-snug sm:text-xl" style={{ color: C.primaryHover }}>
                {category.eyebrow}
              </p>
            )}
            {category.description && (
              <p className="sc-herotext mt-4 max-w-lg text-base leading-relaxed" style={{ color: C.textSecondary }}>
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
          className="sc-reveal mx-auto mt-6 max-w-6xl overflow-hidden rounded-[2rem] px-6 py-12 text-white sm:rounded-[2.5rem] sm:px-12 sm:py-16"
          style={{
            backgroundColor: C.primaryHover,
            backgroundImage:
              "radial-gradient(60% 80% at 10% 0%, rgba(255,255,255,0.16), transparent 70%), radial-gradient(50% 70% at 100% 100%, rgba(0,16,34,0.35), transparent 70%)",
          }}
        >
          <div className="grid gap-8 md:grid-cols-2 md:gap-14">
            <h2 style={{ fontFamily: HEADING_FONT }} className="text-[clamp(1.6rem,3.2vw,2.6rem)] font-black leading-[1.08] tracking-[-0.03em]">
              {category.intro ?? `Everything you need for ${category.name.toLowerCase()}.`}
            </h2>
            {category.details && <p className="text-[15px] leading-relaxed text-white/80 sm:text-base">{category.details}</p>}
          </div>

          {category.stats?.length > 0 && (
            <dl className="mt-10 grid gap-3 border-t border-white/20 pt-8 sm:grid-cols-3">
              {category.stats.map(({ value, label }) => (
                <div key={label} className="rounded-2xl bg-white/10 px-5 py-4">
                  <dt className="sr-only">{label}</dt>
                  <dd className="text-xl font-bold">{value}</dd>
                  <dd className="mt-1 text-sm text-white/70">{label}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        {/* 3. All services in this area */}
        <section id="all-services" className="mx-auto mt-24 max-w-6xl scroll-mt-28 px-2 md:mt-32">
          <div className="sc-reveal flex flex-wrap items-end justify-between gap-4">
            <SectionTitle className="text-[clamp(1.75rem,4vw,3.25rem)]">{category.name} services</SectionTitle>
            <span className="rounded-full px-4 py-2 text-sm font-semibold" style={{ backgroundColor: C.primaryLight, color: C.primaryHover }}>
              {count} services
            </span>
          </div>

          <div className="sc-grid mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(category?.items ?? []).map((item, i) => (
              <Link
                key={item.href || item.slug || i}
                to={item.href || `/service/${category.slug}/${item.slug}`}
                className="sc-card group relative flex min-h-56 flex-col overflow-hidden rounded-[1.75rem] border border-[#E2E8F0] bg-white p-7 text-[#001022] outline-none transition-[transform,background-color,border-color,color] duration-300 hover:-translate-y-1.5 hover:border-[#001022] hover:bg-[#001022] hover:text-white focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
              >
                <span className="text-sm font-semibold text-[#94A3B8] transition-colors duration-300 group-hover:text-white/50">{pad(i + 1)}</span>
                <h3 className="mt-6 text-xl font-bold leading-tight tracking-tight">{item.name || item.title}</h3>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-[#475569] transition-colors duration-300 group-hover:text-white/70">
                  {item.tagline || item.description}
                </p>
                <span className="mt-6 flex items-center justify-between text-sm font-semibold">
                  View service
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-[#001022] transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#001022]">
                    <Arrow className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                  </span>
                </span>
                <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-[#A9C4FA] to-white transition-transform duration-300 group-hover:scale-x-100 group-hover:duration-[900ms] motion-reduce:transition-none" />
              </Link>
            ))}
          </div>
        </section>

        {/* 4. What every engagement includes */}
        {category.deliverables?.length > 0 && (
          <section className="mx-auto mt-24 max-w-6xl px-2 md:mt-32">
            <SectionTitle className="sc-reveal text-center text-[clamp(1.75rem,4vw,3.25rem)]">What every engagement includes</SectionTitle>
            <ol className="sc-incls mt-10 grid gap-4 sm:grid-cols-2">
              {category.deliverables.map(({ title, desc }, i) => (
                <li key={title} className="sc-incl flex gap-5 rounded-[1.75rem] border bg-white p-7" style={{ borderColor: C.border }}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: C.primary, fontFamily: HEADING_FONT }}>
                    {pad(i + 1)}
                  </span>
                  <span>
                    <span className="block text-lg font-bold" style={{ color: C.primary }}>{title}</span>
                    <span className="mt-1.5 block text-[15px] leading-relaxed" style={{ color: C.textSecondary }}>{desc}</span>
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
            className="sc-reveal mb-6 w-full rounded-[1.75rem]"
          />

          <div className="sc-reveal rounded-[1.75rem] border p-8 sm:p-12" style={{ backgroundColor: C.tint, borderColor: C.border }}>
            <SectionTitle className="text-center text-[clamp(1.75rem,3.8vw,3rem)]">Your {partner} partner</SectionTitle>

            {category.benefits?.length > 0 && (
              <ul className="mt-10 grid gap-4 md:grid-cols-2">
                {category.benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-[15px] leading-relaxed" style={{ color: C.textSecondary }}>
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white" style={{ backgroundColor: C.primaryHover }}>
                      <Check />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {category.whoItsFor?.length > 0 && (
              <div className="mt-10 border-t pt-8" style={{ borderColor: C.border }}>
                <p className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">A good fit for</p>
                <ul className="mt-4 flex flex-wrap justify-center gap-2">
                  {category.whoItsFor.map((a) => (
                    <li key={a} className="rounded-full border bg-white px-4 py-2 text-sm font-medium" style={{ borderColor: C.border, color: C.primary }}>
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
          <section className="mx-auto mt-24 max-w-3xl px-2 md:mt-32">
            <SectionTitle className="sc-reveal text-center text-[clamp(1.75rem,4vw,3rem)]">Common questions</SectionTitle>
            <div className="mt-10 space-y-3">
              {faqs.map((f, i) => (
                <Faq key={f.question} item={f} id={`cat-faq-${i}`} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
              ))}
            </div>
          </section>
        )}

        {/* 7. Other main services (bottom navigation) */}
        {others?.length > 0 && (
          <section className="mx-auto mt-24 max-w-6xl px-2 md:mt-32" aria-labelledby="other-title">
            <SectionTitle className="sc-reveal text-center text-[clamp(1.75rem,4vw,3.25rem)]">
              <span id="other-title">Explore other services</span>
            </SectionTitle>

            <div className="sc-others mt-10 grid gap-4 md:grid-cols-2">
              {others?.map((c, i) => {
                const label = i === 0 ? "Next" : i === others.length - 1 ? "Previous" : null;
                return (
                  <Link
                    key={c.slug}
                    to={c.href}
                    className="sc-other group flex min-h-64 flex-col rounded-[1.75rem] p-8 outline-none transition-[transform,background-color] ease-in-out duration-300 hover:-translate-y-1.5 hover:bg-[#001022] focus-visible:ring-2 focus-visible:ring-[#0B3D91] sm:p-10"
                    style={{ backgroundColor: C.primaryLight }}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0B3D91] transition-colors duration-300 group-hover:bg-white/10 ">
                        {label ? `${label} · ` : ""}{c.items?.length ?? 0} services
                      </span>
                    </span>
                    <h3
                      style={{ fontFamily: HEADING_FONT }}
                      className="mt-6 text-[clamp(1.5rem,2.6vw,2.2rem)] font-black uppercase leading-[1.05] tracking-[-0.03em] text-[#001022] transition-colors duration-300 "
                    >
                      {c.name}
                    </h3>
                    {(c.description ?? c.eyebrow) && (
                      <p className="mt-3 line-clamp-2 flex-1 text-[15px] leading-relaxed text-[#475569] transition-colors duration-300 ">
                        {c.description ?? c.eyebrow}
                      </p>
                    )}
                    <span className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-[#001022] transition-colors duration-300 ">
                      Explore {c.name}
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#001022] text-white transition-colors duration-300 group-hover:text-white group-hover:text-[#001022]">
                        <Arrow className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 8. Closing call to action */}
        <section className="mx-auto mb-6 mt-24 max-w-2xl px-2 text-center md:mt-32">
          <SectionTitle className="sc-reveal text-[clamp(1.75rem,4vw,3.25rem)]">Not sure which service you need?</SectionTitle>
          <p className="sc-reveal mx-auto mt-5 max-w-lg text-[15px] leading-relaxed sm:text-base" style={{ color: C.textSecondary }}>
            Tell us where you are and what you’re aiming for, and we’ll point you to the right support.
          </p>
          <div className="sc-reveal mt-8 flex justify-center">
            <PillLink to={contactHref}>Get in touch</PillLink>
          </div>
        </section>
      </div>
    </div>
  );
}