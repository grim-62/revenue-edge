import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NAVIGATION = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const CTA = { label: "Book a consultation", href: "/contact" };

/* Which nav item matches the current URL (path + hash) */
function getActiveHref(path, hash) {
  if (path.startsWith("/service/")) return "/services";

  const hashMatch = NAVIGATION.find((n) => {
    const [p, h] = n.href.split("#");
    return h && path === (p || "/") && hash === `#${h}`;
  });
  if (hashMatch) return hashMatch.href;

  const plain = NAVIGATION.filter((n) => !n.href.includes("#"))
    .sort((a, b) => b.href.length - a.href.length)
    .find((n) => (n.href === "/" ? path === "/" : path === n.href || path.startsWith(`${n.href}/`)));
  return plain ? plain.href : null;
}

function ArrowIcon({ className = "" }) {
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

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const current = getActiveHref(location.pathname, location.hash);
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);

  /* scroll state: only changes shadow/opacity, never the size of the bar */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close the mobile menu: Escape, click outside, or growing to desktop width */
  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => e.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const go = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-50 focus:rounded-full focus:bg-[#001022] focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <div ref={wrapRef} className="relative mx-auto max-w-[1400px]">
        <nav
          aria-label="Main navigation"
          className={`flex h-16 items-center justify-between rounded-2xl border border-white/70 px-3 backdrop-blur-xl transition-[background-color,box-shadow] duration-300 sm:px-4 md:h-[4.5rem] ${
            scrolled
              ? "bg-white/85 shadow-[0_14px_36px_-18px_rgba(0,16,34,0.35)]"
              : "bg-white/65 shadow-[0_1px_0_rgba(0,16,34,0.04)]"
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            aria-label="Revenue Edge home"
            className="flex shrink-0 items-center rounded-lg px-1 outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
            onClick={go}
          >
            <img
              src="/reta.png"
              alt="Revenue Edge"
              width="172"
              height="50"
              decoding="async"
              className="h-9 w-auto sm:h-10 md:h-11"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAVIGATION.map(({ label, href }) => {
              const active = current === href;
              return (
                <Link
                  key={label}
                  to={href}
                  aria-current={active ? "page" : undefined}
                  onClick={go}
                  className={`rounded-full px-4 py-2 text-[15px] font-semibold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#0B3D91] ${
                    active
                      ? "bg-[#E8F0FF] text-[#001022]"
                      : "text-slate-600 hover:bg-[#E8F0FF]/70 hover:text-[#001022]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            <Link
              to={CTA.href}
              onClick={go}
              className="group ml-3 inline-flex items-center gap-3 rounded-full bg-[#001022] py-1.5 pl-5 pr-1.5 text-sm font-semibold text-white outline-none transition-colors duration-300 hover:bg-[#0B3D91] focus-visible:ring-2 focus-visible:ring-[#0B3D91] focus-visible:ring-offset-2"
            >
              {CTA.label}
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#001022]">
                <ArrowIcon className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
              </span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            ref={buttonRef}
            type="button"
            className="relative grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white/80 text-[#001022] outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-[#0B3D91] md:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" className="relative block h-4 w-5">
              <span
                className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${
                  menuOpen ? "top-[7px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-5 rounded bg-current transition-all duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${
                  menuOpen ? "top-[7px] -rotate-45" : "top-[14px]"
                }`}
              />
            </span>
          </button>
        </nav>

        {/* Mobile panel */}
        <div
          id="mobile-navigation"
          inert={!menuOpen}
          className={`absolute inset-x-0 top-[calc(100%+0.5rem)] origin-top rounded-2xl border border-white/70 bg-white/95 p-3 shadow-[0_24px_60px_-24px_rgba(0,16,34,0.4)] backdrop-blur-xl transition-all duration-200 md:hidden ${
            menuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
          }`}
        >
          <ul className="grid gap-1">
            {NAVIGATION.map(({ label, href }) => {
              const active = current === href;
              return (
                <li key={label}>
                  <Link
                    to={href}
                    aria-current={active ? "page" : undefined}
                    onClick={go}
                    className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#0B3D91] ${
                      active ? "bg-[#E8F0FF] text-[#001022]" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {label}
                    <ArrowIcon className="text-slate-400" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            to={CTA.href}
            onClick={go}
            className="group mt-3 flex items-center justify-between rounded-full bg-[#001022] py-1.5 pl-6 pr-1.5 text-[15px] font-semibold text-white outline-none transition-colors hover:bg-[#0B3D91] focus-visible:ring-2 focus-visible:ring-[#0B3D91] focus-visible:ring-offset-2"
          >
            {CTA.label}
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#001022]">
              <ArrowIcon className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}