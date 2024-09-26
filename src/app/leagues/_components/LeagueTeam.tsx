import Link from "next/link";
import type { LeagueTeam } from "../types";
import styles from "./LeagueTeam.module.sass";

export default function LeagueTeam({ data }: { readonly data: LeagueTeam }) {
  return (
    <div className="util-card">
      <Link href={`/teams/${data.id}`}>
        <h3 className={styles.name}>{data.name}</h3>
        <div className={styles.results}>
          <div>{data.played}</div>
          <strong className="util-color--success">{data.won}</strong>
          <strong className="util-color--warning">{data.drawn}</strong>
          <strong className="util-color--danger">{data.lost}</strong>
          <div>{data.pointsFor}</div>
          <div>{data.pointsAgainst}</div>
          <div>{data.pointsBonus}</div>
          <strong className="util-color--highlight">{data.points}</strong>
        </div>
      </Link>
    </div>
  );
}
