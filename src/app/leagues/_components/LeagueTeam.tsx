import Link from "next/link";
import "./LeagueTeam.sass";
import type { LeagueTeam } from "../types";

export default function LeagueTeam({ data }: { readonly data: LeagueTeam }) {
  return (
    <div className="LeagueTeam Card">
      <Link href={`/teams/${data.id}`}>
        <h3 className="LeagueTeam__name">{data.name}</h3>
        <div className="LeagueTeam__results">
          <div>{data.played}</div>
          <strong className="Color--success">{data.won}</strong>
          <strong className="Color--warning">{data.drawn}</strong>
          <strong className="Color--danger">{data.lost}</strong>
          <div>{data.pointsFor}</div>
          <div>{data.pointsAgainst}</div>
          <div>{data.pointsBonus}</div>
          <strong className="Color--highlight">{data.points}</strong>
        </div>
      </Link>
    </div>
  );
}
