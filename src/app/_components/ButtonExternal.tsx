export default function ButtonExternal({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      className="Btn__flex"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span className="material-icons">call_made</span>
    </a>
  );
}
