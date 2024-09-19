import Link from "next/link";
import Icon from "./Icon";
import "./ButtonNav.sass";

export interface Href {
  external?: boolean;
  href: string;
  icon: string;
  text: string;
}

export default function ButtonNav({
  stacked,
  hrefs,
}: {
  stacked?: boolean;
  hrefs: Href[];
}) {
  return (
    <nav
      className={`ButtonNav ${
        stacked ? "ButtonNav--stacked" : "ButtonNav--bar"
      }`}
    >
      {hrefs.map((h: Href) => {
        return h.external ? (
          <a
            href={h.href}
            target="_blank"
            rel="noopener noreferrer"
            key={h.text}
          >
            <Icon name={h.icon} />
            {h.text}
          </a>
        ) : (
          <Link href={h.href} key={h.text}>
            <Icon name={h.icon} />
            {h.text}
          </Link>
        );
      })}
    </nav>
  );
}
