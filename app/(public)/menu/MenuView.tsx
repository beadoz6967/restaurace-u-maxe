"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import PhotoCell from "@/components/ui/PhotoCell";
import { formatKc } from "@/lib/format";
import type { DailyMenu, MenuItem } from "@/types";

export default function MenuView({
  dailyMenu,
  dateLabel,
}: {
  dailyMenu: DailyMenu | null;
  dateLabel: string;
}) {
  const reduce = useReducedMotion();

  const categories = dailyMenu?.categories ?? [];

  // Footer with the shared prices renders only when at least one price is set.
  const { menuPrice, halfPortionPrice, footerNote } = dailyMenu ?? {};
  const showFooter = menuPrice != null || halfPortionPrice != null;
  const priceParts: string[] = [];
  if (menuPrice != null) priceParts.push(`Menu á ${menuPrice},- Kč`);
  if (halfPortionPrice != null)
    priceParts.push(`Poloviční porce á ${halfPortionPrice},- Kč`);

  return (
    <main className="mx-auto max-w-[1440px] px-6 pb-16 pt-24 md:px-10 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-[1100px]">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionLabel label="Jídelní lístek" meta={dateLabel} as="h1" />
        </motion.div>

        <div className="mt-16 flex flex-col gap-16">
        {categories.map((category, ci) => (
          <div key={ci}>
            <h2 className="font-tactical text-sm font-bold uppercase tracking-[0.35em] text-rust">
              {category.title}
            </h2>

            <div className="mt-6 flex flex-col gap-1">
              {category.items.map((item, ii) => {
                const image = item.image;

                // Dishes we have a photo of render as a small 4:5 cell beside
                // the name + a short description, top-aligned with the type.
                if (image) {
                  return (
                    <div key={ii} className="flex flex-col gap-4 py-4">
                      {/* Name + price row — flush-left, identical to the
                          photo-less rows so every dish name shares one baseline. */}
                      <div className="flex items-baseline gap-4">
                        <ItemName item={item} />
                        {item.price != null && (
                          <>
                            <span className="h-px flex-1 translate-y-[-2px] border-b border-dashed border-[#C8962A33]" />
                            <span className="shrink-0 font-body tabular-nums text-gold">
                              {formatKc(item.price)}
                            </span>
                          </>
                        )}
                      </div>
                      {/* Photo + description sit below the name, out of its
                          horizontal flow. */}
                      <div className="flex items-start gap-6">
                        <PhotoCell
                          src={image.url}
                          alt={image.alt || item.name}
                          sizes="(max-width: 768px) 35vw, 160px"
                          className="aspect-[4/5] w-32 shrink-0 md:w-40"
                        />
                        <p className="max-w-md font-body text-sm text-beige/50">
                          {image.description}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <motion.div
                    key={ii}
                    initial={false}
                    whileHover={reduce ? undefined : { x: 6 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="group flex items-baseline gap-4 py-2"
                  >
                    <ItemName item={item} hover />
                    {item.price != null && (
                      <>
                        <span className="h-px flex-1 translate-y-[-2px] border-b border-dashed border-[#C8962A33] transition-colors duration-200 group-hover:border-gold" />
                        <span className="shrink-0 font-body tabular-nums text-gold">
                          {formatKc(item.price)}
                        </span>
                      </>
                    )}
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

        {showFooter && (
          <div className="mt-16 text-center">
            {footerNote && (
              <p className="font-display text-2xl italic text-beige/60">
                {footerNote}
              </p>
            )}
            <p className="mt-4 font-body text-sm text-beige/40">
              {priceParts.join(" / ")}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

/** Dish name with an optional muted weight prefix on the same baseline. */
function ItemName({ item, hover = false }: { item: MenuItem; hover?: boolean }) {
  return (
    <span
      className={`font-body font-medium text-beige${
        hover ? " transition-colors duration-200 group-hover:text-cream" : ""
      }`}
    >
      {item.weight && (
        <span className="font-normal text-beige/40">{item.weight} </span>
      )}
      {item.name}
    </span>
  );
}
