"use client";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";
import type { Teams } from "@/app/teams/types";
import type { Leagues } from "@/app/leagues/types";
import styles from "./page.module.sass";
import Team from "@/app/teams/_components/Team";
import LeagueBasic from "@/app/leagues/_components/LeagueBasic";

export default function Page() {
  const [userTeams, setUserTeams] = useLocalStorage<Teams>("userTeams", []);
  const [userLeagues, setUserLeagues] = useLocalStorage<Leagues>(
    "userLeagues",
    [],
  );

  const removeTeam = (id: string) => {
    const idx = userTeams.findIndex((item) => item.id === id);
    setUserTeams(userTeams.toSpliced(idx, 1));
  };

  return (
    <main className={styles.main}>
      <nav>
        <ul>
          {userTeams.map((team) => (
            <li key={team.id} style={{ padding: "1em" }}>
              <Team data={team} />
            </li>
          ))}
        </ul>
        <ul>
          {userLeagues.map((league) => (
            <li key={league.id} style={{ padding: "1em" }}>
              <LeagueBasic data={league} />
            </li>
          ))}
        </ul>
        <hr />
        <Link href="/add/teams">Add a team</Link>
        <Link href="/add/leagues">Add a league</Link>
      </nav>
    </main>
  );
}
