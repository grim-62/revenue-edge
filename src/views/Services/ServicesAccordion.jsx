import { memo, useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const C = {
  primary: "#001022",
  primaryHover: "#0B3D91",
  primaryLight: "#E8F0FF",
  textSecondary: "#475569",
  border: "#E2E8F0",
  ink: "#0F172A",
};

const DEFAULT_CATEGORY_IMAGES = {
  tax: "/img4.jpg",
  accounting: "/img9.jpg",
  "business-advisory": "/img2.jpg",
  calc: "/img4.jpg",
  chart: "/img1.jpg",
  coins: "/img3.jpg",
};

const ArrowUpRight = ({ className = "" }) => (
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
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

const PlusMinus = ({ open }) => (
  <span
    className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors duration-300 group-hover:bg-[#001022] group-hover:text-white sm:h-11 sm:w-11"
    style={{ borderColor: C.primary }}
    aria-hidden="true"
  >
    <span className="absolute h-[2px] w-4 bg-current" />
    <span
      className={`absolute h-4 w-[2px] bg-current transition-transform duration-300 ${
        open ? "scale-y-0" : "scale-y-100"
      }`}
    />
  </span>
);

/* ───────── One row (memoised: only the rows that change re-render) ───────── */
const CategoryRow = memo(function CategoryRow({ cat, index, uid, isOpen, img, onHover, onClick }) {
  const btnId = `${uid}-btn-${cat.id}`;
  const panelId = `${uid}-panel-${cat.id}`;

  const imageSrc =
    cat.image ||
    cat.img ||
    img ||
    DEFAULT_CATEGORY_IMAGES[cat.id] ||
    DEFAULT_CATEGORY_IMAGES[cat.art] ||
    "/img1.jpg";

  return (
    <div
      data-open={isOpen}
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(index)}
      className="sv-row group/panel border-t"
      style={{ borderColor: C.primary }}
    >
      <h3>
        <button
          type="button"
          id={btnId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={(e) => onClick(index, e.detail)}
          className="group flex w-full items-center justify-between gap-3 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91] sm:gap-6 sm:py-7 md:py-9"
          style={{ color: C.primary }}
        >
          <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl md:text-4xl">
              {cat.title}
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: C.primaryLight, color: C.primaryHover }}
            >
              {cat.items.length} {cat.items.length === 1 ? "service" : "services"}
            </span>
          </span>
          <PlusMinus open={isOpen} />
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        inert={!isOpen ? "" : undefined}
        className={`grid transition-[grid-template-rows] duration-500 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid gap-7 pb-9 pt-2 sm:gap-10 sm:pb-12 md:grid-cols-2 md:items-center md:gap-16">
            {/* services list */}
            <div>
              {cat.intro && (
                <p className="max-w-md text-base leading-relaxed" style={{ color: C.textSecondary }}>
                  {cat.intro}
                </p>
              )}
              <ul className="mt-6 sm:mt-8">
                {cat.items.map((raw, n) => {
                  const item = typeof raw === "string" ? { name: raw, href: cat.href } : raw;
                  return (
                    <li
                      key={item.href ?? item.name}
                      className="-translate-x-4 opacity-0 transition-[opacity,transform] duration-500 ease-out group-data-[open=true]/panel:translate-x-0 group-data-[open=true]/panel:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none"
                      style={{ transitionDelay: isOpen ? `${120 + n * 60}ms` : "0ms" }}
                    >
                      <Link
                        to={item.href ?? cat.href}
                        className="group/item relative flex items-center justify-between gap-4 border-b py-4 outline-none transition-[padding] duration-300 hover:pl-2 focus-visible:pl-2"
                        style={{ borderColor: C.border, color: C.primary }}
                      >
                        <span className="flex items-baseline gap-4">
                          <span className="w-6 shrink-0 text-xs font-semibold text-[#94A3B8]">
                            {String(n + 1).padStart(2, "0")}
                          </span>
                          <span>
                            <span className="block text-[15px] font-medium sm:text-[17px]">
                              {item.name}
                            </span>
                            {item.description && (
                              <span
                                className="mt-1 block text-sm leading-relaxed"
                                style={{ color: C.textSecondary }}
                              >
                                {item.description}
                              </span>
                            )}
                          </span>
                        </span>
                        <span
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-full opacity-0 transition-opacity duration-300 group-hover/item:opacity-100 group-focus-visible/item:opacity-100"
                          style={{ backgroundColor: C.primary, color: "#fff" }}
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>

                        {/* progress line: fills slowly on hover, retracts quickly on leave */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -bottom-px left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-[#0B3D91] to-[#001022] transition-transform duration-300 ease-out group-hover/item:scale-x-100 group-hover/item:duration-[900ms] group-focus-visible/item:scale-x-100 group-focus-visible/item:duration-[900ms] motion-reduce:transition-none"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {cat.href && (
                <Link
                  to={cat.href}
                  className="group/all mt-6 inline-flex items-center gap-3 rounded-full border px-5 py-2.5 text-sm font-semibold outline-none transition-colors duration-300 hover:bg-[#001022] hover:text-white focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
                >
                  Explore {cat.title}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/all:rotate-45" />
                </Link>
              )}
            </div>

            {/* image */}
            <div
              className="relative mx-auto aspect-[5/4] w-full max-w-lg scale-90 -rotate-[5deg] rounded-2xl border  opacity-0 transition-[opacity,transform] duration-700 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-data-[open=true]/panel:scale-100 group-data-[open=true]/panel:rotate-0 group-data-[open=true]/panel:opacity-100 group-data-[open=true]/panel:delay-150 motion-reduce:scale-100 motion-reduce:rotate-0 motion-reduce:opacity-100 motion-reduce:transition-none sm:rounded-[2rem]"
              style={{ backgroundColor: C.primaryLight, borderColor: C.border }}
            >
              <img
                src={imageSrc}
                alt={cat.title}
                draggable={false}
                loading="lazy"
                className="h-full w-full object-cover  mix-blend-multiply"
              />
              {cat.tag && (
                <span
                  className="absolute bottom-5 left-5 -rotate-3 rounded-full border bg-white px-4 py-2 text-xs font-semibold shadow-[0_8px_24px_-10px_rgba(0,16,34,0.35)]"
                  style={{ borderColor: C.border, color: C.primary }}
                >
                  {cat.tag}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * Hover-to-expand services dropdown with images.
 *   categories   – [{ id, title, href, image, tag, intro,
 *                     items: [{ name, description, href }] }]
 *   restingIndex – row that stays open when the mouse isn't over the list (-1 = all closed)
 *   images       – optional { tax, accounting, "business-advisory" } image overrides
 * Mouse: hover opens a row. Touch / keyboard: tap or Enter toggles it.
 */
export default function ServicesAccordion({ categories, restingIndex = -1, images }) {
  const uid = useId();
  const root = useRef(null);
  const timer = useRef(0);
  const [open, setOpen] = useState(restingIndex);

  useEffect(() => {
    setOpen(restingIndex);
  }, [restingIndex]);

  const onHover = useCallback((i) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(i), 90);
  }, []);

  const onLeave = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(restingIndex), 180);
  }, [restingIndex]);

  const onClick = useCallback((i, detail) => {
    clearTimeout(timer.current);
    const hoverDevice = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setOpen((prev) => (hoverDevice && detail > 0 ? i : prev === i ? -1 : i));
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  /* scroll-in */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (root.current?.querySelector(".sv-row")) {
          gsap.from(".sv-row", {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: root.current, start: "top 85%" },
          });
        }
      });
    }, root);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  /* page height changes when a row opens/closes: refresh triggers once it settles (debounced) */
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 650);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <div
      ref={root}
      className="border-b"
      style={{ borderColor: C.primary }}
      onPointerLeave={(e) => e.pointerType === "mouse" && onLeave()}
    >
      {categories.map((cat, i) => (
        <CategoryRow
          key={cat.id}
          cat={cat}
          index={i}
          uid={uid}
          isOpen={open === i}
          img={cat.image ?? images?.[cat.id] ?? images?.[cat.art]}
          onHover={onHover}
          onClick={onClick}
        />
      ))}
    </div>
  );
}