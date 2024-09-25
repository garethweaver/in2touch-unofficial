import Icon from "./Icon";
import "./Button.sass";

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
    <div className="Button Button--faux">
      {children}
      {icon && <Icon name={icon} />}
    </div>
  ) : (
    <button className="Button" onClick={onClick}>
      {children}
      {icon && <Icon name={icon} />}
    </button>
  );
}
