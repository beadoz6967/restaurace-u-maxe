"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import DisplayWord from "@/components/ui/DisplayWord";
import MetadataRow from "@/components/ui/MetadataRow";
import PhotoCell from "@/components/ui/PhotoCell";
import Reveal from "@/components/ui/Reveal";
import TypeGridSection from "@/components/ui/TypeGridSection";
import { formatKc, formatDayMonth } from "@/lib/format";

/** Showcase dishes for the "Z naší kuchyně" section (local, not Sanity). */
const DISHES = [
  {
    name: "Plněné jahodové knedlíky",
    src: "/images/plnene-jahodove-knedliky.jpg",
    desc: "Kynuté ovocné knedlíky plněné čerstvými jahodami, sypané tvarohem a moučkovým cukrem, přelité rozpuštěným máslem.",
  },
  {
    name: "Šišky s mákem",
    src: "/images/sisky-s-makemjpg.jpg",
    desc: "Domácí bramborové šišky obalené v mletém máku s moučkovým cukrem a máslem.",
  },
  {
    name: "Smažený sýr s bramborem",
    src: "/images/smazeny-syr-s-bramborem.jpg",
    desc: "Smažený eidam podávaný s vařeným bramborem a domácí tatarkou.",
  },
  {
    name: "Koprová omáčka s knedlíkem",
    src: "/images/koprova-omacka-s-knedlikem.jpg",
    desc: "Krémová koprová omáčka s vařeným hovězím, půlkou vejce a houskovým knedlíkem.",
  },
];

export default function Home() {
  const reduce = useReducedMotion();

  return (
    <main>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative overflow-hidden">
        {/* LAYER 1 — interior photo: bleeds off the right + top edges, full hero
            height, no frame/border/radius/margin. It runs edge-to-edge into the
            top-right corner, under the nav. */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[58%] md:block lg:w-[55%]">
          <PhotoCell
            src="/images/wide-fotka-interierjpg.jpg"
            alt="Interiér restaurace U Maxe – kamenný sál"
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="h-full w-full"
            frame={false}
            markers={false}
            grain={false}
            hover={false}
          />
          {/* LAYER 2 — tonal integration. Global darken sits the image in the
              dark theme; the left-edge gradient scrim dissolves the photo into
              bg-primary so there is no hard vertical seam. */}
          <div className="absolute inset-0 bg-bg-primary/30" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#17130f_0%,rgba(23,19,15,0.65)_18%,transparent_52%)]" />
        </div>

        {/* LAYER 3 — type, above the photo. Its right portion overlaps the
            scrimmed left zone of the image; the word laces over, never clipped. */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col justify-center px-6 pb-16 pt-24 md:min-h-[88svh] md:px-10">
          <MetadataRow
            items={["JINDŘICHŮV HRADEC", "PO–PÁ 10–13:30", "OBĚDY S SEBOU"]}
          />
          {/* The structural word — one line, tail laces over the photo's edge. */}
          <DisplayWord
            as="h1"
            className="mt-4 whitespace-nowrap text-gold"
            size="clamp(4rem, 26vw, 20rem)"
          >
            U&nbsp;MAXE
          </DisplayWord>
          {/* Cormorant accent — single italic pull-line (use 1 of 2). */}
          <motion.p
            initial={{ opacity: reduce ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: reduce ? 0 : 0.5 }}
            className="mt-6 font-display text-2xl italic text-beige/70 md:text-3xl"
          >
            Poctivá česká kuchyně.
          </motion.p>
        </div>
      </section>

      {/* ──────────────────── DNES — today's special ──────────────────── */}
      <TypeGridSection id="dnes" className="py-16 md:py-24">
        {/* Left — word, dish, and the price anchored to the bottom. On desktop
            the column stretches to the photo's height and the price is pushed to
            the foot (md:mt-auto), so the text column fills that height instead of
            leaving a dead gap — and the photo keeps its true portrait shape. */}
        <div className="col-span-12 flex flex-col md:col-span-8 md:self-stretch">
          <Reveal>
            <MetadataRow
              items={["DNEŠNÍ SPECIALITA", formatDayMonth(new Date(2026, 5, 21))]}
              separator="rule"
            />
          </Reveal>
          <DisplayWord
            inView
            className="mt-4 text-gold"
            size="clamp(3.5rem, 12vw, 13rem)"
          >
            DNES
          </DisplayWord>
          <Reveal className="mt-6" delay={0.08}>
            <h2 className="max-w-xl font-tactical text-2xl font-extrabold uppercase leading-[0.95] tracking-[-0.01em] text-cream md:text-4xl">
              Hovězí líčka na tmavém pivu
            </h2>
            <p className="mt-4 max-w-md font-body text-beige/60">
              Pomalu dušená, bramborová kaše s rozpečeným česnekem, pečená mrkev.
            </p>
          </Reveal>
          <Reveal
            className="mt-12 flex max-w-xl items-baseline justify-between border-t border-surface pt-6 md:mt-auto"
            delay={0.16}
          >
            <span className="font-body text-[0.7rem] font-medium uppercase tracking-[0.15em] text-beige/50">
              Cena
            </span>
            <span className="font-display text-4xl italic text-gold">
              {formatKc(289)}
            </span>
          </Reveal>
        </div>

        {/* Right — the dish photo, a true portrait that sets the section height
            the left column then matches. */}
        <div className="col-span-12 mt-12 md:col-span-4 md:col-start-9 md:mt-0">
          <PhotoCell inView className="aspect-[4/5]" />
        </div>
      </TypeGridSection>

      {/* ──────────────── Z NAŠÍ KUCHYNĚ — dish showcase ──────────────── */}
      <KitchenSection />

      {/* ──────────────────────── CTA — S SEBOU ──────────────────────── */}
      <TypeGridSection className="py-16 md:py-24">
        <Link
          href="/order"
          className="group col-span-12 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-bg-primary"
        >
          <Reveal>
            <MetadataRow items={["OBJEDNAT DO 10:00", "VYZVEDNOUT V POLEDNE"]} />
          </Reveal>
          <div className="mt-4 flex items-baseline justify-between gap-4">
            <DisplayWord inView className="text-beige transition-colors duration-300 group-hover:text-cream">
              S SEBOU
            </DisplayWord>
            <span
              aria-hidden
              className="shrink-0 font-tactical text-5xl font-extrabold text-gold transition-transform duration-300 group-hover:translate-x-3 md:text-8xl"
            >
              →
            </span>
          </div>
        </Link>
      </TypeGridSection>
    </main>
  );
}

/**
 * "Z naší kuchyně" — the one section with characterful motion: directional
 * reveals that follow the alternating photo side, scroll-linked parallax on the
 * food photos, and a faint giant ghost word behind the blocks. All subtle, all
 * scoped here, all reduced-motion aware.
 */
function KitchenSection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Ghost drifts a hair slower than the page — registered, not noticed.
  const ghostY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section ref={ref} className="relative overflow-hidden py-16 md:py-24">
      {/* Ghost typography — barely-there surface-on-bg word, rotated down the
          empty CENTER channel between the (col-5) photo and (col-8) photo so it
          never crosses a food cell. Behind everything, never read consciously. */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: ghostY }}
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
      >
        <span
          className="rotate-90 select-none whitespace-nowrap font-tactical font-extrabold uppercase leading-none text-surface/30"
          style={{ fontSize: "clamp(5rem, 12vw, 12rem)" }}
        >
          KUCHYNĚ
        </span>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10">
        {/* Restrained header — the dish names carry the size. */}
        <Reveal>
          <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.2em] text-gold">
            Z naší kuchyně
          </p>
          <p className="mt-4 font-display text-2xl italic text-beige/70 md:text-3xl">
            Sladké i slané.
          </p>
        </Reveal>

        {/* Four dish blocks — photo side alternates for an asymmetric rhythm. */}
        <div className="mt-16 flex flex-col gap-16">
          {DISHES.map((dish, i) => (
            <DishBlock
              key={dish.src}
              dish={dish}
              index={i}
              reversed={i % 2 === 1}
              reduce={!!reduce}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/** One dish row: photo + text slide in from opposite sides; the photo also
 *  parallaxes a few percent as the block scrolls through the viewport. */
function DishBlock({
  dish,
  index,
  reversed,
  reduce,
}: {
  dish: { name: string; src: string; desc: string };
  index: number;
  reversed: boolean;
  reduce: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Photo lags the scroll a touch → depth. scale covers the translate so the
  // frame never shows a gap; overflow-hidden clips the rest.
  const photoY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const photoDir = reversed ? "right" : "left";
  const textDir = reversed ? "left" : "right";

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-12"
    >
      {/* Photo — slides in from its own side; PhotoCell's clip resolves on
          mount (below the fold, under the still-hidden Reveal) so only the
          directional slide reads. */}
      <Reveal
        direction={photoDir}
        className={`md:col-span-5 ${
          reversed ? "md:col-start-8" : "md:col-start-1"
        }`}
      >
        <div className="overflow-hidden">
          <motion.div style={reduce ? undefined : { y: photoY, scale: 1.12 }}>
            <PhotoCell
              src={dish.src}
              alt={`${dish.name} – ${dish.desc}`}
              sizes="(max-width: 768px) 100vw, 45vw"
              className="aspect-[4/5]"
            />
          </motion.div>
        </div>
      </Reveal>

      {/* Text — slides in from the opposite side. */}
      <Reveal
        direction={textDir}
        delay={0.05}
        className={`flex flex-col md:col-span-7 ${
          reversed ? "md:col-start-1 md:row-start-1" : "md:col-start-6"
        }`}
      >
        <span className="font-body text-sm font-medium tracking-[0.2em] text-gold">
          0{index + 1}
        </span>
        <h3
          className="mt-4 font-tactical font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-cream"
          style={{ fontSize: "clamp(2.25rem, 5.5vw, 5.5rem)" }}
        >
          {dish.name}
        </h3>
        <p className="mt-6 max-w-[40ch] font-body text-beige/70">{dish.desc}</p>
      </Reveal>
    </div>
  );
}
