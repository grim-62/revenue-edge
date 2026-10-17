import { useEffect, useRef } from "react";
import SectionSeven from "../Home/sections/SectionSeven";
import { Link } from "react-router-dom";
import { deferGsap } from "../../deferGsap";

const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';

const STEPS = [
  {
    number: "01",
    title: "Tell us what’s on your mind",
    body: "A few details about you, your business, or the decision you’re facing is a great place to begin.",
  },
  {
    number: "02",
    title: "We’ll understand what you need",
    body: "We’ll take a look at your enquiry and work out which kind of support best fits your situation.",
  },
  {
    number: "03",
    title: "Agree on a way forward",
    body: "We’ll talk through the next step, the scope of work, and clear pricing before anything gets underway.",
  },
];

/* First-screen entrance is pure CSS (transform + opacity only): it starts on the first frame and
   never waits for GSAP to download. GSAP handles everything below the fold. */
const INTRO_CSS = `
@keyframes cpx-fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes cpx-word-up { from { transform: translateY(115%); } to { transform: none; } }
.cpx-fade { animation: cpx-fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
.cpx-word { display: inline-block; animation: cpx-word-up 1.05s cubic-bezier(0.22, 1, 0.36, 1) both; }
@media (prefers-reduced-motion: reduce) {
  .cpx-fade, .cpx-word { animation: none; }
}
`;

/* Each word sits in a mask so it can slide up into view.
   css = true  → animated by the CSS above (first screen)
   css = false → animated by GSAP when scrolled into view */
function Words({ text, css = false, delay = 0.3 }) {
  return text.split(" ").map((word, index) => (
    <span key={`${word}-${index}`}>
      <span className="inline-block px-1 overflow-hidden py-[0.05em] align-bottom">
        {css ? (
          <span className="cpx-word" style={{ animationDelay: `${delay + index * 0.09}s` }}>
            {word}
          </span>
        ) : (
          <span className="cp-word inline-block">{word}</span>
        )}
      </span>{" "}
    </span>
  ));
}

export default function ContactPage() {
  const root = useRef(null);

  useEffect(() => {
    const cleanup = deferGsap((gsap, ScrollTrigger) => {
      const el = root.current;
      if (!el) return undefined;

      /* fewer layout recalculations on phones when the address bar shows/hides */
      ScrollTrigger.config({ ignoreMobileResize: true });

      const context = gsap.context(() => {
        const motion = gsap.matchMedia();

        motion.add("(prefers-reduced-motion: no-preference)", () => {
          const once = (trigger, start = "top 80%") => ({ trigger, start, once: true });

          /* Where to find us: heading words rise, then the card rises, the info panel slides in,
             its details cascade, and a cover panel wipes away to reveal the map */
          gsap.from(".cl-fade", { y: 18, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out", scrollTrigger: once(".cl-head", "top 85%") });
          gsap.from(".cl-head .cp-word", { yPercent: 115, duration: 1, stagger: 0.06, ease: "power4.out", scrollTrigger: once(".cl-head", "top 82%") });

          const cover = el.querySelector(".cl-cover");
          if (cover) gsap.set(cover, { scaleX: 1, transformOrigin: "right center" });

          gsap
            .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: once(".contact-location", "top 80%") })
            .from(".contact-location", { y: 50, opacity: 0, duration: 0.9 })
            .from(".cl-info", { x: -36, opacity: 0, duration: 0.8 }, "-=0.55")
            .from(".cl-info dl > *", { y: 16, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.45")
            .to(".cl-cover", { scaleX: 0, duration: 1.1, ease: "power3.inOut" }, "-=0.9");

          /* Steps: heading words, cards rise one after another, number badges pop */
          gsap.from(".cs-fade", { y: 18, opacity: 0, duration: 0.7, ease: "power3.out", scrollTrigger: once(".cs-head", "top 85%") });
          gsap.from(".cs-head .cp-word", { yPercent: 115, duration: 1, stagger: 0.05, ease: "power4.out", scrollTrigger: once(".cs-head", "top 82%") });

          gsap
            .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: once(".contact-steps", "top 82%") })
            .from(".contact-steps article", { y: 44, opacity: 0, scale: 0.96, duration: 0.85, stagger: 0.14, clearProps: "transform,opacity" })
            .from(".cs-num", { scale: 0, duration: 0.6, stagger: 0.14, ease: "back.out(2)" }, "-=0.95");

          /* Closing card: the dark card rises, then its content follows */
          gsap
            .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: once(".contact-closing", "top 82%") })
            .from(".cc-card", { y: 60, opacity: 0, scale: 0.97, duration: 1 })
            .from(".contact-closing .cp-word", { yPercent: 115, duration: 0.95, stagger: 0.05, ease: "power4.out" }, "-=0.6")
            .from(".cc-fade", { y: 20, opacity: 0, duration: 0.7, stagger: 0.12 }, "-=0.7");

          gsap.from(".cc-btn", { scale: 0.85, opacity: 0, duration: 0.8, ease: "back.out(1.7)", scrollTrigger: once(".contact-closing", "top 78%") });
        });
      }, el);

      /* re-measure once web fonts have loaded, since text size changes trigger positions */
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => context.revert();
    });

    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, []);

  return (
    <div ref={root}>
      <style>{INTRO_CSS}</style>

      <section className="contact-intro px-4 pb-2 pt-14 sm:px-6 sm:pt-20">
        <div className="mx-auto max-w-6xl">
          <p
            className="cpx-fade text-sm font-semibold uppercase tracking-[0.2em] text-[#0B3D91]"
            style={{ animationDelay: "0.1s" }}
          >
            A good conversation starts here
          </p>
          <h1
            aria-label="Let’s chat."
            className="mt-4 max-w-4xl text-[clamp(3rem,8vw,6.5rem)] font-black uppercase leading-[0.9] tracking-[-0.055em] text-[#001022]"
            style={{ fontFamily: HEADING_FONT }}
          >
            <span aria-hidden="true">
              <Words text="Let’s chat." css delay={0.25} />
            </span>
          </h1>
          <p
            className="cpx-fade mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl"
            style={{ animationDelay: "0.7s" }}
          >
            Whether you have a clear plan or are still working out your next
            step, tell us a little about it. We’ll help you find the right place
            to start.
          </p>
        </div>
      </section>

      <SectionSeven />

      <section className="px-4 py-12 sm:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="cl-head mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="cl-fade text-sm font-semibold uppercase tracking-[0.18em] text-[#0B3D91]">
                Come say hello
              </p>
              <h2
                aria-label="Where to find us"
                className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-none tracking-[-0.04em] text-[#001022]"
                style={{ fontFamily: HEADING_FONT }}
              >
                <span aria-hidden="true">
                  <Words text="Where to find us" />
                </span>
              </h2>
            </div>
            <p className="cl-fade max-w-md text-sm leading-relaxed text-slate-600">
              Prefer a call or email? Use the sample details below as a guide
              for the kind of information to add.
            </p>
          </div>

          <div className="contact-location grid overflow-hidden rounded-[2rem] border border-[#DCE5F0] bg-white shadow-[0_24px_70px_-42px_rgba(0,16,34,0.4)] md:grid-cols-[0.85fr_1.15fr]">
            <div className="cl-info relative z-10 m-4 rounded-[1.5rem] bg-[#E8F0FF] p-6 sm:m-6 sm:p-8">
              <span className="inline-flex rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#0B3D91]">
                Sample details — replace before launch
              </span>
              <h3
                className="mt-6 max-w-sm text-3xl font-black uppercase leading-[1.02] tracking-[-0.04em] text-[#001022]"
                style={{ fontFamily: HEADING_FONT }}
              >
                Let’s make the numbers clearer.
              </h3>

              <dl className="mt-8 grid gap-5 text-sm">
                <div>
                  <dt className="font-semibold text-slate-500">Office</dt>
                  <dd className="mt-1 font-medium leading-relaxed text-[#001022]">
                    Suite 00, 123 Example Street
                    <br />
                    Melbourne Victoria, Australia
                  </dd>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-slate-500">Call</dt>
                    <dd className="mt-1">
                      <a
                        className="font-semibold text-[#001022] underline decoration-[#0B3D91]/40 underline-offset-4"
                        href="tel:+61200000000"
                      >
                        +61 2 0000 0000
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">Email</dt>
                    <dd className="mt-1">
                      <a
                        className="font-semibold text-[#001022] underline decoration-[#0B3D91]/40 underline-offset-4"
                        href="mailto:hello@revenueedge.example"
                      >
                        hello@revenueedge.example
                      </a>
                    </dd>
                  </div>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Office hours</dt>
                  <dd className="mt-1 font-medium text-[#001022]">
                    Monday–Friday, 9:00 am–5:00 pm AEST
                  </dd>
                </div>
              </dl>
            </div>

            <div className="relative min-h-[20rem] overflow-hidden bg-[#D9F0F5] md:min-h-[31rem]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.6983291685!2d144.68053897669978!3d-37.82053447197394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad68ebb238a3783%3A0x291e87b4418fb671!2s28%20Burgess%20Rd%2C%20Tarneit%20VIC%203029%2C%20Australia!5e0!3m2!1sen!2sin!4v1792167470595!5m2!1sen!2sin"
                title="Google Maps location - 28 Burgess Road, Tarneit VIC 3029, Australia"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
              {/* cover panel: wipes away to reveal the map (hidden by default, so the map never gets stuck covered) */}
              <span
                aria-hidden="true"
                className="cl-cover pointer-events-none absolute inset-0 z-10 bg-[#BCD0FF]"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="cs-head max-w-2xl">
            <p className="cs-fade text-sm font-semibold uppercase tracking-[0.18em] text-[#0B3D91]">
              A clear next step
            </p>
            <h2
              aria-label="What happens when you get in touch?"
              className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-none tracking-[-0.04em] text-[#001022]"
              style={{ fontFamily: HEADING_FONT }}
            >
              <span aria-hidden="true">
                <Words text="What happens when you get in touch?" />
              </span>
            </h2>
          </div>

          <div className="contact-steps mt-9 grid gap-4 md:grid-cols-3">
            {STEPS.map((step) => (
              <article
                key={step.number}
                className="rounded-[1.75rem] border border-[#DCE5F0] bg-white p-6 transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-30px_rgba(0,16,34,0.4)] sm:p-8"
              >
                <span className="cs-num grid h-11 w-11 place-items-center rounded-full bg-[#E8F0FF] text-sm font-bold text-[#0B3D91]">
                  {step.number}
                </span>
                <h3 className="mt-6 text-xl font-bold tracking-tight text-[#001022]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-closing px-4 pb-16 pt-8 sm:px-6 md:pb-24">
        <div className="cc-card mx-auto max-w-6xl rounded-[2rem] bg-[#001022] px-6 py-10 text-white sm:px-10 sm:py-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="cc-fade text-sm font-semibold uppercase tracking-[0.18em] text-[#BCD0FF]">
                Not sure where to start?
              </p>
              <h2
                aria-label="Explore how we can help."
                className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-none tracking-[-0.04em]"
                style={{ fontFamily: HEADING_FONT }}
              >
                <span aria-hidden="true">
                  <Words text="Explore how we can help." />
                </span>
              </h2>
              <p className="cc-fade mt-4 max-w-xl leading-relaxed text-white/70">
                From tax and bookkeeping to business advice, find the service
                that best matches what you’re working through.
              </p>
            </div>
            <Link
              to="/services"
              className="cc-btn inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-[#001022] transition-colors hover:bg-[#E8F0FF]"
            >
              Browse our services
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}