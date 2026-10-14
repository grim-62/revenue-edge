import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Needs this as the first line of src/index.css:
   @import url("https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&display=swap"); */
const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';

const C = {
  primary: "#001022",
  primaryHover: "#0B3D91",
  primaryLight: "#E8F0FF",
};

const DEFAULT_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const DEFAULT_SERVICES = [
  { label: "Business Services", href: "/services" },
  { label: "Personal & Wealth", href: "/services" },
  { label: "Corporate Services", href: "/services" },
];

const ICONS = {
  linkedin: (
    <path d="M4 9h3v11H4zM5.5 4a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5zM10 9h2.9v1.6c.5-.9 1.7-1.9 3.5-1.9 3 0 3.6 2 3.6 4.6V20h-3v-5.8c0-1.4 0-3-1.9-3s-2.1 1.4-2.1 2.9V20h-3z" />
  ),
  instagram: (
    <>
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="17.2" cy="6.8" r="1.2" />
    </>
  ),
  facebook: (
    <path d="M14 8h2.5V4.5H14A3.5 3.5 0 0 0 10.5 8v2H8v3.5h2.5V20H14v-6.5h2.5L17 10h-3V8z" />
  ),
};

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

function Column({ title, children }) {
  return (
    <div className="ft-col">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
        {title}
      </p>
      <div className="mt-5 grid gap-3 text-[15px]">{children}</div>
    </div>
  );
}

const linkCls = "text-white/75 transition-colors duration-300 hover:text-white";

function AppLink({ href, children, ...props }) {
  if (href.startsWith("/")) {
    return (
      <Link to={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

/**
 * Footer
 *   links     – [{ label, href }]            main navigation
 *   services  – [{ label, href }]            service links
 *   contact   – { phone, email, address }    only the ones you pass are shown
 *   socials   – [{ label: "LinkedIn" | "Instagram" | "Facebook", href }]
 *   legal     – [{ label, href }]            e.g. Privacy, Terms
 *   ctaHref   – where the "Book a consultation" button goes
 */
export default function Footer({
  links = DEFAULT_LINKS,
  services = DEFAULT_SERVICES,
  contact = {},
  socials = [],
  legal = [],
  ctaHref = "/contact",
}) {
  const root = useRef(null);
  const hasContact = contact.phone || contact.email || contact.address;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".ft-cta > *", {
          y: 30,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".ft-cta", start: "top 88%" },
        });
        gsap.from(".ft-brand, .ft-col", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".ft-grid", start: "top 90%" },
        });
        gsap.from(".ft-mark", {
          yPercent: 30,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: { trigger: ".ft-mark", start: "top 100%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={root} className="px-3 pb-3 pt-10 sm:px-5">
      <div
        className="relative mx-auto max-w-full overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]"
        style={{
          backgroundColor: C.primary,
          backgroundImage:
            "radial-gradient(55% 70% at 85% 0%, rgba(11,61,145,0.35), transparent 70%), repeating-radial-gradient(circle at 85% 0%, rgba(255,255,255,0.03) 0 1px, transparent 1px 28px)",
        }}
      >
        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-14 sm:px-10 md:pt-20">
          {/* CTA */}
          <div className="ft-cta flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2
                style={{ fontFamily: HEADING_FONT }}
                className="text-[clamp(2rem,4.6vw,4rem)] font-black uppercase leading-[1.02] tracking-[-0.035em] text-white"
              >
                Ready to simplify your numbers?
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/65">
                Tell us where you are and where you want to be. We’ll map out
                the next step together.
              </p>
            </div>
            <AppLink
              href={ctaHref}
              className="group inline-flex w-fit shrink-0 items-center gap-4 rounded-full bg-white py-1.5 pl-7 pr-1.5 text-[15px] font-semibold transition-colors duration-300 hover:bg-[#E8F0FF]"
              style={{ color: C.primary }}
            >
              Book a consultation
              <span
                className="grid h-10 w-10 place-items-center rounded-full text-white"
                style={{ backgroundColor: C.primary }}
              >
                <Arrow className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
              </span>
            </AppLink>
          </div>

          {/* Columns */}
          <div className="ft-grid mt-14 flex flex-col gap-12 border-t border-white/10 pt-12 md:mt-20 md:flex-row md:justify-between">
            <div className="ft-brand max-w-xs">
              <div className="mix-blend-screen">
                <img
                  src="/reta.png"
                  className="h-15 w-auto brightness-0 invert"
                  alt="Reta"
                />
              </div>
              <p className="mt-5 text-[15px] leading-relaxed text-white/65">
                Registered tax agents, upfront fixed pricing and proactive
                advice, built around you.
              </p>

              {socials.length > 0 && (
                <div className="mt-6 flex gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-[#001022]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-[18px] w-[18px]"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        {ICONS[s.label.toLowerCase()]}
                      </svg>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-12 sm:gap-x-16 md:flex md:gap-20">
              <Column title="Navigate">
                {links.map((l) => (
                  <AppLink key={l.label} href={l.href} className={linkCls}>
                    {l.label}
                  </AppLink>
                ))}
              </Column>

              <Column title="Services">
                {services.map((l) => (
                  <AppLink key={l.label} href={l.href} className={linkCls}>
                    {l.label}
                  </AppLink>
                ))}
              </Column>

              {hasContact && (
                <Column title="Contact">
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, "")}`}
                      className={linkCls}
                    >
                      {contact.phone}
                    </a>
                  )}
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} className={linkCls}>
                      {contact.email}
                    </a>
                  )}
                  {contact.address && (
                    <span className="max-w-[14rem] leading-relaxed text-white/65">
                      {contact.address}
                    </span>
                  )}
                </Column>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 flex flex-col gap-4 border-t border-white/10 py-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Revenue Edge. All rights reserved.
            </p>
            {legal.length > 0 && (
              <div className="flex gap-6">
                {legal.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="transition-colors duration-300 hover:text-white"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Decorative wordmark: one line, fits the width, cropped at the bottom */}
        
      </div>
    </footer>
  );
}
