"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
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
  delay?: number;
  style?: CSSProperties;
}

/**
 * The dominant, tactical, structural type primitive. Big Shoulders 800,
 * sized in viewport units so it nearly touches the viewport edges, with
 * crushed line-height and tightened tracking. This is the loudest element
 * on every page — never decorative.
 *
 * The reveal is driven by the `useInView` hook into React state (not the
 * `whileInView` prop) so it always resolves to visible after a hard page
 * load — avoiding the App Router hydration bug where scroll-reveal elements
 * stay clipped/invisible until a client-side navigation.
 */
export default function DisplayWord({
  children,
  as = "h2",
  className = "",
  size = "clamp(4rem, 18vw, 22rem)",
  inView = false,
  delay = 0,
  style,
}: DisplayWordProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const scrolledIntoView = useInView(ref, { once: true, margin: "-12%" });
  const Component = MOTION[as];

  // Reveal as soon as: reduced motion, on mount (when not scroll-gated), or
  // when scrolled into view. State-driven, so it can never stay stuck hidden.
  const show = reduce || !inView || scrolledIntoView;

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
