// Pre-build both add pages so they're static (and cacheable offline).
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: "teams" }, { slug: "leagues" }];
}

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return children;
}
