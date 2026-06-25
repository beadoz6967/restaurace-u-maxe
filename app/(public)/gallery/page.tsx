import type { Metadata } from "next";
import GalleryView from "./GalleryView";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Fotografie interiéru a jídel Restaurace U Maxe v Jindřichově Hradci.",
  alternates: { canonical: "/gallery" },
};

export default function Gallery() {
  return <GalleryView />;
}
