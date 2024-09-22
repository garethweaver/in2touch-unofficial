import Link from "next/link";
import Location from "./Location";
import type { Fixture } from "../types";

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
  data: Fixture;
  isPast: boolean;
}) {
  return (
    <div className="Fixture">
      {isPast && <h6 className="Heading__sm">Result:</h6>}
      <div className="Flex__bar">
        {isPast ? (
          <p className="Fixture--strong">{getResult(data.result)}</p>
        ) : (
          <p className="Fixture__time Fixture--strong">{data.time}</p>
        )}
        <Link href={`/teams/${data.vsId}`}>
          <strong>{data.vs}</strong>
          <span className="Fixture__link-icon material-icons">
            arrow_forward
          </span>
        </Link>
      </div>
      <p>{data.day}</p>
      {data.grading && (
        <p>
          <em className="Color--muted">
            <span className="Fixture__grading-icon material-icons">
              shuffle
            </span>
            Grading game
          </em>
        </p>
      )}
      {!isPast && <Location pitch={data.pitch} leagueName={data.leagueName} />}
    </div>
  );
}
