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
        <span className="util-color--muted">
          {leagueName.substring(0, 25)}&hellip;
        </span>
      )}
    </p>
  );
}
