import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function AdminLayout({
  navItems,
  adminName,
  onLogout,
  siteHref = "/",
  children,
}) {
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();
  const activeItem = navItems.find((item) => item.end
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`));

  return (
    <div className="min-h-screen bg-[#F1F6FF]">
      <button
        type="button"
        aria-label="Close admin navigation"
        onClick={() => setNavOpen(false)}
        className={`fixed inset-0 z-30 bg-[#001022]/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${navOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`ad-side fixed inset-y-0 left-0 z-40 flex w-64 flex-col px-4 py-6 text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:translate-x-0 ${navOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          backgroundColor: "#001022",
          backgroundImage:
            "radial-gradient(80% 50% at 100% 0%, rgba(11,61,145,0.45), transparent 70%)",
        }}
        aria-label="Admin navigation"
      >
        <Link
          to={siteHref}
          className="ad-side-item mb-8 flex items-center gap-3 px-2 text-lg font-bold outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <div className="mix-blend-screen">
            <img
              src="/reta.webp"
              width="306"
              height="90"
              loading="lazy"
              className="h-15 w-auto brightness-0 invert"
              alt="Reta"
            />
          </div>
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = activeItem?.id === item.id;
            return (
              <NavLink
                key={item.id}
                to={item.href}
                end={item.end}
                onClick={() => {
                  setNavOpen(false);
                  window.scrollTo({ top: 0 });
                }}
                className={({ isActive }) => `ad-side-item group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[15px] font-semibold outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-white/60 ${isActive ? "bg-white/12 text-white" : "text-white/65 hover:bg-white/8 hover:text-white"}`}
              >
                <span className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-[#BCD0FF] transition-all duration-300 ${active ? "opacity-100" : "scale-y-0 opacity-0"}`} />
                {item.icon}
                {item.label}
                {item.badge > 0 && <span className="ml-auto rounded-full bg-[#BCD0FF] px-2 py-0.5 text-xs font-bold text-[#001022]">{item.badge}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="ad-side-item mt-auto space-y-2 border-t border-white/10 pt-5">
          <Link
            to={siteHref}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/65 transition-colors hover:bg-white/8 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            View website
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-white/65 outline-none transition-colors hover:bg-white/8 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M16 8l4 4-4 4M20 12H9" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="ad-top sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[#E2E8F0] bg-white/85 px-5 py-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open admin navigation"
              aria-expanded={navOpen}
              onClick={() => setNavOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#E2E8F0] bg-white text-[#001022] outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91] lg:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <h1 className="text-lg font-bold capitalize text-[#001022]">
              {activeItem?.label ?? "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:block">
              Signed in as{" "}
              <strong className="text-[#001022]">{adminName}</strong>
            </span>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#E8F0FF] text-sm font-bold text-[#0B3D91]">
              {adminName
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
