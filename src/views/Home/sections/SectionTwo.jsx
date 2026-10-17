import { useEffect, useRef, useState } from "react";
import { deferGsap } from "../../../deferGsap";

const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';

const C = {
  primary: "#001022",
  primaryHover: "#0B3D91",
  primaryLight: "#E8F0FF",
  accent: "#BCD0FF", // soft blue pop (plays the role of Pal's yellow)
  textSecondary: "#475569",
  border: "#E2E8F0",
  ink: "#0F172A",
};

/* ───────── Content ───────── */
/* "@name" = sticker badge sitting inside the headline */
const STATEMENT = [
  ["CLEAR", "NUMBERS.", "@growth", "REAL"],
  ["PARTNERSHIP.", "@strategy"],
];

/* Photos: save them in  public/who/  as  growing.jpg, investors.jpg, corporate.jpg
   (or pass your own paths with the `images` prop). A sketch shows if a photo is missing. */
const DEFAULT_IMAGES = {
  growing: "https://i.pinimg.com/1200x/16/02/5b/16025b2cd1421f917cff4f260e4ebf4b.jpg",
  investors: "https://i.pinimg.com/736x/be/e7/28/bee7281cc637b48bdbef4f430d0b2108.jpg",
  corporate: "https://i.pinimg.com/1200x/d6/1b/6c/d61b6c41d2e1285ab187f170ac7dbda4.jpg",
};

const AUDIENCES = [
  {
    id: "growing",
    tag: "Growing Businesses",
    art: "chart",
    quote: "“I need clarity and growth, not just once-a-year compliance.”",
    body: "Streamlined accounting, proactive cash flow forecasts, and smart entity structuring to protect your margins.",
    focus: ["Tax-Effective Structuring", "Cash Flow Forecasting", "Growth Roadmaps"],
  },
  {
    id: "investors",
    tag: "Investors & Individuals",
    art: "coins",
    quote: "“I want to grow my wealth and keep the ATO happy.”",
    body: "High-level property portfolio depreciation, SMSF compliance, and capital gains minimization.",
    focus: ["Property Tax", "SMSF Administration", "CGT Optimization"],
  },
  {
    id: "corporate",
    tag: "Corporate Enterprises",
    art: "calc",
    quote: "“We need strategic financial brains, not just calculators.”",
    body: "M&A due diligence, corporate valuations, statutory audits, and board-level reporting.",
    focus: ["Corporate Governance", "Valuations & Audits", "Inter-Entity Tax"],
  },
];

const WHO_INTRO =
  "Different stages of wealth demand different fiscal instruments. We tailor our engagement model to your operational footprint.";

/* ───────── Icons ───────── */
const ico = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const PhilosophyIcon = () => (
  <svg {...ico} className="h-[18px] w-[18px]">
    <circle cx="12" cy="11" r="2" />
    <path d="M8 15a5.5 5.5 0 0 1 0-8M16 7a5.5 5.5 0 0 1 0 8M12 13v6M9 19h6" />
  </svg>
);

const GrowthIcon = () => (
  <svg {...ico} className="h-[0.85em] w-[0.85em]">
    <path d="M5 20v-6M11 20V9M17 20v-8" />
    <path d="M3 8l5-4 4 3 8-5M16 2h4v4" />
  </svg>
);

const StrategyIcon = () => (
  <svg {...ico} className="h-[0.85em] w-[0.85em]">
    <path d="M12 3l2.4 1.8 3-.3 1 2.8 2.5 1.7-.9 2.9.9 2.9-2.5 1.7-1 2.8-3-.3L12 21l-2.4-1.8-3 .3-1-2.8L3.1 15l.9-2.9-.9-2.9 2.5-1.7 1-2.8 3 .3L12 3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

/* ───────── Sticker badge that sits inline in the headline ───────── */
const STICKERS = {
  growth: {
    label: "Faster Growth",
    Icon: GrowthIcon,
    className: "border-white bg-white text-[#001022] shadow-[0_10px_30px_-10px_rgba(255,255,255,0.35)]",
  },
  strategy: {
    label: "Strategy",
    Icon: StrategyIcon,
    className: "border-white/30 bg-white/10 text-white backdrop-blur-md",
  },
};

function Sticker({ name }) {
  const { label, Icon, className } = STICKERS[name];
  return (
    <span className="st-sticker mx-[0.1em] inline-block align-middle">
      <span
        className={`st-float relative top-[-0.1em] inline-flex items-center gap-[0.45em] whitespace-nowrap rounded-full border px-[0.8em] py-[0.4em] text-[0.4em] font-semibold normal-case leading-none tracking-normal transition-transform duration-300 hover:scale-105 md:text-[0.36em] ${className}`}
      >
        <Icon />
        {label}
      </span>
    </span>
  );
}

/* Each word sits in a mask so it can slide up into view */
const Word = ({ children, cls = "st-word" }) => (
  <span className="inline-block overflow-hidden py-[0.05em] align-bottom">
    <span className={`${cls} inline-block will-change-transform`}>{children}</span>
  </span>
);

const Words = ({ text = "", cls = "wy-word" }) =>
  text.split(" ").map((w, i) => (
    <span key={`${w}-${i}`}>
      <Word cls={cls}>{w}</Word>{" "}
    </span>
  ));

/* Words that light up one by one as you scroll */
const ScrubWords = ({ text = "" }) =>
  text.split(" ").map((w, i) => (
    <span key={`${w}-${i}`}>
      <span className="wy-scrub">{w}</span>{" "}
    </span>
  ));

const P = (props) => (
  <path pathLength="1" strokeDasharray="1" className="draw" {...props} />
);

const Accent = (props) => <path className="wy-accent" stroke="none" fill={C.accent} {...props} />;

const Frame = ({ children }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    stroke={C.ink}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-full w-full overflow-visible"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const BARS = [
  [22, 20],
  [38, 32],
  [54, 46],
  [70, 60],
];

const ChartArt = () => (
  <Frame>
    {BARS.map(([x, h]) => (
      <Accent key={`a${x}`} d={`M${x} 86V${86 - h}h11v${h}z`} />
    ))}
    <P d="M12 12v74h80" />
    {BARS.map(([x, h]) => (
      <P key={x} d={`M${x} 86V${86 - h}h11v${h}`} />
    ))}
    <P d="M16 58L42 40l14 8 30-30" />
    <P d="M74 18h12v12" />
    <P d="M30 6v6M38 4l-3 5M22 8l3 4" strokeWidth="1.4" />
  </Frame>
);

const CoinsArt = () => (
  <Frame>
    <g transform="rotate(-6 50 50)">
      <Accent d="M20 32a30 9 0 1 0 60 0a30 9 0 1 0-60 0" />
      {[74, 60, 46].map((y) => (
        <g key={y}>
          <P d={`M20 ${y}v8a30 9 0 0 0 60 0v-8`} />
          <P d={`M20 ${y}a30 9 0 1 0 60 0a30 9 0 1 0-60 0`} />
        </g>
      ))}
      <P d="M20 32v8a30 9 0 0 0 60 0v-8" />
      <P d="M20 32a30 9 0 1 0 60 0a30 9 0 1 0-60 0" />
      <P d="M54 28c-5-3-11-1-9 3s10 2 9 6-8 4-11 1M49 24v16" strokeWidth="1.8" />
    </g>
    <P d="M82 14l-4 6M88 22l-6 2M76 8v6" strokeWidth="1.4" />
  </Frame>
);

const CalcArt = () => (
  <Frame>
    <g transform="rotate(-8 50 50)">
      <Accent d="M27 20h46v15H27z" />
      <P d="M22 14h56a4 4 0 0 1 4 4v62a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z" />
      <P d="M27 20h46v15H27z" />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2].map((c) => (
          <P key={`${r}-${c}`} d={`M${28 + c * 16} ${42 + r * 10}h11v6h-11z`} strokeWidth="1.6" />
        ))
      )}
    </g>
    <P d="M70 96L94 58M74 98L98 60M94 58l4 2" />
  </Frame>
);

const ART = { chart: ChartArt, coins: CoinsArt, calc: CalcArt };

/* ───────── Rows: photo card + sketch/quote block ───────── */
function PhotoCard({ item, src, className = "" }) {
  const [failed, setFailed] = useState(false);
  const Art = ART[item.art];
  return (
    <div
      className={`wy-photo relative aspect-[1.17/1] w-full overflow-hidden rounded-[1.5rem] ${className}`}
      style={{ backgroundColor: C.primaryLight }}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={item.tag}
          loading="lazy"
          draggable={false}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover will-change-transform"
        />
      ) : (
        <div className="grid h-full w-full place-items-center p-12 sm:p-16">
          <div className="h-full w-full max-w-[14rem]">
            <Art />
          </div>
        </div>
      )}
      <span
        className="wy-tag absolute left-5 top-5 rounded-full bg-white px-5 py-2 text-[15px] font-semibold shadow-[0_6px_20px_-8px_rgba(0,16,34,0.35)]"
        style={{ color: C.primary }}
      >
        {item.tag}
      </span>
    </div>
  );
}

function TextBlock({ item }) {
  const Art = ART[item.art];
  return (
    <div className="wy-text mx-auto flex max-w-md flex-col items-center text-center">
      <div className="h-28 w-28 sm:h-32 sm:w-32">
        <Art />
      </div>
      <h3 className="mt-8 text-xl font-bold leading-snug sm:text-2xl" style={{ color: C.primary }}>
        {item.quote}
      </h3>
      <p className="mt-4 text-sm leading-relaxed sm:text-[15px]" style={{ color: C.textSecondary }}>
        {item.body}
      </p>
      <ul className="mt-6 flex flex-wrap justify-center gap-2">
        {item.focus.map((f) => (
          <li
            key={f}
            className="rounded-full border bg-white px-3.5 py-1.5 text-xs font-semibold"
            style={{ borderColor: C.border, color: C.primaryHover }}
          >
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────── Section ───────── */
export default function SectionTwo({ images = DEFAULT_IMAGES }) {
  const root = useRef(null);

  useEffect(
    () =>
      deferGsap((gsap, ScrollTrigger) => {
        const ctx = gsap.context(() => {
          const mm = gsap.matchMedia();

          mm.add("(prefers-reduced-motion: no-preference)", () => {
            const once = (trigger, start = "top 80%") => ({ trigger, start, once: true });

            /* 1. Statement card: card lifts, words rise, stickers pop, subline fades */
            gsap
              .timeline({
                defaults: { ease: "power4.out" },
                scrollTrigger: once(".st-card", "top 78%"),
              })
              .from(".st-card", { y: 40, opacity: 0, duration: 0.9, clearProps: "transform,opacity" })
              .from(".st-badge", { y: 16, opacity: 0, duration: 0.6 }, "-=0.5")
              .from(".st-word", { yPercent: 115, duration: 1, stagger: 0.06 }, "-=0.3")
              .from(
                ".st-sticker",
                { scale: 0.5, rotate: -8, opacity: 0, duration: 0.8, ease: "back.out(1.8)", stagger: 0.2 },
                "-=0.7"
              )
              .from(".st-sub", { y: 20, opacity: 0, duration: 0.7 }, "-=0.6");

            gsap.to(".st-float", {
              y: -4,
              duration: 2.4,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              stagger: { each: 0.35, from: "random" },
            });

            /* 2. Who we work with: rule draws across, title rises, intro lights up with scroll */
            gsap.from(".wy-line", {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 1.4,
              ease: "power3.inOut",
              scrollTrigger: once(".wy-line", "top 92%"),
            });

            gsap.from(".wy-head .wy-word", {
              yPercent: 115,
              duration: 1,
              stagger: 0.06,
              ease: "power4.out",
              scrollTrigger: once(".wy-head", "top 82%"),
            });

            const introWords = gsap.utils.toArray(".wy-head .wy-scrub");
            gsap.set(introWords, { opacity: 0.2 });
            gsap.to(introWords, {
              opacity: 1,
              ease: "none",
              stagger: 0.12,
              scrollTrigger: { trigger: ".wy-head p", start: "top 85%", end: "bottom 55%", scrub: true },
            });

            /* 3. Rows: photo wipes in from its own side, tag pops, text rises, sketch draws; photo drifts inside frame */
            gsap.utils.toArray(".wy-row").forEach((row, i) => {
              const photoOnRight = i % 2 === 1;
              const photo = row.querySelector(".wy-photo");
              const img = photo?.querySelector("img");
              const tag = row.querySelector(".wy-tag");

              gsap
                .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: once(row, "top 78%") })
                .fromTo(
                  photo,
                  { clipPath: photoOnRight ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
                  { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut", clearProps: "clipPath" }
                )
                .from(tag, { y: 14, scale: 0.85, opacity: 0, duration: 0.6, ease: "back.out(1.7)" }, "-=0.5")
                .from(row.querySelectorAll(".wy-text > *"), { y: 30, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.8")
                .from(
                  row.querySelectorAll(".wy-text .draw"),
                  { strokeDashoffset: 1, duration: 1.2, ease: "power2.inOut", stagger: 0.015 },
                  "<"
                )
                .from(row.querySelectorAll(".wy-text .wy-accent"), { opacity: 0, duration: 0.6 }, "-=0.5");

              if (img) {
                gsap.fromTo(
                  img,
                  { yPercent: -8, scale: 1.2 },
                  {
                    yPercent: 8,
                    scale: 1.2,
                    ease: "none",
                    scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true },
                  }
                );
              }
            });
          });
        }, root);

        ScrollTrigger.refresh();
        return () => ctx.revert();
      }),
    []
  );

  return (
    <section id="who-we-work-with" ref={root} className="overflow-x-clip px-3 py-6 sm:px-5">
      <div className="mx-auto max-w-[1400px]">
        {/* Statement card */}
        <div
          className="st-card relative mx-auto max-w-full overflow-hidden rounded-[1.75rem] px-5 py-10 text-center sm:rounded-[2rem] sm:px-8 sm:py-14 md:px-12 md:py-10"
          style={{
            backgroundColor: C.primary,
            backgroundImage:
              "radial-gradient(60% 90% at 88% 70%, rgba(11,61,145,0.28), transparent 70%), repeating-radial-gradient(circle at 88% 75%, rgba(255,255,255,0.035) 0 1px, transparent 1px 26px)",
          }}
        >
          <div className="relative z-10 flex flex-col items-center">
            <span className="st-badge inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
              <PhilosophyIcon />
              Our Philosophy
            </span>

            <p
              style={{ fontFamily: HEADING_FONT }}
              className="mt-6 max-w-4xl text-[clamp(1.5rem,3.8vw,3.25rem)] font-bold uppercase leading-[1.18] tracking-[-0.025em] text-white sm:mt-7"
            >
              <span aria-hidden="true">
                {STATEMENT.map((line, li) => (
                  <span key={li} className="block">
                    {line.map((t, i) => (
                      <span key={i}>
                        {t.startsWith("@") ? <Sticker name={t.slice(1)} /> : <Word>{t}</Word>}{" "}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            </p>

            <p className="st-sub mt-5 max-w-2xl text-sm leading-relaxed text-white/75 sm:mt-6 sm:text-base">
              No dry jargon or surprise bills. Just dedicated commercial accountants in your corner driving measurable enterprise value.
            </p>
          </div>
        </div>

        {/* Who we work with (zig-zag) */}
        <div className="px-2 pb-10 pt-16 sm:px-6 md:pb-16 md:pt-16">
          <div className="wy-line h-px w-full" style={{ backgroundColor: C.primary }} />

          <div className="wy-head mx-auto mt-12 flex max-w-3xl flex-col items-center text-center md:mt-16">
            <h2
              aria-label="Who We Work With"
              style={{ fontFamily: HEADING_FONT, color: C.primary }}
              className="text-[clamp(2.2rem,5.4vw,4.75rem)] font-black uppercase leading-[1] tracking-[-0.035em]"
            >
              <span aria-hidden="true">
                <Words text="Who We Work With" cls="wy-word" />
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed" style={{ color: C.textSecondary }}>
              <ScrubWords text={WHO_INTRO} />
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-5xl space-y-14 md:mt-20 md:space-y-24">
            {AUDIENCES.map((a, i) => (
              <div key={a.id} className="wy-row grid items-center gap-8 md:grid-cols-2 md:gap-16">
                <PhotoCard item={a} src={images?.[a.id]} className={i % 2 === 1 ? "md:order-2" : ""} />
                <TextBlock item={a} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}