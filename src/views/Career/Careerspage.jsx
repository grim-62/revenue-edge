import { useCallback, useEffect, useRef, useState } from "react";
import { deferGsap } from "../../deferGsap";

const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';
const HERO_TITLE = "Why join us? That’s easy.";

const C = {
  ink: "#001022",
  blue: "#BCD0FF",
  light: "#E8F0FF",
  tint: "#F1F6FF",
  hover: "#0B3D91",
  muted: "#475569",
  border: "#E2E8F0",
};

/* PLACEHOLDERS: replace copy, roles and quotes with your real content */
const INTRO_PARAGRAPHS = [
  "Tired of the grind without the growth? That’s why we built Revenue Edge: a practice where the effort gets you somewhere, with real opportunity and more out of yourself.",
  "We believe work should feel like it matters. Not just churning through the same jobs, but building real relationships, solving real problems and helping business owners win at life.",
  "If that sounds good, we might just be your people.",
];

const PERKS = [
  { id: "people", title: "People-first culture", body: "A team that listens, explains and has your back." },
  { id: "growth", title: "Serious career growth", body: "Clear progression, study support and paid exam leave." },
  { id: "standards", title: "High standards, no ego", body: "Great work, shared openly, with no hierarchy games." },
  { id: "autonomy", title: "Autonomy (no, really!)", body: "Flexible hours, hybrid work and trust from day one." },
];

const DIFFERENCE = [
  "We’re building something different. Beyond box-ticking, it’s real relationships, real autonomy and real growth.",
  "With clear progression pathways, salary reviews and development opportunities, you won’t be left in a dead-end role just spinning your wheels.",
  "If you’re ready to be part of a team with heaps of upside, check out the current opportunities below.",
];

const ROLES = [
  { title: "Tax Accountant", team: "Tax", type: "Full-time", place: "Hybrid" },
  { title: "Business Advisory Associate", team: "Advisory", type: "Full-time", place: "Hybrid" },
  { title: "Bookkeeper", team: "Accounting", type: "Part-time", place: "Remote" },
  { title: "Graduate Accountant", team: "Accounting", type: "Full-time", place: "Office" },
];

const TEAM_QUOTES = [
  { text: "Replace this with a real quote from a team member. Two or three sentences work best.", name: "Team member", role: "Senior Accountant" },
  { text: "Replace this with a real quote from a team member. Two or three sentences work best.", name: "Team member", role: "Tax Manager" },
  { text: "Replace this with a real quote from a team member. Two or three sentences work best.", name: "Team member", role: "Advisory Associate" },
];

const inputCls =
  "w-full rounded-xl border bg-white px-4 py-3 text-[15px] outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-slate-400 focus:border-[#0B3D91] focus:shadow-[0_0_0_4px_rgba(188,208,255,0.55)]";

/* ───────── Small pieces ───────── */
function Arrow({ className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${className}`} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Chevron({ dir }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 52 52" className="h-16 w-16" fill="none" stroke={C.ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle className="cr-draw" pathLength="1" strokeDasharray="1" cx="26" cy="26" r="23" />
      <path className="cr-draw" pathLength="1" strokeDasharray="1" d="M15 27l8 8 14-16" />
    </svg>
  );
}

/* Each word sits in a mask so it can slide up into view */
function Words({ text }) {
  return text.split(" ").map((word, i) => (
    <span key={`${word}-${i}`}>
      <span className="inline-block overflow-hidden py-[0.05em] align-bottom">
        <span className="cr-word inline-block will-change-transform">{word}</span>
      </span>{" "}
    </span>
  ));
}

function ScrubWords({ text }) {
  return text.split(" ").map((word, i) => (
    <span key={`${word}-${i}`}>
      <span className="cr-scrub">{word}</span>{" "}
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

function Field({ label, error, children, className = "" }) {
  return (
    <div className={`cr-field ${className}`}>
      <label className="block text-sm font-semibold" style={{ color: C.ink }}>
        {label}
        {children}
      </label>
      <p
        role={error ? "alert" : undefined}
        className={`overflow-hidden text-[13px] text-red-600 transition-all duration-300 ${error ? "mt-1.5 max-h-6 opacity-100" : "max-h-0 opacity-0"}`}
      >
        {error}
      </p>
    </div>
  );
}

/* Line sketches for the perk cards. Paths draw themselves on scroll. */
const sk = { viewBox: "0 0 100 100", fill: "none", stroke: C.ink, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "h-full w-full overflow-visible", "aria-hidden": true };
const D = (props) => <path pathLength="1" strokeDasharray="1" className="cr-sketch" {...props} />;
const Fill = (props) => <path className="cr-sketch-fill" stroke="none" fill={C.blue} {...props} />;

const SKETCHES = {
  people: () => (
    <svg {...sk}>
      <Fill d="M50 78C22 60 18 40 32 30c9-6 16-1 18 6 2-7 9-12 18-6 14 10 10 30-18 48z" />
      <D d="M50 78C22 60 18 40 32 30c9-6 16-1 18 6 2-7 9-12 18-6 14 10 10 30-18 48z" />
      <D d="M14 22l6 5M86 22l-6 5M50 10v8" strokeWidth="1.5" />
    </svg>
  ),
  growth: () => (
    <svg {...sk}>
      <Fill d="M50 14c14 10 18 30 12 50H38c-6-20-2-40 12-50z" />
      <D d="M50 14c14 10 18 30 12 50H38c-6-20-2-40 12-50z" />
      <D d="M38 64l-10 10 12-2M62 64l10 10-12-2" />
      <circle cx="50" cy="38" r="5" stroke={C.ink} strokeWidth="2" fill="#fff" />
      <D d="M44 76v10M50 78v14M56 76v10" strokeWidth="1.5" />
    </svg>
  ),
  standards: () => (
    <svg {...sk}>
      <Fill d="M14 28h72v44H14z" />
      <D d="M18 24h64a4 4 0 0 1 4 4v44a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V28a4 4 0 0 1 4-4z" />
      <D d="M28 40h44M36 33h28" strokeWidth="1.5" />
      <D d="M26 58l3 3 5-6M42 58l3 3 5-6M58 58l3 3 5-6" strokeWidth="2.2" />
    </svg>
  ),
  autonomy: () => (
    <svg {...sk}>
      <Fill d="M50 18a32 32 0 1 0 0 64a32 32 0 1 0 0-64z" />
      <D d="M50 18a32 32 0 1 0 0 64a32 32 0 1 0 0-64z" />
      <D d="M50 34v17l11 7" />
      <D d="M18 14l6 6M82 14l-6 6" strokeWidth="1.5" />
    </svg>
  ),
};

/* ───────── Page ───────── */
export default function CareersPage({ contactHref = "/contact", endpoint = "", onSubmit, newsletterEndpoint = "", onNewsletter }) {
  const root = useRef(null);
  const formRef = useRef(null);
  const gsapRef = useRef(null);
  const firstQuote = useRef(true);
  const animating = useRef(false);

  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [nlStatus, setNlStatus] = useState("idle"); // idle | sending | success | error
  const [nlError, setNlError] = useState("");

  const chooseRole = (title) => {
    setRole(title);
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ---------- Application form ---------- */
  const validate = (fd) => {
    const next = {};
    if (!String(fd.get("name") || "").trim()) next.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(String(fd.get("email") || "").trim())) next.email = "Please enter a valid email address.";
    if (!fd.get("role")) next.role = "Please choose a role.";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const fd = new FormData(e.currentTarget);
    if (fd.get("website")) return; // honeypot: bots fill this in

    const next = validate(fd);
    setErrors(next);
    if (Object.keys(next).length) {
      formRef.current?.querySelector(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

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

  /* ---------- Newsletter ---------- */
  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (nlStatus === "sending") return;
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setNlError("Please enter a valid email address.");
      return;
    }
    setNlError("");
    setNlStatus("sending");
    try {
      if (onNewsletter) await onNewsletter(email);
      else if (newsletterEndpoint) {
        const res = await fetch(newsletterEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error("Request failed");
      } else {
        await new Promise((r) => setTimeout(r, 800)); // demo only: no endpoint set
      }
      setNlStatus("success");
    } catch {
      setNlStatus("error");
    }
  };

  /* ---------- Team quote slider: fade out, swap, fade in ---------- */
  const goTo = useCallback((next) => {
    const target = (next + TEAM_QUOTES.length) % TEAM_QUOTES.length;
    const g = gsapRef.current;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!g || reduce) {
      setQuoteIdx(target);
      return;
    }
    if (animating.current) return;
    animating.current = true;
    g.to(".cr-quote", {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => setQuoteIdx(target),
    });
  }, []);

  useEffect(() => deferGsap((gsap) => { gsapRef.current = gsap; }), []);

  useEffect(() => {
    if (firstQuote.current) {
      firstQuote.current = false;
      return undefined;
    }
    const g = gsapRef.current;
    animating.current = false;
    if (!g) return undefined;
    const tween = g.fromTo(".cr-quote", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", clearProps: "transform,opacity" });
    return () => tween.kill();
  }, [quoteIdx]);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => goTo(quoteIdx + 1), 6500);
    return () => clearInterval(id);
  }, [paused, quoteIdx, goTo]);

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

          /* 1. Hero: card opens, title rises, photo wipes in from the right and drifts */
          gsap
            .timeline({ defaults: { ease: "power4.out" } })
            .from(".cr-hero", { y: 28, opacity: 0, duration: 0.9 })
            .from(".cr-badge", { y: 16, opacity: 0, duration: 0.6 }, "-=0.6")
            .from(".cr-hero .cr-word", { yPercent: 115, duration: 1.05, stagger: 0.07 }, "-=0.35")
            .from(".cr-hero-cta", { y: 16, opacity: 0, duration: 0.6 }, "-=0.5")
            .fromTo(
              ".cr-hero-img",
              { clipPath: "inset(0% 0% 0% 100% round 1.5rem)", opacity: 0, x: 40 },
              { clipPath: "inset(0% 0% 0% 0% round 1.5rem)", opacity: 1, x: 0, duration: 1.2, ease: "power3.inOut", clearProps: "clipPath,opacity,transform" },
              "-=1.1"
            )
            .from(".cr-hero-img img", { scale: 1.35, duration: 1.7, ease: "power3.out" }, "<");

          gsap.to(".cr-hero-img img", {
            yPercent: 10,
            ease: "none",
            scrollTrigger: { trigger: ".cr-hero", start: "top top", end: "bottom top", scrub: true },
          });

          /* 2. Intro: statement rises from the left, copy lights up word by word with scroll */
          gsap.from(".cr-intro .cr-word", { yPercent: 115, duration: 1, stagger: 0.07, ease: "power4.out", scrollTrigger: once(".cr-intro") });
          const scrub = gsap.utils.toArray(".cr-scrub");
          gsap.set(scrub, { opacity: 0.2 });
          gsap.to(scrub, {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: ".cr-intro-copy", start: "top 82%", end: "bottom 50%", scrub: true },
          });

          /* 3. Perks: title rises, cards lift in a wave, sketches draw themselves */
          gsap.from(".cr-perks .cr-word", { yPercent: 115, duration: 1, stagger: 0.07, ease: "power4.out", scrollTrigger: once(".cr-perks", "top 82%") });
          gsap
            .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: once(".cr-perk-grid", "top 85%") })
            .from(".cr-perk", { y: 60, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: "transform,opacity" })
            .from(".cr-perk .cr-sketch", { strokeDashoffset: 1, duration: 1.2, ease: "power2.inOut", stagger: 0.03 }, "-=0.8")
            .from(".cr-perk .cr-sketch-fill", { opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.5");

          /* 4. Difference: title rises, lines fade up one by one, button pops */
          gsap.from(".cr-diff .cr-word", { yPercent: 115, duration: 1, stagger: 0.07, ease: "power4.out", scrollTrigger: once(".cr-diff", "top 80%") });
          gsap.from(".cr-diff .cr-fade", { y: 24, opacity: 0, duration: 0.8, stagger: 0.14, ease: "power3.out", scrollTrigger: once(".cr-diff", "top 72%") });
          gsap.from(".cr-diff-cta", { scale: 0.85, opacity: 0, duration: 0.8, ease: "back.out(1.7)", scrollTrigger: once(".cr-diff-cta", "top 94%") });

          /* 5. Opportunities: title rises, bars glide in one after another */
          gsap.from(".cr-roles .cr-word", { yPercent: 115, duration: 1, stagger: 0.07, ease: "power4.out", scrollTrigger: once(".cr-roles", "top 82%") });
          gsap.from(".cr-role", {
            y: 36,
            opacity: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: once(".cr-list", "top 88%"),
          });
          gsap.from(".cr-roles-note", { y: 18, opacity: 0, duration: 0.7, ease: "power3.out", scrollTrigger: once(".cr-roles-note", "top 94%") });

          /* 6. Application: info slides from the left, card opens, fields rise in order */
          gsap
            .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: once(".cr-apply", "top 75%") })
            .from(".cr-apply .cr-word", { yPercent: 115, duration: 1, stagger: 0.06, ease: "power4.out" })
            .from(".cr-apply-info .cr-fade", { x: -40, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.6")
            .fromTo(
              ".cr-card",
              { clipPath: "inset(8% 4% 8% 4% round 2rem)", opacity: 0, y: 40 },
              { clipPath: "inset(0% 0% 0% 0% round 1.75rem)", opacity: 1, y: 0, duration: 1.1, ease: "power4.out", clearProps: "clipPath,opacity,transform" },
              "-=1.1"
            )
            .from(".cr-card .cr-field", { y: 24, opacity: 0, duration: 0.7, stagger: 0.07, clearProps: "transform,opacity" }, "-=0.6");

          /* 7. Team say: title rises, card opens from the middle, controls pop */
          gsap.from(".cr-say .cr-word", { yPercent: 115, duration: 1, stagger: 0.07, ease: "power4.out", scrollTrigger: once(".cr-say", "top 82%") });
          gsap
            .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: once(".cr-slider", "top 85%") })
            .fromTo(
              ".cr-slider",
              { clipPath: "inset(12% 8% 12% 8% round 2rem)", opacity: 0, y: 40 },
              { clipPath: "inset(0% 0% 0% 0% round 1.75rem)", opacity: 1, y: 0, duration: 1.1, ease: "power4.out", clearProps: "clipPath,opacity,transform" }
            )
            .from(".cr-slider-ctl", { scale: 0.6, opacity: 0, duration: 0.6, stagger: 0.06, ease: "back.out(1.8)" }, "-=0.5");

          /* 8. Newsletter: card slides up, text from the left, sketch from the right */
          gsap
            .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: once(".cr-news", "top 82%") })
            .fromTo(
              ".cr-news",
              { clipPath: "inset(10% 5% 10% 5% round 2rem)", opacity: 0, y: 40 },
              { clipPath: "inset(0% 0% 0% 0% round 1.75rem)", opacity: 1, y: 0, duration: 1.1, ease: "power4.out", clearProps: "clipPath,opacity,transform" }
            )
            .from(".cr-news .cr-word", { yPercent: 115, duration: 0.9, stagger: 0.07, ease: "power4.out" }, "-=0.6")
            .from(".cr-news .cr-fade", { x: -30, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.6")
            .from(".cr-news-art", { x: 50, opacity: 0, rotate: 4, duration: 1 }, "-=0.9")
            .from(".cr-news-art .cr-sketch", { strokeDashoffset: 1, duration: 1.3, ease: "power2.inOut", stagger: 0.03 }, "-=0.8");

          gsap.to(".cr-news-art", { y: -6, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
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

  /* Success state: tick draws itself, message follows */
  useEffect(() => {
    if (status !== "success" && nlStatus !== "success") return undefined;
    return deferGsap((gsap) => {
      const ctx = gsap.context(() => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".cr-success", { scale: 0.96, opacity: 0, duration: 0.5 })
          .from(".cr-draw", { strokeDashoffset: 1, duration: 0.9, stagger: 0.25, ease: "power2.inOut" }, "-=0.2")
          .from(".cr-success-item", { y: 18, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.4");
      }, root);
      return () => ctx.revert();
    });
  }, [status, nlStatus]);

  const quote = TEAM_QUOTES[quoteIdx];

  return (
    <div ref={root} className="ab-pending overflow-x-clip px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-6xl">
        {/* 1. Hero */}
        <section className="cr-hero overflow-hidden rounded-[2rem] border px-6 py-12 sm:rounded-[2.5rem] sm:px-12 sm:py-16 md:grid md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10" style={{ backgroundColor: C.light, borderColor: C.border }}>
          <div>
            <span className="cr-badge inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.ink }}>
              Careers
            </span>
            <h1
              aria-label={HERO_TITLE}
              style={{ fontFamily: HEADING_FONT, color: C.ink }}
              className="mt-6 text-[clamp(2.2rem,5.6vw,4.8rem)] font-black uppercase leading-[1.02] tracking-[-0.035em]"
            >
              <span aria-hidden="true">
                <Words text={HERO_TITLE} />
              </span>
            </h1>
            <a
              href="#open-roles"
              className="cr-hero-cta group mt-8 inline-flex items-center gap-3 font-semibold transition-colors hover:text-[#0B3D91]"
              style={{ color: C.ink }}
            >
              See current opportunities
              <Arrow className="rotate-90 transition-transform group-hover:translate-y-1" />
            </a>
          </div>

          <div className="cr-hero-img mx-auto mt-10 h-64 w-full max-w-sm overflow-hidden rounded-[1.5rem] md:mt-0 md:h-96" style={{ backgroundColor: C.blue }}>
            <img src="./img3.jpg" alt="" draggable={false} className="h-full w-full scale-110 object-cover" />
          </div>
        </section>

        {/* 2. Intro: statement left, copy right */}
        <section className="cr-intro mx-auto grid max-w-5xl items-center gap-10 py-16 sm:py-24 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <Title text="We’re for good people who want more." className="text-[clamp(1.9rem,3.8vw,3.2rem)]" />
          <div className="cr-intro-copy space-y-5 text-base leading-relaxed sm:text-lg" style={{ color: C.muted }}>
            {INTRO_PARAGRAPHS.map((p) => (
              <p key={p}>
                <ScrubWords text={p} />
              </p>
            ))}
          </div>
        </section>

        {/* 3. Perks & benefits */}
        <section className="cr-perks text-center" aria-label="Perks and benefits">
          <Title text="Perks & benefits" className="text-[clamp(2rem,4.6vw,3.8rem)]" />
          <div className="cr-perk-grid mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PERKS.map((perk) => {
              const Sketch = SKETCHES[perk.id];
              return (
                <article
                  key={perk.id}
                  className="cr-perk group flex flex-col items-center rounded-[1.75rem] px-6 pb-8 pt-8 transition-[transform,background-color,box-shadow] duration-500 ease-out hover:-translate-y-2 hover:bg-[#DCE8FF] hover:shadow-[0_28px_44px_-28px_rgba(0,16,34,0.35)]"
                  style={{ backgroundColor: C.light }}
                >
                  <div className="h-28 w-28 transition-transform duration-500 ease-out group-hover:-rotate-3 group-hover:scale-105">
                    <Sketch />
                  </div>
                  <h3 className="mt-6 text-lg font-bold leading-snug" style={{ color: C.ink }}>{perk.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: C.muted }}>{perk.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* 4. The difference */}
        <section className="cr-diff mx-auto max-w-3xl py-16 text-center sm:py-24">
          <Title text="The Revenue Edge difference" className="text-[clamp(2rem,4.6vw,3.8rem)]" />
          <div className="mt-8 space-y-5 text-base leading-relaxed sm:text-lg" style={{ color: C.muted }}>
            {DIFFERENCE.map((p) => (
              <p key={p} className="cr-fade">{p}</p>
            ))}
          </div>
          <a
            href="#open-roles"
            className="cr-diff-cta group mt-9 inline-flex items-center gap-4 rounded-full py-1.5 pl-7 pr-1.5 text-[15px] font-semibold text-white outline-none transition-colors duration-300 hover:bg-[#0B3D91] focus-visible:ring-2 focus-visible:ring-[#0B3D91] focus-visible:ring-offset-2"
            style={{ backgroundColor: C.ink }}
          >
            See open roles
            <span className="grid h-10 w-10 place-items-center rounded-full" style={{ backgroundColor: C.light, color: C.ink }}>
              <Arrow className="rotate-90 transition-transform duration-300 group-hover:translate-y-0.5" />
            </span>
          </a>
        </section>

        {/* 5. Current opportunities */}
        <section id="open-roles" className="cr-roles scroll-mt-24 pb-16 sm:pb-24">
          <Title text="Current opportunities" className="text-[clamp(2rem,4.6vw,3.8rem)]" />
          <ul className="cr-list mt-10 space-y-3">
            {ROLES.map((r) => (
              <li key={r.title}>
                <button
                  type="button"
                  onClick={() => chooseRole(r.title)}
                  className="cr-role group flex w-full flex-col gap-4 rounded-[1.5rem] px-6 py-5 text-left outline-none transition-[transform,background-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:bg-[#DCE8FF] hover:shadow-[0_24px_40px_-28px_rgba(0,16,34,0.35)] focus-visible:ring-2 focus-visible:ring-[#0B3D91] sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6"
                  style={{ backgroundColor: C.light }}
                >
                  <span>
                    <span className="block text-xl font-bold sm:text-2xl" style={{ color: C.ink }}>{r.title}</span>
                    <span className="mt-3 flex flex-wrap gap-2">
                      {[r.team, r.type, r.place].map((t) => (
                        <span key={t} className="rounded-full bg-white px-3 py-1 text-xs font-semibold" style={{ color: C.hover }}>{t}</span>
                      ))}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-3 text-sm font-semibold" style={{ color: C.ink }}>
                    <span className="transition-transform duration-500 ease-out group-hover:-translate-x-1">Apply</span>
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white transition-transform duration-500 ease-out group-hover:scale-110">
                      <Arrow className="-rotate-45 transition-transform duration-500 group-hover:rotate-0" />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="cr-roles-note mt-8 text-[15px]" style={{ color: C.muted }}>
            Don’t see your role?{" "}
            <button type="button" onClick={() => chooseRole("General application")} className="font-semibold underline underline-offset-4 transition-colors hover:text-[#0B3D91]" style={{ color: C.ink }}>
              Send us a general application
            </button>
            .
          </p>
        </section>

        {/* 6. Application form */}
        <section id="apply" className="cr-apply mb-16 scroll-mt-24 sm:mb-24">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
            <div className="cr-apply-info md:sticky md:top-28 md:self-start">
              <Title text="Apply in two minutes." className="text-[clamp(2rem,4vw,3.2rem)]" />
              <p className="cr-fade mt-5 max-w-md text-base leading-relaxed" style={{ color: C.muted }}>
                Tell us a little about yourself. A real person reads every application.
              </p>
              <ul className="mt-8 space-y-4">
                {["We reply within five working days", "Your details are only used for hiring", "No cover letter required"].map((t) => (
                  <li key={t} className="cr-fade flex items-center gap-3 text-[15px] font-semibold" style={{ color: C.ink }}>
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full" style={{ backgroundColor: C.blue }}>
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke={C.ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 13l4 4 10-10" /></svg>
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="cr-card rounded-[1.75rem] border p-6 sm:p-10" style={{ backgroundColor: C.tint, borderColor: C.border }}>
              {status === "success" ? (
                <div className="cr-success flex min-h-[26rem] flex-col items-center justify-center text-center" role="status">
                  <Check />
                  <h3 className="cr-success-item mt-6 text-2xl font-bold" style={{ color: C.ink }}>Application received</h3>
                  <p className="cr-success-item mt-3 max-w-sm text-[15px] leading-relaxed" style={{ color: C.muted }}>
                    Thanks for applying. We’ll review it and get back to you within five working days.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setStatus("idle"); setRole(""); setErrors({}); }}
                    className="cr-success-item mt-6 text-sm font-semibold underline underline-offset-4 transition-colors hover:text-[#0B3D91]"
                    style={{ color: C.ink }}
                  >
                    Send another application
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
                  {/* honeypot */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                  <Field label="Full name" error={errors.name}>
                    <input name="name" type="text" autoComplete="name" placeholder="Your name" className={`${inputCls} mt-2`} style={{ borderColor: errors.name ? "#DC2626" : C.border }} />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input name="email" type="email" autoComplete="email" placeholder="you@example.com" className={`${inputCls} mt-2`} style={{ borderColor: errors.email ? "#DC2626" : C.border }} />
                  </Field>
                  <Field label="Phone">
                    <input name="phone" type="tel" autoComplete="tel" placeholder="+91 00000 00000" className={`${inputCls} mt-2`} style={{ borderColor: C.border }} />
                  </Field>
                  <Field label="Role" error={errors.role}>
                    <select
                      name="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className={`${inputCls} mt-2`}
                      style={{ borderColor: errors.role ? "#DC2626" : C.border }}
                    >
                      <option value="">Choose a role</option>
                      {ROLES.map((r) => (
                        <option key={r.title} value={r.title}>{r.title}</option>
                      ))}
                      <option value="General application">General application</option>
                    </select>
                  </Field>
                  <Field label="LinkedIn or portfolio (optional)" className="sm:col-span-2">
                    <input name="link" type="url" placeholder="https://" className={`${inputCls} mt-2`} style={{ borderColor: C.border }} />
                  </Field>
                  <Field label="Why Revenue Edge? (optional)" className="sm:col-span-2">
                    <textarea name="message" rows={4} placeholder="A few lines about you and what you’re looking for" className={`${inputCls} mt-2 resize-none`} style={{ borderColor: C.border }} />
                  </Field>

                  <div className="cr-field sm:col-span-2">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group inline-flex items-center gap-4 rounded-full py-2 pl-7 pr-2 text-[15px] font-semibold text-white outline-none transition-all duration-300 hover:bg-[#0B3D91] focus-visible:ring-2 focus-visible:ring-[#0B3D91] focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-70"
                      style={{ backgroundColor: C.ink }}
                    >
                      {status === "sending" ? "Sending…" : "Submit application"}
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-white" style={{ color: C.ink }}>
                        {status === "sending" ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Arrow className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                        )}
                      </span>
                    </button>
                    <p
                      role="alert"
                      className={`overflow-hidden text-sm text-red-600 transition-all duration-300 ${status === "error" ? "mt-3 max-h-10 opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      Something went wrong sending your application. Please try again.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* 7. What our team say */}
        <section className="cr-say text-center" aria-label="What our team say" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
          <Title text="What our team say" className="text-[clamp(2rem,4.6vw,3.8rem)]" />
          <div className="cr-slider relative mx-auto mt-10 max-w-4xl rounded-[1.75rem] border px-6 py-14 sm:px-14 sm:py-20" style={{ backgroundColor: C.tint, borderColor: C.border }}>
            <div className="cr-quote min-h-[11rem]" aria-live="polite">
              <p className="text-[clamp(1.25rem,2.6vw,2rem)] font-bold leading-snug" style={{ color: C.ink }}>
                “{quote.text}”
              </p>
              <p className="mt-6 text-sm font-semibold" style={{ color: C.hover }}>
                {quote.name}, {quote.role}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                aria-label="Previous quote"
                onClick={() => goTo(quoteIdx - 1)}
                className="cr-slider-ctl grid h-11 w-11 place-items-center rounded-full border bg-white outline-none transition-colors duration-300 hover:bg-[#001022] hover:text-white focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
                style={{ borderColor: C.ink, color: C.ink }}
              >
                <Chevron dir="left" />
              </button>
              <div className="flex gap-2" role="tablist" aria-label="Choose quote">
                {TEAM_QUOTES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === quoteIdx}
                    aria-label={`Quote ${i + 1}`}
                    onClick={() => goTo(i)}
                    className="cr-slider-ctl h-2.5 rounded-full outline-none transition-all duration-500 ease-out focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
                    style={{ width: i === quoteIdx ? "1.75rem" : "0.625rem", backgroundColor: i === quoteIdx ? C.ink : C.blue }}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Next quote"
                onClick={() => goTo(quoteIdx + 1)}
                className="cr-slider-ctl grid h-11 w-11 place-items-center rounded-full border bg-white outline-none transition-colors duration-300 hover:bg-[#001022] hover:text-white focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
                style={{ borderColor: C.ink, color: C.ink }}
              >
                <Chevron dir="right" />
              </button>
            </div>
          </div>
        </section>

        {/* 8. In the know (newsletter) */}
        <section className="cr-news mx-auto mt-16 max-w-4xl overflow-hidden rounded-[1.75rem] px-6 py-10 sm:mt-24 sm:px-12 sm:py-14 md:grid md:grid-cols-[1.2fr_1fr] md:items-center md:gap-8" style={{ backgroundColor: C.blue }}>
          <div>
            <Title text="In the know…" className="text-[clamp(1.9rem,3.6vw,3rem)]" />
            <p className="cr-fade mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: "#1E293B" }}>
              Want to stay ahead of the curve on tax, finance and business? Drop your email to receive our monthly newsletter.
            </p>

            {nlStatus === "success" ? (
              <p className="cr-success cr-success-item mt-6 flex items-center gap-3 text-[15px] font-semibold" style={{ color: C.ink }} role="status">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={C.ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 13l4 4 10-10" /></svg>
                </span>
                You’re on the list. Thank you!
              </p>
            ) : (
              <form onSubmit={handleNewsletter} noValidate className="cr-fade mt-6">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="sr-only" htmlFor="nl-email">Email</label>
                  <input
                    id="nl-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email*"
                    className={`${inputCls} sm:flex-1`}
                    style={{ borderColor: nlError ? "#DC2626" : "transparent", borderRadius: "9999px" }}
                  />
                  <button
                    type="submit"
                    disabled={nlStatus === "sending"}
                    className="rounded-full px-7 py-3 text-[15px] font-semibold text-white outline-none transition-all duration-300 hover:bg-[#0B3D91] focus-visible:ring-2 focus-visible:ring-[#0B3D91] focus-visible:ring-offset-2 active:scale-[0.97] disabled:opacity-70"
                    style={{ backgroundColor: C.ink }}
                  >
                    {nlStatus === "sending" ? "Sending…" : "Send"}
                  </button>
                </div>
                <p
                  role="alert"
                  className={`overflow-hidden text-[13px] text-red-700 transition-all duration-300 ${nlError || nlStatus === "error" ? "mt-2 max-h-6 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {nlError || "Something went wrong. Please try again."}
                </p>
              </form>
            )}
          </div>

          {/* envelope sketch */}
          <div className="cr-news-art mx-auto mt-8 h-44 w-44 md:mt-0 md:h-56 md:w-56">
            <svg viewBox="0 0 100 100" fill="none" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full overflow-visible" aria-hidden="true">
              <path d="M14 30h72v46H14z" fill="#fff" stroke="none" />
              <D d="M18 26h64a4 4 0 0 1 4 4v42a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V30a4 4 0 0 1 4-4z" />
              <D d="M14 32l36 24 36-24" />
              <D d="M14 72l26-20M86 72L60 52" strokeWidth="1.5" />
              <D d="M74 10l-4 7M84 16l-7 3M64 6v8" strokeWidth="1.5" />
            </svg>
          </div>
        </section>
      </div>
    </div>
  );
}