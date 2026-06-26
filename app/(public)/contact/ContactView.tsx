"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import PhotoCell from "@/components/ui/PhotoCell";

const HOURS: [string, string][] = [
  ["Pondělí–Pátek", "10:00–13:30"],
  ["Sobota–Neděle", "Zavřeno"],
];

export default function ContactView() {
  const reduce = useReducedMotion();

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
  });

  return (
    <main className="mx-auto max-w-[1440px] px-6 pb-16 pt-24 md:px-10 md:pb-24 md:pt-32">
      <div className="grid grid-cols-1 items-start gap-16 md:grid-cols-2 md:gap-12">
        {/* LEFT — only the display heading keeps a reveal; the detail lines
            (address, phone, email, online-order, hours) stay static/calm. */}
        <div className="flex flex-col">
          <motion.h1
            {...fade(0)}
            className="font-display text-5xl font-bold italic text-cream md:text-6xl"
          >
            Restaurace
            <br />
            <span className="text-gold">U Maxe</span>
          </motion.h1>

          <div className="mt-12 flex flex-col gap-1 font-tactical text-lg font-bold uppercase tracking-[0.15em] text-beige/80">
            <span>Denisova 20/II.</span>
            <span>377 01 Jindřichův Hradec</span>
            <span>Česká republika</span>
          </div>

          <a
            href="tel:+420728814736"
            className="mt-12 font-body text-2xl font-medium text-gold transition-colors duration-200 hover:text-rust focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary md:text-4xl"
          >
            +420 728 814 736
          </a>

          <a
            href="mailto:Objednavkyumaxe@seznam.cz"
            className="mt-4 break-words font-body text-lg text-beige transition-colors duration-200 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            Objednavkyumaxe@seznam.cz
          </a>

          <p className="mt-6 max-w-sm font-body text-sm text-beige/60">
            Objednávky s sebou přijímáme každý den do 10:00.
          </p>

          <div className="mt-12">
            <span className="font-tactical text-sm font-bold uppercase tracking-[0.3em] text-rust">
              Otevírací doba
            </span>
            <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-8 gap-y-2">
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
        </div>

        {/* RIGHT — map. On desktop it stretches to the text column's height so
            both columns end level; on mobile it falls back to an aspect ratio. */}
        <motion.div
          {...fade(0.12)}
          className="aspect-[4/3] w-full md:aspect-auto md:h-full md:self-stretch"
        >
          <iframe
            title="Mapa — Restaurace U Maxe"
            src="https://www.openstreetmap.org/export/embed.html?bbox=15.0002%2C49.1398%2C15.0182%2C49.1508&layer=mapnik&marker=49.1452668%2C15.0092159"
            loading="lazy"
            className="h-full w-full border border-[#C8962A22] [filter:invert(1)_hue-rotate(180deg)_brightness(0.9)_contrast(0.9)]"
          />
        </motion.div>
      </div>

      {/* Interior — wide atmospheric band closing the page, flush in the
          container (not a floating framed rectangle). */}
      <div className="mt-16">
        <PhotoCell
          src="/images/wide-fotka-interierjpg.jpg"
          alt="Interiér restaurace U Maxe – kamenný sál"
          inView
          sizes="(max-width: 768px) 100vw, 90vw"
          className="aspect-[3/2] w-full"
        />
      </div>
    </main>
  );
}
