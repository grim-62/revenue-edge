import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { serviceCategories } from "../data/serviceData";

const NAVIGATION = [
  { label: "Our Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const CTA = { label: "Book a consultation", href: "/contact" };

/* Which nav item matches the current URL */
function getActiveHref(path) {
  if (path === "/services" || path.startsWith("/services/") || path.startsWith("/service/")) return "/services";
  const plain = NAVIGATION.filter((n) => n.href !== "/services")
    .sort((a, b) => b.href.length - a.href.length)
    .find((n) => path === n.href || path.startsWith(`${n.href}/`));
  return plain ? plain.href : null;
}

/* Animated underline for top-level links */
const NAV_UNDERLINE =
  "after:pointer-events-none after:absolute after:bottom-1 after:left-4 after:right-4 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-[#0B3D91] after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none";

/* Animated underline for links inside the dropdown (fits the text width) */
const ITEM_UNDERLINE =
  "after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:origin-left after:scale-x-0 after:rounded-full after:bg-[#0B3D91] after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none";

function ArrowIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${className}`} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ChevronIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${className}`} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/* ───────── Desktop dropdown: three category blocks, every service in a 2-column grid ───────── */
const ServicesMenu = memo(function ServicesMenu({ pathname, onNavigate }) {
  return (
    <div className="max-h-[calc(100vh-7.5rem)] overflow-y-auto overscroll-contain rounded-2xl border border-white/80 bg-white/95 p-5 shadow-[0_24px_60px_-20px_rgba(0,16,34,0.35)] backdrop-blur-xl lg:p-7">
      <div className="grid grid-cols-3 gap-x-6 lg:gap-x-10">
        {serviceCategories.map((cat) => {
          const isCatActive = pathname === cat.href || pathname.startsWith(`${cat.href}/`);
          return (
            <section key={cat.slug} aria-label={cat.name}>
              <Link
                to={cat.href}
                onClick={onNavigate}
                aria-current={pathname === cat.href ? "page" : undefined}
                className="group/cat block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
              >
                <span className="inline-block rounded-full bg-[#E8F0FF] px-2 py-0.5 text-[10px] font-bold text-[#0B3D91]">
                  {cat.tag || `${cat.items.length} services`}
                </span>
                <span
                  className={`relative mt-1.5 block w-fit text-[15px] font-bold transition-colors ${
                    isCatActive ? "text-[#0B3D91] after:scale-x-100" : "text-[#001022] group-hover/cat:text-[#0B3D91]"
                  } after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:origin-left after:rounded-full after:bg-[#0B3D91] after:transition-transform after:duration-300 group-hover/cat:after:scale-x-100 group-focus-visible/cat:after:scale-x-100 motion-reduce:after:transition-none ${
                    isCatActive ? "" : "after:scale-x-0"
                  }`}
                >
                  {cat.name}
                </span>
                {(cat.eyebrow || cat.description) && (
                  <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-slate-500">
                    {cat.eyebrow || cat.description}
                  </span>
                )}
              </Link>

              {/* every service: 1 column on tablets, 2 columns on large screens */}
              <ul className="mt-4 grid grid-cols-1 gap-x-5 gap-y-0.5 border-t border-slate-100 pt-3 lg:grid-cols-2">
                {cat.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.slug ?? item.href}>
                      <Link
                        to={item.href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={`relative inline-block w-full py-1.5 text-[13px] font-medium leading-snug outline-none transition-colors ${ITEM_UNDERLINE} ${
                          active ? "text-[#0B3D91] after:scale-x-100" : "text-slate-700 hover:text-[#0B3D91] focus-visible:text-[#0B3D91]"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-semibold">
        <Link
          to="/services"
          onClick={onNavigate}
          className={`relative inline-flex items-center gap-1.5 text-[#001022] outline-none hover:text-[#0B3D91] ${ITEM_UNDERLINE}`}
        >
          Explore Capability Matrix <span aria-hidden="true">&rarr;</span>
        </Link>
        <Link
          to="/contact"
          onClick={onNavigate}
          className={`relative inline-flex items-center gap-1.5 text-[#0B3D91] outline-none ${ITEM_UNDERLINE}`}
        >
          Book a consultation <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
});

/* ───────── Mobile submenu: every service, one collapsible group per category ───────── */
function MobileServices({ open, onNavigate, pathname }) {
  const activeCatIndex = serviceCategories.findIndex(
    (cat) => pathname === cat.href || pathname.startsWith(`${cat.href}/`)
  );
  const [openCat, setOpenCat] = useState(activeCatIndex);
  const [prevCatIndex, setPrevCatIndex] = useState(activeCatIndex);

  if (prevCatIndex !== activeCatIndex) {
    setPrevCatIndex(activeCatIndex);
    if (activeCatIndex !== -1) {
      setOpenCat(activeCatIndex);
    }
  }

  if (!open) return null;

  return (
    <div
      id="mobile-services"
      inert={!open}
      className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
    >
      <div className="overflow-hidden">
        <div className="mb-2 ml-4 border-l-2 border-[#E8F0FF] pb-2 pl-3 pt-2">
          <Link to="/services" onClick={onNavigate} className="block py-1.5 text-xs font-bold uppercase tracking-wider text-[#0B3D91]">
            All services &rarr;
          </Link>

          {serviceCategories.map((cat, i) => {
            const isCatActive = pathname === cat.href || pathname.startsWith(`${cat.href}/`);
            const isOpen = openCat === i;
            return (
              <div key={cat.slug} className="border-b border-slate-100 last:border-0">
                <div className="flex items-center justify-between">
                  <Link
                    to={cat.href}
                    onClick={onNavigate}
                    aria-current={pathname === cat.href ? "page" : undefined}
                    className={`flex-1 py-3 text-sm font-bold transition-colors ${
                      isCatActive ? "text-[#0B3D91]" : "text-[#001022] hover:text-[#0B3D91]"
                    }`}
                  >
                    {cat.name}
                    <span className="ml-2 text-[11px] font-semibold text-slate-400">{cat.items.length}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setOpenCat(isOpen ? -1 : i)}
                    aria-label={`Show ${cat.name} services`}
                    aria-expanded={isOpen}
                    aria-controls={`mobile-cat-${cat.slug}`}
                    className="grid h-9 w-9 place-items-center rounded-full text-slate-500 outline-none hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
                  >
                    <ChevronIcon className={`transition-transform duration-200 border border-slate-500 text-slate-500 rounded-full ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>

                <div
                  id={`mobile-cat-${cat.slug}`}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <ul className="grid grid-cols-1 gap-x-4 pb-2 min-[440px]:grid-cols-2">
                      {cat.items.map((item) => {
                        const active = pathname === item.href;
                        return (
                          <li key={item.slug ?? item.href}>
                            <Link
                              to={item.href}
                              onClick={onNavigate}
                              aria-current={active ? "page" : undefined}
                              className={`block py-1.5 text-[13.5px] leading-snug transition-colors ${
                                active ? "font-semibold text-[#0B3D91]" : "text-slate-600 hover:text-[#0B3D91]"
                              }`}
                            >
                              {item.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ───────── Navbar ───────── */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();
  const current = getActiveHref(location.pathname);
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const closeTimer = useRef(0);

  /* scroll state: only changes shadow/opacity, never the size of the bar */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close everything on route change */
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMenuOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }

  /* Escape / click outside close the menus */
  useEffect(() => {
    if (!menuOpen && !servicesOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setServicesOpen(false);
        if (menuOpen) buttonRef.current?.focus();
      }
    };
    const onPointer = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setMenuOpen(false);
        setServicesOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen, servicesOpen]);

  /* growing to desktop width closes the mobile menu; shrinking closes the desktop dropdown */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => {
      if (e.matches) setMenuOpen(false);
      else setServicesOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const openServices = useCallback(() => {
    clearTimeout(closeTimer.current);
    setServicesOpen(true);
  }, []);

  const scheduleClose = useCallback(() => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 180);
  }, []);

  const go = useCallback(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, []);

  return (
    <>
    <div aria-hidden="true" className="h-[4.75rem] md:h-[5.25rem]" />
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
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
            scrolled ? "bg-white/85 shadow-[0_14px_36px_-18px_rgba(0,16,34,0.35)]" : "bg-white/65 shadow-[0_1px_0_rgba(0,16,34,0.04)]"
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            aria-label="Revenue Edge home"
            className="flex shrink-0 items-center rounded-lg px-1 outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
            onClick={go}
          >
            <img src="/reta.webp" alt="Revenue Edge" width="306" height="90" decoding="async" className="h-9 w-auto sm:h-10 md:h-11" />
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAVIGATION.map(({ label, href }) => {
              const active = current === href;

              if (href === "/services") {
                const highlighted = active || servicesOpen;
                return (
                  <div
                    key={label}
                    className="static"
                    onPointerEnter={(e) => e.pointerType === "mouse" && openServices()}
                    onPointerLeave={(e) => e.pointerType === "mouse" && scheduleClose()}
                    onFocus={openServices}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) setServicesOpen(false);
                    }}
                  >
                    {/* link + chevron toggle share one pill (the chevron makes the menu usable on touch and keyboard) */}
                    <div
                      className={`relative inline-flex items-center rounded-full transition-colors duration-200 ${NAV_UNDERLINE} ${
                        highlighted
                          ? "bg-[#E8F0FF] text-[#001022] after:scale-x-100"
                          : "text-slate-600 hover:bg-[#E8F0FF]/70 hover:text-[#001022]"
                      }`}
                    >
                      <Link
                        to={href}
                        aria-current={active ? "page" : undefined}
                        onClick={go}
                        className="rounded-l-full py-2 pl-4 pr-1.5 text-[15px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
                      >
                        {label}
                      </Link>
                      <button
                        type="button"
                        aria-label="Show all services"
                        aria-expanded={servicesOpen}
                        aria-controls="services-menu"
                        onClick={() => setServicesOpen((o) => !o)}
                        className="rounded-r-full py-2 pl-1 pr-3.5 outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
                      >
                        <ChevronIcon className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
                      </button>
                    </div>

                    {/* Dropdown: full width of the bar */}
                    <div
                      id="services-menu"
                      inert={!servicesOpen}
                      className={`absolute left-0 top-full z-40 w-full pt-3 transition-[opacity,transform] duration-200 motion-reduce:transition-none ${
                        servicesOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
                      }`}
                    >
                      {servicesOpen && <ServicesMenu pathname={location.pathname} onNavigate={go} />}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={label}
                  to={href}
                  aria-current={active ? "page" : undefined}
                  onClick={go}
                  className={`relative rounded-full px-4 py-2 text-[15px] font-semibold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#0B3D91] ${NAV_UNDERLINE} ${
                    active ? "bg-[#E8F0FF] text-[#001022]" : "text-slate-600 hover:bg-[#E8F0FF]/70 hover:text-[#001022]"
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
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span aria-hidden="true" className="relative block h-4 w-5">
              <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${menuOpen ? "top-[7px] rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-[7px] h-0.5 w-5 rounded bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${menuOpen ? "top-[7px] -rotate-45" : "top-[14px]"}`} />
            </span>
          </button>
        </nav>

        {/* Mobile panel (scrolls on short screens) */}
        <div
          id="mobile-navigation"
          inert={!menuOpen}
          className={`absolute inset-x-0 top-[calc(100%+0.5rem)] max-h-[calc(100dvh-6.5rem)] origin-top overflow-y-auto overscroll-contain rounded-2xl border border-white/70 bg-white/95 p-3 shadow-[0_24px_60px_-24px_rgba(0,16,34,0.4)] backdrop-blur-xl transition-all duration-200 md:hidden ${
            menuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
          }`}
        >
          <ul className="grid gap-1">
            {NAVIGATION.map(({ label, href }) => {
              const active = current === href;

              if (href === "/services") {
                return (
                  <li key={label}>
                    <div
                      className={`flex items-center justify-between rounded-xl text-base font-semibold ${
                        active ? "bg-[#E8F0FF] text-[#001022]" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Link to={href} onClick={go} aria-current={active ? "page" : undefined} className="flex-1 rounded-xl px-4 py-3.5 outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]">
                        {label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setMobileServicesOpen((o) => !o)}
                        className="mr-2 grid h-10 w-10 place-items-center rounded-full text-slate-500 outline-none hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
                        aria-label="Show all services"
                        aria-expanded={mobileServicesOpen}
                        aria-controls="mobile-services"
                      >
                        <ChevronIcon className={`transition-transform rounded-full border duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                    <MobileServices open={mobileServicesOpen} onNavigate={go} pathname={location.pathname} />
                  </li>
                );
              }

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
    </>
  );
}