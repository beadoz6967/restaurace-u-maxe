interface SectionLabelProps {
  label: string;
  /** Optional right-aligned text, e.g. a date stamp. */
  meta?: string;
  className?: string;
}

/**
 * Renders the "DNEŠNÍ RACIÓN ─────────── [meta]" tactical row.
 * Label in Big Shoulders Display gold, a stretched gold-muted rule,
 * optional monospace meta on the right.
 */
export default function SectionLabel({
  label,
  meta,
  className = "",
}: SectionLabelProps) {
  return (
    <div className={`flex items-baseline gap-5 ${className}`}>
      <span className="shrink-0 font-tactical text-sm font-extrabold uppercase tracking-[0.25em] text-gold md:text-base">
        {label}
      </span>
      <span className="h-px flex-1 translate-y-[-3px] bg-[#C8962A22]" />
      {meta && (
        <span className="shrink-0 font-body text-xs tabular-nums tracking-wide text-beige/50">
          {meta}
        </span>
      )}
    </div>
  );
}
