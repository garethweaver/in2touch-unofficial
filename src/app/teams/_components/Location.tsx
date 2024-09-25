export default function Location({
  pitch,
  leagueName,
}: {
  readonly pitch: string;
  readonly leagueName: string;
}) {
  return (
    <p>
      {pitch && pitch}
      {pitch && leagueName && " - "}
      {leagueName && (
        <span className="Color--muted">
          {leagueName.substring(0, 20)}&hellip;
        </span>
      )}
    </p>
  );
}
