import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CalcArt } from "./Sketches";

gsap.registerPlugin(ScrollTrigger);

/* Needs this as the first line of src/index.css:
   @import url("https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&display=swap"); */
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

function Field({ id, label, optional, required, children }) {
  return (
    <div className="ct-field">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold" style={{ color: C.primary }}>
        {label}
        {required && <span className="ml-1 text-[#0B3D91]" aria-hidden="true">*</span>}
        {optional && <span className="ml-1.5 font-normal text-[#64748B]">(optional)</span>}
      </label>
      {children}
    </div>
  );
}

const Arrow = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={`h-4 w-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/**
 * Contact form.
 * Connect it with ONE of:
 *   endpoint  – URL that accepts a JSON POST (Formspree, your API, etc.)
 *   onSubmit  – async (data) => {} that sends it however you like
 */
export default function SectionSeven({ image = "/contact/team.jpg", endpoint, onSubmit }) {
  const root = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: ".ct-card", start: "top 80%" },
          })
          .from(".ct-card", { y: 60, opacity: 0, duration: 0.9 })
          .from(".ct-photo", { scale: 1.12, duration: 1.3 }, "<")
          .from(".ct-title, .ct-lead, .ct-field, .ct-submit", { y: 24, opacity: 0, duration: 0.6, stagger: 0.07 }, "-=0.8");
      });
    }, root);
    return () => ctx.revert();
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
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
      } else {
        throw new Error("Contact form is not connected: pass an `endpoint` or `onSubmit` prop to <SectionSeven />.");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <section id="contact" ref={root} className="scroll-mt-24 px-3 py-6 sm:px-5">
      <div className="mx-auto max-w-[1400px] px-0 py-10 sm:px-2 md:py-16">
        <div
          className="ct-card mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-[#CBD5E1] bg-white p-4 shadow-[0_40px_90px_-40px_rgba(0,16,34,0.45)] sm:rounded-[2.5rem] sm:p-6 md:grid-cols-[0.9fr_1.1fr] md:gap-10 md:p-8"
        >
          {/* photo */}
          <div className="relative min-h-72 overflow-hidden rounded-[1.5rem] md:min-h-[34rem]">
           
            <img src={'/img12.jpg'} alt="Revenue Edge accountants" loading="lazy" draggable={false} className="ct-photo absolute h-full w-full object-bottom object-contain" />
          </div>

          {/* form */}
          <div className="px-2 py-8 sm:px-4 md:py-6">
            <h2
              style={{ fontFamily: HEADING_FONT, color: C.primary }}
              className="ct-title text-[clamp(2rem,4.4vw,3.5rem)] font-black uppercase leading-[1] tracking-[-0.035em]"
            >
              Get in touch
            </h2>
            <p className="ct-lead mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: C.textSecondary }}>
              Tell us a little about what you need and we’ll come back to you with the next step.
            </p>

            {status === "sent" ? (
              <div role="status" className="mt-10 rounded-3xl border border-[#E2E8F0] bg-[#F4F7FC] p-8 text-center">
                <span
                  className="mx-auto grid h-14 w-14 place-items-center rounded-full text-white"
                  style={{ backgroundColor: C.primaryHover }}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <p className="mt-5 text-xl font-bold" style={{ color: C.primary }}>
                  Thanks, your message is on its way.
                </p>
                <p className="mt-2 text-[15px]" style={{ color: C.textSecondary }}>
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
              <form onSubmit={handleSubmit} noValidate={false} className="mt-8 space-y-5">
                {/* honeypot */}
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label>
                    Website
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <Field id="ct-name" label="Name" required>
                  <input id="ct-name" name="name" type="text" required autoComplete="name" placeholder="Your name" className={inputCls} />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="ct-company" label="Company" optional>
                    <input id="ct-company" name="company" type="text" autoComplete="organization" placeholder="Company name" className={inputCls} />
                  </Field>
                  <Field id="ct-phone" label="Phone" optional>
                    <input id="ct-phone" name="phone" type="tel" autoComplete="tel" placeholder="Phone number" className={inputCls} />
                  </Field>
                </div>

                <Field id="ct-email" label="Email" required>
                  <input id="ct-email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={inputCls} />
                </Field>

                <Field id="ct-message" label="How can we help?" required>
                  <textarea
                    id="ct-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us a little about what you need"
                    className={`${inputCls} resize-y`}
                   
                  />
                </Field>

                <div className="ct-submit">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group flex w-full items-center justify-between rounded-full py-1.5 pl-7 pr-1.5 text-[15px] font-semibold text-white outline-none transition-colors duration-300 hover:bg-[#0B3D91] focus-visible:ring-2 focus-visible:ring-[#0B3D91] focus-visible:ring-offset-2 disabled:opacity-70"
                    style={{ backgroundColor: C.primary }}
                  >
                    {status === "sending" ? "Sending…" : "Send message"}
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white" style={{ color: C.primary }}>
                      <Arrow className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                    </span>
                  </button>
                  <div aria-live="polite" className="mt-3">
                    {status === "error" && (
                      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        Something went wrong. Please try again, or contact us directly.
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