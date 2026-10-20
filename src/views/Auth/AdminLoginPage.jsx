import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deferGsap } from "../../deferGsap";

/* Needs this as the first line of src/index.css:
   @import url("https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&display=swap"); */
const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';

const C = {
  ink: "#001022",
  blue: "#BCD0FF",
  light: "#E8F0FF",
  tint: "#F1F6FF",
  hover: "#0B3D91",
  muted: "#475569",
  border: "#E2E8F0",
};

const inputCls =
  "w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-slate-400 focus:border-[#0B3D91] focus:shadow-[0_0_0_4px_rgba(188,208,255,0.55)]";

/* ───────── Small pieces ───────── */
const Arrow = ({ className = "" }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${className}`} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Eye = ({ off }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M4 4l16 16" />}
  </svg>
);

const Lock = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="11" width="14" height="9" rx="2.5" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

function Check() {
  return (
    <svg viewBox="0 0 52 52" className="h-16 w-16" fill="none" stroke={C.ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle className="al-draw" pathLength="1" strokeDasharray="1" cx="26" cy="26" r="23" />
      <path className="al-draw" pathLength="1" strokeDasharray="1" d="M15 27l8 8 14-16" />
    </svg>
  );
}

/* Each word sits in a mask so it can slide up into view */
const Words = ({ text }) =>
  text.split(" ").map((word, i) => (
    <span key={`${word}-${i}`}>
      <span className="inline-block overflow-hidden py-[0.05em] align-bottom">
        <span className="al-word inline-block will-change-transform">{word}</span>
      </span>{" "}
    </span>
  ));

const D = (props) => <path pathLength="1" strokeDasharray="1" className="al-sketch" {...props} />;

/* Chart sketch on the brand panel */
function ChartSketch() {
  const bars = [[22, 20], [38, 32], [54, 46], [70, 60]];
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full overflow-visible" aria-hidden="true">
      {bars.map(([x, h]) => (
        <path key={`f${x}`} className="al-fill" d={`M${x} 86V${86 - h}h11v${h}z`} fill={C.blue} fillOpacity="0.28" stroke="none" />
      ))}
      <D d="M12 12v74h80" />
      {bars.map(([x, h]) => (
        <D key={x} d={`M${x} 86V${86 - h}h11v${h}`} />
      ))}
      <D d="M16 58L42 40l14 8 30-30" />
      <D d="M74 18h12v12" />
    </svg>
  );
}

/* ───────── Page ─────────
   SECURITY NOTE: this page only collects credentials. Real protection must happen on your server:
   verify the password there, set an httpOnly + Secure session cookie, rate-limit attempts,
   and check the session on every admin API route. Never put passwords or keys in this file. */
export default function AdminLoginPage({
  endpoint = "",          // e.g. "/api/admin/login" (POST JSON: { email, password, remember })
  onLogin,                // or pass your own async (credentials) => void; throw to show an error
  redirectTo = "/admin",  // where to go after a successful login
  forgotHref = "/admin/forgot-password",
  homeHref = "/",
}) {
  const root = useRef(null);
  const formRef = useRef(null);
  const gsapRef = useRef(null);
  const navigate = useNavigate();

  const [showPw, setShowPw] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [message, setMessage] = useState("");

  const shake = () => {
    const g = gsapRef.current;
    if (!g || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    g.to(".al-card", { keyframes: { x: [0, -10, 9, -6, 4, 0] }, duration: 0.5, ease: "power2.out", overwrite: "auto" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending" || status === "success") return;

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    const remember = Boolean(fd.get("remember"));

    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    setMessage("");
    if (Object.keys(next).length) {
      formRef.current?.querySelector(`[name="${Object.keys(next)[0]}"]`)?.focus();
      shake();
      return;
    }

    setStatus("sending");
    try {
      if (onLogin) {
        await onLogin({ email, password, remember });
      } else if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // lets the server set its session cookie
          body: JSON.stringify({ email, password, remember }),
        });
        if (res.status === 401 || res.status === 403) {
          const err = new Error("invalid");
          err.code = "invalid";
          throw err;
        }
        if (res.status === 429) {
          const err = new Error("rate");
          err.code = "rate";
          throw err;
        }
        if (!res.ok) throw new Error("Request failed");
      } else {
        const err = new Error("not-connected");
        err.code = "not-connected";
        throw err;
      }
      setStatus("success");
      setTimeout(() => navigate(redirectTo, { replace: true }), 1400);
    } catch (err) {
      setStatus("error");
      setMessage(
        err.code === "invalid"
          ? "That email or password isn’t right. Please try again."
          : err.code === "rate"
          ? "Too many attempts. Please wait a few minutes and try again."
          : err.code === "not-connected"
          ? "Login isn’t connected yet. Pass an `endpoint` or `onLogin` prop."
          : "Something went wrong. Please try again."
      );
      shake();
    }
  };

  /* ---------- Page animation ---------- */
  useEffect(() => {
    const fallback = setTimeout(() => root.current?.classList.remove("ab-pending"), 2500);

    const cleanup = deferGsap((gsap) => {
      gsapRef.current = gsap;
      const el = root.current;
      if (!el) return undefined;

      const context = gsap.context(() => {
        const motion = gsap.matchMedia();

        motion.add("(prefers-reduced-motion: no-preference)", () => {
          gsap
            .timeline({ defaults: { ease: "power4.out" } })
            /* brand panel opens, then headline rises, sketch draws */
            .from(".al-panel", { clipPath: "inset(0% 100% 0% 0%)", duration: 1.2, ease: "power3.inOut", clearProps: "clipPath" })
            .from(".al-logo", { y: -16, opacity: 0, duration: 0.7 }, "-=0.6")
            .from(".al-panel .al-word", { yPercent: 115, duration: 1.05, stagger: 0.07 }, "-=0.5")
            .from(".al-panel-text", { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.6")
            .from(".al-sketch", { strokeDashoffset: 1, duration: 1.4, ease: "power2.inOut", stagger: 0.04 }, "-=0.9")
            .from(".al-fill", { opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.6")
            /* form card slides in from the right, fields rise in order */
            .from(".al-card", { x: 60, opacity: 0, duration: 1, clearProps: "transform,opacity" }, "-=1.4")
            .from(".al-lock", { scale: 0.4, rotate: -20, opacity: 0, duration: 0.7, ease: "back.out(2)" }, "-=0.6")
            .from(".al-field", { y: 22, opacity: 0, duration: 0.7, stagger: 0.08, clearProps: "transform,opacity" }, "-=0.6");

          gsap.to(".al-float", { y: -8, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
        });
      }, el);

      el.classList.remove("ab-pending");
      return () => context.revert();
    });

    return () => {
      clearTimeout(fallback);
      if (typeof cleanup === "function") cleanup();
    };
  }, []);

  /* Success: tick draws itself */
  useEffect(() => {
    if (status !== "success") return undefined;
    return deferGsap((gsap) => {
      const ctx = gsap.context(() => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".al-success", { scale: 0.96, opacity: 0, duration: 0.5 })
          .from(".al-draw", { strokeDashoffset: 1, duration: 0.9, stagger: 0.25, ease: "power2.inOut" }, "-=0.2")
          .from(".al-success-item", { y: 16, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.4");
      }, root);
      return () => ctx.revert();
    });
  }, [status]);

  return (
    <div ref={root} className="ab-pending min-h-screen overflow-x-clip md:grid md:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside
        className="al-panel relative hidden overflow-hidden px-12 py-12 text-white md:flex md:flex-col md:justify-between lg:px-16"
        style={{
          backgroundColor: C.ink,
          backgroundImage:
            "radial-gradient(60% 90% at 88% 0%, rgba(11,61,145,0.45), transparent 70%), repeating-radial-gradient(circle at 88% 0%, rgba(255,255,255,0.035) 0 1px, transparent 1px 26px)",
        }}
      >
        <Link to={homeHref} className="al-logo inline-flex w-fit items-center gap-3 text-lg font-bold outline-none focus-visible:ring-2 focus-visible:ring-white/60" style={{ fontFamily: HEADING_FONT }}>
           <div className="mix-blend-screen">
                <img
                  src="/reta.webp"
                  width="306"
                  height="100"
                  loading="lazy"
                  className="h-15 w-auto brightness-0 invert"
                  alt="Reta"
                />
              </div>
        </Link>

        <div>
          <h1
            aria-label="Welcome back."
            style={{ fontFamily: HEADING_FONT }}
            className="text-[clamp(2.4rem,4.6vw,4.2rem)] font-black uppercase leading-[1.02] tracking-[-0.035em]"
          >
            <span aria-hidden="true">
              <Words text="Welcome back." />
            </span>
          </h1>
          <p className="al-panel-text mt-5 max-w-sm text-base leading-relaxed text-white/70">
            Sign in to manage reviews, applications and site content.
          </p>
        </div>

        <div className="al-float ml-auto h-52 w-52 lg:h-64 lg:w-64">
          <ChartSketch />
        </div>
      </aside>

      {/* Form side */}
      <main className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8" style={{ backgroundColor: C.tint }}>
        <div className="w-full max-w-md">
          {/* mobile logo */}
          <Link to={homeHref} className="mb-8 inline-flex items-center gap-3 text-lg font-bold md:hidden" style={{ fontFamily: HEADING_FONT, color: C.ink }}>
             <div className="mx-auto ">
            
                <img
                  src="/reta.png"
                  width="306"
                  height="90"
                  loading="lazy"
                  className="h-15 w-auto  mx-auto"
                  alt="Reta"
                />
              </div>
          </Link>

          <div className="al-card rounded-[1.75rem] border bg-white p-7 shadow-[0_30px_70px_-45px_rgba(0,16,34,0.45)] sm:p-10" style={{ borderColor: C.border }}>
            {status === "success" ? (
              <div className="al-success flex min-h-[22rem] flex-col items-center justify-center text-center" role="status">
                <Check />
                <h2 className="al-success-item mt-6 text-2xl font-bold" style={{ color: C.ink }}>You’re in</h2>
                <p className="al-success-item mt-2 text-[15px]" style={{ color: C.muted }}>Taking you to the dashboard…</p>
              </div>
            ) : (
              <>
                <span className="al-lock grid h-12 w-12 place-items-center rounded-2xl" style={{ backgroundColor: C.light, color: C.hover }}>
                  <Lock />
                  
                </span>
                <h2 className="al-field mt-5 text-2xl font-bold tracking-tight sm:text-[1.75rem]" style={{ color: C.ink }}>Admin sign in</h2>
                <p className="al-field mt-1.5 text-[15px]" style={{ color: C.muted }}>Authorised team members only.</p>

                <form ref={formRef} onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
                  <div className="al-field">
                    <label className="block text-sm font-semibold" style={{ color: C.ink }}>
                      Email
                      <input
                        name="email"
                        type="email"
                        autoComplete="username"
                        placeholder="you@company.com"
                        aria-invalid={Boolean(errors.email)}
                        className={`${inputCls} mt-2`}
                        style={{ borderColor: errors.email ? "#DC2626" : C.border }}
                      />
                    </label>
                    <p role={errors.email ? "alert" : undefined} className={`overflow-hidden text-[13px] text-red-600 transition-all duration-300 ${errors.email ? "mt-1.5 max-h-6 opacity-100" : "max-h-0 opacity-0"}`}>{errors.email}</p>
                  </div>

                  <div className="al-field">
                    <label className="block text-sm font-semibold" htmlFor="admin-password" style={{ color: C.ink }}>Password</label>
                    <div className="relative mt-2">
                      <input
                        id="admin-password"
                        name="password"
                        type={showPw ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Your password"
                        aria-invalid={Boolean(errors.password)}
                        onKeyUp={(e) => setCapsOn(e.getModifierState?.("CapsLock") || false)}
                        onBlur={() => setCapsOn(false)}
                        className={`${inputCls} pr-12`}
                        style={{ borderColor: errors.password ? "#DC2626" : C.border }}
                      />
                      <button
                        type="button"
                        aria-label={showPw ? "Hide password" : "Show password"}
                        aria-pressed={showPw}
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full outline-none transition-colors duration-300 hover:bg-[#E8F0FF] focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
                        style={{ color: C.muted }}
                      >
                        <Eye off={showPw} />
                      </button>
                    </div>
                    <p role={errors.password ? "alert" : undefined} className={`overflow-hidden text-[13px] text-red-600 transition-all duration-300 ${errors.password ? "mt-1.5 max-h-6 opacity-100" : "max-h-0 opacity-0"}`}>{errors.password}</p>
                    <p className={`overflow-hidden text-[13px] transition-all duration-300 ${capsOn ? "mt-1.5 max-h-6 opacity-100" : "max-h-0 opacity-0"}`} style={{ color: C.hover }}>Caps Lock is on.</p>
                  </div>

                  <div className="al-field flex items-center justify-between gap-4 text-sm">
                    <label className="flex cursor-pointer items-center gap-2.5" style={{ color: C.muted }}>
                      <input name="remember" type="checkbox" className="h-4 w-4 accent-[#0B3D91]" />
                      Keep me signed in
                    </label>
                    <Link to={forgotHref} className="font-semibold underline-offset-4 transition-colors hover:text-[#0B3D91] hover:underline" style={{ color: C.ink }}>
                      Forgot password?
                    </Link>
                  </div>

                  <div className="al-field">
                    <p
                      role="alert"
                      className={`overflow-hidden rounded-xl bg-red-50 text-sm text-red-700 transition-all duration-300 ${status === "error" && message ? "mb-4 max-h-24 px-4 py-3 opacity-100" : "max-h-0 px-4 py-0 opacity-0"}`}
                    >
                      {message}
                    </p>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group flex w-full items-center justify-between gap-4 rounded-full py-2 pl-7 pr-2 text-[15px] font-semibold text-white outline-none transition-all duration-300 hover:bg-[#0B3D91] focus-visible:ring-2 focus-visible:ring-[#0B3D91] focus-visible:ring-offset-2 active:scale-[0.99] disabled:opacity-70"
                      style={{ backgroundColor: C.ink }}
                    >
                      {status === "sending" ? "Signing in…" : "Sign in"}
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-white" style={{ color: C.ink }}>
                        {status === "sending" ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Arrow className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                        )}
                      </span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          <p className="mt-6 text-center text-sm" style={{ color: C.muted }}>
            <Link to={homeHref} className="font-semibold transition-colors hover:text-[#0B3D91]" style={{ color: C.ink }}>← Back to website</Link>
          </p>
        </div>
      </main>
    </div>
  );
}