"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export default function Home() {
  const reduce = useReducedMotion();

  const heroContainer: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: 0.1 },
    },
  };
  const heroWord: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <main>
      {/* ZONE A — HERO */}
      <section className="relative flex h-screen min-h-[640px] flex-col justify-between overflow-hidden">
        {/* RIGHT — scratched metal placeholder panel (not an empty void) */}
        <div className="absolute right-0 top-0 hidden h-full w-[45%] md:block" aria-hidden>
          <div className="relative h-full w-full overflow-hidden bg-[#2A1F15]">
            {/* Diagonal scratch lines — worn metal / wasteland surface */}
            <svg
              className="absolute inset-0 h-full w-full opacity-20"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern
                  id="scratches"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(35)"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="40"
                    stroke="#C8962A"
                    strokeWidth="0.5"
                    opacity="0.6"
                  />
                  <line
                    x1="15"
                    y1="0"
                    x2="15"
                    y2="40"
                    stroke="#C8962A"
                    strokeWidth="0.3"
                    opacity="0.3"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#scratches)" />
            </svg>
            {/* Vignette edges blending into the page */}
            <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-bg-primary/40" />
            {/* Center placeholder label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-tactical text-xs uppercase tracking-[0.4em] text-gold/20">
                FOTO BUDE DOPLNĚNO
              </span>
            </div>
          </div>
        </div>

        {/* LEFT — name block */}
        <div className="relative z-10 flex flex-1 flex-col justify-center px-6 md:px-16">
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="show"
            className="border-l-2 border-gold pl-8 md:w-[55%] md:pl-12"
          >
            {/* Eyebrow — Big Shoulders, rust, wide tracking */}
            <motion.p
              variants={heroWord}
              className="mb-6 font-tactical text-sm uppercase tracking-[0.5em] text-rust"
            >
              RESTAURACE
            </motion.p>

            {/* Name — Big Shoulders Display, massive, gold */}
            <motion.h1
              variants={heroWord}
              className="font-tactical font-black uppercase leading-none text-gold"
              style={{ fontSize: "clamp(5rem, 12vw, 11rem)" }}
            >
              U MAXE
            </motion.h1>

            {/* Subline — Cormorant italic, supporting role */}
            <motion.p
              variants={heroWord}
              className="mt-4 font-display text-2xl italic tracking-wide text-beige/60"
            >
              Česká kuchyně · České Budějovice
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll indicator — pulses, not bounces */}
        <motion.div
          aria-hidden
          animate={reduce ? {} : { opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 flex flex-col items-center gap-2 pb-10 font-tactical text-xs uppercase tracking-[0.4em] text-gold"
        >
          <span>Dnešní příděl</span>
          <span className="text-base">↓</span>
        </motion.div>
      </section>

      {/* ZONE B — HORIZONTAL STRIPS */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-16">
        {/* Strip 1 — Opening hours */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: "easeOut" }}
          className="flex flex-col gap-4 border-b border-[#C8962A22] py-10 md:flex-row md:items-center md:justify-between md:gap-8"
        >
          <span className="font-tactical text-sm font-extrabold uppercase tracking-[0.3em] text-gold">
            Otevírací doba
          </span>
          <span className="hidden h-px flex-1 bg-[#C8962A22] md:block" />
          <div className="flex flex-wrap gap-x-10 gap-y-2 font-body text-beige/85">
            <span>
              <span className="text-beige/50">Po–Pá</span> &nbsp;10:00–02:00
            </span>
            <span>
              <span className="text-beige/50">So–Ne</span> &nbsp;NONSTOP
            </span>
          </div>
        </motion.div>

        {/* Strip 2 — Today's special */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: "easeOut" }}
          className="flex flex-col gap-4 border-b border-[#C8962A22] py-10 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <span className="font-tactical text-xs font-bold uppercase tracking-[0.3em] text-rust">
              Dnešní specialita
            </span>
            <h2 className="mt-3 font-display text-3xl italic text-cream md:text-4xl">
              Hovězí líčka na tmavém pivu
            </h2>
            <p className="mt-2 font-body text-beige/60">
              Pomalu dušená, bramborová kaše s rozpečeným česnekem, pečená
              mrkev.
            </p>
          </div>
          <span className="shrink-0 font-body text-2xl text-gold md:text-3xl">
            289 Kč
          </span>
        </motion.div>

        {/* Strip 3 — CTA */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: "easeOut" }}
          className="my-10"
        >
          <Link
            href="/order"
            className="group flex items-center justify-between border-y border-[#C8962A22] py-12 transition-colors duration-200 hover:border-rust"
          >
            <span className="font-tactical text-3xl font-extrabold uppercase tracking-[0.15em] text-beige transition-[letter-spacing,color] duration-300 group-hover:tracking-[0.2em] group-hover:text-cream md:text-5xl">
              Objednat s sebou
            </span>
            <span
              aria-hidden
              className="font-tactical text-3xl text-gold transition-transform duration-200 group-hover:translate-x-2 md:text-5xl"
            >
              →
            </span>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
