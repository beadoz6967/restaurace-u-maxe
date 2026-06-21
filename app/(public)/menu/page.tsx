"use client";

import { motion, useReducedMotion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
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
        name: "Smažený řízek z vepřové kotlety, bramborový salát",
        price: 219,
      },
      {
        id: "h4",
        name: "Pečené kuřecí stehno, opékané brambory, dušený špenát",
        price: 198,
      },
    ],
  },
  {
    title: "Dezert",
    allergens: "Obsahuje: lepek (1), mléko (7), vejce (3), skořápkové (8).",
    items: [
      { id: "d1", name: "Domácí jablečný štrúdl, šlehačka", price: 89 },
      { id: "d2", name: "Čokoládový fondant, arašídová zmrzlina", price: 119 },
    ],
  },
];

const TODAY = "21. 06. 2026";

export default function Menu() {
  const reduce = useReducedMotion();

  return (
    <main className="mx-auto max-w-[1100px] px-6 pb-28 pt-32 md:px-16 md:pt-40">
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <SectionLabel label="Dnešní příděl" meta={TODAY} />
      </motion.div>

      <div className="mt-16 flex flex-col gap-16">
        {MENU.map((category, ci) => (
          <motion.section
            key={category.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              delay: reduce ? 0 : ci * 0.05,
            }}
          >
            <h2 className="font-tactical text-sm font-bold uppercase tracking-[0.35em] text-rust">
              {category.title}
            </h2>

            <div className="mt-6 flex flex-col gap-1">
              {category.items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={false}
                  whileHover={reduce ? undefined : { x: 6 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="group flex items-baseline gap-4 py-3"
                >
                  <span className="font-body font-medium text-beige transition-colors duration-200 group-hover:text-cream">
                    {item.name}
                  </span>
                  <span className="h-px flex-1 translate-y-[-2px] border-b border-dashed border-[#C8962A33] transition-colors duration-200 group-hover:border-gold" />
                  <span className="shrink-0 font-body tabular-nums text-gold">
                    {item.price} Kč
                  </span>
                </motion.div>
              ))}
            </div>

            {category.allergens && (
              <p className="mt-5 font-body text-sm text-beige/40">
                {category.allergens}
              </p>
            )}
          </motion.section>
        ))}
      </div>
    </main>
  );
}
