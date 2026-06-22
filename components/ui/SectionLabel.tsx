interface SectionLabelProps {
  label: string;
  /** Optional right-aligned text, e.g. a date stamp. */
  meta?: string;
  className?: string;
  /** Heading element for the label. Default "span"; pass "h1"/"h2" when this
      label is the page/section heading so the document keeps a real outline. */
  as?: "h1" | "h2" | "span";
}

/**
 * Renders the "JÍDELNÍ LÍSTEK ─────────── [meta]" section-label row.
 * Label in Big Shoulders Display gold, a stretched gold-muted rule,
 * optional monospace meta on the right.
 */
export default function SectionLabel({
  label,
  meta,
  className = "",
  as: Tag = "span",
}: SectionLabelProps) {
  return (
    <div className={`flex items-baseline gap-4 ${className}`}>
      <Tag className="shrink-0 font-tactical text-sm font-extrabold uppercase tracking-[0.25em] text-gold md:text-base">
        {label}
      </Tag>
      <span aria-hidden className="h-px flex-1 translate-y-[-3px] bg-[#C8962A22]" />
      {meta && (
        <span className="shrink-0 font-body text-xs tabular-nums tracking-wide text-beige/50">
          {meta}
        </span>
      )}
    </div>
  );
}
