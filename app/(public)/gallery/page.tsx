"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import PhotoCell from "@/components/ui/PhotoCell";

const INTERIOR = {
  src: "/images/wide-fotka-interierjpg.jpg",
  alt: "Interiér restaurace U Maxe – kamenný sál",
};

const FOOD = [
  {
    src: "/images/plnene-jahodove-knedliky.jpg",
    alt: "Ovocné knedlíky plněné jahodami s tvarohem a moučkovým cukrem",
  },
  {
    src: "/images/sisky-s-makemjpg.jpg",
    alt: "Bramborové šišky s mákem a moučkovým cukrem",
  },
  {
    src: "/images/smazeny-syr-s-bramborem.jpg",
    alt: "Smažený sýr s vařeným bramborem a tatarkou",
  },
  {
    src: "/images/koprova-omacka-s-knedlikem.jpg",
    alt: "Koprová omáčka s vařeným hovězím, vejcem a houskovým knedlíkem",
  },
];

export default function Gallery() {
  const reduce = useReducedMotion();

  return (
    <main className="mx-auto max-w-[1440px] px-6 pb-16 pt-24 md:px-10 md:pb-24 md:pt-32">
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <SectionLabel label="Galerie" meta="5 / 5" as="h1" />
      </motion.div>

      <div className="mt-12 grid grid-cols-2 items-start gap-2 md:grid-cols-4">
        {/* Interior — wide landscape band across the top row. */}
        <PhotoCell
          src={INTERIOR.src}
          alt={INTERIOR.alt}
          priority
          inView
          sizes="(max-width: 768px) 100vw, 92vw"
          className="col-span-2 aspect-[3/2] md:col-span-4"
        />
        {/* Four food portraits. */}
        {FOOD.map((photo) => (
          <PhotoCell
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            inView
            sizes="(max-width: 768px) 50vw, 25vw"
            className="aspect-[4/5]"
          />
        ))}
      </div>
    </main>
  );
}
