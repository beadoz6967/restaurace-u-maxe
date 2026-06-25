const YEAR = new Date().getFullYear();

/**
 * Compact site footer for public pages — address, opening hours, and
 * contact. A single top hairline; flat fills, 0px edges, no decoration.
 */
export default function Footer() {
  return (
    <footer className="border-t border-surface">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
        <div className="grid items-start gap-12 sm:grid-cols-2 lg:grid-cols-4">
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
                className="text-gold transition-colors duration-200 hover:text-rust focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              >
                +420 728 814 736
              </a>
              <a
                href="mailto:Objednavkyumaxe@seznam.cz"
                className="text-beige/80 transition-colors duration-200 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              >
                Objednavkyumaxe@seznam.cz
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.2em] text-beige/40">
              Sledujte nás
            </p>
            <div className="mt-4 inline-flex flex-col gap-4">
              <a
                href="https://www.instagram.com/umaxerestaurace/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 border border-gold/40 px-4 py-2 font-tactical text-xs font-bold uppercase tracking-[0.2em] text-gold transition-colors duration-200 hover:border-gold hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              >
                Instagram →
              </a>
              <a
                href="https://www.facebook.com/UMaxeJH/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 border border-gold/40 px-4 py-2 font-tactical text-xs font-bold uppercase tracking-[0.2em] text-gold transition-colors duration-200 hover:border-gold hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              >
                Facebook →
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
