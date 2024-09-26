import Link from "next/link";
import Icon from "@/app/_components/Icon";
import Location from "./Location";
import type { Fixture } from "../types";
import styles from "./Fixture.module.sass";

function getResultClassName(arr: string[]) {
  if (parseInt(arr[0]) > parseInt(arr[1])) {
    return "util-color--success";
  } else if (parseInt(arr[0]) < parseInt(arr[1])) {
    return "util-color--danger";
  } else {
    return "util-color--warning";
  }
}

function getResult(result: string) {
  let r;
  if (result.length === 0) {
    r = <span className="util-color--muted">No result yet</span>;
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
    <Link className={styles.root} href={`/teams/${data.vsId}`}>
      {isPast && <h6 className="util-heading--sm">Result:</h6>}
      <div className="util-flex__bar">
        {isPast ? (
          <p className={styles.result}>{getResult(data.result)}</p>
        ) : (
          <p className={styles.time}>{data.time}</p>
        )}
        <div className={styles.vs}>
          <strong>{data.vs}</strong>
          <Icon name="arrow-right" />
        </div>
      </div>
      <p>{data.day}</p>
      {data.grading && (
        <p>
          <em className="util-color--muted">
            <Icon name="shuffle" size="small" className={styles.gradingIcon} />
            Grading game
          </em>
        </p>
      )}
      {!isPast && <Location pitch={data.pitch} leagueName={data.leagueName} />}
    </Link>
  );
}
