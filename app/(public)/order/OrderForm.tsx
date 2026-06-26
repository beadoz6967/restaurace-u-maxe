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
  /** Optional weight prefix, e.g. "140 g". */
  weight?: string;
}

/** Visible keyboard focus, shared across the page's interactive controls. */
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary";

type Status = "idle" | "submitting" | "success" | "error";

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

/** Full-bleed centred message used for the closed and success states. */
function CenteredNotice({ title, sub }: { title: string; sub: string }) {
  return (
    <main className="mx-auto flex min-h-[70svh] max-w-[840px] flex-col items-center justify-center px-6 text-center md:px-10">
      <p className="font-display text-4xl italic text-cream md:text-5xl">
        {title}
      </p>
      <p className="mt-6 max-w-md font-body text-beige/60">{sub}</p>
    </main>
  );
}

export default function OrderForm({
  items,
  isOpen,
}: {
  items: OrderItem[];
  isOpen: boolean;
}) {
  const reduce = useReducedMotion();
  const [qty, setQty] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const setQuantity = (id: string, next: number) =>
    setQty((prev) => ({ ...prev, [id]: Math.max(0, next) }));

  const toggle = (id: string) =>
    setQty((prev) => ({ ...prev, [id]: prev[id] ? 0 : 1 }));

  const selected = useMemo(
    () => items.filter((item) => (qty[item.id] ?? 0) > 0),
    [items, qty]
  );

  const total = useMemo(
    () =>
      selected.reduce((sum, item) => sum + item.price * (qty[item.id] ?? 0), 0),
    [selected, qty]
  );

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
  });

  // Closed: past the 10:00 cutoff, or there is no menu to order from today.
  if (!isOpen || items.length === 0) {
    return (
      <CenteredNotice
        title="Objednávky jsou dnes uzavřeny."
        sub="Objednávky přijímáme každý den do 10:00."
      />
    );
  }

  if (status === "success") {
    return (
      <CenteredNotice
        title="Objednávka přijata."
        sub="Potvrdíme vám ji telefonicky. Vyzvednutí v poledne."
      />
    );
  }

  const canSubmit =
    selected.length > 0 && name.trim() !== "" && phone.trim() !== "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || status === "submitting") return;

    setStatus("submitting");
    setErrorMsg("");

    const payload = {
      customerName: name.trim(),
      customerPhone: phone.trim(),
      items: selected.map((item) => ({
        name: item.name,
        quantity: qty[item.id] ?? 0,
        price: item.price,
      })),
      total,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        setStatus("success");
        return;
      }

      const data: { error?: string } = await res.json().catch(() => ({}));
      setErrorMsg(data.error ?? "Objednávku se nepodařilo odeslat.");
      setStatus("error");
    } catch {
      setErrorMsg("Objednávku se nepodařilo odeslat. Zkuste to prosím znovu.");
      setStatus("error");
    }
  }

  return (
    <main className="mx-auto max-w-[1440px] px-6 pb-16 pt-24 md:px-10 md:pb-24 md:pt-32">
      <form className="mx-auto max-w-[840px]" onSubmit={handleSubmit}>
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
                  className="flex flex-col gap-3 border-b border-[#C8962A22] py-4 sm:flex-row sm:items-center sm:gap-4"
                >
                  {/* Checkbox + name — its own line on phones; `sm:contents`
                      dissolves this wrapper on desktop so the row is unchanged. */}
                  <div className="flex items-center gap-4 sm:contents">
                    <button
                      type="button"
                      onClick={() => toggle(item.id)}
                      aria-pressed={checked}
                      aria-label={`Vybrat ${item.name}`}
                      className={`flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center border transition-colors duration-200 sm:h-6 sm:w-6 ${FOCUS_RING} ${
                        checked
                          ? "border-gold"
                          : "border-[#C8962A44] hover:border-gold/70"
                      }`}
                    >
                      {checked && <Check />}
                    </button>

                    <span className="min-w-0 flex-1 break-words font-body text-beige">
                      {item.weight && (
                        <span className="font-normal text-beige/40">
                          {item.weight}{" "}
                        </span>
                      )}
                      {item.name}
                    </span>
                  </div>

                  {/* Stepper + price — second line on phones; `sm:contents`
                      dissolves this wrapper on desktop. */}
                  <div className="flex items-center justify-between gap-4 sm:contents">
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
                        className={`flex h-11 w-11 touch-manipulation items-center justify-center border border-[#C8962A44] font-tactical text-beige transition-colors duration-200 hover:border-rust hover:text-rust sm:h-7 sm:w-7 ${FOCUS_RING}`}
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
                        className={`flex h-11 w-11 touch-manipulation items-center justify-center border border-[#C8962A44] font-tactical text-beige transition-colors duration-200 hover:border-gold hover:text-gold sm:h-7 sm:w-7 ${FOCUS_RING}`}
                      >
                        +
                      </button>
                    </div>

                    <span className="w-20 shrink-0 text-right font-body tabular-nums text-gold">
                      {formatKc(item.price)}
                    </span>
                  </div>
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
              value={name}
              onChange={setName}
              required
            />
            <FloatingInput
              id="phone"
              label="Telefon"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={setPhone}
              required
            />
          </div>
        </Reveal>

        {/* STEP 3 — Summary */}
        <Reveal className="mt-16">
          <SectionLabel label="03 · Shrnutí" />
          {selected.length === 0 ? (
            <p className="mt-6 font-body text-beige/50">
              Zatím jste nevybrali žádné položky.
            </p>
          ) : (
            <div className="mt-6 flex flex-col">
              {selected.map((item) => {
                const count = qty[item.id] ?? 0;
                return (
                  <div
                    key={item.id}
                    className="flex items-baseline gap-4 border-b border-[#C8962A22] py-4"
                  >
                    <span className="font-body tabular-nums text-beige/60">
                      {count}×
                    </span>
                    <span className="min-w-0 flex-1 break-words font-body text-beige">
                      {item.weight && (
                        <span className="font-normal text-beige/40">
                          {item.weight}{" "}
                        </span>
                      )}
                      {item.name}
                    </span>
                    <span className="shrink-0 font-body tabular-nums text-gold">
                      {formatKc(item.price * count)}
                    </span>
                  </div>
                );
              })}
              <div className="mt-6 flex items-baseline justify-between">
                <span className="font-tactical text-sm font-bold uppercase tracking-[0.3em] text-beige/60">
                  Celkem
                </span>
                <span className="font-body text-2xl tabular-nums text-gold">
                  {formatKc(total)}
                </span>
              </div>
            </div>
          )}
          <p className="mt-8 font-body text-beige">
            Platba probíhá v hotovosti při převzetí objednávky.
          </p>
        </Reveal>

        {/* Submit */}
        <Reveal className="mt-16">
          <button
            type="submit"
            disabled={!canSubmit || status === "submitting"}
            className={`group flex w-full touch-manipulation items-center justify-center gap-4 border border-gold py-6 transition-colors duration-200 hover:border-rust disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gold ${FOCUS_RING}`}
          >
            <span className="font-tactical text-xl font-extrabold uppercase tracking-[0.25em] text-beige transition-colors duration-200 group-hover:text-cream">
              {status === "submitting" ? "Odesílám..." : "Odeslat objednávku"}
            </span>
            {status !== "submitting" && (
              <span
                aria-hidden
                className="font-tactical text-xl text-gold transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            )}
          </button>
          {status === "error" && errorMsg && (
            <p className="mt-4 font-body text-sm text-rust" role="alert">
              {errorMsg}
            </p>
          )}
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
  value,
  onChange,
  required,
}: {
  id: string;
  label: string;
  type: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
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
