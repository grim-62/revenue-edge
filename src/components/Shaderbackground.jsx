import { useState } from "react";
import { Shader, MeshGradient } from "shaders/react";

/* Your exact MeshGradient from shaders.com (same stops + settings as the editor). */
const STOPS = [
  { color: "#F4F8FF", position: 0 },
  { color: "#C9DAFF", position: 0.26 },
  { color: "#A9C4FA", position: 0.52 },
  { color: "#F4F8FF", position: 0.76 },
  { color: "#FFF8F2", position: 1 },
];

/* Shown only if the browser has no WebGPU */
const FALLBACK =
  "linear-gradient(135deg, #F4F8FF 0%, #C9DAFF 26%, #A9C4FA 52%, #FFE3CF 76%, #FFF8F2 100%)";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Full-website animated background.
 * Fixed to the viewport, so it covers every section no matter how tall the page is.
 *   speed – 6.9 matches your editor preview; lower it (1–3) for a calmer page
 */
export default function ShaderBackground({ speed = 6.9 }) {
  const [unavailable, setUnavailable] = useState(false);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: FALLBACK }}
    >
      {!unavailable && (
        <Shader className="h-full w-full" onUnavailable={() => setUnavailable(true)}>
          <MeshGradient
            stops={STOPS}
            colorSpace="oklab"
            count={5}
            smoothness={2}
            variation={0.35}
            swirl={0.3}
            drift={0.5}
            wrapping={0}
            seed={0}
            speed={prefersReducedMotion() ? 0 : speed}
          />
        </Shader>
      )}
    </div>
  );
}