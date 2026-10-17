import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { deferGsap } from "../../deferGsap";

const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';
const HERO_TITLE = "Build a career with clear purpose.";

const C = {
  ink: "#001022",
  blue: "#BCD0FF",
  light: "#E8F0FF",
  hover: "#0B3D91",
  muted: "#475569",
  border: "#E2E8F0",
};

/* PLACEHOLDERS: replace roles and perks with your real openings */
const INTRO_PARAGRAPHS = [
  "Great accountants don’t just balance books. They explain, plan and look ahead with the people they work for. That’s the kind of team we’re building.",
  "At Revenue Edge you’ll work directly with clients, learn from registered tax agents and take on real responsibility early. We invest in your growth the same way we invest in our clients’.",
];

const PERKS = [
  { title: "Learn from experts", body: "Work alongside registered tax agents and advisors, with a study budget and paid exam leave." },
  { title: "Flexible by default", body: "Hybrid work, flexible hours and a team that trusts you to manage your time." },
  { title: "Real client exposure", body: "Join client meetings from your first months and own your own portfolio sooner." },
  { title: "A clear path forward", body: "Regular check-ins and a defined progression plan, so you always know what’s next." },
];

const ROLES = [
  { title: "Tax Accountant", team: "Tax", type: "Full-time", place: "Hybrid" },
  { title: "Business Advisory Associate", team: "Advisory", type: "Full-time", place: "Hybrid" },
  { title: "Bookkeeper", team: "Accounting", type: "Part-time", place: "Remote" },
  { title: "Graduate Accountant", team: "Accounting", type: "Full-time", place: "Office" },
];

const MAX_FILE_MB = 5;
const FILE_TYPES = [".pdf", ".doc", ".docx"];

const inputCls =
  "w-full rounded-xl border bg-white px-4 py-3 text-[15px] outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-slate-400 focus:border-[#0B3D91] focus:shadow-[0_0_0_4px_rgba(188,208,255,0.55)]";

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

function Check() {
  return (
    <svg viewBox="0 0 52 52" className="h-16 w-16" fill="none" stroke={C.ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle className="cr-draw" pathLength="1" strokeDasharray="1" cx="26" cy="26" r="23" />
      <path className="cr-draw" pathLength="1" strokeDasharray="1" d="M15 27l8 8 14-16" />
    </svg>
  );
}

function Arrow({ className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${className}`} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
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

export default function CareersPage({ contactHref = "/contact", endpoint = "", onSubmit }) {
  const root = useRef(null);
  const formRef = useRef(null);
  const [role, setRole] = useState("");
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const chooseRole = (title) => {
    setRole(title);
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validate = (fd) => {
    const next = {};
    if (!String(fd.get("name") || "").trim()) next.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(String(fd.get("email") || "").trim())) next.email = "Please enter a valid email address.";
    if (!fd.get("role")) next.role = "Please choose a role.";
    const file = fd.get("resume");
    if (!file || !file.name) next.resume = "Please attach your CV.";
    else if (!FILE_TYPES.some((t) => file.name.toLowerCase().endsWith(t))) next.resume = "Use a PDF or Word file.";
    else if (file.size > MAX_FILE_MB * 1024 * 1024) next.resume = `File must be under ${MAX_FILE_MB} MB.`;
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

  useEffect(() => {
    const fallback = setTimeout(() => root.current?.classList.remove("ab-pending"), 2500);

    const cleanup = deferGsap((gsap, ScrollTrigger) => {
      const el = root.current;
      if (!el) return undefined;

      const context = gsap.context(() => {
        const motion = gsap.matchMedia();

        motion.add("(prefers-reduced-motion: no-preference)", () => {
          const once = (trigger, start = "top 80%") => ({ trigger, start, once: true });

          /* 1. Hero */
          gsap
            .timeline({ defaults: { ease: "power4.out" } })
            .from(".cr-hero", { y: 28, opacity: 0, duration: 0.9 })
            .from(".cr-badge", { y: 16, opacity: 0, duration: 0.6 }, "-=0.6")
            .from(".cr-hero .cr-word", { yPercent: 115, duration: 1.05, stagger: 0.06 }, "-=0.35")
            .from(".cr-hero-cta", { y: 16, opacity: 0, duration: 0.6 }, "-=0.5")
            .fromTo(
              ".cr-hero-img",
              { clipPath: "inset(0% 0% 0% 100%)", opacity: 0 },
              { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.2, ease: "power3.inOut", clearProps: "clipPath,opacity" },
              "-=1"
            )
            .from(".cr-hero-img img", { scale: 1.35, duration: 1.7, ease: "power3.out" }, "<");

          gsap.to(".cr-hero-img img", {
            yPercent: 10,
            ease: "none",
            scrollTrigger: { trigger: ".cr-hero", start: "top top", end: "bottom top", scrub: true },
          });

          /* 2. Intro: title rises, copy lights up with scroll */
          gsap.from(".cr-intro .cr-word", { yPercent: 115, duration: 1, stagger: 0.06, ease: "power4.out", scrollTrigger: once(".cr-intro") });
          const scrub = gsap.utils.toArray(".cr-scrub");
          gsap.set(scrub, { opacity: 0.2 });
          gsap.to(scrub, {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: ".cr-intro-copy", start: "top 82%", end: "bottom 55%", scrub: true },
          });

          /* 3. Perks: cards alternate in from the left and right */
          gsap.utils.toArray(".cr-perk").forEach((card, i) => {
            gsap.from(card, {
              x: i % 2 === 0 ? -70 : 70,
              opacity: 0,
              duration: 1,
              ease: "power3.out",
              clearProps: "transform,opacity",
              scrollTrigger: once(card, "top 88%"),
            });
          });

          /* 4. Roles: rules draw across, rows slide in one by one */
          gsap.from(".cr-roles .cr-word", { yPercent: 115, duration: 1, stagger: 0.06, ease: "power4.out", scrollTrigger: once(".cr-roles", "top 80%") });
          gsap
            .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: once(".cr-list", "top 85%") })
            .from(".cr-rule", { scaleX: 0, transformOrigin: "left center", duration: 1.2, ease: "power3.inOut", stagger: 0.12 })
            .from(".cr-role-inner", { y: 24, opacity: 0, duration: 0.7, stagger: 0.12 }, "-=1");

          /* 5. Application form: info slides from the left, card opens, fields rise in order */
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

          /* 6. Closing */
          gsap.from(".cr-close .cr-word", { yPercent: 115, duration: 1, stagger: 0.05, ease: "power4.out", scrollTrigger: once(".cr-close", "top 78%") });
          gsap.from(".cr-close .cr-fade", { y: 24, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out", scrollTrigger: once(".cr-close", "top 78%") });
          gsap.from(".cr-cta", { scale: 0.85, opacity: 0, duration: 0.8, ease: "back.out(1.7)", scrollTrigger: once(".cr-cta", "top 94%") });
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
    if (status !== "success") return undefined;
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
  }, [status]);

  return (
    <div ref={root} className="ab-pending overflow-x-clip px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <section className="cr-hero overflow-hidden rounded-[2rem] border px-6 py-12 sm:rounded-[2.5rem] sm:px-12 sm:py-16 md:grid md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10" style={{ backgroundColor: C.light, borderColor: C.border }}>
          <div>
            <span className="cr-badge inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.ink }}>
              Careers
            </span>
            <h1
              aria-label={HERO_TITLE}
              style={{ fontFamily: HEADING_FONT, color: C.ink }}
              className="mt-6 text-[clamp(2rem,5.2vw,4.4rem)] font-black uppercase leading-[1.02] tracking-[-0.035em]"
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
              See open roles
              <Arrow className="rotate-90 transition-transform group-hover:translate-y-1" />
            </a>
          </div>

          <div className="cr-hero-img mx-auto mt-10 h-56 w-full max-w-sm overflow-hidden rounded-[1.5rem] md:mt-0 md:h-80" style={{ backgroundColor: C.blue }}>
            <img src="./img3.jpg" alt="" draggable={false} className="h-full w-full scale-110 object-cover" />
          </div>
        </section>

        {/* Intro */}
        <section className="cr-intro mx-auto grid max-w-5xl gap-8 py-16 sm:py-24 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <Title text="Work that moves people forward." className="text-[clamp(2rem,4.5vw,3.8rem)]" />
          <div className="cr-intro-copy space-y-5 text-base leading-relaxed sm:text-lg" style={{ color: C.muted }}>
            {INTRO_PARAGRAPHS.map((p) => (
              <p key={p}>
                <ScrubWords text={p} />
              </p>
            ))}
          </div>
        </section>

        {/* Perks */}
        <section aria-label="Why work with us" className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {PERKS.map((perk, i) => (
            <article
              key={perk.title}
              className="cr-perk rounded-[1.5rem] p-7 transition-transform duration-500 hover:-translate-y-1 sm:rounded-[2rem] sm:p-10"
              style={{ backgroundColor: i % 3 === 0 ? C.blue : C.light }}
            >
              <h3 className="text-xl font-bold leading-snug sm:text-2xl" style={{ color: C.ink }}>{perk.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed" style={{ color: "#1E293B" }}>{perk.body}</p>
            </article>
          ))}
        </section>

        {/* Open roles */}
        <section id="open-roles" className="cr-roles mx-auto max-w-5xl scroll-mt-24 py-16 sm:py-24">
          <Title text="Open roles" className="text-[clamp(2rem,4.5vw,3.8rem)]" />
          <ul className="cr-list mt-10">
            <span aria-hidden="true" className="cr-rule block h-px w-full" style={{ backgroundColor: C.ink }} />
            {ROLES.map((role) => (
              <li key={role.title}>
                <button
                  type="button"
                  onClick={() => chooseRole(role.title)}
                  className="cr-role-inner group flex w-full flex-col gap-3 py-6 text-left transition-colors hover:bg-[#F1F6FF] sm:flex-row sm:items-center sm:justify-between sm:px-3"
                >
                  <span>
                    <span className="block text-xl font-bold sm:text-2xl" style={{ color: C.ink }}>{role.title}</span>
                    <span className="mt-1 block text-sm" style={{ color: C.muted }}>
                      {role.team} · {role.type} · {role.place}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-3 text-sm font-semibold" style={{ color: C.ink }}>
                    Apply
                    <span className="grid h-10 w-10 place-items-center rounded-full border transition-colors duration-300 group-hover:bg-[#001022] group-hover:text-white" style={{ borderColor: C.ink }}>
                      <Arrow className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                    </span>
                  </span>
                </button>
                <span aria-hidden="true" className="cr-rule block h-px w-full" style={{ backgroundColor: C.border }} />
              </li>
            ))}
          </ul>
        </section>

        {/* Application form */}
        <section id="apply" className="cr-apply mb-16 scroll-mt-24 sm:mb-24">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
            <div className="cr-apply-info md:sticky md:top-28 md:self-start">
              <Title text="Apply in two minutes." className="text-[clamp(2rem,4vw,3.2rem)]" />
              <p className="cr-fade mt-5 max-w-md text-base leading-relaxed" style={{ color: C.muted }}>
                Tell us a little about yourself and attach your CV. A real person reads every application.
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

            <div className="cr-card rounded-[1.75rem] border p-6 sm:p-10" style={{ backgroundColor: "#F1F6FF", borderColor: C.border }}>
              {status === "success" ? (
                <div className="cr-success flex min-h-[26rem] flex-col items-center justify-center text-center" role="status">
                  <Check />
                  <h3 className="cr-success-item mt-6 text-2xl font-bold" style={{ color: C.ink }}>Application received</h3>
                  <p className="cr-success-item mt-3 max-w-sm text-[15px] leading-relaxed" style={{ color: C.muted }}>
                    Thanks for applying. We’ll review it and get back to you within five working days.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setStatus("idle"); setFileName(""); setRole(""); setErrors({}); }}
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
                  <Field label="Phone (optional)">
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
                  {/* <Field label="CV (PDF or Word, up to 5 MB)" error={errors.resume} className="sm:col-span-2">
                    <span
                      className="mt-2 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-dashed bg-white px-4 py-4 text-[15px] transition-colors duration-300 hover:border-[#0B3D91] hover:bg-[#E8F0FF] focus-within:border-[#0B3D91]"
                      style={{ borderColor: errors.resume ? "#DC2626" : "#94A3B8", color: C.muted }}
                    >
                      <span className="truncate">{fileName || "Choose a file to upload"}</span>
                      <span className="shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold" style={{ backgroundColor: C.blue, color: C.ink }}>Browse</span>
                      <input
                        name="resume"
                        type="file"
                        accept={FILE_TYPES.join(",")}
                        className="sr-only"
                        onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                      />
                    </span>
                  </Field> */}

                  <div className="cr-field sm:col-span-2">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="cr-submit group inline-flex items-center gap-4 rounded-full py-2 pl-7 pr-2 text-[15px] font-semibold text-white outline-none transition-all duration-300 hover:bg-[#0B3D91] focus-visible:ring-2 focus-visible:ring-[#0B3D91] focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-70"
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

        {/* Closing */}
        <section className="cr-close rounded-[2rem] px-6 py-14 text-center sm:px-12 sm:py-20" style={{ backgroundColor: C.blue }}>
          <Title text="Don’t see your role?" className="mx-auto max-w-3xl text-[clamp(2rem,5vw,4rem)]" />
          <p className="cr-fade mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: "#1E293B" }}>
            We’re always glad to meet good people. Tell us about yourself and we’ll be in touch when something fits.
          </p>
          <Link
            to={contactHref}
            className="cr-cta group mt-8 inline-flex items-center gap-4 rounded-full py-2 pl-6 pr-2 text-sm font-semibold text-white transition-colors hover:bg-[#0B3D91] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3D91]"
            style={{ backgroundColor: C.ink }}
          >
            Get in touch
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white" style={{ color: C.ink }}>
              <Arrow className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
            </span>
          </Link>
        </section>
      </div>
    </div>
  );
}