import { Fixture } from "../types";
import Location from "./Location";

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
    <div className="NextFixture__game">
      <div className="Flex__bar">
        <p className="NextFixture__time">{next.time}</p>
        <p className="NextFixture__vs">
          <strong>{next.vs}</strong>
        </p>
      </div>
      <p className="NextFixture__day">{next.day}</p>
      <Location pitch={next.pitch} leagueName={next.leagueName} />
    </div>
  );
}

export default function NextFixture({ fixtures }: { fixtures: Fixture[] }) {
  const next = getAllNextOnSameDay(fixtures);
  return (
    <div className="NextFixture">
      {next.length === 0 ? (
        <em className="Color--muted Text--small">No scheduled fixtures</em>
      ) : (
        <>
          <h6 className="Heading__sm">
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
