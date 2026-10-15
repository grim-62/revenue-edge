import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BASE = "#F4F8FF"; // shows while the poster/video loads

/* Two stacked copies of the clip that cross-fade at the end,
   so the loop never "jumps". Use fade={0} for a plain native loop. */
function CrossfadeVideo({ src, fade }) {
  const a = useRef(null);
  const b = useRef(null);

  useEffect(() => {
    const vids = [a.current, b.current];
    if (!vids[0] || !vids[1]) return undefined;
    let cur = 0;
    let raf = 0;
    vids[0].play().catch(() => {});

    const tick = () => {
      const v = vids[cur];
      const o = vids[1 - cur];
      const d = v.duration;
      if (d && v.currentTime > d - fade) {
        if (o.paused) {
          o.currentTime = 0;
          o.style.zIndex = "2";
          v.style.zIndex = "1";
          o.play().catch(() => {});
        }
        const t = Math.min(1, (v.currentTime - (d - fade)) / fade);
        o.style.opacity = String(t);
        if (t >= 1) {
          v.pause();
          v.currentTime = 0;
          v.style.opacity = "0";
          cur = 1 - cur;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fade]);

  const cls = "absolute inset-0 h-full w-full object-cover";
  return (
    <>
      <video ref={a} src={src} muted playsInline preload="auto" className={cls} style={{ opacity: 1, zIndex: 1 }} />
      <video ref={b} src={src} muted playsInline preload="auto" className={cls} style={{ opacity: 0, zIndex: 0 }} />
    </>
  );
}

/**
 * Full-page animated gradient background, mapped to scroll.
 *
 * Export the shader as a TALL clip (e.g. 720 × 2160). It is shown at full
 * screen width and slides up as you scroll, so the top of the page sits on the
 * top of the gradient and the footer on the bottom. Every section gets its own
 * part of it. Only the transform is animated, so it stays smooth.
 */
export default function PageBackground({
  video = "/bg/gradient.mp4", // tall looping clip exported from the shader editor
  poster = "/bg/gradient.webp", // same size, still frame (also used for reduced motion)
  fade = 1.2, // seconds of cross-fade at the loop point; 0 = native loop
  veil = 0.1, // 0–1 white wash over the gradient to keep text readable
}) {
  const root = useRef(null);
  const media = useRef(null);
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = (e) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  /* scroll progress (0 → 1) = how far down the gradient we are */
  useEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        media.current,
        { y: 0 },
        {
          y: () => -Math.max(0, media.current.offsetHeight - root.current.clientHeight),
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: BASE }}
    >
      {/* tall layer: its height comes from the poster image */}
      <div ref={media} className="absolute left-0 top-0 min-h-full w-full will-change-transform">
        <img
          src={poster}
          alt=""
          draggable={false}
          onLoad={() => ScrollTrigger.refresh()}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          className="block h-auto min-h-full w-full object-cover"
        />
        {!reduced &&
          (fade > 0 ? (
            <CrossfadeVideo src={video} fade={fade} />
          ) : (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ))}
      </div>
      <div className="absolute inset-0 bg-white" style={{ opacity: veil }} />
    </div>
  );
}