import { groq } from 'next-sanity'
import type { SanityImageSource } from '@sanity/image-url'
import { sanity, urlFor } from '@/lib/sanity'
import type { DailyMenu } from '@/types'

/** Raw image shape returned by GROQ — carries the asset ref for `urlFor`. */
type RawImage = SanityImageSource & {
  alt?: string
  description?: string
  asset?: { _ref?: string }
}

interface RawItem {
  name: string
  weight?: string
  price?: number
  image?: RawImage
}

interface RawCategory {
  title: string
  allergens?: string
  items?: RawItem[]
}

interface RawDailyMenu {
  date: string
  menuPrice?: number
  halfPortionPrice?: number
  footerNote?: string
  categories?: RawCategory[]
}

const dailyMenuQuery = groq`*[_type == "dailyMenu"] | order(date desc) [0] {
  date,
  menuPrice,
  halfPortionPrice,
  footerNote,
  categories[] {
    title,
    allergens,
    items[] {
      name,
      weight,
      price,
      image {
        alt,
        description,
        asset
      }
    }
  }
}`

/**
 * Fetch the most recent daily menu with its nested categories and items.
 * Image URLs are built through the `urlFor` helper. Returns `null` when no
 * daily menu has been published yet.
 */
export async function getDailyMenu(): Promise<DailyMenu | null> {
  const raw = await sanity.fetch<RawDailyMenu | null>(dailyMenuQuery)
  if (!raw) return null

  return {
    date: raw.date,
    menuPrice: raw.menuPrice,
    halfPortionPrice: raw.halfPortionPrice,
    footerNote: raw.footerNote,
    categories: (raw.categories ?? []).map((category) => ({
      title: category.title,
      allergens: category.allergens,
      items: (category.items ?? []).map((item) => ({
        name: item.name,
        weight: item.weight,
        price: item.price,
        image: item.image?.asset?._ref
          ? {
              url: urlFor(item.image).width(800).fit('max').url(),
              alt: item.image.alt ?? '',
              description: item.image.description ?? '',
            }
          : undefined,
      })),
    })),
  }
}
