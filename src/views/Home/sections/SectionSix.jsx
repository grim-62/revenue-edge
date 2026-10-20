import { useCallback, useEffect, useRef, useState } from "react";
import { deferGsap } from "../../../deferGsap";
import ConsultationButton from "../../../components/ConsultationButton";

/* Needs this as the first line of src/index.css:
   @import url("https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&display=swap"); */
const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';

const C = {
  primary: "#001022",
  primaryHover: "#0B3D91",
  primaryLight: "#E8F0FF",
  accent: "#BCD0FF",
  textSecondary: "#475569",
  border: "#E2E8F0",
};

/* PLACEHOLDERS: replace with real client reviews (with permission) before launch,
   or pass your own with <SectionSix reviews={[...]} /> */
const PLACEHOLDER_REVIEWS = [
  {
    name: "Client name",
    role: "Business owner",
    rating: 5,
    text: "Replace this with a real client review. Two or three sentences work best.",
  },
  {
    name: "Client name",
    role: "Investor",
    rating: 5,
    text: "Replace this with a real client review. Two or three sentences work best.",
  },
  {
    name: "Client name",
    role: "Finance director",
    rating: 5,
    text: "Replace this with a real client review. Two or three sentences work best.",
  },
  {
    name: "Client name",
    role: "Founder",
    rating: 5,
    text: "Replace this with a real client review. Two or three sentences work best.",
  },
];

/* Each word sits in a mask so it can slide up into view */
const Words = ({ text = "", cls = "tm-word" }) =>
  text.split(" ").map((w, i) => (
    <span key={`${w}-${i}`}>
      <span className="inline-block overflow-hidden py-[0.05em] align-bottom">
        <span className={`${cls} inline-block will-change-transform`}>{w}</span>
      </span>{" "}
    </span>
  ));

const Star = ({ filled }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill={filled ? "#F5B301" : "#E2E8F0"}
    aria-hidden="true"
  >
    <path d="M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.2l-5.7 3 1.1-6.3L2.8 9.5l6.4-.9L12 2.8z" />
  </svg>
);

const QuoteMark = ({ className = "" }) => (
  <svg
    viewBox="0 0 48 36"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M0 36V21.6C0 9.6 6.4 2.4 18 0l1.6 5.6C13.6 7.6 11 11.2 10.6 16H20v20H0zm28 0V21.6C28 9.6 34.4 2.4 46 0l1.6 5.6C41.6 7.6 39 11.2 38.6 16H48v20H28z" />
  </svg>
);

const Chevron = ({ dir }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
  </svg>
);

export default function SectionSix({
  reviews = PLACEHOLDER_REVIEWS,
  contactHref = "#contact",
  reviewsHref = "/review",
}) {
  const root = useRef(null);
  const track = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  const scrollByPage = (dir) => {
    const el = track.current;
    if (el)
      el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(
    () =>
      deferGsap((gsap, ScrollTrigger) => {
        const ctx = gsap.context(() => {
          const mm = gsap.matchMedia();

          mm.add("(prefers-reduced-motion: no-preference)", () => {
            const once = (trigger, start = "top 80%") => ({
              trigger,
              start,
              once: true,
            });

            /* 1. Header: rule draws, title rises, copy + arrows follow */
            gsap
              .timeline({
                defaults: { ease: "power4.out" },
                scrollTrigger: once(".tm-head", "top 85%"),
              })
              .from(".tm-line", {
                scaleX: 0,
                transformOrigin: "left center",
                duration: 1.3,
                ease: "power3.inOut",
              })
              .from(
                ".tm-head .tm-word",
                { yPercent: 115, duration: 1, stagger: 0.06 },
                "-=0.9",
              )
              .from(
                ".tm-head .tm-fade",
                {
                  y: 20,
                  opacity: 0,
                  duration: 0.7,
                  stagger: 0.1,
                  ease: "power3.out",
                },
                "-=0.6",
              );

            /* 2. Cards glide in from the right, each one a little later */
            gsap
              .timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: once(".tm-track", "top 88%"),
              })
              .from(".tm-card", {
                x: 90,
                opacity: 0,
                duration: 1,
                stagger: 0.12,
                clearProps: "transform,opacity",
              })
              .from(
                ".tm-card .tm-star",
                {
                  scale: 0,
                  duration: 0.4,
                  stagger: 0.015,
                  ease: "back.out(2.5)",
                },
                "-=0.9",
              );

            /* 3. "Read all reviews" button */
            gsap.from(".tm-more", {
              y: 20,
              opacity: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: once(".tm-more", "top 94%"),
            });

            /* 4. Promo: banner opens, text from the left, image wipes in from the right and drifts */
            gsap
              .timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: once(".tm-promo", "top 82%"),
              })
              .fromTo(
                ".tm-promo",
                {
                  clipPath: "inset(10% 5% 10% 5% round 2rem)",
                  opacity: 0,
                  y: 40,
                },
                {
                  clipPath: "inset(0% 0% 0% 0% round 2rem)",
                  opacity: 1,
                  y: 0,
                  duration: 1.1,
                  ease: "power4.out",
                  clearProps: "clipPath,opacity,transform",
                },
              )
              .from(
                ".tm-promo .tm-word",
                {
                  yPercent: 115,
                  duration: 0.9,
                  stagger: 0.05,
                  ease: "power4.out",
                },
                "-=0.6",
              )
              .from(
                ".tm-promo .tm-fade",
                { y: 22, opacity: 0, duration: 0.7, stagger: 0.1 },
                "-=0.6",
              )
              .fromTo(
                ".tm-promo-img",
                { clipPath: "inset(0% 0% 0% 100%)", x: 40 },
                {
                  clipPath: "inset(0% 0% 0% 0%)",
                  x: 0,
                  duration: 1.1,
                  ease: "power3.inOut",
                  clearProps: "clipPath,transform",
                },
                "-=1.2",
              );

            gsap.from(".tm-cta", {
              scale: 0.85,
              opacity: 0,
              duration: 0.8,
              ease: "back.out(1.7)",
              scrollTrigger: once(".tm-cta", "top 94%"),
            });

            gsap.fromTo(
              ".tm-promo-img img",
              { yPercent: -5 },
              {
                yPercent: 5,
                ease: "none",
                scrollTrigger: {
                  trigger: ".tm-promo",
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          });
        }, root);

        ScrollTrigger.refresh();
        return () => ctx.revert();
      }),
    [],
  );

  return (
    <section
      id="testimonials"
      ref={root}
      className="overflow-x-clip px-3 py-6 sm:px-5"
    >
      <div className="mx-auto max-w-[1400px] px-2 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div
            className="tm-line h-px w-full"
            style={{ backgroundColor: C.primary }}
          />
        </div>

        {/* Header + arrows */}
        <div className="tm-head mx-auto mt-10 flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2
              aria-label="What our clients say"
              style={{ fontFamily: HEADING_FONT, color: C.primary }}
              className="text-[clamp(2rem,4.6vw,4rem)] font-black uppercase leading-[1] tracking-[-0.035em]"
            >
              <span aria-hidden="true">
                <Words text="What our clients say" />
              </span>
            </h2>
            <p
              className="tm-fade mt-5 text-base leading-relaxed"
              style={{ color: C.textSecondary }}
            >
              Trusted by business owners, investors and corporate teams.
            </p>
          </div>

          <div className="tm-fade flex gap-3">
            {["left", "right"].map((dir) => (
              <button
                key={dir}
                type="button"
                aria-label={
                  dir === "left" ? "Previous reviews" : "Next reviews"
                }
                disabled={dir === "left" ? edge.start : edge.end}
                onClick={() => scrollByPage(dir === "left" ? -1 : 1)}
                className="grid h-12 w-12 place-items-center rounded-full border bg-white outline-none transition-colors duration-300 hover:bg-[#001022] hover:text-white focus-visible:ring-2 focus-visible:ring-[#0B3D91] disabled:pointer-events-none disabled:opacity-35"
                style={{ borderColor: C.primary, color: C.primary }}
              >
                <Chevron dir={dir} />
              </button>
            ))}
          </div>
        </div>

        {/* Review track */}
        <div
          ref={track}
          onScroll={measure}
          className="tm-track mx-auto mt-10 flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          tabIndex={0}
          aria-label="Client reviews"
        >
          {reviews.map((r, i) => (
            <figure
              key={`${r.name}-${i}`}
              className="tm-card group flex shrink-0 basis-[85%] snap-start flex-col justify-between rounded-[1.75rem] border bg-white p-7 transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_40px_-24px_rgba(0,16,34,0.35)] sm:basis-[46%] lg:basis-[31.5%]"
              style={{ borderColor: C.border }}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span style={{ color: C.primaryHover }}>
                    <QuoteMark className="h-7 w-9 transition-transform duration-500 group-hover:-rotate-6" />
                  </span>
                  <div
                    className="flex gap-0.5"
                    role="img"
                    aria-label={`${r.rating} out of 5 stars`}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} className="tm-star inline-block">
                        <Star filled={n <= r.rating} />
                      </span>
                    ))}
                  </div>
                </div>
                <blockquote
                  className="mt-6 text-[16px] leading-relaxed"
                  style={{ color: C.textSecondary }}
                >
                  {r.text}
                </blockquote>
              </div>

              <figcaption
                className="mt-8 flex items-center gap-3 border-t pt-5"
                style={{ borderColor: C.border }}
              >
                <span
                  className="grid h-11 w-11 place-items-center rounded-full text-sm font-bold"
                  style={{
                    backgroundColor: C.primaryLight,
                    color: C.primaryHover,
                  }}
                  aria-hidden="true"
                >
                  {r.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <span>
                  <span
                    className="block text-[15px] font-semibold"
                    style={{ color: C.primary }}
                  >
                    {r.name}
                  </span>
                  <span
                    className="block text-xs"
                    style={{ color: C.textSecondary }}
                  >
                    {r.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Link to the full reviews page */}
        <div className="tm-more mx-auto mt-8 flex max-w-6xl justify-center">
          <ConsultationButton
            href={reviewsHref}
            label="Read all reviews"
            variant="light"
            className="border border-[#001022]"
          />
        </div>

        {/* Promo banner */}
        <div
          className="tm-promo mx-auto mt-14 max-w-6xl overflow-hidden rounded-[2rem] px-6 py-10 sm:px-12 sm:py-14 md:grid md:grid-cols-[1.4fr_1fr] md:items-center md:gap-10"
          style={{ backgroundColor: C.accent }}
        >
          <div>
            <h3
              aria-label="Spend less time on admin. More on your business."
              style={{ fontFamily: HEADING_FONT, color: C.primary }}
              className="text-[clamp(1.6rem,3.4vw,2.9rem)] font-black uppercase leading-[1.04] tracking-[-0.03em]"
            >
              <span aria-hidden="true">
                <Words text="Spend less time on admin. More on your business." />
              </span>
            </h3>
            <p
              className="tm-fade mt-4 max-w-md text-[15px] leading-relaxed"
              style={{ color: "#1E293B" }}
            >
              Hand the paperwork to us and get back to running, and growing,
              what you’ve built.
            </p>

            <ConsultationButton
              className="tm-cta mt-6"
              to={contactHref}
              label="Get in touch"
              variant="dark"
            />
          </div>
          <div className="tm-promo-img mt-8 flex items-center justify-center overflow-hidden md:mt-0">
            <img
              src="./img4.png"
              alt=""
              width="1200"
              height="960"
              loading="lazy"
              className="h-auto w-full scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
