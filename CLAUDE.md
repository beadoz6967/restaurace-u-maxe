# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run Next.js linter
```

Setup: `cp .env.local.example .env.local && npm install`

## Architecture

Mad Max-themed Czech restaurant website with online ordering and a kitchen display system. **Status: Step 1 scaffold** — pages and components are intentionally empty skeletons.

**Stack:** Next.js 14 App Router · TypeScript (strict) · Tailwind CSS · Framer Motion · Sanity.io (CMS) · Supabase (PostgreSQL + Realtime)

### Route Groups

- `app/(public)/` — customer-facing pages: homepage, `/menu`, `/order`, `/gallery`, `/contact`
- `app/(kitchen)/kitchen/` — PIN-protected kitchen display system (`KITCHEN_PIN` env var)
- `app/api/orders/` — POST endpoint for order intake

### External Service Clients

Both clients in `lib/` are initialized but empty (credentials stubbed out):

- `lib/supabase.ts` — needs `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `lib/sanity.ts` — needs `NEXT_PUBLIC_SANITY_PROJECT_ID` + `NEXT_PUBLIC_SANITY_DATASET`; API version pinned to `2024-01-01`, `useCdn: true`

Sanity project ID is `rg3vifbx`, dataset is `production` (from `.env.local.example`).

### Design System

Defined in `tailwind.config.ts` and enforced globally:

| Token | Value | Use |
|-------|-------|-----|
| `bg-primary` | `#17130f` | Page background (near-black) |
| `gold` | `#C8962A` | Accent color |
| `rust` | `#B84C1E` | Hover/highlight |
| `beige` | `#E8D5B5` | Body text |
| `cream` | `#F5ECD7` | Light text |
| `font-display` | Cormorant Garamond | Headings (`--font-cormorant`) |
| `font-body` | Inter | Body text (`--font-inter`) |

**All border radii are 0px** — sharp, industrial look. Never use `rounded-*` classes.

### Component Organization

```
components/
├── ui/       # Shared primitives (buttons, cards, etc.)
├── menu/     # Menu display components
├── order/    # Ordering flow components
└── kitchen/  # Kitchen display components
```

All currently empty. New components go in the appropriate subdirectory.

### Shared Types

`types/index.ts` is the single location for shared TypeScript types (currently empty placeholder).

### Path Aliases

`@/*` maps to the project root. Use `@/lib/supabase`, `@/components/ui/...`, etc.

Food photos in public/images are placeholder/showcase content — replaced with real client photos post-sale; treat as final for layout