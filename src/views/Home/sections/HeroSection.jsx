import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

/* Needs this as the first line of src/index.css:
   @import url("https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&display=swap"); */
const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';

/* Revenue Edge light theme */
const C = {
  primary: "#001022",
  primaryHover: "#0B3D91",
  primaryLight: "#E8F0FF",
  textSecondary: "#475569",
  border: "#E2E8F0",
  ink: "#0F172A",
};

/* Photos used in the headline. Save them in  public/hero/  (or pass your own paths
   with the `images` prop). If a file is missing, a pen sketch is shown instead. */
const DEFAULT_IMAGES = {
  buildings: "https://i.pinimg.com/1200x/0f/55/7b/0f557b38ca48f71fc58d4af2cceeedeb.jpg",
  suit: "https://i.pinimg.com/736x/5b/cd/01/5bcd0112eaf556e1f57c05841cb1bc6b.jpg",
};

/* Headline lines. "@name" = photo sitting between the words. */
const LINES = [
  { tokens: ["FINANCIAL", "@buildings","CLARITY"], color: C.primary },
  { tokens: ["TO","@suit", "ACCELERATE"], color: C.primary },
  { tokens: ["YOUR", "GROWTH"], color: C.primaryHover },
];

/* Photo that sits inline between words, same height as the letters */
function PhotoChip({ name, images }) {
  const [failed, setFailed] = useState(false);
  const src = images?.[name];
  const showPhoto = src && !failed;

  return (
    <span className="hero-chip relative top-[-0.02em] mx-[0.06em] inline-block h-[0.8em] w-[1.9em] align-middle">
      <span
        className="hero-float block h-full w-full overflow-hidden rounded-[0.2em] border bg-white shadow-[0_10px_28px_-12px_rgba(0,16,34,0.45)]"
        style={{ borderColor: "rgba(255,255,255,0.9)" }}
      >
        {showPhoto && (
          <img
            src={src}
            alt=""
            draggable={false}
            onError={() => setFailed(true)}
            className="h-full w-full object-contain  object-cover"
          />
        )}
      </span>
    </span>
  );
}

const Word = ({ children }) => (
  <span className="inline-block overflow-hidden py-[0.05em] align-bottom">
    <span className="hero-word inline-block will-change-transform">{children}</span>
  </span>
);

const Line = ({ tokens, images, color }) => (
  <span className="block lg:whitespace-nowrap" style={{ color }}>
    {tokens.map((t, i) => (
      <span key={i}>
        {t.startsWith("@") ? <PhotoChip name={t.slice(1)} images={images} /> : <Word>{t}</Word>}{" "}
      </span>
    ))}
  </span>
);

const Arrow = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    className={`h-4 w-4 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const icon = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "h-[18px] w-[18px]",
  "aria-hidden": true,
};

const TRUST = [
  {
    label: "Registered Tax Agents",
    svg: (
      <svg viewBox="0 0 24 24" {...icon}>
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "Upfront Fixed Pricing",
    svg: (
      <svg viewBox="0 0 24 24" {...icon}>
        <circle cx="12" cy="12" r="9" />
        <path d="M14.5 9.2c-.6-.8-1.5-1.2-2.5-1.2-1.4 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1 0-1.9-.4-2.5-1.2M12 6.5V8m0 8v1.5" />
      </svg>
    ),
  },
  {
    label: "Proactive Advisory",
    svg: (
      <svg viewBox="0 0 24 24" {...icon}>
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M15 7h6v6" />
      </svg>
    ),
  },
];

export default function HeroSection({
  images = DEFAULT_IMAGES,
  consultationHref = "/contact",
  servicesHref = "#services",
}) {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(".hero-badge", { y: 16, opacity: 0, duration: 0.6 })
          .from(".hero-word", { yPercent: 115, duration: 1, stagger: 0.06 }, "-=0.3")
          /* Reveal the inline photos from left to right. */
          .from(
            ".hero-chip",
            { clipPath: "inset(0% 100% 0% 0%)", duration: 1.1, ease: "power3.inOut", stagger: 0.2 },
            "-=0.8"
          )
          .from(".hero-fade", { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.9");

        gsap.to(".hero-float", {
          y: -4,
          duration: 2.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.4, from: "random" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={root} className="scroll-mt-24 px-3 pb-6 pt-20 sm:px-5 sm:pt-24">
      <div
        className="mx-auto max-w-350 rounded-4xl px-5 sm:py-12 sm:rounded-[2.5rem] sm:px-10  md:py-24 lg:py-10"
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center lg:max-w-7xl">
          {/* badge */}
          <div
            className="hero-badge inline-flex items-center gap-2 rounded-full  px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] sm:text-xs"
            style={{ borderColor: C.border, color: C.primary }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: C.primaryHover }} />
            Tax Advisory &amp; Strategic Growth
          </div>

          {/* headline */}
          <h1
            aria-label="Financial clarity to accelerate your growth"
            style={{ fontFamily: HEADING_FONT }}
            className="mt-5 text-[clamp(3rem,6.4vw,5.9rem)]  font-black uppercase leading-[1.05] tracking-[-0.035em] lg:max-w-6xl lg:text-[clamp(3.5rem,5vw,5.25rem)]"
          >
            <span aria-hidden="true">
              {LINES.map((l, i) => (
                <Line key={i} tokens={l.tokens} images={images} color={l.color} />
              ))}
            </span>
          </h1>

          <p className="hero-fade mt-8 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: C.textSecondary }}>
            We take care of your tax returns, corporate compliance, and cash flow strategy — giving founders,
            investors, and corporate leaders complete financial confidence year-round.
          </p>

          {/* CTAs */}
          <div className="hero-fade mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              to={consultationHref}
              className="group inline-flex items-center gap-4 rounded-full py-1.5 pl-7 pr-1.5 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-[#0B3D91]"
              style={{ backgroundColor: C.primary }}
            >
              Book Strategic Consultation
              <span
                className="grid h-10 w-10 place-items-center rounded-full"
                style={{ backgroundColor: C.primaryLight, color: C.primary }}
              >
                <Arrow className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
              </span>
            </Link>

            <Link
              to={servicesHref}
              className="inline-flex items-center rounded-full border bg-white px-7 py-[14px] text-[15px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(0,16,34,0.35)]"
              style={{ borderColor: C.border, color: C.primary }}
            >
              Explore Our Services
            </Link>
          </div>

          {/* trust row */}
          <ul
            className="hero-fade mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium"
            style={{ color: C.textSecondary }}
          >
            {TRUST.map((t) => (
              <li key={t.label} className="inline-flex items-center gap-2">
                <span style={{ color: C.primaryHover }}>{t.svg}</span>
                {t.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}