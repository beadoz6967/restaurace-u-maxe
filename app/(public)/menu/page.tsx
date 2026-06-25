import type { Metadata } from "next";
import { getDailyMenu } from "@/lib/queries";
import { formatDate } from "@/lib/format";
import MenuView from "./MenuView";

// Re-fetch the menu from Sanity at most once a minute so edits in Studio
// surface without a redeploy.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Denní menu",
  description:
    "Dnešní polední menu Restaurace U Maxe — polévky, hlavní jídla a dezerty. Každý den čerstvě připraveno.",
  alternates: { canonical: "/menu" },
};

export default async function Menu() {
  const dailyMenu = await getDailyMenu();

  // Format on the server (restaurant/build timezone) and pass a string so the
  // client render can't drift and cause a hydration mismatch. Parsing as local
  // midnight avoids the UTC-shift you'd get from `new Date("2026-06-25")`.
  const dateLabel = dailyMenu
    ? formatDate(new Date(`${dailyMenu.date}T00:00:00`))
    : "";

  return <MenuView dailyMenu={dailyMenu} dateLabel={dateLabel} />;
}
