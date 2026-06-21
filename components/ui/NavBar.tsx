"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const LINKS = [
  { href: "/menu", label: "MENU" },
  { href: "/order", label: "OBJEDNAT" },
  { href: "/gallery", label: "GALERIE" },
  { href: "/contact", label: "KONTAKT" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#C8962A22]">
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="font-tactical text-2xl font-black uppercase leading-none tracking-widest text-gold transition-colors duration-200 hover:text-rust focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary md:text-3xl"
          >
            U Maxe
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-tactical text-xs font-bold uppercase tracking-[0.35em] text-beige/70 transition-colors duration-200 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Otevřít menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 w-8 touch-manipulation flex-col items-center justify-center gap-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary md:hidden"
          >
            <span
              className={`block h-[2px] w-7 bg-gold transition-transform duration-200 ${
                open ? "translate-y-[8px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-7 bg-gold transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-[2px] w-7 bg-gold transition-transform duration-200 ${
                open ? "-translate-y-[8px] -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center overscroll-contain bg-bg-primary md:hidden"
          >
            <ul className="flex flex-col items-center gap-10">
              {LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduce ? 0 : 0.4,
                    ease: "easeOut",
                    delay: reduce ? 0 : 0.1 + i * 0.08,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-tactical text-4xl font-extrabold uppercase tracking-[0.15em] text-beige transition-colors duration-200 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
