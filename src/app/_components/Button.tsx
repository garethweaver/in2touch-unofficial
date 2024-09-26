import Icon from "./Icon";
import styles from "./Button.module.sass";

export default function Button({
  onClick,
  icon,
  faux,
  children,
}: {
  readonly onClick?: () => void;
  readonly icon?: string;
  readonly faux?: boolean;
  readonly children: React.ReactNode;
}) {
  return faux ? (
    <div className={`${styles.root} ${styles.faux}`}>
      {children}
      {icon && <Icon name={icon} />}
    </div>
  ) : (
    <button className={styles.root} onClick={onClick}>
      {children}
      {icon && <Icon name={icon} />}
    </button>
  );
}
