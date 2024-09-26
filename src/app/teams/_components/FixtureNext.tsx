import { Fixture } from "../types";
import Location from "./Location";
import styles from "./FixtureNext.module.sass";

function getAllNextOnSameDay(fixtures: Fixture[]): Fixture[] {
  let next: Fixture[] = [];
  const nextIdx = fixtures.findIndex((f) => f.timestamp > Date.now());
  if (nextIdx > -1) {
    next = fixtures.filter((f) => {
      return (
        new Date(f.timestamp).toDateString() ===
        new Date(fixtures[nextIdx].timestamp).toDateString()
      );
    });
  }
  return next;
}

function NextGame({ next }: { next: Fixture }) {
  return (
    <div className={styles.game}>
      <div className="util-flex__bar">
        <p className={styles.time}>{next.time}</p>
        <p className={styles.vs}>{next.vs}</p>
      </div>
      <p className={styles.day}>{next.day}</p>
      <Location pitch={next.pitch} leagueName={next.leagueName} />
    </div>
  );
}

export default function FixtureNext({
  fixtures,
}: {
  readonly fixtures: Fixture[];
}) {
  const next = getAllNextOnSameDay(fixtures);
  return (
    <div className={styles.root}>
      {next.length === 0 ? (
        <em className="util-color--muted util-text--small">
          No scheduled fixtures
        </em>
      ) : (
        <>
          <h6 className="util-heading--sm">
            {next.length > 1 ? next.length : ""} Next:
          </h6>
          {next.map((n, idx) => (
            <NextGame key={idx} next={n} />
          ))}
        </>
      )}
    </div>
  );
}
