import Fixture from "./Fixture";
import type { Fixture as FixtureType } from "../types";

function getFixtures(fixtures: FixtureType[], isPast?: boolean) {
  return fixtures.map((fixture, i) => {
    return (
      <li key={i} className="Card">
        <Fixture data={fixture} isPast={!!isPast} />
      </li>
    );
  });
}

export default function FixtureList({ fixtures }: { fixtures: FixtureType[] }) {
  const future = fixtures.filter((f) => f.timestamp > Date.now());
  const past = fixtures.filter((f) => f.timestamp <= Date.now());
  return (
    <div>
      {past.length > 0 && (
        <div className="Margin--t">
          <h2 className="Flex__icon">
            <span className="material-icons">check_circle_outline</span>
            Past Fixtures
          </h2>
          <ol>{getFixtures(past, true)}</ol>
        </div>
      )}
      {future.length > 0 && (
        <div className="Margin--t">
          <h2 className="Flex__icon">
            <span className="material-icons">schedule</span>
            Upcoming Fixtures
          </h2>
          <ol>{getFixtures(future)}</ol>
        </div>
      )}
      {future.length === 0 && past.length === 0 && (
        <div className="Margin--t">
          <em className="Color--muted">No fixture data</em>
        </div>
      )}
    </div>
  );
}
