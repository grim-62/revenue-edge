import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { deferGsap } from "../../deferGsap";

const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';
const HERO_TITLE = "Don’t take our word for it.";

const C = {
  ink: "#001022",
  blue: "#BCD0FF",
  light: "#E8F0FF",
  tint: "#F1F6FF",
  hover: "#0B3D91",
  muted: "#475569",
  border: "#E2E8F0",
};

const FILTERS = [
  { id: "all", label: "All reviews" },
  { id: "business", label: "Business owners" },
  { id: "investor", label: "Investors" },
  { id: "corporate", label: "Corporate" },
];

/* PLACEHOLDERS: replace with real client reviews (with permission) before launch,
   or pass your own with <ReviewsPage reviews={[...]} />.
   Each review: { name, role, group: "business" | "investor" | "corporate", rating, text, service?, date? } */
const PLACEHOLDER_REVIEWS = [
  { name: "Client name", role: "Business owner", group: "business", rating: 5, service: "Tax & Compliance", date: "2026", text: "Replace this with a real client review. Two or three sentences work best." },
  { name: "Client name", role: "Investor", group: "investor", rating: 5, service: "Property Tax", date: "2026", text: "Replace this with a real client review. A longer review can talk about what changed after working with you, how clearly things were explained, and what the client would tell a friend." },
  { name: "Client name", role: "Finance director", group: "corporate", rating: 5, service: "Corporate Advisory", date: "2026", text: "Replace this with a real client review." },
  { name: "Client name", role: "Founder", group: "business", rating: 5, service: "Accounting", date: "2026", text: "Replace this with a real client review. Two or three sentences work best, ideally with a specific result or moment." },
  { name: "Client name", role: "SMSF trustee", group: "investor", rating: 4, service: "SMSF", date: "2025", text: "Replace this with a real client review. Mention what the service helped with and how it felt to work with the team." },
  { name: "Client name", role: "CFO", group: "corporate", rating: 5, service: "Valuations & Audits", date: "2025", text: "Replace this with a real client review. A medium-length review is perfect here, with a clear before-and-after story that feels honest." },
];

const STATS = [
  { value: "5.0", label: "Average rating" },
  { value: "100%", label: "Would recommend" },
  { value: "24h", label: "Typical reply time" },
  { value: "1:1", label: "Dedicated advisor" },
];

/* ───────── Small pieces ───────── */
const Star = ({ filled, className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill={filled ? "#F5B301" : "#E2E8F0"} aria-hidden="true">
    <path d="M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.2l-5.7 3 1.1-6.3L2.8 9.5l6.4-.9L12 2.8z" />
  </svg>
);

const QuoteMark = ({ className = "" }) => (
  <svg viewBox="0 0 48 36" className={className} fill="currentColor" aria-hidden="true">
    <path d="M0 36V21.6C0 9.6 6.4 2.4 18 0l1.6 5.6C13.6 7.6 11 11.2 10.6 16H20v20H0zm28 0V21.6C28 9.6 34.4 2.4 46 0l1.6 5.6C41.6 7.6 39 11.2 38.6 16H48v20H28z" />
  </svg>
);

function Arrow({ className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${className}`} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 52 52" className="h-16 w-16" fill="none" stroke={C.ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle className="rv-draw" pathLength="1" strokeDasharray="1" cx="26" cy="26" r="23" />
      <path className="rv-draw" pathLength="1" strokeDasharray="1" d="M15 27l8 8 14-16" />
    </svg>
  );
}

/* Each word sits in a mask so it can slide up into view */
function Words({ text }) {
  return text.split(" ").map((word, i) => (
    <span key={`${word}-${i}`}>
      <span className="inline-block overflow-hidden py-[0.05em] align-bottom">
        <span className="rv-word inline-block will-change-transform">{word}</span>
      </span>{" "}
    </span>
  ));
}

const Title = ({ text, className = "" }) => (
  <h2
    aria-label={text}
    style={{ fontFamily: HEADING_FONT, color: C.ink }}
    className={`font-black uppercase leading-[1.02] tracking-[-0.04em] ${className}`}
  >
    <span aria-hidden="true">
      <Words text={text} />
    </span>
  </h2>
);

const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const inputCls =
  "w-full rounded-xl border bg-white px-4 py-3 text-[15px] outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-slate-400 focus:border-[#0B3D91] focus:shadow-[0_0_0_4px_rgba(188,208,255,0.55)]";

function ReviewCard({ r }) {
  return (
    <figure
      className="rv-card group mb-4 flex break-inside-avoid flex-col rounded-[1.75rem] border bg-white p-7 transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1.5 hover:border-[#0B3D91] hover:shadow-[0_28px_44px_-28px_rgba(0,16,34,0.35)]"
      style={{ borderColor: C.border }}
    >
      <div className="flex items-start justify-between">
        <span style={{ color: C.hover }}>
          <QuoteMark className="h-7 w-9 transition-transform duration-500 group-hover:-rotate-6" />
        </span>
        <div className="flex gap-0.5" role="img" aria-label={`${r.rating} out of 5 stars`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} filled={n <= r.rating} />
          ))}
        </div>
      </div>

      <blockquote className="mt-5 text-[16px] leading-relaxed" style={{ color: C.muted }}>
        {r.text}
      </blockquote>

      {r.service && (
        <span className="mt-5 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: C.light, color: C.hover }}>
          {r.service}
        </span>
      )}

      <figcaption className="mt-6 flex items-center gap-3 border-t pt-5" style={{ borderColor: C.border }}>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold" style={{ backgroundColor: C.light, color: C.hover }} aria-hidden="true">
          {initials(r.name)}
        </span>
        <span>
          <span className="block text-[15px] font-semibold" style={{ color: C.ink }}>{r.name}</span>
          <span className="block text-xs" style={{ color: C.muted }}>
            {r.role}{r.date ? ` · ${r.date}` : ""}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/* ───────── Page ───────── */
export default function ReviewsPage({ reviews = PLACEHOLDER_REVIEWS, contactHref = "/contact", endpoint = "", onSubmit }) {
  const root = useRef(null);
  const firstFilter = useRef(true);
  const formRef = useRef(null);

  const [filter, setFilter] = useState("all");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const total = reviews.length;
  const average = total ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / total : 0;
  const distribution = useMemo(
    () => [5, 4, 3, 2, 1].map((n) => ({ n, count: reviews.filter((r) => r.rating === n).length })),
    [reviews]
  );
  const visible = filter === "all" ? reviews : reviews.filter((r) => r.group === filter);

  /* ---------- Review form ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const fd = new FormData(e.currentTarget);
    if (fd.get("website")) return; // honeypot

    const next = {};
    if (!String(fd.get("name") || "").trim()) next.name = "Please enter your name.";
    if (!rating) next.rating = "Please choose a star rating.";
    if (String(fd.get("text") || "").trim().length < 20) next.text = "Please write at least a couple of sentences.";
    if (!fd.get("consent")) next.consent = "Please confirm we may publish your review.";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      formRef.current?.querySelector(first === "rating" ? "[data-star]" : `[name="${first}"]`)?.focus();
      return;
    }

    fd.set("rating", String(rating));
    setStatus("sending");
    try {
      if (onSubmit) await onSubmit(fd);
      else if (endpoint) {
        const res = await fetch(endpoint, { method: "POST", body: fd });
        if (!res.ok) throw new Error("Request failed");
      } else {
        await new Promise((r) => setTimeout(r, 900)); // demo only: no endpoint set
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  /* ---------- Page animation ---------- */
  useEffect(() => {
    const fallback = setTimeout(() => root.current?.classList.remove("ab-pending"), 2500);

    const cleanup = deferGsap((gsap, ScrollTrigger) => {
      const el = root.current;
      if (!el) return undefined;

      const context = gsap.context(() => {
        const motion = gsap.matchMedia();

        motion.add("(prefers-reduced-motion: no-preference)", () => {
          const once = (trigger, start = "top 80%") => ({ trigger, start, once: true });

          /* 1. Hero: card opens, title rises, rating card slides in from the right, bars fill */
          gsap
            .timeline({ defaults: { ease: "power4.out" } })
            .from(".rv-hero", { y: 28, opacity: 0, duration: 0.9 })
            .from(".rv-badge", { y: 16, opacity: 0, duration: 0.6 }, "-=0.6")
            .from(".rv-hero .rv-word", { yPercent: 115, duration: 1.05, stagger: 0.07 }, "-=0.35")
            .from(".rv-hero-text", { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.6")
            .fromTo(
              ".rv-score",
              { clipPath: "inset(0% 0% 0% 100% round 1.5rem)", opacity: 0, x: 40 },
              { clipPath: "inset(0% 0% 0% 0% round 1.5rem)", opacity: 1, x: 0, duration: 1.2, ease: "power3.inOut", clearProps: "clipPath,opacity,transform" },
              "-=1.1"
            )
            .from(".rv-bigstar", { scale: 0, rotate: -40, duration: 0.6, stagger: 0.08, ease: "back.out(2)" }, "-=0.5")
            .from(".rv-bar", { scaleX: 0, transformOrigin: "left center", duration: 1, stagger: 0.08, ease: "power3.out" }, "-=0.6");

          /* 2. Stats: pop in one by one */
          gsap.from(".rv-stat", { y: 30, scale: 0.94, opacity: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.4)", clearProps: "transform,opacity", scrollTrigger: once(".rv-stats", "top 88%") });

          /* 3. Reviews: title rises, filters pop, cards lift in a wave */
          gsap.from(".rv-list .rv-word", { yPercent: 115, duration: 1, stagger: 0.07, ease: "power4.out", scrollTrigger: once(".rv-list", "top 82%") });
          gsap.from(".rv-filter", { y: 16, scale: 0.9, opacity: 0, duration: 0.6, stagger: 0.07, ease: "back.out(1.6)", clearProps: "transform,opacity", scrollTrigger: once(".rv-filters", "top 90%") });
          gsap.from(".rv-card", {
            y: 60,
            opacity: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: once(".rv-grid", "top 88%"),
          });

          /* 4. Leave a review: info slides from the left, card opens, fields rise */
          gsap
            .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: once(".rv-write", "top 75%") })
            .from(".rv-write .rv-word", { yPercent: 115, duration: 1, stagger: 0.06, ease: "power4.out" })
            .from(".rv-write-info .rv-fade", { x: -40, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.6")
            .fromTo(
              ".rv-form-card",
              { clipPath: "inset(8% 4% 8% 4% round 2rem)", opacity: 0, y: 40 },
              { clipPath: "inset(0% 0% 0% 0% round 1.75rem)", opacity: 1, y: 0, duration: 1.1, ease: "power4.out", clearProps: "clipPath,opacity,transform" },
              "-=1.1"
            )
            .from(".rv-form-card .rv-field", { y: 24, opacity: 0, duration: 0.7, stagger: 0.07, clearProps: "transform,opacity" }, "-=0.6");

          /* 5. Closing */
          gsap.from(".rv-close .rv-word", { yPercent: 115, duration: 1, stagger: 0.05, ease: "power4.out", scrollTrigger: once(".rv-close", "top 78%") });
          gsap.from(".rv-close .rv-fade", { y: 24, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out", scrollTrigger: once(".rv-close", "top 78%") });
          gsap.from(".rv-cta", { scale: 0.85, opacity: 0, duration: 0.8, ease: "back.out(1.7)", scrollTrigger: once(".rv-cta", "top 94%") });
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
  }, []);

  /* Filter change: new set of cards rises in smoothly */
  useEffect(() => {
    if (firstFilter.current) {
      firstFilter.current = false;
      return undefined;
    }
    return deferGsap((gsap, ScrollTrigger) => {
      const ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.fromTo(".rv-card", { y: 40, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.08, ease: "power3.out", clearProps: "transform,opacity" });
        });
      }, root);
      ScrollTrigger?.refresh();
      return () => ctx.revert();
    });
  }, [filter]);

  /* Success state: tick draws itself, message follows */
  useEffect(() => {
    if (status !== "success") return undefined;
    return deferGsap((gsap) => {
      const ctx = gsap.context(() => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".rv-success", { scale: 0.96, opacity: 0, duration: 0.5 })
          .from(".rv-draw", { strokeDashoffset: 1, duration: 0.9, stagger: 0.25, ease: "power2.inOut" }, "-=0.2")
          .from(".rv-success-item", { y: 18, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.4");
      }, root);
      return () => ctx.revert();
    });
  }, [status]);

  const shownRating = hoverRating || rating;

  return (
    <div ref={root} className="ab-pending overflow-x-clip px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-6xl">
        {/* 1. Hero */}
        <section className="rv-hero overflow-hidden rounded-[2rem] border px-6 py-12 sm:rounded-[2.5rem] sm:px-12 sm:py-16 md:grid md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10" style={{ backgroundColor: C.light, borderColor: C.border }}>
          <div>
            <span className="rv-badge inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.ink }}>
              Client reviews
            </span>
            <h1
              aria-label={HERO_TITLE}
              style={{ fontFamily: HEADING_FONT, color: C.ink }}
              className="mt-6 text-[clamp(2.2rem,5.4vw,4.6rem)] font-black uppercase leading-[1.02] tracking-[-0.035em]"
            >
              <span aria-hidden="true">
                <Words text={HERO_TITLE} />
              </span>
            </h1>
            <p className="rv-hero-text mt-5 max-w-md text-base leading-relaxed" style={{ color: C.muted }}>
              Real words from business owners, investors and corporate teams we work with.
            </p>
            <a
              href="#all-reviews"
              className="rv-hero-text group mt-8 inline-flex items-center gap-3 font-semibold transition-colors hover:text-[#0B3D91]"
              style={{ color: C.ink }}
            >
              Read the reviews
              <Arrow className="rotate-90 transition-transform group-hover:translate-y-1" />
            </a>
          </div>

          <div className="rv-score mx-auto mt-10 w-full max-w-sm rounded-[1.5rem] bg-white p-7 shadow-[0_30px_60px_-40px_rgba(0,16,34,0.4)] md:mt-0">
            <div className="flex items-end gap-4">
              <span style={{ fontFamily: HEADING_FONT, color: C.ink }} className="text-6xl font-black leading-none tracking-[-0.05em]">
                {average.toFixed(1)}
              </span>
              <div className="pb-1">
                <div className="flex gap-0.5" role="img" aria-label={`Average rating ${average.toFixed(1)} out of 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} className="rv-bigstar inline-block">
                      <Star filled={n <= Math.round(average)} className="h-5 w-5" />
                    </span>
                  ))}
                </div>
                <p className="mt-1 text-sm" style={{ color: C.muted }}>
                  From {total} review{total === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <ul className="mt-6 space-y-2.5" aria-label="Rating breakdown">
              {distribution.map(({ n, count }) => (
                <li key={n} className="flex items-center gap-3 text-xs font-semibold" style={{ color: C.muted }}>
                  <span className="w-4">{n}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: C.light }}>
                    <span className="rv-bar block h-full rounded-full" style={{ width: total ? `${(count / total) * 100}%` : 0, backgroundColor: C.hover }} />
                  </span>
                  <span className="w-4 text-right">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 2. Stats */}
        <section className="rv-stats mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" aria-label="Highlights">
          {STATS.map((s) => (
            <div key={s.label} className="rv-stat rounded-[1.5rem] px-6 py-6 text-center" style={{ backgroundColor: C.tint }}>
              <p style={{ fontFamily: HEADING_FONT, color: C.ink }} className="text-3xl font-black tracking-[-0.03em] sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm" style={{ color: C.muted }}>{s.label}</p>
            </div>
          ))}
        </section>

        {/* 3. Reviews */}
        <section id="all-reviews" className="rv-list scroll-mt-24 py-16 sm:py-24">
          <div className="text-center">
            <Title text="What our clients say" className="text-[clamp(2rem,4.6vw,3.8rem)]" />
          </div>

          <div className="rv-filters mt-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter reviews">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.id)}
                  className="rv-filter rounded-full border px-5 py-2.5 text-sm font-semibold outline-none transition-[background-color,color,border-color,transform] duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
                  style={{
                    backgroundColor: active ? C.ink : "#fff",
                    color: active ? "#fff" : C.ink,
                    borderColor: active ? C.ink : C.border,
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="rv-grid mt-10 columns-1 gap-4 md:columns-2 lg:columns-3">
            {visible.map((r, i) => (
              <ReviewCard key={`${filter}-${r.name}-${i}`} r={r} />
            ))}
          </div>

          {visible.length === 0 && (
            <p className="mt-10 text-center text-[15px]" style={{ color: C.muted }}>
              No reviews in this group yet.
            </p>
          )}
        </section>

        {/* 4. Leave a review */}
        <section id="write-review" className="rv-write mb-16 scroll-mt-24 sm:mb-24">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
            <div className="rv-write-info md:sticky md:top-28 md:self-start">
              <Title text="Worked with us? Tell us how it went." className="text-[clamp(1.9rem,3.8vw,3rem)]" />
              <p className="rv-fade mt-5 max-w-md text-base leading-relaxed" style={{ color: C.muted }}>
                Honest feedback helps us improve and helps others choose the right advisor. It takes about a minute.
              </p>
              <ul className="mt-8 space-y-4">
                {["We read every review", "Reviews are checked before they’re published", "You can ask us to remove yours at any time"].map((t) => (
                  <li key={t} className="rv-fade flex items-center gap-3 text-[15px] font-semibold" style={{ color: C.ink }}>
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full" style={{ backgroundColor: C.blue }}>
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke={C.ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 13l4 4 10-10" /></svg>
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rv-form-card rounded-[1.75rem] border p-6 sm:p-10" style={{ backgroundColor: C.tint, borderColor: C.border }}>
              {status === "success" ? (
                <div className="rv-success flex min-h-[26rem] flex-col items-center justify-center text-center" role="status">
                  <Check />
                  <h3 className="rv-success-item mt-6 text-2xl font-bold" style={{ color: C.ink }}>Thank you for your review</h3>
                  <p className="rv-success-item mt-3 max-w-sm text-[15px] leading-relaxed" style={{ color: C.muted }}>
                    We’ll check it and publish it shortly. We really appreciate you taking the time.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setStatus("idle"); setRating(0); setErrors({}); }}
                    className="rv-success-item mt-6 text-sm font-semibold underline underline-offset-4 transition-colors hover:text-[#0B3D91]"
                    style={{ color: C.ink }}
                  >
                    Write another review
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                  <div className="rv-field">
                    <label className="block text-sm font-semibold" style={{ color: C.ink }}>
                      Your name
                      <input name="name" type="text" autoComplete="name" placeholder="Your name" className={`${inputCls} mt-2`} style={{ borderColor: errors.name ? "#DC2626" : C.border }} />
                    </label>
                    <p role={errors.name ? "alert" : undefined} className={`overflow-hidden text-[13px] text-red-600 transition-all duration-300 ${errors.name ? "mt-1.5 max-h-6 opacity-100" : "max-h-0 opacity-0"}`}>{errors.name}</p>
                  </div>

                  <div className="rv-field">
                    <label className="block text-sm font-semibold" style={{ color: C.ink }}>
                      Your role (optional)
                      <input name="role" type="text" placeholder="e.g. Business owner" className={`${inputCls} mt-2`} style={{ borderColor: C.border }} />
                    </label>
                  </div>

                  <div className="rv-field sm:col-span-2">
                    <span className="block text-sm font-semibold" style={{ color: C.ink }} id="rating-label">Your rating</span>
                    <div className="mt-2 flex items-center gap-1" role="radiogroup" aria-labelledby="rating-label" onMouseLeave={() => setHoverRating(0)}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          data-star
                          role="radio"
                          aria-checked={rating === n}
                          aria-label={`${n} star${n > 1 ? "s" : ""}`}
                          onMouseEnter={() => setHoverRating(n)}
                          onClick={() => setRating(n)}
                          className="rounded-md p-1 outline-none transition-transform duration-300 ease-out hover:scale-125 focus-visible:ring-2 focus-visible:ring-[#0B3D91] active:scale-95"
                        >
                          <Star filled={n <= shownRating} className="h-8 w-8 transition-colors duration-200" />
                        </button>
                      ))}
                    </div>
                    <p role={errors.rating ? "alert" : undefined} className={`overflow-hidden text-[13px] text-red-600 transition-all duration-300 ${errors.rating ? "mt-1.5 max-h-6 opacity-100" : "max-h-0 opacity-0"}`}>{errors.rating}</p>
                  </div>

                  <div className="rv-field sm:col-span-2">
                    <label className="block text-sm font-semibold" style={{ color: C.ink }}>
                      Your review
                      <textarea name="text" rows={5} placeholder="What did we help you with, and how did it go?" className={`${inputCls} mt-2 resize-none`} style={{ borderColor: errors.text ? "#DC2626" : C.border }} />
                    </label>
                    <p role={errors.text ? "alert" : undefined} className={`overflow-hidden text-[13px] text-red-600 transition-all duration-300 ${errors.text ? "mt-1.5 max-h-6 opacity-100" : "max-h-0 opacity-0"}`}>{errors.text}</p>
                  </div>

                  <div className="rv-field sm:col-span-2">
                    <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed" style={{ color: C.muted }}>
                      <input name="consent" type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[#0B3D91]" />
                      I’m happy for Revenue Edge to publish my review with my name and role.
                    </label>
                    <p role={errors.consent ? "alert" : undefined} className={`overflow-hidden text-[13px] text-red-600 transition-all duration-300 ${errors.consent ? "mt-1.5 max-h-6 opacity-100" : "max-h-0 opacity-0"}`}>{errors.consent}</p>
                  </div>

                  <div className="rv-field sm:col-span-2">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group inline-flex items-center gap-4 rounded-full py-2 pl-7 pr-2 text-[15px] font-semibold text-white outline-none transition-all duration-300 hover:bg-[#0B3D91] focus-visible:ring-2 focus-visible:ring-[#0B3D91] focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-70"
                      style={{ backgroundColor: C.ink }}
                    >
                      {status === "sending" ? "Sending…" : "Submit review"}
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-white" style={{ color: C.ink }}>
                        {status === "sending" ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Arrow className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                        )}
                      </span>
                    </button>
                    <p role="alert" className={`overflow-hidden text-sm text-red-600 transition-all duration-300 ${status === "error" ? "mt-3 max-h-10 opacity-100" : "max-h-0 opacity-0"}`}>
                      Something went wrong sending your review. Please try again.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* 5. Closing */}
        <section className="rv-close rounded-[2rem] px-6 py-14 text-center sm:px-12 sm:py-20" style={{ backgroundColor: C.blue }}>
          <Title text="Ready to see why clients stay?" className="mx-auto max-w-3xl text-[clamp(2rem,5vw,4rem)]" />
          <p className="rv-fade mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: "#1E293B" }}>
            Tell us where you are and what you’re aiming for. We’ll talk through the right next step.
          </p>
          <Link
            to={contactHref}
            className="rv-cta group mt-8 inline-flex items-center gap-4 rounded-full py-2 pl-6 pr-2 text-sm font-semibold text-white transition-colors hover:bg-[#0B3D91] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3D91]"
            style={{ backgroundColor: C.ink }}
          >
            Book a conversation
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white" style={{ color: C.ink }}>
              <Arrow className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
            </span>
          </Link>
        </section>
      </div>
    </div>
  );
}