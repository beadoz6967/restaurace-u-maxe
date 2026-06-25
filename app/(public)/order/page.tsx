import type { Metadata } from "next";
import { getDailyMenu } from "@/lib/queries";
import OrderForm, { type OrderItem } from "./OrderForm";

// Re-fetch the menu from Sanity at most once a minute so edits in Studio
// surface without a redeploy.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Objednávka s sebou",
  description:
    "Objednejte si oběd s sebou z Restaurace U Maxe online. Objednávky přijímáme do 10:00, vyzvednutí v poledne.",
  alternates: { canonical: "/order" },
};

export default async function Order() {
  const dailyMenu = await getDailyMenu();
  const menuPrice = dailyMenu?.menuPrice;

  // Resolve each item's price (own price, else the shared menu price) and drop
  // anything still without a price — e.g. soups on a menu-price-free day.
  const items: OrderItem[] = (dailyMenu?.categories ?? [])
    .flatMap((category) => category.items)
    .flatMap((item, index) => {
      const price = item.price ?? menuPrice;
      return price === undefined
        ? []
        : [{ id: String(index), name: item.name, price }];
    });

  return <OrderForm items={items} />;
}
