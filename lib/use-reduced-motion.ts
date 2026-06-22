"use client";

import { useEffect, useState } from "react";

/**
 * Hydration-safe reduced-motion hook. Returns `false` on the first render (so
 * SSR and the first client paint always match), then the real value after
 * mount. Framer Motion's own `useReducedMotion` reads `matchMedia`
 * synchronously, so for users who prefer reduced motion its first client render
 * disagrees with the server → hydration mismatch. This defers that read by one
 * tick, which removes the mismatch; reduced-motion behavior still applies right
 * after mount.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}
