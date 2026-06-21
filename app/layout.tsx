import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Big_Shoulders_Display,
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

const bigShoulders = Big_Shoulders_Display({
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
  title: "Restaurace U Maxe, České Budějovice",
  description:
    "Restaurace U Maxe v Českých Budějovicích. Jídlo s sebou i na místě, nonstop.",
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
      style={{ colorScheme: "dark" }}
      className={`${cormorant.variable} ${bigShoulders.variable} ${inter.variable}`}
    >
      <body className="bg-bg-primary font-body text-beige antialiased">
        <a
          href="#obsah"
          className="sr-only font-tactical uppercase tracking-widest focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:text-bg-primary"
        >
          Přeskočit na obsah
        </a>
        <NavBar />
        <div id="obsah">{children}</div>
      </body>
    </html>
  );
}
