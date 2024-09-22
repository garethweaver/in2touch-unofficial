import Link from "next/link";
import type { LeagueTeam } from "../types";

export default function LeagueTableTeam({ data }: { data: LeagueTeam }) {
  return (
    <div className="LeagueTableTeam Card">
      <h3 className="LeagueTableTeam__name">
        <Link href={`/teams/${data.id}`}>{data.name}</Link>
      </h3>
      <div className="LeagueTableTeam__results">
        <div>{data.played}</div>
        <strong className="Color--success">{data.won}</strong>
        <strong className="Color--warning">{data.drawn}</strong>
        <strong className="Color--danger">{data.lost}</strong>
        <div>{data.pointsFor}</div>
        <div>{data.pointsAgainst}</div>
        <div>{data.pointsBonus}</div>
        <strong>{data.points}</strong>
      </div>
    </div>
  );
}
