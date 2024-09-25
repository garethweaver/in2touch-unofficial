import Link from "next/link";
import Icon from "@/app/_components/Icon";
import Location from "./Location";
import type { Fixture } from "../types";
import "./Fixture.sass";

function getResultClassName(arr: string[]) {
  if (parseInt(arr[0]) > parseInt(arr[1])) {
    return "Color--success";
  } else if (parseInt(arr[0]) < parseInt(arr[1])) {
    return "Color--danger";
  } else {
    return "Color--warning";
  }
}

function getResult(result: string) {
  let r;
  if (result.length === 0) {
    r = <span className="Color--muted">No result yet</span>;
  } else {
    r = (
      <span className={getResultClassName(result.split(" - "))}>{result}</span>
    );
  }
  return r;
}

export default function Fixture({
  data,
  isPast,
}: {
  readonly data: Fixture;
  readonly isPast: boolean;
}) {
  return (
    <Link className="Fixture" href={`/teams/${data.vsId}`} prefetch>
      {isPast && <h6 className="Heading__sm">Result:</h6>}
      <div className="Flex__bar">
        {isPast ? (
          <p className="Fixture--strong">{getResult(data.result)}</p>
        ) : (
          <p className="Fixture__time Fixture--strong">{data.time}</p>
        )}
        <div className="Fixture__team-link">
          <strong>{data.vs}</strong>
          <Icon name="arrow-right" />
        </div>
      </div>
      <p>{data.day}</p>
      {data.grading && (
        <p>
          <em className="Color--muted">
            <Icon
              name="shuffle"
              size="small"
              className="Fixture__grading-icon"
            />
            Grading game
          </em>
        </p>
      )}
      {!isPast && <Location pitch={data.pitch} leagueName={data.leagueName} />}
    </Link>
  );
}
