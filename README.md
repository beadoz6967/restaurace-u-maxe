# Restaurace U Maxe

A restaurant website with online ordering and a live kitchen display, carrying
a subtle Mad Max–inspired visual design. Near-black backdrop, desert-gold
accents, rust hovers, zero rounded corners — an industrial, weathered look in
service of a professional restaurant brand.

## Stack

| Concern        | Technology                                  |
| -------------- | ------------------------------------------- |
| Framework      | Next.js 14 (App Router) + TypeScript        |
| Styling        | Tailwind CSS (custom design tokens)         |
| Animation      | Framer Motion                               |
| CMS            | Sanity.io (`@sanity/client`, `next-sanity`) |
| Database / RT  | Supabase (Postgres + Realtime)              |
| Deployment     | Vercel                                      |

### Design tokens

Defined in both `tailwind.config.ts` (utility classes) and `app/globals.css`
(CSS custom properties):

| Token         | Value     | Use                       |
| ------------- | --------- | ------------------------- |
| `bg-primary`  | `#17130f` | Near-black page backdrop  |
| `gold`        | `#C8962A` | Desert-gold accent        |
| `rust`        | `#B84C1E` | Rust hover / highlight    |
| `beige`       | `#E8D5B5` | Default body text         |
| `cream`       | `#F5ECD7` | Light contrast text       |

Fonts: **Cormorant Garamond** (`font-display`) and **Inter** (`font-body`),
loaded via `next/font/google` and exposed as `--font-cormorant` / `--font-inter`.
Border radius is forced to `0px` everywhere.

## Getting started

```bash
cp .env.local.example .env.local   # then fill in real values
npm install
npm run dev                        # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`.

## Folder structure

```
app/
  (public)/        Public-facing routes (route group, no URL segment)
    page.tsx       Homepage
    menu/          Daily menu
    order/         Online ordering flow
    gallery/       Photo gallery
    contact/       Map + contact details
  (kitchen)/
    kitchen/       Kitchen display system (PIN-gated)
  api/
    orders/        Order intake route handler
  layout.tsx       Root layout + Google Fonts
  globals.css      CSS custom properties + body defaults
components/
  ui/              Shared UI primitives
  menu/            Menu-specific components
  order/           Order-flow components
  kitchen/         Kitchen-display components
lib/
  supabase.ts      Supabase client
  sanity.ts        Sanity client
sanity/
  schemas/         Sanity content schemas
types/
  index.ts         Shared TypeScript types
public/images/     Static image assets
```

## Environment variables

Copy `.env.local.example` to `.env.local` and supply real values. Keys prefixed
with `NEXT_PUBLIC_` are exposed to the browser; all others are server-only.

| Variable                              | Purpose                                |
| ------------------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`            | Supabase project URL                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`       | Supabase anon/public key               |
| `SUPABASE_SERVICE_ROLE_KEY`           | Supabase service role (server only)    |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`       | Sanity project ID                      |
| `NEXT_PUBLIC_SANITY_DATASET`          | Sanity dataset (e.g. `production`)     |
| `SANITY_API_TOKEN`                    | Sanity write token (server only)       |
| `KITCHEN_PIN`                         | PIN protecting the `/kitchen` route    |

---

This is **Step 1** (scaffolding) of a multi-phase build. Pages, components, and
integrations are intentionally empty skeletons — implementation follows in later
steps.
