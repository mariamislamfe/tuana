/** Re-mounts on every navigation, giving each storefront page a soft entrance. */
export default function StorefrontTemplate({ children }: { children: React.ReactNode }) {
  return <div className="anim-page">{children}</div>;
}
