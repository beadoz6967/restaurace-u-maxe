import Footer from "@/components/ui/Footer";
import SmoothScroll from "@/components/ui/SmoothScroll";

/**
 * Layout for customer-facing pages — appends the shared footer beneath each
 * public page and enables Lenis smooth scroll. Scoped to the (public) route
 * group so neither the footer nor the smooth scroll ever reach the kitchen
 * display (which must stay on native instant scroll).
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      {children}
      <Footer />
    </SmoothScroll>
  );
}
