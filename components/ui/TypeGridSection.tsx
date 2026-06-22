import type { ReactNode } from "react";

interface TypeGridSectionProps {
  children: ReactNode;
  className?: string;
  /** Draw a 1px hairline rule along the top edge. */
  topRule?: boolean;
  id?: string;
}

/**
 * Structured 12-column grid wrapper that pairs oversized type with photo
 * cells. Children claim intentional column spans (col-start / col-span) so
 * words and photos can sit adjacent to or overlap one another. No centered
 * single-column stacks. Optional top hairline for tactile section breaks.
 */
export default function TypeGridSection({
  children,
  className = "",
  topRule = false,
  id,
}: TypeGridSectionProps) {
  return (
    <section
      id={id}
      className={`${topRule ? "border-t border-surface" : ""} ${className}`}
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 items-start gap-x-4 px-6 md:px-10">
        {children}
      </div>
    </section>
  );
}
