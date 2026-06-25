import type { Metadata } from "next";
import { getDailyMenu } from "@/lib/queries";
import { isBeforeOrderCutoff } from "@/lib/time";
import OrderForm, { type OrderItem } from "./OrderForm";

// Rendered dynamically so the 10:00 cutoff and the latest Studio edits are
// evaluated per request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Objednávka s sebou",
  description:
    "Objednejte si oběd s sebou z Restaurace U Maxe. Objednávky přijímáme do 10:00, vyzvednutí v poledne. Platba v hotovosti při převzetí.",
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
      return price == null
        ? []
        : [{ id: String(index), name: item.name, price, weight: item.weight }];
    });

  return <OrderForm items={items} isOpen={isBeforeOrderCutoff()} />;
}
