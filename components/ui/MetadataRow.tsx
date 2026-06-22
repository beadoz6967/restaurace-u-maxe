import { Fragment } from "react";

interface MetadataRowProps {
  /** Uppercase label strings, e.g. ["EST. 2024", "ČESKÉ BUDĚJOVICE"]. */
  items: string[];
  /** Divider between labels. Default a gold middot. */
  separator?: "dot" | "rule";
  className?: string;
}

/**
 * The metadata row that replaces the hero subtitle/CTA block: a single
 * horizontal run of small Inter 500 uppercase labels, wide-tracked,
 * separated by a middot or a 1px vertical hairline.
 */
export default function MetadataRow({
  items,
  separator = "dot",
  className = "",
}: MetadataRowProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 font-body text-[0.7rem] font-medium uppercase tracking-[0.15em] text-beige/60 ${className}`}
    >
      {items.map((item, i) => (
        <Fragment key={item}>
          {i > 0 &&
            (separator === "rule" ? (
              <span aria-hidden className="h-3 w-px bg-beige/25" />
            ) : (
              <span aria-hidden className="text-gold/70">
                ·
              </span>
            ))}
          <span>{item}</span>
        </Fragment>
      ))}
    </div>
  );
}
