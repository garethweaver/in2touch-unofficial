import Icon from "./Icon";
import styles from "./Button.module.sass";

export default function Button({
  onClick,
  icon,
  faux,
  selected,
  children,
}: {
  readonly onClick?: () => void;
  readonly icon?: string;
  readonly faux?: boolean;
  readonly selected?: boolean;
  readonly children: React.ReactNode;
}) {
  const className =
    `${styles.root} ${faux ? styles.faux : ""} ${selected ? styles.selected : ""}`.trim();

  return faux ? (
    <div className={className}>
      {children}
      {icon && <Icon name={icon} />}
    </div>
  ) : (
    <button className={className} onClick={onClick}>
      {children}
      {icon && <Icon name={icon} />}
    </button>
  );
}
