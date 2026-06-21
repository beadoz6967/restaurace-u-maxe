"use client";

import { motion, useReducedMotion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";

// Placeholder cells — real photos swapped in later.
const CELLS = Array.from({ length: 9 }, (_, i) => i);

export default function Gallery() {
  const reduce = useReducedMotion();

  return (
    <main className="mx-auto max-w-[1400px] px-6 pb-28 pt-32 md:px-10 md:pt-40">
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <SectionLabel label="Citadela" meta="9 / 9" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mt-12 grid grid-cols-2 gap-[2px] md:grid-cols-3"
      >
        {CELLS.map((i) => (
          <div
            key={i}
            className="aspect-square cursor-pointer bg-surface transition-[filter] duration-200 hover:brightness-110"
          />
        ))}
      </motion.div>
    </main>
  );
}
