import SectionSeven from "../Home/sections/SectionSeven";
import { Link } from "react-router-dom";

export default function ContactPage() {
  return (
    <>
      <section className="px-4 pb-2 pt-14 sm:px-6 sm:pt-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0B3D91]">
            A good conversation starts here
          </p>
          <h1
            className="mt-4 max-w-4xl text-[clamp(3rem,8vw,6.5rem)] font-black uppercase leading-[0.9] tracking-[-0.055em] text-[#001022]"
            style={{ fontFamily: '"Archivo", ui-sans-serif, system-ui, sans-serif' }}
          >
            Let’s chat.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            Whether you have a clear plan or are still working out your next
            step, tell us a little about it. We’ll help you find the right place
            to start.
          </p>
        </div>
      </section>

      <SectionSeven />

      <section className="px-4 py-12 sm:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0B3D91]">
                Come say hello
              </p>
              <h2
                className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-none tracking-[-0.04em] text-[#001022]"
                style={{ fontFamily: '"Archivo", ui-sans-serif, system-ui, sans-serif' }}
              >
                Where to find us
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-600">
              Prefer a call or email? Use the sample details below as a guide
              for the kind of information to add.
            </p>
          </div>

          <div className="grid overflow-hidden rounded-[2rem] border border-[#DCE5F0] bg-white shadow-[0_24px_70px_-42px_rgba(0,16,34,0.4)] md:grid-cols-[0.85fr_1.15fr]">
            <div className="relative z-10 m-4 rounded-[1.5rem] bg-[#E8F0FF] p-6 sm:m-6 sm:p-8">
              <span className="inline-flex rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#0B3D91]">
                Sample details — replace before launch
              </span>
              <h3
                className="mt-6 max-w-sm text-3xl font-black uppercase leading-[1.02] tracking-[-0.04em] text-[#001022]"
                style={{ fontFamily: '"Archivo", ui-sans-serif, system-ui, sans-serif' }}
              >
                Let’s make the numbers clearer.
              </h3>

              <dl className="mt-8 grid gap-5 text-sm">
                <div>
                  <dt className="font-semibold text-slate-500">Office</dt>
                  <dd className="mt-1 font-medium leading-relaxed text-[#001022]">
                    Suite 00, 123 Example Street
                    <br />
                    Sydney NSW 2000, Australia
                  </dd>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-slate-500">Call</dt>
                    <dd className="mt-1">
                      <a className="font-semibold text-[#001022] underline decoration-[#0B3D91]/40 underline-offset-4" href="tel:+61200000000">
                        +61 2 0000 0000
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">Email</dt>
                    <dd className="mt-1">
                      <a className="font-semibold text-[#001022] underline decoration-[#0B3D91]/40 underline-offset-4" href="mailto:hello@revenueedge.example">
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
              <svg
                viewBox="0 0 720 520"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 h-full w-full"
                role="img"
                aria-label="Illustrative map graphic for a sample Sydney office location"
              >
                <rect width="720" height="520" fill="#D9F0F5" />
                <path d="M0 88 720 442M0 350 720 110M95 0l310 520M545 0 245 520M0 230h720M360 0v520" stroke="#FFFFFF" strokeWidth="18" />
                <path d="M0 88 720 442M0 350 720 110M95 0l310 520M545 0 245 520M0 230h720M360 0v520" stroke="#B7CFD6" strokeWidth="2" />
                <path d="M0 468c170-80 263-66 361-4s221 61 359-18" fill="none" stroke="#A6DDE7" strokeWidth="32" />
                <path d="M44 140h95v62H44zm436 185h108v76H480zM214 24h76v60h-76zM601 120h74v62h-74z" fill="#C5E2C9" />
                <path d="M152 0v520M0 294h720M433 0v520M0 400h720" stroke="#FFFFFF" strokeWidth="5" strokeDasharray="12 10" />
                <circle cx="376" cy="257" r="42" fill="#0B3D91" fillOpacity=".12" />
                <path d="M376 199c-25 0-45 20-45 45 0 34 45 82 45 82s45-48 45-82c0-25-20-45-45-45Z" fill="#001022" />
                <circle cx="376" cy="244" r="14" fill="#FFFFFF" />
                <text x="30" y="42" fill="#001022" fontFamily="sans-serif" fontSize="16" fontWeight="700">SYDNEY · SAMPLE MAP</text>
              </svg>
              <div className="absolute bottom-5 left-5 rounded-2xl border border-white/70 bg-white/90 px-5 py-4 shadow-lg backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0B3D91]">Example location</p>
                <p className="mt-1 font-bold text-[#001022]">Sydney, Australia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0B3D91]">
              A clear next step
            </p>
            <h2
              className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-none tracking-[-0.04em] text-[#001022]"
              style={{ fontFamily: '"Archivo", ui-sans-serif, system-ui, sans-serif' }}
            >
              What happens when you get in touch?
            </h2>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {[
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
            ].map((step) => (
              <article
                key={step.number}
                className="rounded-[1.75rem] border border-[#DCE5F0] bg-white p-6 sm:p-8"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#E8F0FF] text-sm font-bold text-[#0B3D91]">
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

      <section className="px-4 pb-16 pt-8 sm:px-6 md:pb-24">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-[#001022] px-6 py-10 text-white sm:px-10 sm:py-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#BCD0FF]">
                Not sure where to start?
              </p>
              <h2
                className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-none tracking-[-0.04em]"
                style={{ fontFamily: '"Archivo", ui-sans-serif, system-ui, sans-serif' }}
              >
                Explore how we can help.
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-white/70">
                From tax and bookkeeping to business advice, find the service
                that best matches what you’re working through.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-[#001022] transition-colors hover:bg-[#E8F0FF]"
            >
              Browse our services
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}