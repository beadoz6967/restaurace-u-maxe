import type { Metadata } from "next";
import { getDailyMenu } from "@/lib/queries";
import type { MenuCategory } from "@/types";
import PrintButton from "./PrintButton";
import styles from "./tisk.module.css";

// Mirror the public menu's revalidation so Studio edits reach the print sheet.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Menu k tisku",
  // Utility/print page — keep it out of search results.
  robots: { index: false, follow: false },
};

// "D. M. YYYY" in Czech, anchored to the restaurant's timezone so the printed
// date never drifts across the UTC boundary.
const dateFormatter = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  timeZone: "Europe/Prague",
});

// A "sides" row: every item is priced and weightless (fries, sauces, …). These
// print inline on one line instead of as a titled block. Heuristic only — no
// schema flag distinguishes them from a normal category.
function isInlineCategory(category: MenuCategory): boolean {
  return (
    category.items.length > 0 &&
    category.items.every((item) => item.price != null && !item.weight)
  );
}

// Soups print tightly packed; every other titled category gets generous
// spacing. Detected diacritic-insensitively from the title ("Polévky").
function isSoupCategory(category: MenuCategory): boolean {
  const normalized = category.title
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
  return normalized.includes("polev");
}

// Titles print with a trailing colon ("Polévky:"), tolerating one already set.
function withColon(title: string): string {
  return `${title.replace(/:\s*$/, "")}:`;
}

export default async function MenuTiskPage({
  searchParams,
}: {
  searchParams: Promise<{ print?: string }>;
}) {
  const [dailyMenu, params] = await Promise.all([getDailyMenu(), searchParams]);
  const autoPrint = params.print === "1";

  const dateLabel = dailyMenu
    ? dateFormatter.format(new Date(`${dailyMenu.date}T12:00:00Z`))
    : "";

  return (
    <div className={styles.page}>
      <div className={`${styles.controls} ${styles.noPrint}`}>
        <PrintButton autoPrint={autoPrint} />
      </div>

      <main className={styles.sheet}>
        {!dailyMenu ? (
          <p className={styles.empty}>Menu zatím nebylo zveřejněno.</p>
        ) : (
          <>
            <div className={styles.head}>
              <span className={styles.rname}>Restaurace u Maxe</span>
              <span className={styles.date}>{dateLabel}</span>
            </div>

            {dailyMenu.categories.map((category, ci) => {
              if (isInlineCategory(category)) {
                return (
                  <div key={ci} className={styles.sides}>
                    {category.items.map((item, ii) => (
                      <span key={ii}>
                        {item.name} {item.price},-
                      </span>
                    ))}
                  </div>
                );
              }

              const sectionClass = isSoupCategory(category)
                ? styles.soups
                : styles.mains;

              return (
                <section key={ci} className={sectionClass}>
                  <div className={styles.cat}>{withColon(category.title)}</div>
                  {category.items.map((item, ii) => (
                    <div key={ii} className={styles.dish}>
                      <span>
                        {item.weight ? `${item.weight} ` : ""}
                        {item.name}
                      </span>
                      {item.price != null && <span>{item.price},-</span>}
                    </div>
                  ))}
                </section>
              );
            })}

            {/* Footer block — a <div>, never <footer>, so the print rule that
                hides the site footer doesn't catch it. */}
            <div className={styles.foot}>
              {dailyMenu.menuPrice != null && (
                <div className={styles.big}>Menu á {dailyMenu.menuPrice},-Kč</div>
              )}
              {dailyMenu.halfPortionPrice != null && (
                <div className={styles.big}>
                  Poloviční porce á {dailyMenu.halfPortionPrice},-Kč
                </div>
              )}
              <div className={styles.alerg}>
                Alergeny je možné vyžádat u obsluhy
              </div>
              {dailyMenu.footerNote && (
                <div className={styles.note}>{dailyMenu.footerNote}</div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
