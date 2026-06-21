"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import type { MenuItem } from "@/types";

const ITEMS: MenuItem[] = [
  { id: "h1", name: "Hovězí líčka na tmavém pivu", price: 289 },
  { id: "h2", name: "Svíčková na smetaně", price: 245 },
  { id: "h3", name: "Smažený řízek, bramborový salát", price: 219 },
  { id: "h4", name: "Pečené kuřecí stehno", price: 198 },
  { id: "p1", name: "Hovězí vývar s knedlíčky", price: 65 },
  { id: "d1", name: "Domácí jablečný štrúdl", price: 89 },
];

type Payment = "site" | "card" | null;

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M4 12.5l5 5L20 6.5"
        stroke="#C8962A"
        strokeWidth="2.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export default function Order() {
  const reduce = useReducedMotion();
  const [qty, setQty] = useState<Record<string, number>>({});
  const [payment, setPayment] = useState<Payment>(null);

  const setQuantity = (id: string, next: number) =>
    setQty((prev) => ({ ...prev, [id]: Math.max(0, next) }));

  const toggle = (id: string) =>
    setQty((prev) => ({ ...prev, [id]: prev[id] ? 0 : 1 }));

  const total = useMemo(
    () =>
      ITEMS.reduce((sum, item) => sum + item.price * (qty[item.id] ?? 0), 0),
    [qty]
  );

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
  });

  return (
    <main className="mx-auto max-w-[840px] px-6 pb-28 pt-32 md:px-10 md:pt-40">
      {/* Header */}
      <motion.header {...fade(0)}>
        <h1 className="font-display text-4xl font-bold italic text-cream md:text-6xl">
          Manifest objednávky
        </h1>
        <p className="mt-3 font-tactical text-sm font-bold uppercase tracking-[0.3em] text-gold">
          Vyberte, co chcete vzít
        </p>
      </motion.header>

      {/* STEP 1 — Items */}
      <motion.section {...fade(0.08)} className="mt-16">
        <SectionLabel label="01 · Položky" />
        <div className="mt-6 flex flex-col">
          {ITEMS.map((item) => {
            const count = qty[item.id] ?? 0;
            const checked = count > 0;
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b border-[#C8962A22] py-4"
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-pressed={checked}
                  aria-label={`Vybrat ${item.name}`}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center border transition-colors duration-200 ${
                    checked
                      ? "border-gold"
                      : "border-[#C8962A44] hover:border-gold/70"
                  }`}
                >
                  {checked && <Check />}
                </button>

                <span className="flex-1 font-body text-beige">{item.name}</span>

                {/* Quantity stepper */}
                <div
                  className={`flex items-center transition-opacity duration-200 ${
                    checked ? "opacity-100" : "pointer-events-none opacity-30"
                  }`}
                >
                  <button
                    type="button"
                    aria-label="Ubrat"
                    onClick={() => setQuantity(item.id, count - 1)}
                    className="flex h-7 w-7 items-center justify-center border border-[#C8962A44] font-tactical text-beige transition-colors duration-200 hover:border-rust hover:text-rust"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-body tabular-nums text-cream">
                    {count}
                  </span>
                  <button
                    type="button"
                    aria-label="Přidat"
                    onClick={() => setQuantity(item.id, count + 1)}
                    className="flex h-7 w-7 items-center justify-center border border-[#C8962A44] font-tactical text-beige transition-colors duration-200 hover:border-gold hover:text-gold"
                  >
                    +
                  </button>
                </div>

                <span className="w-20 shrink-0 text-right font-body tabular-nums text-gold">
                  {item.price} Kč
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-baseline justify-between">
          <span className="font-tactical text-sm font-bold uppercase tracking-[0.3em] text-beige/60">
            Celkem
          </span>
          <span className="font-body text-2xl tabular-nums text-gold">
            {total} Kč
          </span>
        </div>
      </motion.section>

      {/* STEP 2 — Details */}
      <motion.section {...fade(0.16)} className="mt-20">
        <SectionLabel label="02 · Detaily" />
        <div className="mt-10 flex flex-col gap-10">
          <FloatingInput
            id="name"
            label="Jméno"
            type="text"
            autoComplete="name"
          />
          <FloatingInput
            id="phone"
            label="Telefon"
            type="tel"
            autoComplete="tel"
          />
          <FloatingInput id="time" label="Čas vyzvednutí" type="time" />
        </div>
      </motion.section>

      {/* STEP 3 — Payment */}
      <motion.section {...fade(0.24)} className="mt-20">
        <SectionLabel label="03 · Platba" />
        <div className="mt-6 flex flex-col gap-3">
          <PaymentRow
            label="Platba na místě"
            selected={payment === "site"}
            onClick={() => setPayment("site")}
          />
          <PaymentRow
            label="Platba kartou"
            selected={payment === "card"}
            onClick={() => setPayment("card")}
          />
        </div>
      </motion.section>

      {/* Submit */}
      <motion.button
        {...fade(0.32)}
        type="button"
        className="group mt-16 flex w-full items-center justify-center gap-3 border border-gold py-6 transition-colors duration-200 hover:border-rust"
      >
        <span className="font-tactical text-xl font-extrabold uppercase tracking-[0.25em] text-beige transition-colors duration-200 group-hover:text-cream">
          Vzít to
        </span>
        <span className="font-tactical text-xl text-gold transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </motion.button>
    </main>
  );
}

function FloatingInput({
  id,
  label,
  type,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  autoComplete?: string;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder=" "
        className="peer w-full border-0 border-b border-[#C8962A44] bg-transparent pb-2 pt-4 font-body text-cream outline-none transition-colors duration-200 [color-scheme:dark] focus:border-gold"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-4 origin-left font-tactical text-base uppercase tracking-[0.15em] text-beige/50 transition-all duration-200 peer-focus:-translate-y-5 peer-focus:text-xs peer-focus:tracking-[0.25em] peer-focus:text-gold peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:tracking-[0.25em] peer-[:not(:placeholder-shown)]:text-gold"
      >
        {label}
      </label>
    </div>
  );
}

function PaymentRow({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full border px-6 py-5 text-left font-tactical text-base font-bold uppercase tracking-[0.2em] transition-colors duration-200 ${
        selected
          ? "border-gold bg-[#C8962A0A] text-cream"
          : "border-[#C8962A22] text-beige/80 hover:border-rust"
      }`}
    >
      {label}
    </button>
  );
}
