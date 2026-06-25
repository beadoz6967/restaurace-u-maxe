"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import { formatKc } from "@/lib/format";

/** An orderable line item with a resolved (always present) price. */
export interface OrderItem {
  id: string;
  name: string;
  price: number;
}

/** Visible keyboard focus, shared across the page's interactive controls. */
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary";

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

export default function OrderForm({ items }: { items: OrderItem[] }) {
  const reduce = useReducedMotion();
  const [qty, setQty] = useState<Record<string, number>>({});

  const setQuantity = (id: string, next: number) =>
    setQty((prev) => ({ ...prev, [id]: Math.max(0, next) }));

  const toggle = (id: string) =>
    setQty((prev) => ({ ...prev, [id]: prev[id] ? 0 : 1 }));

  const total = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.price * (qty[item.id] ?? 0), 0),
    [items, qty]
  );

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
  });

  return (
    <main className="mx-auto max-w-[1440px] px-6 pb-16 pt-24 md:px-10 md:pb-24 md:pt-32">
      <form className="mx-auto max-w-[840px]" onSubmit={(e) => e.preventDefault()}>
      {/* Header */}
      <motion.header {...fade(0)}>
        <h1 className="font-display text-4xl font-bold italic text-cream md:text-6xl">
          Objednávka s sebou
        </h1>
        <p className="mt-4 font-tactical text-sm font-bold uppercase tracking-[0.3em] text-gold">
          Vyberte si z naší nabídky
        </p>
      </motion.header>

      {/* STEP 1 — Items */}
      <motion.section {...fade(0.08)} className="mt-16">
        <SectionLabel label="01 · Položky" />
        <div className="mt-6 flex flex-col">
          {items.map((item) => {
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
                  className={`flex h-6 w-6 shrink-0 touch-manipulation items-center justify-center border transition-colors duration-200 ${FOCUS_RING} ${
                    checked
                      ? "border-gold"
                      : "border-[#C8962A44] hover:border-gold/70"
                  }`}
                >
                  {checked && <Check />}
                </button>

                <span className="min-w-0 flex-1 break-words font-body text-beige">
                  {item.name}
                </span>

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
                    className={`flex h-7 w-7 touch-manipulation items-center justify-center border border-[#C8962A44] font-tactical text-beige transition-colors duration-200 hover:border-rust hover:text-rust ${FOCUS_RING}`}
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
                    className={`flex h-7 w-7 touch-manipulation items-center justify-center border border-[#C8962A44] font-tactical text-beige transition-colors duration-200 hover:border-gold hover:text-gold ${FOCUS_RING}`}
                  >
                    +
                  </button>
                </div>

                <span className="w-20 shrink-0 text-right font-body tabular-nums text-gold">
                  {formatKc(item.price)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-baseline justify-between">
          <span className="font-tactical text-sm font-bold uppercase tracking-[0.3em] text-beige/60">
            Celkem
          </span>
          <span
            aria-live="polite"
            className="font-body text-2xl tabular-nums text-gold"
          >
            {formatKc(total)}
          </span>
        </div>
      </motion.section>

      {/* STEP 2 — Details */}
      <Reveal className="mt-16">
        <SectionLabel label="02 · Detaily" />
        <div className="mt-6 flex flex-col gap-8">
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
          <FloatingInput
            id="time"
            label="Čas vyzvednutí"
            type="time"
            autoComplete="off"
          />
        </div>
      </Reveal>

      {/* STEP 3 — Payment */}
      <Reveal className="mt-16">
        <SectionLabel label="03 · Platba" />
        <p className="mt-6 font-body text-beige">
          Platba probíhá v hotovosti při převzetí objednávky.
        </p>
      </Reveal>

      {/* Submit */}
      <Reveal className="mt-16">
        <button
          type="submit"
          className={`group flex w-full touch-manipulation items-center justify-center gap-4 border border-gold py-6 transition-colors duration-200 hover:border-rust ${FOCUS_RING}`}
        >
          <span className="font-tactical text-xl font-extrabold uppercase tracking-[0.25em] text-beige transition-colors duration-200 group-hover:text-cream">
            Odeslat objednávku
          </span>
          <span
            aria-hidden
            className="font-tactical text-xl text-gold transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </button>
      </Reveal>
      </form>
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
        name={id}
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
