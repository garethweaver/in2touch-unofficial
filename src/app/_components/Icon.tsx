import FeatherIcon from "feather-icons-react";

export default function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <FeatherIcon icon={name} size="16" strokeWidth="3" className={className} />
  );
}
