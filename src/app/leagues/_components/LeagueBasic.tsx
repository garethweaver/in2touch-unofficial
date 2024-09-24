import { League } from "../types";
import Link from "next/link";
import "./LeagueBasic.sass";

function parseName(name: string) {
  let namesArr: undefined | string[];
  if (name.indexOf("-")) {
    namesArr = name.split("-");
  }
  return (
    <>
      <h3 className="Flex__heading">{namesArr?.[0]}</h3>
      <span>{namesArr?.slice(1, namesArr?.length).join("-").trim()}</span>
    </>
  );
}

export default function LeagueBasic({ data }: { data: League }) {
  return (
    <div className="LeagueBasic Card">
      <Link href={`/leagues/${data.id}`}>
        <div className="Flex__header">
          <span>{parseName(data.name)}</span>
          {/*
        <ButtonsEdit
          id={data.id}
          type="leagues" />
         */}
        </div>
        <div className="LeagueBasic__list">
          {data.teams && data.teams.length > 0 ? (
            <>
              <h6 className="Heading__sm">Teams:</h6>
              <ol>
                {data.teams.map((team, idx: number) => {
                  return (
                    <li key={team.id} className="LeagueBasic__team">
                      <span className="LeagueBasic__team-pos">{idx + 1}</span>
                      <span className="LeagueBasic__team-name">
                        {team.name}
                      </span>
                      <span className="LeagueBasic__team-points">
                        {team.points}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </>
          ) : (
            <em className="Color--muted">No league data yet</em>
          )}
        </div>
      </Link>
    </div>
  );
}
