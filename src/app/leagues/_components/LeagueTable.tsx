import LeagueTeam from "./LeagueTeam";
import type { LeagueTeam as LeagueTeamType } from "../types";
import styles from "./LeagueTable.module.sass";

export default function LeagueTable({
  data,
}: {
  readonly data: LeagueTeamType[] | undefined;
}) {
  return (
    <div className={styles.root}>
      {data ? (
        <>
          <div className={`${styles.header} util-card util-color--muted`}>
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
        <em className="util-color--muted">No league data yet</em>
      )}
    </div>
  );
}
