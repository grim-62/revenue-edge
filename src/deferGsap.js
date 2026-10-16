let gsapModules;

function loadGsapModules() {
  gsapModules ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
    ([{ default: gsap }, { ScrollTrigger }]) => ({ gsap, ScrollTrigger })
  );
  return gsapModules;
}

export function deferGsap(setup) {
  let started = false;
  let cancelled = false;
  let cleanup;
  const events = ["wheel", "touchstart", "pointerdown", "keydown"];

  const activate = async () => {
    if (started || cancelled) return;
    started = true;
    events.forEach((event) => window.removeEventListener(event, activate));

    const { gsap, ScrollTrigger } = await loadGsapModules();
    if (cancelled) return;
    gsap.registerPlugin(ScrollTrigger);
    cleanup = setup(gsap, ScrollTrigger);
  };

  events.forEach((event) => {
    window.addEventListener(event, activate, { passive: event === "wheel" || event === "touchstart" });
  });

  return () => {
    cancelled = true;
    events.forEach((event) => window.removeEventListener(event, activate));
    cleanup?.();
  };
}