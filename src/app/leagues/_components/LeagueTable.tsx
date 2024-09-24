import React from "react";
import LeagueTeam from "./LeagueTeam";
import type { LeagueTeam as LeagueTeamType } from "../types";
import "./LeagueTable.sass";

export default function LeagueTable({
  data,
}: {
  data: LeagueTeamType[] | undefined;
}) {
  return (
    <div className="LeagueTable">
      {data ? (
        <>
          <div className="LeagueTable__header Card Color--muted">
            <div>PL</div>
            <div>W</div>
            <div>D</div>
            <div>L</div>
            <div>F</div>
            <div>A</div>
            <div>BP</div>
            <div>P</div>
          </div>
          <ul>
            {data.map((team) => {
              return (
                <li key={team.id}>
                  <LeagueTeam data={team} />
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <em className="Color--muted">No league data yet</em>
      )}
    </div>
  );
}
