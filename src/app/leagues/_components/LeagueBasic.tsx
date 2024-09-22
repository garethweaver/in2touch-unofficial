import { League } from "../types";
import Link from "next/link";

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
    <div className="League Card">
      <Link href={`/leagues/${data.id}`}>
        <div className="Flex__header">
          <span>{parseName(data.name)}</span>
          {/*
        <ButtonsEdit
          id={data.id}
          type="leagues" />
         */}
        </div>
        <div className="League__list">
          {data.teams && data.teams.length > 0 ? (
            <>
              <h6 className="Heading__sm">Teams:</h6>
              <ol>
                {data.teams.map((team, i: number) => {
                  return (
                    <li key={team.id} className="League__team">
                      <span className="League__team-pos">{i + 1}</span>
                      <span className="League__team-name">{team.name}</span>
                      <span className="League__team-points">{team.points}</span>
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
