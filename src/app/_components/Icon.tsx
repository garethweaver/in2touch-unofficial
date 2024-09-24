import FeatherIcon from "feather-icons-react";

export default function Icon({
  name,
  className,
  size,
}: {
  name: string;
  className?: string;
  size?: "large";
}) {
  return (
    <FeatherIcon
      icon={name}
      size={size === "large" ? 26 : 16}
      strokeWidth={size === "large" ? 2 : 3}
      className={className}
    />
  );
}
