import type { Metadata } from "next";
import ContactView from "./ContactView";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Adresa, otevírací doba a kontakt na Restauraci U Maxe. Denisova 20/II, Jindřichův Hradec. Tel: +420 728 814 736.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return <ContactView />;
}
