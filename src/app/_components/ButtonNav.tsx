import Link from "next/link";
import Icon from "./Icon";
import styles from "./ButtonNav.module.sass";

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
  readonly stacked?: boolean;
  readonly hrefs: Href[];
}) {
  return (
    <nav className={`${styles.root} ${stacked ? styles.stacked : styles.bar}`}>
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
