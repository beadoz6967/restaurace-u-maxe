# Spacing System — single source of truth

Every margin, padding, and gap on the public site comes from this document.
If a value isn't here, it doesn't go in the markup. No arbitrary `[..px]`
spacing values, and no off-scale Tailwind tokens (`mt-3`, `py-5`, `gap-10`,
`space-y-1.5`, …). Sizing (`max-w-*`, `aspect-*`, icon `h-/w-`) and transforms
(`translate-*`) are not spacing and are governed by layout, not this scale.

## 1. The scale (the ONLY allowed spacing tokens)

Use only these Tailwind step numbers for `m* / p* / gap* / space-*`:

| token | px  |
|-------|-----|
| `1`   | 4   |
| `2`   | 8   |
| `4`   | 16  |
| `6`   | 24  |
| `8`   | 32  |
| `12`  | 48  |
| `16`  | 64  |
| `24`  | 96  |
| `32`  | 128 |
| `40`  | 160 |

## 2. Proximity tiers (relationship decides the value, never the eye)

- **Tier 1 — tight pair** (eyebrow ↔ display word, label ↔ its value,
  price-label ↔ price): `2`–`4` (8–16px).
- **Tier 2 — related elements in one block** (display ↔ subhead ↔ body):
  `4`–`6` (16–24px).
- **Tier 3 — between distinct blocks in the same section**: `12`–`16`
  (48–64px).
- **Tier 4 — between major page sections**: section padding (§4), never an
  ad-hoc margin.

## 3. Container + horizontal rhythm

Every page's content lives in one container:

```
mx-auto max-w-[1440px] px-6 md:px-10
```

`px-6` (24px) mobile, `px-10` (40px) desktop — site-wide, no page overrides.
The navbar and footer inner rows use the same container so their edges line up
with page content. Narrow reading columns (menu list, order form) keep their
own `max-w-*` **measure** *inside* this container — that's content sizing, not a
second page container.

## 4. Section vertical rhythm

Every full-width section uses one constant:

```
py-16 md:py-24
```

(64px mobile / 96px desktop). The homepage hero is `min-h-svh` and centers its
content with this same padding, bleeding under the transparent navbar.

**Navbar clearance:** content pages (everything except the hero) start at the
very top under the fixed navbar, so their top padding steps up one tier to
clear it — `pt-24 md:pt-32` — while the bottom keeps the standard
`pb-16 md:pb-24`.

## 5. Column alignment

- All multi-column grids use `items-start`. Columns share a top baseline.
  Never `items-center` (or rely on `stretch`) to float a short column against a
  tall one.
- Photo / media cells use `aspect-[..]` (e.g. `aspect-[4/3]`, `aspect-square`),
  never a fixed pixel height that floats free of its text neighbour. If a photo
  is taller than its text column, the text stays top-aligned — it is never
  centered to fill.

## 6. No orphaned elements

Every element sits in a flow container. Bottom-anchored rows (price, total,
CTA, hours) live in the same flex/grid flow as the content above them,
separated by exactly one Tier-3 gap — never floated to a section's bottom edge
with dead space above.
