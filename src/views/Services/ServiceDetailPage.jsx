import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { deferGsap } from "../../deferGsap";
import { getServiceCategory, getServiceItem } from "../../data/serviceData";

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
};

/* Images: save them in  public/services/  or pass  images={{ hero, partner }}.
   A single service can override them with  heroImage / partnerImage  in serviceData. */
const DEFAULT_IMAGES = {
  hero: "/img4.jpg",
  partner: "/img10.jpg",
};

/* ───────── Small pieces ───────── */
const Arrow = ({ className = "" }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${className}`} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* Each word sits in a mask so it can slide up into view */
const Words = ({ text = "" }) =>
  (text || "").split(" ").map((w, i) => (
    <span key={`${w}-${i}`}>
      <span className="inline-block overflow-hidden py-[0.05em] align-bottom">
        <span className="sd-word inline-block will-change-transform">{w}</span>
      </span>{" "}
    </span>
  ));

/* Section titles: words rise when the section scrolls in */
const SectionTitle = ({ text, className = "" }) => (
  <h2
    aria-label={text}
    style={{ fontFamily: HEADING_FONT, color: C.primary }}
    className={`sd-title font-black uppercase leading-[1.02] tracking-[-0.035em] ${className}`}
  >
    <span aria-hidden="true">
      <Words text={text} />
    </span>
  </h2>
);

const Check = () => (
  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

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
    <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: C.primaryLight }}>
      {ok ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          draggable={false}
          onError={() => setFailed(true)}
          className="h-full w-full scale-110 object-cover will-change-transform"
        />
      ) : (
        <div className="absolute inset-3 grid place-items-center rounded-[1.1rem] border-2 border-dashed border-[#93A8D6] px-4 text-center">
          <div>
            <svg viewBox="0 0 24 24" className="mx-auto h-9 w-9 text-[#0B3D91]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="16" rx="3" />
              <circle cx="9" cy="10" r="1.8" />
              <path d="M4 18l5.5-5.5 4 4 2.5-2.5L20 18" />
            </svg>
            <p className="mt-3 text-sm font-semibold" style={{ color: C.primary }}>
              Image placeholder
            </p>
            {label && <p className="mt-1 text-xs text-[#64748B]">{label}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function PillButton({ href, to, children, className = "" }) {
  const target = to || href;
  return (
    <Link
      to={target}
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

function Faq({ item, id, open, onToggle }) {
  return (
    <div className="sd-faq overflow-hidden rounded-2xl border bg-white transition-colors duration-300" style={{ borderColor: open ? C.primary : C.border }}>
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
          {item.question}
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
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-500 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
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

function NotFound({ categorySlug }) {
  const category = getServiceCategory(categorySlug);
  return (
    <div className="grid min-h-[70vh] place-items-center px-5 py-20 text-center">
      <div className="max-w-xl rounded-[2rem] border bg-white p-10 shadow-[0_30px_70px_-40px_rgba(0,16,34,0.4)]" style={{ borderColor: C.border }}>
        <span className="inline-flex rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ backgroundColor: C.primaryLight, color: C.primaryHover }}>
          Service not found
        </span>
        <h2 style={{ fontFamily: HEADING_FONT, color: C.primary }} className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-black uppercase leading-[1.02] tracking-[-0.035em]">
          Let’s find the right support
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed" style={{ color: C.textSecondary }}>
          {category
            ? `We couldn’t find that service in ${category.name}. Browse the available services instead.`
            : "We couldn’t find that service. Browse all of our services instead."}
        </p>
        <PillButton to="/services" className="mt-8">
          Browse services
        </PillButton>
      </div>
    </div>
  );
}

/* ───────── Page ───────── */
export default function ServiceDetailPage({ categorySlug: propCat, serviceSlug: propSvc, contactHref = "/contact", images = DEFAULT_IMAGES }) {
  const params = useParams();
  const categorySlug = propCat || params.categorySlug;
  const serviceSlug = propSvc || params.serviceSlug;

  const root = useRef(null);
  const slugKey = `${categorySlug}/${serviceSlug}`;
  const [prevSlugKey, setPrevSlugKey] = useState(slugKey);
  const [openFaq, setOpenFaq] = useState(0);
  if (prevSlugKey !== slugKey) {
    setPrevSlugKey(slugKey);
    setOpenFaq(0);
  }

  const service = getServiceItem(categorySlug, serviceSlug);
  const category = service ? getServiceCategory(service.categorySlug || categorySlug) : null;
  const isWrongCategory = Boolean(service && categorySlug && service.categorySlug !== categorySlug);
  const isNotFound = !service || !category;

  useEffect(() => {
    if (isWrongCategory || isNotFound) return undefined;

    /* If GSAP is slow or fails to load, never leave the first screen hidden */
    const fallback = setTimeout(() => root.current?.classList.remove("ab-pending"), 2500);

    const cleanup = deferGsap((gsap, ScrollTrigger) => {
      const el = root.current;
      if (!el) return undefined;
      const has = (sel) => !!el.querySelector(sel);

      const context = gsap.context(() => {
        const motion = gsap.matchMedia();

        motion.add("(prefers-reduced-motion: no-preference)", () => {
          const once = (trigger, start = "top 80%") => ({ trigger, start, once: true });

          /* 1. Hero: card reveal, title rise, image wipes in from the right and drifts */
          const hero = gsap
            .timeline({ defaults: { ease: "power4.out" } })
            .from(".sd-hero", { y: 28, opacity: 0, duration: 0.9 })
            .from(".sd-crumb", { x: -24, opacity: 0, duration: 0.6 }, "-=0.6")
            .from(".sd-label", { y: 16, opacity: 0, duration: 0.6 }, "-=0.5")
            .from(".sd-hero .sd-word", { yPercent: 115, duration: 1.05, stagger: 0.06 }, "-=0.35");

          if (has(".sd-tagline")) hero.from(".sd-tagline", { y: 20, opacity: 0, duration: 0.7 }, "-=0.6");

          hero
            .fromTo(
              ".sd-heroimg",
              { clipPath: "inset(0% 0% 0% 100% round 1.5rem)", opacity: 0, x: 40 },
              { clipPath: "inset(0% 0% 0% 0% round 1.5rem)", opacity: 1, x: 0, duration: 1.2, ease: "power3.inOut", clearProps: "clipPath,opacity,transform" },
              "-=1.2"
            )
            .from(".sd-heroimg img", { scale: 1.4, duration: 1.7, ease: "power3.out" }, "<");

          gsap.to(".sd-heroimg img", {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: ".sd-hero", start: "top top", end: "bottom top", scrub: true },
          });

          /* 2. Statement card opens, text rises, stats pop one by one */
          gsap
            .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: once(".sd-overview", "top 82%") })
            .fromTo(
              ".sd-overview",
              { clipPath: "inset(10% 5% 10% 5% round 2.5rem)", opacity: 0, y: 40 },
              { clipPath: "inset(0% 0% 0% 0% round 2.5rem)", opacity: 1, y: 0, duration: 1.1, ease: "power4.out", clearProps: "clipPath,opacity,transform" }
            )
            .from(".sd-overview-text", { y: 28, opacity: 0, duration: 0.8, stagger: 0.12 }, "-=0.6")
            .from(".sd-stat", { y: 24, scale: 0.94, opacity: 0, duration: 0.7, stagger: 0.1, ease: "back.out(1.5)" }, "-=0.5");

          /* 3. Section titles: words rise when each section scrolls in */
          gsap.utils.toArray(".sd-section").forEach((section) => {
            const words = section.querySelectorAll(".sd-title .sd-word");
            if (words.length) {
              gsap.from(words, { yPercent: 115, duration: 1, stagger: 0.05, ease: "power4.out", scrollTrigger: once(section, "top 82%") });
            }
          });

          /* 4. What we can help with: rule draws, rows glide in from the left one by one */
          if (has(".sd-rule")) {
            gsap.from(".sd-rule", {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 1.4,
              ease: "power3.inOut",
              scrollTrigger: once(".sd-rule", "top 92%"),
            });
          }
          if (has(".sd-row")) {
            gsap.from(".sd-row", {
              x: -50,
              opacity: 0,
              duration: 0.9,
              stagger: 0.1,
              ease: "power3.out",
              clearProps: "transform,opacity",
              scrollTrigger: once(".sd-rows", "top 85%"),
            });
          }

          /* 5. Partner: image wipes in from the left and drifts, card opens, content follows */
          gsap.fromTo(
            ".sd-partnerimg",
            { clipPath: "inset(0% 100% 0% 0% round 1.75rem)" },
            { clipPath: "inset(0% 0% 0% 0% round 1.75rem)", duration: 1.3, ease: "power3.inOut", clearProps: "clipPath", scrollTrigger: once(".sd-partnerimg", "top 85%") }
          );
          gsap.fromTo(
            ".sd-partnerimg img",
            { yPercent: -7, scale: 1.18 },
            {
              yPercent: 7,
              scale: 1.18,
              ease: "none",
              scrollTrigger: { trigger: ".sd-partnerimg", start: "top bottom", end: "bottom top", scrub: true },
            }
          );

          gsap
            .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: once(".sd-partner", "top 78%") })
            .from(".sd-partner", { y: 50, opacity: 0, duration: 1, clearProps: "transform,opacity" })
            .from(".sd-partner-text", { y: 24, opacity: 0, duration: 0.8 }, "-=0.5")
            .from(".sd-benefit", { x: 30, opacity: 0, duration: 0.7, stagger: 0.08 }, "-=0.6")
            .from(".sd-chip", { scale: 0.8, opacity: 0, duration: 0.6, stagger: 0.05, ease: "back.out(1.7)" }, "-=0.4");

          /* 6. Method steps: dark card opens, steps rise, number circles pop */
          if (has(".sd-method")) {
            gsap
              .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: once(".sd-method", "top 80%") })
              .fromTo(
                ".sd-method",
                { clipPath: "inset(8% 4% 8% 4% round 2.5rem)", opacity: 0, y: 40 },
                { clipPath: "inset(0% 0% 0% 0% round 2.5rem)", opacity: 1, y: 0, duration: 1.1, ease: "power4.out", clearProps: "clipPath,opacity,transform" }
              )
              .from(".sd-step", { y: 40, opacity: 0, duration: 0.8, stagger: 0.12 }, "-=0.5")
              .from(".sd-stepnum", { scale: 0.5, duration: 0.7, stagger: 0.12, ease: "back.out(2)" }, "<");
          }

          /* 7. FAQs */
          gsap.from(".sd-faq", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: once(".sd-faqs", "top 88%"),
          });

          /* 8. Related services: batched rise with a clip reveal */
          if (has(".sd-related")) {
            gsap.set(".sd-related", { clipPath: "inset(100% 0% 0% 0% round 1.75rem)", y: 40 });
            ScrollTrigger.batch(".sd-related", {
              start: "top 92%",
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

          /* 9. Closing */
          gsap.from(".sd-close .sd-fade", { y: 24, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out", scrollTrigger: once(".sd-close", "top 80%") });
          gsap.from(".sd-cta", { scale: 0.85, opacity: 0, duration: 0.8, ease: "back.out(1.7)", scrollTrigger: once(".sd-cta", "top 94%") });
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
  }, [service, category, isWrongCategory, isNotFound]);

  if (isWrongCategory) {
    return <Navigate to={service.href} replace />;
  }

  if (isNotFound) {
    return <NotFound categorySlug={categorySlug} />;
  }

  const relatedServices = category.items.filter(({ slug }) => slug !== service.slug).slice(0, 3);

  return (
    <div ref={root} className="ab-pending overflow-x-clip px-3 pb-10 pt-24 sm:px-5 sm:pt-28">
      <div className="mx-auto max-w-[1400px]">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="sd-crumb mx-auto mb-5 max-w-6xl px-2 text-sm" style={{ color: C.textSecondary }}>
          <Link to="/" className="transition hover:text-[#001022]">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/services" className="transition hover:text-[#001022]">Services</Link>
          <span className="mx-2">/</span>
          <Link to={category.href} className="transition hover:text-[#001022]">{category.name}</Link>
          <span className="mx-2">/</span>
          <span aria-current="page" style={{ color: C.primary }}>{service.name}</span>
        </nav>

        {/* 1. Hero card */}
        <section
          className="sd-hero mx-auto max-w-6xl overflow-hidden rounded-[2rem] border px-6 py-12 sm:rounded-[2.5rem] sm:px-12 sm:py-16 md:grid md:grid-cols-[1.35fr_1fr] md:items-center md:gap-10"
          style={{ backgroundColor: C.primaryLight, borderColor: C.border }}
        >
          <div>
            <Link
              to={category.href}
              className="sd-label inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] outline-none transition-colors hover:bg-[#001022] hover:text-white focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
              style={{ color: C.primaryHover }}
            >
              {service.categoryName ?? category.name}
            </Link>
            <h1
              aria-label={service.name}
              style={{ fontFamily: HEADING_FONT, color: C.primary }}
              className="mt-6 text-[clamp(2rem,5.2vw,4.5rem)] font-black uppercase leading-[1.02] tracking-[-0.035em]"
            >
              <span aria-hidden="true">
                <Words text={service.name} />
              </span>
            </h1>
            {service.tagline && (
              <p className="sd-tagline mt-5 max-w-lg text-lg font-semibold leading-snug sm:text-xl" style={{ color: C.primaryHover }}>
                {service.tagline}
              </p>
            )}
          </div>

          <ImageSlot
            src={service.heroImage ?? images?.hero}
            alt={service.name}
            label="Hero image, 4:3 (e.g. 1200×900)"
            className="sd-heroimg mx-auto mt-10 aspect-[4/3.5] w-full max-w-md rounded-[1.5rem] md:mt-0"
          />
        </section>

        {/* 2. Statement card */}
        <section
          className="sd-overview mx-auto mt-6 max-w-6xl overflow-hidden rounded-[2rem] px-6 py-12 text-white sm:rounded-[2.5rem] sm:px-12 sm:py-16"
          style={{
            backgroundColor: C.primaryHover,
            backgroundImage:
              "radial-gradient(60% 80% at 10% 0%, rgba(255,255,255,0.16), transparent 70%), radial-gradient(50% 70% at 100% 100%, rgba(0,16,34,0.35), transparent 70%)",
          }}
        >
          <div className="grid gap-8 md:grid-cols-2 md:gap-14">
            <h2 style={{ fontFamily: HEADING_FONT }} className="sd-overview-text text-[clamp(1.6rem,3.2vw,2.6rem)] font-black leading-[1.08] tracking-[-0.03em]">
              Clear advice, carefully delivered.
            </h2>
            <p className="sd-overview-text text-[15px] leading-relaxed text-white/80 sm:text-base">{service.description}</p>
          </div>

          {service.stats?.length > 0 && (
            <dl className="mt-10 grid gap-3 border-t border-white/20 pt-8 sm:grid-cols-3">
              {service.stats.map(({ value, label }) => (
                <div key={label} className="sd-stat rounded-2xl bg-white/10 px-5 py-4">
                  <dt className="sr-only">{label}</dt>
                  <dd className="text-xl font-bold">{value}</dd>
                  <dd className="mt-1 text-sm text-white/70">{label}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        {/* 3. What we can help with (rows) */}
        {service.deliverables?.length > 0 && (
          <section className="sd-section mx-auto mt-24 max-w-4xl px-2 md:mt-32">
            <div className="sd-rule h-px w-full" style={{ backgroundColor: C.primary }} />
            <SectionTitle text="What we can help with" className="mt-12 text-center text-[clamp(1.75rem,4vw,3.25rem)]" />

            <ul className="sd-rows mt-12 border-b" style={{ borderColor: C.primary }}>
              {service.deliverables.map(({ title, desc }, i) => (
                <li key={title} className="sd-row border-t" style={{ borderColor: C.primary }}>
                  <Link
                    to={contactHref}
                    className="group relative flex items-center justify-between gap-6 py-6 outline-none transition-[padding] duration-500 ease-out hover:pl-3 focus-visible:pl-3 md:py-7"
                  >
                    <span className="flex items-baseline gap-5">
                      <span className="w-7 shrink-0 text-xs font-bold" style={{ color: C.primaryHover }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="block text-xl font-semibold tracking-tight sm:text-2xl" style={{ color: C.primary }}>
                          {title}
                        </span>
                        {desc && (
                          <span className="mt-1.5 block max-w-xl text-sm leading-relaxed" style={{ color: C.textSecondary }}>
                            {desc}
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors duration-300 group-hover:bg-[#001022] group-hover:text-white" style={{ borderColor: C.primary, color: C.primary }}>
                      <Arrow className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 4. Your partner */}
        <section className="mx-auto mt-24 max-w-5xl px-2 md:mt-32">
          <div className="sd-partnerimg mb-6 h-[22rem] w-full overflow-hidden rounded-[1.75rem] sm:h-[28rem] md:h-[35rem]" style={{ backgroundColor: C.primaryLight }}>
            <img
              src={service.partnerImage ?? images?.partner}
              alt={`${service.name} with Revenue Edge`}
              className="h-full w-full object-cover object-center will-change-transform"
            />
          </div>

          <div className="sd-partner sd-section rounded-[1.75rem] border p-8 sm:p-12" style={{ backgroundColor: C.tint, borderColor: C.border }}>
            <SectionTitle text={`Your ${category.name} partner`} className="text-center text-[clamp(1.75rem,3.8vw,3rem)]" />

            <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-14">
              <p className="sd-partner-text text-[15px] font-semibold leading-relaxed sm:text-base" style={{ color: C.primary }}>
                {service.details}
              </p>
              <ul className="space-y-4">
                {(service.benefits ?? []).map((b) => (
                  <li key={b} className="sd-benefit flex gap-3 text-[15px] leading-relaxed" style={{ color: C.textSecondary }}>
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white" style={{ backgroundColor: C.primaryHover }}>
                      <Check />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {service.whoItsFor?.length > 0 && (
              <div className="mt-10 border-t pt-8" style={{ borderColor: C.border }}>
                <p className="sd-partner-text text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">A good fit for</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {service.whoItsFor.map((a) => (
                    <li key={a} className="sd-chip rounded-full border bg-white px-4 py-2 text-sm font-medium" style={{ borderColor: C.border, color: C.primary }}>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* 5. Our approach (dark card) */}
        {service.methodology?.length > 0 && (
          <section
            className="sd-method sd-section mx-auto mt-24 max-w-6xl overflow-hidden rounded-[2rem] px-6 py-14 sm:rounded-[2.5rem] sm:px-12 md:mt-32 md:py-20"
            style={{
              backgroundColor: C.primary,
              backgroundImage:
                "radial-gradient(60% 90% at 88% 0%, rgba(11,61,145,0.32), transparent 70%), repeating-radial-gradient(circle at 88% 0%, rgba(255,255,255,0.035) 0 1px, transparent 1px 26px)",
            }}
          >
            <h2
              aria-label="A clear path forward"
              style={{ fontFamily: HEADING_FONT }}
              className="sd-title text-center text-[clamp(1.75rem,4vw,3.25rem)] font-black uppercase leading-[1.02] tracking-[-0.035em] text-white"
            >
              <span aria-hidden="true">
                <Words text="A clear path forward" />
              </span>
            </h2>
            <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {service.methodology.map(({ step, title, desc }) => (
                <li key={step} className="sd-step">
                  <span className="sd-stepnum grid h-12 min-w-12 w-fit place-items-center rounded-full px-3 text-sm font-bold" style={{ backgroundColor: C.primaryLight, color: C.primary, fontFamily: HEADING_FONT }}>
                    {step}
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/65">{desc}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* 6. FAQs */}
        {service.faqs?.length > 0 && (
          <section className="sd-section mx-auto mt-24 max-w-3xl px-2 md:mt-32">
            <SectionTitle text="Frequently asked" className="text-center text-[clamp(1.75rem,4vw,3rem)]" />
            <div className="sd-faqs mt-10 space-y-3">
              {service.faqs.map((f, i) => (
                <Faq key={f.question} item={f} id={`faq-${i}`} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
              ))}
            </div>
          </section>
        )}

        {/* 7. Related services */}
        {relatedServices.length > 0 && (
          <section className="sd-section mx-auto mt-24 max-w-6xl px-2 md:mt-32">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <SectionTitle text="Related services" className="text-[clamp(1.75rem,3.6vw,2.75rem)]" />
              <Link to={category.href} className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[#0B3D91]" style={{ color: C.primary }}>
                All {category.name} <Arrow />
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {relatedServices.map((item) => (
                <Link
                  key={item.slug || item.href}
                  to={item.href}
                  className="sd-related group flex flex-col rounded-[1.75rem] border border-[#E2E8F0] bg-white p-7 text-[#001022] transition-[transform,background-color,border-color,color,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:border-[#001022] hover:bg-[#001022] hover:text-white hover:shadow-[0_28px_44px_-28px_rgba(0,16,34,0.5)]"
                >
                  <h3 className="text-xl font-bold tracking-tight">{item.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[#475569] transition-colors duration-500 group-hover:text-white/70">{item.tagline}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                    View service <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 8. Closing call to action */}
        <section className="sd-close sd-section mx-auto mb-6 mt-24 max-w-2xl px-2 text-center md:mt-32">
          <SectionTitle text="Let’s get your numbers working for you" className="text-[clamp(1.75rem,4vw,3.25rem)]" />
          <p className="sd-fade mx-auto mt-5 max-w-lg text-[15px] leading-relaxed sm:text-base" style={{ color: C.textSecondary }}>
            If you’re tired of flying blind or feeling buried in admin, let’s chat. We’ll talk through where you are and
            what the right next step looks like.
          </p>
          <div className="mt-8 flex justify-center">
            <PillButton to={contactHref} className="sd-cta">Get in touch</PillButton>
          </div>
        </section>
      </div>
    </div>
  );
}