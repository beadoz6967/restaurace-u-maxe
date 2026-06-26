"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { useReveal } from "@/lib/use-reveal";

type Direction = "up" | "left" | "right";

/** Hidden offset per direction. `up` is the original default — unchanged. */
const HIDDEN: Record<Direction, { opacity: 0; x?: number; y?: number }> = {
  up: { opacity: 0, y: 24 },
  left: { opacity: 0, x: -40 },
  right: { opacity: 0, x: 40 },
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger offset for grouped items, e.g. 0, 0.08, 0.16. */
  delay?: number;
  /** Slide-in axis. Default `up` (the site-wide fade-rise). */
  direction?: Direction;
  /** Force visible shortly after mount even if off-screen. Use for important
   *  text that must never be permanently invisible. */
  failsafe?: boolean;
}

/**
 * Fade-and-rise (or fade-and-slide) scroll reveal for text and section groups.
 * Mirrors PhotoCell's mechanism: the shared `useReveal` hook drives `animate`,
 * so it resolves visible immediately under reduced motion, self-heals if the
 * IntersectionObserver misses its initial callback while on-screen, and (with
 * `failsafe`) is force-shown shortly after mount — never the bare-`whileInView`
 * trap, never permanently stuck at the hidden state.
 *
 * The motion.div carries `className`, so it can BE a grid/flex item (pass the
 * layout classes) without adding a layout-changing wrapper.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  failsafe = false,
}: RevealProps) {
  const { ref, show, reduce } = useReveal<HTMLDivElement>({ inView: true, failsafe });

  const variants: Variants = {
    hidden: HIDDEN[direction],
    shown: { opacity: 1, x: 0, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial={reduce ? false : "hidden"}
      animate={show ? "shown" : "hidden"}
      transition={{ duration: reduce ? 0 : 0.65, ease: [0.22, 0.61, 0.18, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
