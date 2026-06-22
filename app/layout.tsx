import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Big_Shoulders,
  Inter,
} from "next/font/google";
import "./globals.css";
import NavBar from "@/components/ui/NavBar";

const cormorant = Cormorant_Garamond({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-cormorant",
});

const bigShoulders = Big_Shoulders({
  weight: ["500", "700", "800"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-big-shoulders",
});

const inter = Inter({
  weight: ["400", "500"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Restaurace U Maxe, Jindřichův Hradec",
  description:
    "Restaurace U Maxe v Jindřichově Hradci. Polední menu a obědy s sebou, objednávky online do 10:00. Otevřeno Po–Pá 10:00–13:30.",
};

export const viewport: Viewport = {
  themeColor: "#17130f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      suppressHydrationWarning
      style={{ colorScheme: "dark" }}
      className={`${cormorant.variable} ${bigShoulders.variable} ${inter.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-bg-primary font-body text-beige antialiased"
      >
        <a
          href="#obsah"
          className="sr-only font-tactical uppercase tracking-widest focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:text-bg-primary"
        >
          Přeskočit na obsah
        </a>
        <NavBar />
        <div id="obsah" tabIndex={-1} className="scroll-mt-24 focus:outline-none">
          {children}
        </div>
      </body>
    </html>
  );
}
