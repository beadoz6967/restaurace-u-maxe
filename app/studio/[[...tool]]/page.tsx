import type { Metadata, Viewport } from "next";
import StudioClient from "./StudioClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Restaurace U Maxe — Studio",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function StudioPage() {
  return <StudioClient />;
}
