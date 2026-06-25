import type { Metadata } from "next";
import HomeView from "./HomeView";

export const metadata: Metadata = {
  title: "Restaurace U Maxe · Poctivá česká kuchyně · Jindřichův Hradec",
  description:
    "Restaurace U Maxe v Jindřichově Hradci. Poctivá česká kuchyně, polední menu a obědy s sebou. Objednávky online do 10:00. Otevřeno Po–Pá 10:00–13:30.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomeView />;
}
