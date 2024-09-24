import FeatherIcon from "feather-icons-react";

const sizes = {
  large: [26, 2],
  medium: [16, 3],
  small: [12, 3],
};
export default function Icon({
  name,
  className,
  size = "medium",
}: {
  name: string;
  className?: string;
  size?: "large" | "medium" | "small";
}) {
  return (
    <FeatherIcon
      icon={name}
      size={sizes[size][0]}
      strokeWidth={sizes[size][1]}
      className={className}
    />
  );
}
