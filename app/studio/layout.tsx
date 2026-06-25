/**
 * The embedded Studio fills the viewport above the public chrome (the global
 * fixed NavBar lives at z-50), so it gets its own full-screen layer.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="fixed inset-0 z-[100] bg-white">{children}</div>
}
