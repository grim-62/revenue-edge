import { useEffect, useRef, useState } from "react";

const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';

const C = {
  primary: "#001022",
  primaryHover: "#0B3D91",
  primaryLight: "#E8F0FF",
  textSecondary: "#475569",
  border: "#E2E8F0",
};

const inputCls =
  "w-full rounded-xl border border-[#CBD5E1] bg-[#F4F7FC] px-4 py-3.5 text-base text-[#001022] outline-none transition placeholder:text-[#8593A8] hover:border-[#94A3B8] focus:border-[#0B3D91] focus:bg-white focus:ring-4 focus:ring-[#0B3D91]/15";

/* Entrance animation: plain CSS transitions (transform + opacity only) switched on by an
   IntersectionObserver. No GSAP is needed here, so nothing waits for a download and the page
   stays smooth while it loads. */
const REVEAL_CSS = `
.ct-reveal .ct-card { opacity: 0; transform: translateY(50px) scale(0.97); transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1); }
.ct-reveal .ct-pop { opacity: 0; transform: translateY(18px); transition: opacity 0.7s ease, transform 0.85s cubic-bezier(0.22, 1, 0.36, 1); }
.ct-reveal .ct-word { display: inline-block; transform: translateY(115%); transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1); }
.ct-reveal .ct-cover { transform: scaleX(1); transform-origin: right center; transition: transform 1.1s cubic-bezier(0.76, 0, 0.24, 1) 0.45s; }
.ct-reveal .ct-photo { transform: scale(1.15); transition: transform 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.35s; }

.ct-reveal.ct-in .ct-card,
.ct-reveal.ct-in .ct-pop { opacity: 1; transform: none; }
.ct-reveal.ct-in .ct-word { transform: none; }
.ct-reveal.ct-in .ct-cover { transform: scaleX(0); }
.ct-reveal.ct-in .ct-photo { transform: scale(1); }

@media (prefers-reduced-motion: reduce) {
  .ct-reveal .ct-card, .ct-reveal .ct-pop, .ct-reveal .ct-word, .ct-reveal .ct-photo { opacity: 1; transform: none; transition: none; }
  .ct-reveal .ct-cover { display: none; }
}
`;

/* Heading words rise out of a mask, one after another */
function Words({ text, base = 0.4 }) {
  return text.split(" ").map((word, index) => (
    <span key={`${word}-${index}`}>
      <span className="inline-block overflow-hidden py-[0.05em] align-bottom">
        <span className="ct-word" style={{ transitionDelay: `${base + index * 0.09}s` }}>
          {word}
        </span>
      </span>{" "}
    </span>
  ));
}

function Field({ id, label, optional, required, delay = 0.6, children }) {
  return (
    <div className="ct-pop" style={{ transitionDelay: `${delay}s` }}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold"
        style={{ color: C.primary }}
      >
        {label}
        {required && (
          <span className="ml-1 text-[#0B3D91]" aria-hidden="true">
            *
          </span>
        )}
        {optional && (
          <span className="ml-1.5 font-normal text-[#64748B]">(optional)</span>
        )}
      </label>
      {children}
    </div>
  );
}

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

/**
 * Contact form.
 * Connect it with ONE of:
 *   endpoint  – URL that accepts a JSON POST (Formspree, your API, etc.)
 *   onSubmit  – async (data) => {} that sends it however you like
 */
export default function SectionSeven({ endpoint, onSubmit }) {
  const root = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  /* switch the entrance on once the section scrolls into view */
  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("ct-in");
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("ct-in");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (data.website) return; // honeypot: real visitors never fill this in
    delete data.website;

    setStatus("sending");
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
      } else {
        throw new Error(
          "Contact form is not connected: pass an `endpoint` or `onSubmit` prop to <SectionSeven />.",
        );
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      ref={root}
      className="ct-reveal scroll-mt-24 px-3 py-6 sm:px-5"
    >
      <style>{REVEAL_CSS}</style>

      <div className="mx-auto max-w-[1400px] px-0 py-10 sm:px-2 md:py-16">
        <div
          className="
    ct-card mx-auto grid max-w-6xl grid-cols-1
    items-start gap-6 overflow-hidden rounded-[2rem]
    border border-[#CBD5E1] bg-white p-4
    shadow-[0_40px_90px_-40px_rgba(0,16,34,0.45)]
    sm:rounded-[2.5rem] sm:p-6
    md:grid-cols-[0.9fr_1.1fr] md:gap-10 md:p-8
  "
        >
          {/* LEFT COLUMN */}
          <div className="flex min-w-0 flex-col px-1 py-3 sm:px-2 md:py-6">
            {/* Image appears first on mobile: a cover panel wipes away, then the picture settles */}
            <div className="ct-illustration relative order-1 mb-6 min-h-64 overflow-hidden rounded-3xl  sm:min-h-80 md:order-2 md:mb-0 md:mt-8 md:min-h-[30rem]">
              <img
                src="/img12.jpg"
                alt="Revenue Edge accounting and advisory"
                loading="lazy"
                decoding="async"
                draggable={false}
                className="ct-photo absolute inset-0 h-full w-full object-contain object-center"
              />
              <span
                aria-hidden="true"
                className="ct-cover pointer-events-none absolute inset-0 z-10 bg-[#ffffnpm]"
              />
            </div>

            {/* Heading appears after image on mobile */}
            <div className="order-2 md:order-1">
              <h2
                aria-label="Let’s Chat"
                style={{
                  fontFamily: HEADING_FONT,
                  color: C.primary,
                }}
                className="text-[clamp(2rem,4.4vw,3.5rem)] font-black uppercase leading-[1] tracking-[-0.035em]"
              >
                <span aria-hidden="true">
                  <Words text="Let’s Chat" />
                </span>
              </h2>

              <p
                className="ct-pop mt-4 max-w-md text-[15px] leading-relaxed"
                style={{ color: C.textSecondary, transitionDelay: "0.55s" }}
              >
                Tell us a little about what you need and we’ll come back to you
                with the next step.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: FORM */}
          <div className="min-w-0 px-1 py-3 sm:px-2 md:py-6">
            {status === "sent" ? (
              <div
                role="status"
                className="mt-4 rounded-3xl border border-[#E2E8F0] bg-[#F4F7FC] p-8 text-center"
              >
                <span
                  className="mx-auto grid h-14 w-14 place-items-center rounded-full text-white"
                  style={{ backgroundColor: C.primaryHover }}
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>

                <p
                  className="mt-5 text-xl font-bold"
                  style={{ color: C.primary }}
                >
                  Thanks, your message is on its way.
                </p>

                <p
                  className="mt-2 text-[15px]"
                  style={{ color: C.textSecondary }}
                >
                  We’ll get back to you soon.
                </p>

                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm font-semibold underline underline-offset-4"
                  style={{ color: C.primaryHover }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot */}
                <div
                  className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
                  aria-hidden="true"
                >
                  <label>
                    Website
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </label>
                </div>

                <Field id="ct-name" label="Name" required delay={0.6}>
                  <input
                    id="ct-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className={inputCls}
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="ct-company" label="Company" optional delay={0.68}>
                    <input
                      id="ct-company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      placeholder="Company name"
                      className={inputCls}
                    />
                  </Field>

                  <Field id="ct-phone" label="Phone" required delay={0.76}>
                    <input
                      id="ct-phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="Phone number"
                      className={inputCls}
                    />
                  </Field>
                </div>

                <Field id="ct-email" label="Email" required delay={0.84}>
                  <input
                    id="ct-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={inputCls}
                  />
                </Field>

                <Field
                  id="ct-message"
                  label="How can we help?"
                  required
                  delay={0.92}
                >
                  <textarea
                    id="ct-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us a little about what you need"
                    className={`${inputCls} resize-y`}
                  />
                </Field>

                <div className="ct-pop" style={{ transitionDelay: "1s" }}>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group flex w-full items-center justify-between rounded-full py-1.5 pl-7 pr-1.5 text-[15px] font-semibold text-white outline-none transition-colors duration-300 hover:bg-[#0B3D91] focus-visible:ring-2 focus-visible:ring-[#0B3D91] focus-visible:ring-offset-2 disabled:opacity-70"
                    style={{ backgroundColor: C.primary }}
                  >
                    {status === "sending" ? "Sending…" : "Send message"}

                    <span
                      className="grid h-10 w-10 place-items-center rounded-full bg-white"
                      style={{ color: C.primary }}
                    >
                      <Arrow className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                    </span>
                  </button>

                  <div aria-live="polite" className="mt-3">
                    {status === "error" && (
                      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        Something went wrong. Please try again, or contact us
                        directly.
                      </p>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}