"use client";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "@/app/_firebase/config";
import { useLocalStorage } from "usehooks-ts";
import type { TeamData, TeamsData } from "@/app/teams/types";

export default function Page({ params }: { params: { id: string } }) {
  const [userTeams, setUserTeams] = useLocalStorage<TeamsData>("userTeams", []);
  const localStorageThisTeam = userTeams.find((t) => params.id === t.id);
  const [team, setTeam] = useState<TeamData | undefined>(localStorageThisTeam);

  const addTeam = (newTeam: TeamData) => {
    if (!localStorageThisTeam) {
      setUserTeams([...userTeams, newTeam]);
    }
  };

  useEffect(() => {
    // do not fetch if in local storage
    if (localStorageThisTeam) return;
    // else fetch from databse
    const teamRef = ref(database, `team-data/${params.id}`);
    get(teamRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setTeam(data);
      }
    });
  }, [params.id]);

  return (
    <main>
      {team && (
        <>
          {!localStorageThisTeam && (
            <button onClick={() => addTeam(team)}>Add team</button>
          )}
          TEAM {params.id}
          {JSON.stringify(team)}
        </>
      )}
    </main>
  );
}
