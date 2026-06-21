// Shared TypeScript types.

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
}

export interface MenuCategory {
  title: string;
  allergens?: string;
  items: MenuItem[];
}
