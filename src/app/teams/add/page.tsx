"use client";
import { get, ref } from "firebase/database";
import { useEffect } from "react";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";
import { database } from "@/app/_firebase/config";
import type { TeamsData, TeamData, TeamsDataBasic } from "@/app/teams/types";
import { sortTeamsAlpha } from "@/app/_helpers/helpers";

export default function Page() {
  const [localStorageUserTeams] = useLocalStorage<TeamsData>("userTeams", []);
  const localStorageUserTeamIDs = localStorageUserTeams.map(
    (t: TeamData) => t.id
  );
  const [teams, setTeams] = useLocalStorage<TeamsDataBasic | null>(
    "allTeams",
    null
  );

  useEffect(() => {
    // do not fetch if in local storage
    if (teams) return;
    // else fetch from databse
    const teamsRef = ref(database, "teams");
    get(teamsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const teamsArray: TeamsDataBasic = Object.values(snapshot.val());
        teamsArray.sort(sortTeamsAlpha);
        setTeams(teamsArray);
      }
    });
  }, []);

  return (
    <main>
      <ul>
        {teams?.map((team) => (
          <li key={team.id}>
            {localStorageUserTeamIDs.includes(team.id) && <>✅</>}
            <Link href={`/teams/${team.id}`}>{team.nameLowercased}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
