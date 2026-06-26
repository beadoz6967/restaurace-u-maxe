"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const SELF_HEAL_MS = 400; // catch a missed IO initial callback for on-screen elements
const FORCE_MS = 1500; // hard guarantee for important text, even off-screen

interface RevealOptions {
  /** Gate the reveal on scroll-into-view. When false, reveal on mount. */
  inView?: boolean;
  /** Fraction of the element visible to trigger. Default 0.1. */
  amount?: number;
  /** Force visible shortly after mount even if off-screen. Use ONLY for
   *  important text that must never be invisible (trades the animation for a
   *  visibility guarantee). */
  failsafe?: boolean;
}

/**
 * Scroll-reveal state with guarantees a bare `useInView` lacks. Framer's
 * `useInView` relies on IntersectionObserver, which under Lenis intermittently
 * never fires — both its initial callback (element on-screen at load) and its
 * scroll callbacks (element entering the viewport on scroll), especially after
 * a client-side navigation. The element then sits at its SSR hidden state until
 * something forces a re-evaluation (a tab switch, scrolling back and forth).
 *
 * So we don't trust IO alone. A passive `scroll`/`resize` rect-check — which
 * Lenis's native window scroll always emits — reveals the element the moment it
 * enters the viewport, IO or not. We also re-check shortly after mount and on
 * load/pageshow/visibilitychange (catching the on-screen-at-load miss), and,
 * for important text, force visible after a short delay regardless of position.
 * Each element's listeners self-remove the instant it is revealed.
 *
 * Returns the shared `reduce` flag too, since callers need it for transitions.
 */
export function useReveal<T extends HTMLElement = HTMLElement>({
  inView = false,
  amount = 0.1,
  failsafe = false,
}: RevealOptions = {}) {
  const reduce = useReducedMotion();
  const ref = useRef<T>(null);
  const scrolledIntoView = useInView(ref, { once: true, amount });
  const [rescued, setRescued] = useState(false);

  useEffect(() => {
    // Reveal-on-mount and reduced motion are already visible; nothing to rescue.
    if (!inView || reduce) return;

    let done = false;
    let healId = 0;
    let forceId = 0;

    const cleanup = () => {
      window.clearTimeout(healId);
      window.clearTimeout(forceId);
      window.removeEventListener("scroll", healIfVisible);
      window.removeEventListener("resize", healIfVisible);
      window.removeEventListener("load", healIfVisible);
      window.removeEventListener("pageshow", healIfVisible);
      document.removeEventListener("visibilitychange", healIfVisible);
    };

    const reveal = () => {
      if (done) return;
      done = true;
      setRescued(true);
      cleanup(); // one-shot — stop checking once shown
    };

    // Reveal when any part of the element is within the viewport box. Lenis
    // scrolls the window natively, so getBoundingClientRect is accurate.
    const healIfVisible = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      if (r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw) reveal();
    };

    healId = window.setTimeout(healIfVisible, SELF_HEAL_MS);
    if (failsafe) forceId = window.setTimeout(reveal, FORCE_MS);
    window.addEventListener("scroll", healIfVisible, { passive: true });
    window.addEventListener("resize", healIfVisible, { passive: true });
    window.addEventListener("load", healIfVisible);
    window.addEventListener("pageshow", healIfVisible);
    document.addEventListener("visibilitychange", healIfVisible);
    // Run once now in case it is already in view at mount.
    healIfVisible();

    return cleanup;
  }, [inView, reduce, failsafe]);

  // Visible when: reduced motion, reveal-on-mount, scrolled into view, or
  // rescued by the self-heal / failsafe above. State-driven, so it can never
  // stay stuck at the SSR-rendered hidden state.
  const show = reduce || !inView || scrolledIntoView || rescued;

  return { ref, show, reduce };
}
