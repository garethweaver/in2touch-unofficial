import "./Loader.sass";

export default function Loader({ className }: { className?: string }) {
  return (
    <div className={`Loader ${className ? `Loader--${className}` : ""}`}>
      <div className="Loader__inner" />
    </div>
  );
}
