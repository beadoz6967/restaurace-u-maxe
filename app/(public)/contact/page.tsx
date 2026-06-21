"use client";

import { motion, useReducedMotion } from "framer-motion";

const HOURS: [string, string][] = [
  ["Pondělí–Pátek", "10:00–02:00"],
  ["Sobota–Neděle", "NONSTOP"],
  ["Státní svátky", "NONSTOP"],
];

export default function Contact() {
  const reduce = useReducedMotion();

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
  });

  return (
    <main className="mx-auto max-w-[1400px] px-6 pb-28 pt-32 md:px-10 md:pt-40">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-12">
        {/* LEFT */}
        <motion.div {...fade(0)} className="flex flex-col">
          <h1 className="font-display text-5xl font-bold italic text-cream md:text-6xl">
            Restaurace
            <br />
            <span className="text-gold">U Maxe</span>
          </h1>

          <div className="mt-10 flex flex-col gap-1 font-tactical text-lg font-bold uppercase tracking-[0.15em] text-beige/80">
            <span>Pekárenská 12</span>
            <span>370 04 České Budějovice</span>
            <span>Česká republika</span>
          </div>

          <a
            href="tel:+420389112233"
            className="mt-10 font-body text-3xl font-medium text-gold transition-colors duration-200 hover:text-rust md:text-4xl"
          >
            +420 389 112 233
          </a>

          <div className="mt-12">
            <span className="font-tactical text-sm font-bold uppercase tracking-[0.3em] text-rust">
              Otevírací doba
            </span>
            <div className="mt-5 grid grid-cols-[auto_1fr] gap-x-10 gap-y-3">
              {HOURS.map(([day, time]) => (
                <div key={day} className="contents">
                  <span className="font-tactical text-sm font-bold uppercase tracking-[0.12em] text-beige/60">
                    {day}
                  </span>
                  <span className="font-body tabular-nums text-beige">
                    {time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT — map */}
        <motion.div {...fade(0.12)} className="min-h-[420px]">
          <iframe
            title="Mapa — Restaurace U Maxe"
            src="https://www.openstreetmap.org/export/embed.html?bbox=14.46%2C48.97%2C14.49%2C48.99&layer=mapnik&marker=48.98%2C14.475"
            loading="lazy"
            className="h-full min-h-[420px] w-full border border-[#C8962A22] [filter:grayscale(100%)_contrast(1.1)]"
          />
        </motion.div>
      </div>
    </main>
  );
}
