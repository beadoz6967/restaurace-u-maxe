"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import PhotoCell from "@/components/ui/PhotoCell";
import { formatKc, formatDate } from "@/lib/format";
import type { MenuCategory } from "@/types";

const MENU: MenuCategory[] = [
  {
    title: "Polévka",
    allergens: "Obsahuje: lepek (1), celer (9), vejce (3).",
    items: [
      {
        id: "p1",
        name: "Silný hovězí vývar s játrovými knedlíčky",
        price: 65,
      },
      { id: "p2", name: "Pražená česnečka se sýrem a krutony", price: 59 },
    ],
  },
  {
    title: "Hlavní jídlo",
    allergens: "Obsahuje: lepek (1), mléko (7), hořčici (10).",
    items: [
      {
        id: "h1",
        name: "Hovězí líčka na tmavém pivu, bramborová kaše",
        price: 289,
      },
      {
        id: "h2",
        name: "Svíčková na smetaně, houskový knedlík",
        price: 245,
      },
      {
        id: "h3",
        name: "Smažený sýr s bramborem",
        price: 159,
      },
      {
        id: "h4",
        name: "Koprová omáčka s knedlíkem",
        price: 169,
      },
    ],
  },
  {
    title: "Dezert",
    allergens: "Obsahuje: lepek (1), mléko (7), vejce (3).",
    items: [
      { id: "d1", name: "Plněné jahodové knedlíky", price: 139 },
      { id: "d2", name: "Šišky s mákem", price: 119 },
    ],
  },
];

const TODAY = formatDate(new Date(2026, 5, 21));

/** Photos for the dishes we have shots of, keyed by menu item id. */
const PHOTOS: Record<string, { src: string; alt: string; desc: string }> = {
  h3: {
    src: "/images/smazeny-syr-s-bramborem.jpg",
    alt: "Smažený sýr s vařeným bramborem a tatarkou",
    desc: "Smažený eidam s vařeným bramborem a domácí tatarkou.",
  },
  h4: {
    src: "/images/koprova-omacka-s-knedlikem.jpg",
    alt: "Koprová omáčka s vařeným hovězím, vejcem a houskovým knedlíkem",
    desc: "Krémová koprová omáčka s hovězím, vejcem a houskovým knedlíkem.",
  },
  d1: {
    src: "/images/plnene-jahodove-knedliky.jpg",
    alt: "Ovocné knedlíky plněné jahodami s tvarohem a moučkovým cukrem",
    desc: "Kynuté knedlíky s jahodami, tvarohem a rozpuštěným máslem.",
  },
  d2: {
    src: "/images/sisky-s-makemjpg.jpg",
    alt: "Bramborové šišky s mákem a moučkovým cukrem",
    desc: "Domácí bramborové šišky s mletým mákem a cukrem.",
  },
};

export default function Menu() {
  const reduce = useReducedMotion();

  return (
    <main className="mx-auto max-w-[1440px] px-6 pb-16 pt-24 md:px-10 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-[1100px]">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionLabel label="Jídelní lístek" meta={TODAY} as="h1" />
        </motion.div>

        <div className="mt-16 flex flex-col gap-16">
        {MENU.map((category) => (
          <div key={category.title}>
            <h2 className="font-tactical text-sm font-bold uppercase tracking-[0.35em] text-rust">
              {category.title}
            </h2>

            <div className="mt-6 flex flex-col gap-1">
              {category.items.map((item) => {
                const photo = PHOTOS[item.id];

                // Dishes we have a photo of render as a small 4:5 cell beside
                // the name + a short description, top-aligned with the type.
                if (photo) {
                  return (
                    <div key={item.id} className="flex flex-col gap-4 py-4">
                      {/* Name + price row — flush-left, identical to the
                          photo-less rows so every dish name shares one baseline. */}
                      <div className="flex items-baseline gap-4">
                        <span className="font-body font-medium text-beige">
                          {item.name}
                        </span>
                        <span className="h-px flex-1 translate-y-[-2px] border-b border-dashed border-[#C8962A33]" />
                        <span className="shrink-0 font-body tabular-nums text-gold">
                          {formatKc(item.price)}
                        </span>
                      </div>
                      {/* Photo + description sit below the name, out of its
                          horizontal flow. */}
                      <div className="flex items-start gap-6">
                        <PhotoCell
                          src={photo.src}
                          alt={photo.alt}
                          sizes="(max-width: 768px) 35vw, 160px"
                          className="aspect-[4/5] w-32 shrink-0 md:w-40"
                        />
                        <p className="max-w-md font-body text-sm text-beige/50">
                          {photo.desc}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <motion.div
                    key={item.id}
                    initial={false}
                    whileHover={reduce ? undefined : { x: 6 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="group flex items-baseline gap-4 py-2"
                  >
                    <span className="font-body font-medium text-beige transition-colors duration-200 group-hover:text-cream">
                      {item.name}
                    </span>
                    <span className="h-px flex-1 translate-y-[-2px] border-b border-dashed border-[#C8962A33] transition-colors duration-200 group-hover:border-gold" />
                    <span className="shrink-0 font-body tabular-nums text-gold">
                      {formatKc(item.price)}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {category.allergens && (
              <p className="mt-4 font-body text-sm text-beige/40">
                {category.allergens}
              </p>
            )}
          </div>
          ))}
        </div>
      </div>
    </main>
  );
}
