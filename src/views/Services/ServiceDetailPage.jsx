import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getServiceCategory, getServiceItem } from "../../data/serviceData";

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

const Words = ({ text = "" }) =>
  (text || "").split(" ").map((w, i) => (
    <span key={`${w}-${i}`}>
      <span className="inline-block overflow-hidden py-[0.05em] align-bottom">
        <span className="sd-word inline-block will-change-transform">{w}</span>
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
          className="h-full w-full object-cover"
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
    <div className="sd-reveal overflow-hidden rounded-2xl border bg-white transition-colors duration-300" style={{ borderColor: open ? C.primary : C.border }}>
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

function NotFound({ categorySlug }) {
  const category = getServiceCategory(categorySlug);
  return (
    <div className="grid min-h-[70vh] place-items-center px-5 py-20 text-center">
      <div className="max-w-xl rounded-[2rem] border bg-white p-10 shadow-[0_30px_70px_-40px_rgba(0,16,34,0.4)]" style={{ borderColor: C.border }}>
        <span className="inline-flex rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ backgroundColor: C.primaryLight, color: C.primaryHover }}>
          Service not found
        </span>
        <SectionTitle className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)]">Let’s find the right support</SectionTitle>
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
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(".sd-label", { y: 16, opacity: 0, duration: 0.6 })
          .from(".sd-word", { yPercent: 115, duration: 1, stagger: 0.05 }, "-=0.3")
          .from(".sd-heroimg", { y: 40, opacity: 0, scale: 0.95, duration: 1 }, "-=0.8");

        if (root.current?.querySelector(".sd-tagline")) {
          tl.from(".sd-tagline", { y: 20, opacity: 0, duration: 0.7 }, "-=0.8");
        }

        gsap.utils.toArray(".sd-reveal").forEach((el) => {
          gsap.from(el, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
        });

        if (root.current?.querySelector(".sd-row")) {
          gsap.from(".sd-row", {
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: ".sd-rows", start: "top 85%" },
          });
        }

        if (root.current?.querySelector(".sd-rule")) {
          gsap.from(".sd-rule", {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: { trigger: ".sd-rule", start: "top 92%" },
          });
        }

        if (root.current?.querySelector(".sd-step")) {
          gsap.from(".sd-step", {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: ".sd-steps", start: "top 85%" },
          });
        }
      });
    }, root);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [service, category, isWrongCategory, isNotFound]);

  if (isWrongCategory) {
    return <Navigate to={service.href} replace />;
  }

  if (isNotFound) {
    return <NotFound categorySlug={categorySlug} />;
  }

  const relatedServices = category.items.filter(({ slug }) => slug !== service.slug).slice(0, 3);

  return (
    <div ref={root} className="px-3 pb-10 pt-24 sm:px-5 sm:pt-28">
      <div className="mx-auto max-w-[1400px]">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mx-auto mb-5 max-w-6xl px-2 text-sm" style={{ color: C.textSecondary }}>
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
          className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border px-6 py-12 sm:rounded-[2.5rem] sm:px-12 sm:py-16 md:grid md:grid-cols-[1.35fr_1fr] md:items-center md:gap-10"
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
          className="sd-reveal mx-auto mt-6 max-w-6xl overflow-hidden rounded-[2rem] px-6 py-12 text-white sm:rounded-[2.5rem] sm:px-12 sm:py-16"
          style={{
            backgroundColor: C.primaryHover,
            backgroundImage:
              "radial-gradient(60% 80% at 10% 0%, rgba(255,255,255,0.16), transparent 70%), radial-gradient(50% 70% at 100% 100%, rgba(0,16,34,0.35), transparent 70%)",
          }}
        >
          <div className="grid gap-8 md:grid-cols-2 md:gap-14">
            <h2 style={{ fontFamily: HEADING_FONT }} className="text-[clamp(1.6rem,3.2vw,2.6rem)] font-black leading-[1.08] tracking-[-0.03em]">
              Clear advice, carefully delivered.
            </h2>
            <p className="text-[15px] leading-relaxed text-white/80 sm:text-base">{service.description}</p>
          </div>

          {service.stats?.length > 0 && (
            <dl className="mt-10 grid gap-3 border-t border-white/20 pt-8 sm:grid-cols-3">
              {service.stats.map(({ value, label }) => (
                <div key={label} className="rounded-2xl bg-white/10 px-5 py-4">
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
          <section className="mx-auto mt-24 max-w-4xl px-2 md:mt-32">
            <div className="sd-rule h-px w-full" style={{ backgroundColor: C.primary }} />
            <SectionTitle className="sd-reveal mt-12 text-center text-[clamp(1.75rem,4vw,3.25rem)]">What we can help with</SectionTitle>

            <ul className="sd-rows mt-12 border-b" style={{ borderColor: C.primary }}>
              {service.deliverables.map(({ title, desc }, i) => (
                <li key={title} className="sd-row border-t" style={{ borderColor: C.primary }}>
                  <Link
                    to={contactHref}
                    className="group relative flex items-center justify-between gap-6 py-6 outline-none transition-[padding] duration-300 hover:pl-3 focus-visible:pl-3 md:py-7"
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
                      <Arrow className="-rotate-45 transition-transform group-hover:text-white duration-300 group-hover:rotate-0" />
                    </span>

                    {/* progress line */}
                    <span aria-hidden="true" className="pointer-events-none absolute -bottom-px left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-[#0B3D91] to-[#001022] transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:duration-[900ms] group-focus-visible:scale-x-100 motion-reduce:transition-none" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 4. Your partner: sketch overlapping a soft card */}
        <section className="mx-auto mt-24 max-w-5xl px-2 md:mt-32">
          <img
            src={service.partnerImage ?? images?.partner}
            alt={`${service.name} with Revenue Edge`}
            className="sd-reveal mb-6 h-[35rem] object-cover object-center w-full rounded-[1.75rem]"
          />

          <div className="sd-reveal rounded-[1.75rem] border p-8 sm:p-12" style={{ backgroundColor: C.tint, borderColor: C.border }}>
            <SectionTitle className="text-center text-[clamp(1.75rem,3.8vw,3rem)]">Your {category.name} partner</SectionTitle>

            <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-14">
              <p className="text-[15px] font-semibold leading-relaxed sm:text-base" style={{ color: C.primary }}>
                {service.details}
              </p>
              <ul className="space-y-4">
                {service.benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-[15px] leading-relaxed" style={{ color: C.textSecondary }}>
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">A good fit for</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {service.whoItsFor.map((a) => (
                    <li key={a} className="rounded-full border bg-white px-4 py-2 text-sm font-medium" style={{ borderColor: C.border, color: C.primary }}>
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
            className="mx-auto mt-24 max-w-6xl overflow-hidden rounded-[2rem] px-6 py-14 sm:rounded-[2.5rem] sm:px-12 md:mt-32 md:py-20"
            style={{
              backgroundColor: C.primary,
              backgroundImage:
                "radial-gradient(60% 90% at 88% 0%, rgba(11,61,145,0.32), transparent 70%), repeating-radial-gradient(circle at 88% 0%, rgba(255,255,255,0.035) 0 1px, transparent 1px 26px)",
            }}
          >
            <h2 style={{ fontFamily: HEADING_FONT }} className="sd-reveal text-center text-[clamp(1.75rem,4vw,3.25rem)] font-black uppercase leading-[1.02] tracking-[-0.035em] text-white">
              A clear path forward
            </h2>
            <ol className="sd-steps mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {service.methodology.map(({ step, title, desc }) => (
                <li key={step} className="sd-step">
                  <span className="grid h-12 min-w-12 w-fit place-items-center rounded-full px-3 text-sm font-bold" style={{ backgroundColor: C.primaryLight, color: C.primary, fontFamily: HEADING_FONT }}>
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
          <section className="mx-auto mt-24 max-w-3xl px-2 md:mt-32">
            <SectionTitle className="sd-reveal text-center text-[clamp(1.75rem,4vw,3rem)]">Frequently asked</SectionTitle>
            <div className="mt-10 space-y-3">
              {service.faqs.map((f, i) => (
                <Faq key={f.question} item={f} id={`faq-${i}`} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
              ))}
            </div>
          </section>
        )}

        {/* 7. Related services */}
        {relatedServices.length > 0 && (
          <section className="mx-auto mt-24 max-w-6xl px-2 md:mt-32">
            <div className="sd-reveal flex flex-wrap items-end justify-between gap-5">
              <SectionTitle className="text-[clamp(1.75rem,3.6vw,2.75rem)]">Related services</SectionTitle>
              <Link to={category.href} className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[#0B3D91]" style={{ color: C.primary }}>
                All {category.name} <Arrow />
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {relatedServices.map((item) => (
                <Link
                  key={item.slug || item.href}
                  to={item.href}
                  className="sd-reveal group flex flex-col rounded-[1.75rem] border border-[#E2E8F0] bg-white p-7 text-[#001022] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#001022] hover:bg-[#001022] hover:text-white"
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
        <section className="mx-auto mb-6 mt-24 max-w-2xl px-2 text-center md:mt-32">
          <SectionTitle className="sd-reveal text-[clamp(1.75rem,4vw,3.25rem)]">Let’s get your numbers working for you</SectionTitle>
          <p className="sd-reveal mx-auto mt-5 max-w-lg text-[15px] leading-relaxed sm:text-base" style={{ color: C.textSecondary }}>
            If you’re tired of flying blind or feeling buried in admin, let’s chat. We’ll talk through where you are and
            what the right next step looks like.
          </p>
          <div className="sd-reveal mt-8 flex justify-center">
            <PillButton to={contactHref}>Get in touch</PillButton>
          </div>
        </section>
      </div>
    </div>
  );
}