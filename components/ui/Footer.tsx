const YEAR = 2026;

/**
 * Compact site footer for public pages — address, opening hours, and
 * contact. A single top hairline; flat fills, 0px edges, no decoration.
 */
export default function Footer() {
  return (
    <footer className="border-t border-surface">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
        <div className="grid items-start gap-12 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand + address */}
          <div>
            <p className="font-tactical text-2xl font-extrabold uppercase tracking-wide text-gold">
              U Maxe
            </p>
            <p className="mt-4 font-body text-sm leading-relaxed text-beige/60">
              Denisova 20/II.
              <br />
              377 01 Jindřichův Hradec
            </p>
          </div>

          {/* Opening hours */}
          <div>
            <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.2em] text-beige/40">
              Otevírací doba
            </p>
            <dl className="mt-4 space-y-2 font-body text-sm">
              <div className="flex items-baseline justify-between gap-6">
                <dt className="text-beige/50">Po–Pá</dt>
                <dd className="tabular-nums text-beige">10:00–13:30</dd>
              </div>
              <div className="flex items-baseline justify-between gap-6">
                <dt className="text-beige/50">So–Ne</dt>
                <dd className="text-beige/40">Zavřeno</dd>
              </div>
            </dl>
          </div>

          {/* Contact */}
          <div>
            <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.2em] text-beige/40">
              Kontakt
            </p>
            <div className="mt-4 flex flex-col items-start gap-2 font-body text-sm">
              <a
                href="tel:+420728814736"
                className="text-gold transition-colors duration-200 hover:text-rust"
              >
                +420 728 814 736
              </a>
              <a
                href="mailto:Objednavkyumaxe@seznam.cz"
                className="text-beige/80 transition-colors duration-200 hover:text-gold"
              >
                Objednavkyumaxe@seznam.cz
              </a>
              <a
                href="https://umaxe.sebou.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-beige/80 transition-colors duration-200 hover:text-gold"
              >
                Objednávky online → umaxe.sebou.cz
              </a>
            </div>
          </div>
        </div>

        <p className="mt-12 font-body text-[0.7rem] uppercase tracking-[0.15em] text-beige/40">
          © {YEAR} Restaurace U Maxe · Jindřichův Hradec
        </p>
      </div>
    </footer>
  );
}
