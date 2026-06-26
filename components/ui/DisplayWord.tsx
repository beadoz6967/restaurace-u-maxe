"use client";

import { motion, type Variants } from "framer-motion";
import { useReveal } from "@/lib/use-reveal";
import type { CSSProperties, ReactNode, Ref } from "react";

type Tag = "h1" | "h2" | "div" | "span" | "p";

const MOTION = {
  h1: motion.h1,
  h2: motion.h2,
  div: motion.div,
  span: motion.span,
  p: motion.p,
} as const;

const variants: Variants = {
  // Tactical bottom-up wipe — no fade, no bounce. Type clips into place.
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  show: { clipPath: "inset(0% 0% 0% 0%)" },
};

interface DisplayWordProps {
  children: ReactNode;
  /** Element/semantics. Default h2. */
  as?: Tag;
  className?: string;
  /** Override the default viewport-scale font-size clamp. */
  size?: string;
  /** Reveal on scroll-into-view instead of on mount. */
  inView?: boolean;
  /** Force visible shortly after mount even if off-screen. Use for important
   *  text that must never be permanently invisible. */
  failsafe?: boolean;
  delay?: number;
  style?: CSSProperties;
}

/**
 * The dominant, tactical, structural type primitive. Big Shoulders 800,
 * sized in viewport units so it nearly touches the viewport edges, with
 * crushed line-height and tightened tracking. This is the loudest element
 * on every page — never decorative.
 *
 * The reveal is driven by the shared `useReveal` hook into React state (not the
 * `whileInView` prop) so it always resolves to visible: it self-heals if the
 * IntersectionObserver misses its initial callback while on-screen, and with
 * `failsafe` is force-shown shortly after mount — never stuck clipped/invisible
 * at the SSR-rendered hidden state.
 */
export default function DisplayWord({
  children,
  as = "h2",
  className = "",
  size = "clamp(4rem, 18vw, 22rem)",
  inView = false,
  failsafe = false,
  delay = 0,
  style,
}: DisplayWordProps) {
  const { ref, show, reduce } = useReveal<HTMLElement>({ inView, failsafe });
  const Component = MOTION[as];

  return (
    <Component
      ref={ref as Ref<never>}
      variants={variants}
      initial={reduce ? false : "hidden"}
      animate={show ? "show" : "hidden"}
      transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 0.61, 0.18, 1], delay }}
      className={`font-tactical font-extrabold uppercase ${className}`}
      style={{
        fontSize: size,
        lineHeight: 0.85,
        letterSpacing: "-0.02em",
        ...style,
      }}
    >
      {children}
    </Component>
  );
}
