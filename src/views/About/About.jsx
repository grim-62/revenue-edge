import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { deferGsap } from "../../deferGsap";

const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';
const HERO_TITLE = "Accounting built around clear advice.";

const COLORS = {
  ink: "#001022",
  blue: "#BCD0FF",
  muted: "#475569",
};

const DEFAULT_IMAGES = {
  hero: "https://i.pinimg.com/736x/58/96/0d/58960d372e2ff5087d6daff317c3080b.jpg",
  people: "https://i.pinimg.com/1200x/fd/21/7e/fd217eaad772a8bf0a26eeddd899198e.jpg",
  together: "https://i.pinimg.com/736x/4c/34/a2/4c34a29c8b556ea64e06b7c12ee4c0b2.jpg",
  adapt: "https://i.pinimg.com/1200x/33/b3/67/33b36737fc79bfafaa8b79b1b884bbaf.jpg",
};

const STORY = [
  {
    title: "We’re people first",
    body: "Good advice starts with understanding the people behind the numbers. We take the time to listen, explain things clearly and make sure you feel supported at every step.",
    image: "people",
    alt: "Business owners sharing a conversation",
  },
  {
    title: "We own it — together",
    body: "Your goals matter to us. We work alongside you, stay accountable and keep you informed, so you always know what’s happening and what comes next.",
    image: "together",
    alt: "A team working together",
  },
  {
    title: "We grow and adapt",
    body: "Business and life don’t stand still. We keep looking ahead with you, adjusting the plan as things change and helping you make confident, informed decisions.",
    image: "adapt",
    alt: "A one-to-one business planning conversation",
  },
];

const INTRO_PARAGRAPHS = [
  "Too often, people only hear from their accountant once a year and leave with more questions than answers. We believe there’s a better way.",
  "Revenue Edge is a tax and advisory practice for people who want straight answers, fair pricing and a partner who plans ahead. We make the numbers easier to understand and the next step easier to see.",
];

function Arrow({ className = "" }) {
  return (
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
}

/* Each word sits in a mask so it can slide up into view */
function Words({ text }) {
  return text.split(" ").map((word, index) => (
    <span key={`${word}-${index}`}>
      <span className="inline-block overflow-hidden py-[0.05em] align-bottom">
        <span className="ab-word inline-block will-change-transform">{word}</span>
      </span>{" "}
    </span>
  ));
}

/* Words that light up one by one as you scroll */
function ScrubWords({ text }) {
  return text.split(" ").map((word, index) => (
    <span key={`${word}-${index}`}>
      <span className="ab-scrub">{word}</span>{" "}
    </span>
  ));
}

function Photo({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#E8F0FF] ${className}`}>
      {!failed && src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          draggable={false}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="grid h-full min-h-48 place-items-center bg-gradient-to-br from-[#E8F0FF] via-[#BCD0FF] to-[#8AAEFF]">
          <span aria-hidden="true" className="grid h-16 w-16 place-items-center rounded-full bg-white/70 text-[#001022]">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 19.5h18M5 19.5V9l7-5 7 5v10.5M9 19.5v-6h6v6" />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
}

function StoryRow({ item, image, reverse = false }) {
  return (
    <article data-reverse={reverse} className="ab-row grid items-center gap-8 md:grid-cols-2 md:gap-16">
      <Photo
        src={image}
        alt={item.alt}
        className={`ab-photo aspect-[4/3] rounded-[1.5rem] sm:rounded-[2rem] ${reverse ? "md:order-2" : ""}`}
      />
      <div className={`ab-rowtext ${reverse ? "md:order-1 md:pl-8" : "md:pr-8"}`}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0B3D91]">Our approach</p>
        <h2
          aria-label={item.title}
          className="mt-4 text-[clamp(1.9rem,4vw,3.25rem)] font-black uppercase leading-[1.03] tracking-[-0.04em]"
          style={{ color: COLORS.ink, fontFamily: HEADING_FONT }}
        >
          <span aria-hidden="true">
            <Words text={item.title} />
          </span>
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: COLORS.muted }}>
          {item.body}
        </p>
      </div>
    </article>
  );
}

export default function AboutPage({ images = DEFAULT_IMAGES, contactHref = "/contact" }) {
  const root = useRef(null);

  useEffect(() => {
    /* If GSAP is slow or fails to load, never leave the first screen hidden */
    const fallback = setTimeout(() => root.current?.classList.remove("ab-pending"), 2500);

    const cleanup = deferGsap((gsap, ScrollTrigger) => {
      const el = root.current;
      if (!el) return undefined;

      const context = gsap.context(() => {
        const motion = gsap.matchMedia();

        motion.add("(prefers-reduced-motion: no-preference)", () => {
          const once = (trigger, start = "top 80%") => ({ trigger, start, once: true });

          /* 1. Hero: smooth whole-card reveal, then word lift and image wipe */
          gsap
            .timeline({ defaults: { ease: "power4.out" } })
            .from(".ab-hero", { y: 28, opacity: 0, duration: 0.9 })
            .from(".ab-hero-badge", { y: 16, opacity: 0, duration: 0.6 }, "-=0.6")
            .from(".ab-hero .ab-word", { yPercent: 115, duration: 1.05, stagger: 0.06 }, "-=0.35")
            .fromTo(
              ".ab-hero-imgwrap",
              { clipPath: "inset(0% 0% 100% 0%)", opacity: 0 },
              { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.2, ease: "power3.inOut", clearProps: "clipPath,opacity" },
              "-=0.8"
            )
            .from(".ab-hero-imgwrap img", { scale: 1.35, duration: 1.7, ease: "power3.out" }, "<");

          gsap.to(".ab-hero-imgwrap img", {
            yPercent: 10,
            ease: "none",
            scrollTrigger: { trigger: ".ab-hero", start: "top top", end: "bottom top", scrub: true },
          });

          /* 2. Intro: title words rise, then the paragraph lights up word by word with scroll */
          gsap.from(".ab-intro-kicker", { y: 16, opacity: 0, duration: 0.6, ease: "power3.out", scrollTrigger: once(".ab-intro", "top 82%") });
          gsap.from(".ab-intro .ab-word", { yPercent: 115, duration: 1, stagger: 0.06, ease: "power4.out", scrollTrigger: once(".ab-intro") });

          const scrubWords = gsap.utils.toArray(".ab-scrub");
          gsap.set(scrubWords, { opacity: 0.2 });
          gsap.to(scrubWords, {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: ".ab-intro-copy", start: "top 82%", end: "bottom 55%", scrub: true },
          });

          gsap.from(".ab-intro-link", { y: 20, opacity: 0, duration: 0.7, ease: "power3.out", scrollTrigger: once(".ab-intro-link", "top 94%") });

          /* 3. Mission / promise cards slide in from opposite sides */
          gsap.from(".ab-card-left", {
            x: -90,
            rotate: -3,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: once(".about-values", "top 82%"),
          });
          gsap.from(".ab-card-right", {
            x: 90,
            rotate: 3,
            opacity: 0,
            duration: 1,
            delay: 0.12,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: once(".about-values", "top 82%"),
          });

          /* 4. Story rows: photo wipes in from its own side, title words rise, text follows; photo drifts inside its frame */
          gsap.utils.toArray(".ab-row").forEach((row) => {
            const photoOnRight = row.dataset.reverse === "true";
            const photo = row.querySelector(".ab-photo");
            const img = photo?.querySelector("img");
            const words = row.querySelectorAll(".ab-rowtext .ab-word");
            const copy = row.querySelectorAll(".ab-rowtext > :not(h2)");

            gsap
              .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: once(row, "top 78%") })
              .fromTo(
                photo,
                { clipPath: photoOnRight ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
                { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut", clearProps: "clipPath" }
              )
              .from(words, { yPercent: 115, duration: 0.9, stagger: 0.05, ease: "power4.out" }, "-=0.7")
              .from(copy, { y: 24, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.6");

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

          /* 5. Closing: rules draw across, headline rises, button pops */
          gsap.from(".ab-line", {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.4,
            ease: "power3.inOut",
            stagger: 0.15,
            scrollTrigger: once(".about-closing", "top 88%"),
          });
          gsap.from(".about-closing .ab-word", { yPercent: 115, duration: 1, stagger: 0.05, ease: "power4.out", scrollTrigger: once(".about-closing", "top 78%") });
          gsap.from(".about-closing .ab-fade", { y: 24, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out", scrollTrigger: once(".about-closing", "top 78%") });
          gsap.from(".ab-cta", { scale: 0.85, opacity: 0, duration: 0.8, ease: "back.out(1.7)", scrollTrigger: once(".ab-cta", "top 94%") });
        });
      }, el);

      /* start states are now set by GSAP, so the CSS "hidden until ready" state can go */
      el.classList.remove("ab-pending");
      ScrollTrigger.refresh();

      return () => context.revert();
    });

    return () => {
      clearTimeout(fallback);
      if (typeof cleanup === "function") cleanup();
    };
  }, []);

  return (
    <div
      ref={root}
      className="ab-pending px-4 pb-16 pt-8 sm:px-6 sm:pt-12"
    >
      <div className="mx-auto max-w-6xl">
        <section>
          <div className="ab-hero mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#E2E8F0] bg-[#E8F0FF] px-6 py-12 sm:rounded-[2.5rem] sm:px-12 sm:py-16 md:grid md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10">
            <div>
              <span className="ab-hero-badge inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#001022]">
                Our Story
              </span>
              <h1
                aria-label={HERO_TITLE}
                style={{ fontFamily: HEADING_FONT, color: COLORS.ink }}
                className="mt-6 text-[clamp(2rem,5.2vw,4.4rem)] font-black uppercase leading-[1.02] tracking-[-0.035em]"
              >
                <span aria-hidden="true">
                  <Words text={HERO_TITLE} />
                </span>
              </h1>
            </div>

            <div className="ab-hero-imgwrap relative mx-auto mt-10 h-56 w-full max-w-sm overflow-hidden rounded-[1.5rem] md:mt-0 md:h-72">
              <img src="./img3.jpg" className="h-full w-full scale-110 object-cover" alt="" />
            </div>
          </div>
        </section>

        <section className="ab-intro mx-auto grid max-w-5xl gap-8 py-16 sm:py-24 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <div>
            <p className="ab-intro-kicker text-xs font-bold uppercase tracking-[0.18em] text-[#0B3D91]">Our story</p>
            <h2
              aria-label="Accounting should move you forward."
              className="mt-4 text-[clamp(2rem,4.5vw,3.8rem)] font-black uppercase leading-[1.02] tracking-[-0.045em]"
              style={{ color: COLORS.ink, fontFamily: HEADING_FONT }}
            >
              <span aria-hidden="true">
                <Words text="Accounting should move you forward." />
              </span>
            </h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed sm:text-lg" style={{ color: COLORS.muted }}>
            <div className="ab-intro-copy space-y-5">
              {INTRO_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph}>
                  <ScrubWords text={paragraph} />
                </p>
              ))}
            </div>
            <Link
              to="/services"
              className="ab-intro-link group inline-flex items-center gap-3 pt-2 font-semibold text-[#001022] transition-colors hover:text-[#0B3D91]"
            >
              Explore our services
              <Arrow className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        <section className="about-values grid gap-4 sm:grid-cols-2 sm:gap-5" aria-label="Our mission">
          <article className="ab-card-left rounded-[1.5rem] bg-[#BCD0FF] p-7 transition-transform duration-500 hover:-translate-y-1 sm:rounded-[2rem] sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B3D91]">Our mission</p>
            <p className="mt-5 text-xl font-semibold leading-snug text-[#001022] sm:text-2xl">
              Help people make confident decisions with clear, thoughtful financial advice.
            </p>
          </article>
          <article className="ab-card-right rounded-[1.5rem] bg-[#E8F0FF] p-7 transition-transform duration-500 hover:-translate-y-1 sm:rounded-[2rem] sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B3D91]">Our promise</p>
            <p className="mt-5 text-xl font-semibold leading-snug text-[#001022] sm:text-2xl">
              You’ll know where you stand, what we recommend and what happens next.
            </p>
          </article>
        </section>

        <section className="about-story mx-auto grid max-w-5xl gap-14 py-16 sm:gap-20 sm:py-24">
          {STORY.map((item, index) => (
            <StoryRow key={item.title} item={item} image={images?.[item.image]} reverse={index === 1} />
          ))}
        </section>

        <section className="about-closing relative py-14 text-center sm:py-20">
          <span aria-hidden="true" className="ab-line absolute left-0 top-0 h-px w-full bg-slate-700" />
          <span aria-hidden="true" className="ab-line absolute bottom-0 left-0 h-px w-full bg-slate-700" />

          <p className="ab-fade text-xs font-bold uppercase tracking-[0.18em] text-[#0B3D91]">The bottom line</p>
          <h2
            aria-label="Straight answers. A clearer way forward."
            className="mx-auto mt-4 max-w-3xl text-[clamp(2rem,5vw,4.25rem)] font-black uppercase leading-[1.02] tracking-[-0.045em]"
            style={{ color: COLORS.ink, fontFamily: HEADING_FONT }}
          >
            <span aria-hidden="true">
              <Words text="Straight answers. A clearer way forward." />
            </span>
          </h2>
          <p className="ab-fade mx-auto mt-5 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: COLORS.muted }}>
            Whether you’re building a business, growing your wealth or planning what comes next, we’re here to help you
            make your numbers work for you.
          </p>
          <Link
            to={contactHref}
            className="ab-cta group mt-8 inline-flex items-center gap-4 rounded-full bg-[#001022] py-2 pl-6 pr-2 text-sm font-semibold text-white transition-colors hover:bg-[#0B3D91] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3D91]"
          >
            Book a conversation
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#001022]">
              <Arrow className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
            </span>
          </Link>
        </section>
      </div>
    </div>
  );
}