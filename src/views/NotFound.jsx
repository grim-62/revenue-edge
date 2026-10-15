import { Link } from "react-router-dom";

const HEADING_FONT = '"Archivo", ui-sans-serif, system-ui, sans-serif';

const C = {
  primary: "#001022",
  primaryHover: "#0B3D91",
  primaryLight: "#E8F0FF",
  textSecondary: "#475569",
  border: "#E2E8F0",
};

export default function NotFoundPage() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-5 py-20 text-center">
      <div
        className="max-w-xl rounded-[2rem] border bg-white p-10 shadow-[0_30px_70px_-40px_rgba(0,16,34,0.4)]"
        style={{ borderColor: C.border }}
      >
        <span
          className="inline-flex rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{ backgroundColor: C.primaryLight, color: C.primaryHover }}
        >
          Page not found
        </span>
        <h1
          style={{ fontFamily: HEADING_FONT, color: C.primary }}
          className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-black uppercase leading-[1.02] tracking-[-0.035em]"
        >
          Let’s find the right support
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed" style={{ color: C.textSecondary }}>
          We couldn’t find the page you’re looking for. Browse all of our services instead.
        </p>
        <Link
          to="/services"
          className="group mt-8 inline-flex items-center gap-4 rounded-full py-1.5 pl-7 pr-1.5 text-[15px] font-semibold text-white outline-none transition-colors duration-300 hover:bg-[#0B3D91] focus-visible:ring-2 focus-visible:ring-[#0B3D91] focus-visible:ring-offset-2"
          style={{ backgroundColor: C.primary }}
        >
          Browse services
          <span
            className="grid h-10 w-10 place-items-center rounded-full"
            style={{ backgroundColor: C.primaryLight, color: C.primary }}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}
