"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, type LenisRef } from "lenis/react";
import type { ReactNode } from "react";
import "lenis/dist/lenis.css";

/**
 * Lenis smooth scroll, scoped to the (public) route group only — it is mounted
 * in app/(public)/layout.tsx, never in the root layout, so the (kitchen)
 * operational display keeps native instant scroll.
 *
 * Lenis wraps the browser's own scroll, so Framer Motion's IntersectionObserver
 * reveals work without any frame syncing — autoRaf (ReactLenis default) is the
 * only loop; no GSAP, no second RAF.
 *
 * Reduced motion: render children with no Lenis at all → native instant scroll.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);
  const lenisRef = useRef<LenisRef>(null);
  const pathname = usePathname();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Reset to the top on route change so inertia never carries between pages.
  useEffect(() => {
    lenisRef.current?.lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{ lerp: 0.1, anchors: true, syncTouch: false }}
    >
      {children}
    </ReactLenis>
  );
}
