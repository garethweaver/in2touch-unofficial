"use client";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";
import type { TeamsData } from "@/app/teams/types";

export default function Page() {
  const [userTeams, setUserTeams] = useLocalStorage<TeamsData>("userTeams", []);

  const removeTeam = (id: string) => {
    const idx = userTeams.findIndex((item) => item.id === id);
    setUserTeams(userTeams.toSpliced(idx, 1));
  };

  return (
    <main>
      <nav>
        <ul>
          {userTeams.map((team) => (
            <li key={team.id} style={{ padding: "1em" }}>
              <Link href={`/teams/${team.id}`}>
                <strong>
                  {team.id} - {team.name}
                </strong>
              </Link>
              <br />
              {team.fixtures?.[0].time} - {team.fixtures?.[0].vs}
              <br />
              <small>{team.fixtures?.[0].leagueName}</small>
              <br />
              <button onClick={() => removeTeam(team.id)}>X</button>
            </li>
          ))}
        </ul>
        <hr />
        <Link href="/teams/add">Add a team</Link>
        <Link href="/leagues/add">Add a league</Link>
      </nav>
    </main>
  );
}
