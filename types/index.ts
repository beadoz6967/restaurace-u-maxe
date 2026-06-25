// Shared TypeScript types.

export interface MenuItemImage {
  url: string;
  alt: string;
  description: string;
}

export interface MenuItem {
  name: string;
  /** Optional weight prefix, e.g. "140 g". */
  weight?: string;
  /** Individual price; when absent the item uses the daily menu's menuPrice. */
  price?: number;
  image?: MenuItemImage;
}

export interface MenuCategory {
  title: string;
  allergens?: string;
  items: MenuItem[];
}

export interface DailyMenu {
  /** ISO date string, e.g. "2026-06-25". */
  date: string;
  /** Shared price for main dishes without an individual price. */
  menuPrice?: number;
  halfPortionPrice?: number;
  footerNote?: string;
  categories: MenuCategory[];
}
