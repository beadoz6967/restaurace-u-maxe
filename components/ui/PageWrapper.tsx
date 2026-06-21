"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps a page and staggers direct-child <motion> sections on load.
 * Children should be wrapped with the exported `item` variants via
 * `<motion.section variants={pageItem}>` to participate in the stagger.
 */
export const pageItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function PageWrapper({
  children,
  className = "",
}: PageWrapperProps) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.08,
        delayChildren: reduce ? 0 : 0.05,
      },
    },
  };

  return (
    <motion.main
      variants={container}
      initial={reduce ? "show" : "hidden"}
      animate="show"
      className={className}
    >
      {children}
    </motion.main>
  );
}
