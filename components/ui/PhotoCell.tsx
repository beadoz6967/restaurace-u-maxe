"use client";

import { useId } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useReveal } from "@/lib/use-reveal";

interface PhotoCellProps {
  className?: string;
  /** Placeholder caption. Default "FOTO BUDE DOPLNĚNO". */
  label?: string;
  /** Reveal on scroll-into-view instead of on mount. */
  inView?: boolean;
  delay?: number;
  /** Real image source. When set, renders an optimized photo instead of the
      scratch placeholder. */
  src?: string;
  /** Czech alt text — required for accessibility when `src` is set. */
  alt?: string;
  /** Mark as LCP (eager-load). Use only for the hero photo. */
  priority?: boolean;
  /** next/image `sizes` hint. */
  sizes?: string;
  /** Real-photo polish — each independently toggleable (default on). */
  frame?: boolean;
  markers?: boolean;
  grain?: boolean;
  hover?: boolean;
}

const HIDDEN = { clipPath: "inset(0% 0% 100% 0%)" };
const SHOWN = { clipPath: "inset(0% 0% 0% 0%)" };

/** Monochrome grain (no mix-blend-mode — blend modes tank scroll FPS). */
const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E";

/**
 * Placeholder image cell, sized by its grid placement (className). When `src`
 * is set it renders an optimized photo with a restrained polish layer (hairline
 * frame, viewfinder corner markers, unifying grain/tint, desktop-only hover
 * reveal) so the mismatched phone shots read as one series. 0px edges, no shadow.
 *
 * The reveal is driven by the shared `useReveal` hook into state (not
 * `whileInView`), so it always resolves to visible: it self-heals if the
 * IntersectionObserver misses its initial callback while the cell is on-screen
 * (the gallery-stays-blank bug), never stuck at the hidden clip.
 */
export default function PhotoCell({
  className = "",
  label = "FOTO BUDE DOPLNĚNO",
  inView = false,
  delay = 0,
  src,
  alt = "",
  priority = false,
  sizes,
  frame = true,
  markers = true,
  grain = true,
  hover = true,
}: PhotoCellProps) {
  const { ref, show, reduce } = useReveal<HTMLDivElement>({ inView });
  const id = useId().replace(/:/g, "");

  // Desktop-only (@media hover:hover) rest-muted → hover-full + gentle zoom.
  // Scale is dropped under reduced motion; touch devices get the clean state.
  const hoverClasses = hover
    ? "transition duration-[400ms] ease-out [@media(hover:hover)]:brightness-[0.92] [@media(hover:hover)]:saturate-[0.9] [@media(hover:hover)]:group-hover:brightness-100 [@media(hover:hover)]:group-hover:saturate-100" +
      (reduce ? "" : " [@media(hover:hover)]:group-hover:scale-[1.02]")
    : "";

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : HIDDEN}
      animate={show ? SHOWN : HIDDEN}
      transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 0.61, 0.18, 1], delay }}
      className={`group relative overflow-hidden bg-[#2A1F15] ${className}`}
      aria-hidden={src ? undefined : true}
    >
      {src ? (
        <>
          {/* 1 — the photo */}
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes ?? "(max-width: 1024px) 100vw, 50vw"}
            className={`object-cover ${hoverClasses}`}
          />

          {/* 2 — grain + faint warm tint: unify the series, every device */}
          {grain && (
            <>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.1]"
                style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "180px 180px" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[#2A1F15]/10"
              />
            </>
          )}

          {/* 3 — hairline frame */}
          {frame && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 border border-beige/15"
            />
          )}

          {/* 3 — viewfinder corner brackets */}
          {markers && (
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <span className="absolute left-2 top-2 h-4 w-4 border-l border-t border-gold/40" />
              <span className="absolute right-2 top-2 h-4 w-4 border-r border-t border-gold/40" />
              <span className="absolute bottom-2 left-2 h-4 w-4 border-b border-l border-gold/40" />
              <span className="absolute bottom-2 right-2 h-4 w-4 border-b border-r border-gold/40" />
            </div>
          )}
        </>
      ) : (
        <PlaceholderArt id={id} label={label} />
      )}
    </motion.div>
  );
}

/** The scratched-metal placeholder shown until a real photo is wired in. */
function PlaceholderArt({ id, label }: { id: string; label: string }) {
  return (
    <>
      <svg
        className="absolute inset-0 h-full w-full opacity-20"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id={`scratch-${id}`}
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(35)"
          >
            <line x1="0" y1="0" x2="0" y2="40" stroke="#C8962A" strokeWidth="0.5" opacity="0.6" />
            <line x1="15" y1="0" x2="15" y2="40" stroke="#C8962A" strokeWidth="0.3" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#scratch-${id})`} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <span className="font-body text-[0.6rem] font-medium uppercase tracking-[0.35em] text-gold/30">
          {label}
        </span>
      </div>
    </>
  );
}
