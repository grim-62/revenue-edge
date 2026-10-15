import { useState } from "react";
import { Link } from "react-router-dom";
import { CalcArt, ChartArt, CoinsArt } from "../Home/sections/Sketches";

const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';
const HERO_TITLE = "Accounting built around clear advice.";

const COLORS = {
  ink: "#001022",
  blue: "#BCD0FF",
  muted: "#475569",
};

const DEFAULT_IMAGES = {
  hero: "https://i.pinimg.com/736x/58/96/0d/58960d372e2ff5087d6daff317c3080b.jpg",
  people: "https://i.pinimg.com/736x/26/d6/ef/26d6efede6e21522e070b822f88dfaa2.jpg",
  together: "https://i.pinimg.com/736x/58/96/0d/58960d372e2ff5087d6daff317c3080b.jpg",
  adapt: "https://i.pinimg.com/736x/15/0b/14/150b142a43c82ef9fe5d49dc29ecee92.jpg",
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

function Words({ text }) {
  return text.split(" ").map((word, index) => (
    <span key={`${word}-${index}`}>
      <span className="inline-block overflow-hidden py-[0.05em] align-bottom">
        <span className="inline-block">{word}</span>
      </span>{" "}
    </span>
  ));
}

function Photo({ src, alt, className = "", imageClassName = "" }) {
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
          className={`h-full w-full object-cover ${imageClassName}`}
        />
      ) : (
        <div className="grid h-full min-h-48 place-items-center bg-gradient-to-br from-[#E8F0FF] via-[#BCD0FF] to-[#8AAEFF]">
          <span
            aria-hidden="true"
            className="grid h-16 w-16 place-items-center rounded-full bg-white/70 text-[#001022]"
          >
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
    <article className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
      <Photo
        src={image}
        alt={item.alt}
        className={`aspect-[4/3] rounded-[1.5rem] sm:rounded-[2rem] ${reverse ? "md:order-2" : ""}`}
      />
      <div className={reverse ? "md:order-1 md:pl-8" : "md:pr-8"}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0B3D91]">Our approach</p>
        <h2
          className="mt-4 text-[clamp(1.9rem,4vw,3.25rem)] font-black uppercase leading-[1.03] tracking-[-0.04em]"
          style={{ color: COLORS.ink, fontFamily: HEADING_FONT }}
        >
          {item.title}
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: COLORS.muted }}>
          {item.body}
        </p>
      </div>
    </article>
  );
}

export default function AboutPage({ images = DEFAULT_IMAGES, contactHref = "/contact" }) {
  return (
    <div className=" px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
      <div className="mx-auto max-w-6xl">
        <section>
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#E2E8F0] bg-[#E8F0FF] px-6 py-12 sm:rounded-[2.5rem] sm:px-12 sm:py-16 md:grid md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10">
            <div>
              <span className="inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#001022]">
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

            <div className="relative mx-auto h-56 w-full max-w-sm md:mt-0 md:h-72">
              <img src="./img3.jpg" className="h-full w-full object-cover scale-3d" alt="" />
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-8 py-16 sm:py-24 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0B3D91]">Our story</p>
            <h2
              className="mt-4 text-[clamp(2rem,4.5vw,3.8rem)] font-black uppercase leading-[1.02] tracking-[-0.045em]"
              style={{ color: COLORS.ink, fontFamily: HEADING_FONT }}
            >
              Accounting should move you forward.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed sm:text-lg" style={{ color: COLORS.muted }}>
            <p>
              Too often, people only hear from their accountant once a year and leave with more questions than answers.
              We believe there’s a better way.
            </p>
            <p>
              Revenue Edge is a tax and advisory practice for people who want straight answers, fair pricing and a
              partner who plans ahead. We make the numbers easier to understand and the next step easier to see.
            </p>
            <Link
              to="/services"
              className="group inline-flex items-center gap-3 pt-2 font-semibold text-[#001022] transition-colors hover:text-[#0B3D91]"
            >
              Explore our services
              <Arrow className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 sm:gap-5" aria-label="Our mission">
          <article className="rounded-[1.5rem] bg-[#BCD0FF] p-7 sm:rounded-[2rem] sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B3D91]">Our mission</p>
            <p className="mt-5 text-xl font-semibold leading-snug text-[#001022] sm:text-2xl">
              Help people make confident decisions with clear, thoughtful financial advice.
            </p>
          </article>
          <article className="rounded-[1.5rem] bg-[#E8F0FF] p-7 sm:rounded-[2rem] sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B3D91]">Our promise</p>
            <p className="mt-5 text-xl font-semibold leading-snug text-[#001022] sm:text-2xl">
              You’ll know where you stand, what we recommend and what happens next.
            </p>
          </article>
        </section>

        <section className="mx-auto grid max-w-5xl gap-14 py-16 sm:gap-20 sm:py-24">
          {STORY.map((item, index) => (
            <StoryRow
              key={item.title}
              item={item}
              image={images?.[item.image]}
              reverse={index === 1}
            />
          ))}
        </section>

        <section className="border-y border-slate-700 py-14 text-center sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0B3D91]">The bottom line</p>
          <h2
            className="mx-auto mt-4 max-w-3xl text-[clamp(2rem,5vw,4.25rem)] font-black uppercase leading-[1.02] tracking-[-0.045em]"
            style={{ color: COLORS.ink, fontFamily: HEADING_FONT }}
          >
            Straight answers. A clearer way forward.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: COLORS.muted }}>
            Whether you’re building a business, growing your wealth or planning what comes next, we’re here to help you
            make your numbers work for you.
          </p>
          <Link
            to={contactHref}
            className="group mt-8 inline-flex items-center gap-4 rounded-full bg-[#001022] py-2 pl-6 pr-2 text-sm font-semibold text-white transition-colors hover:bg-[#0B3D91] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3D91]"
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
