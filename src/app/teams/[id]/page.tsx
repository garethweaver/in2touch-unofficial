"use client";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "@/app/_firebase/config";
import { useLocalStorage } from "usehooks-ts";
import type { Team, Teams } from "@/app/teams/types";

export default function Page({ params }: { params: { id: string } }) {
  const [userTeams, setUserTeams] = useLocalStorage<Teams>("userTeams", []);
  const cachedTeam = userTeams.find((t) => params.id === t.id);
  const [uncachedTeam, setUncachedTeam] = useState<Team | undefined>();

  const addTeam = (newTeam: Team) => {
    setUserTeams([...userTeams, newTeam]);
    setUncachedTeam(undefined);
  };

  useEffect(() => {
    // do not fetch if in local storage
    if (cachedTeam) return;
    // else fetch from databse
    const teamRef = ref(database, `team-data/${params.id}`);
    get(teamRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUncachedTeam(data);
      }
    });
  }, []);

  return (
    <main>
      {(cachedTeam || uncachedTeam) && (
        <>
          {uncachedTeam && (
            <button onClick={() => addTeam(uncachedTeam)}>Add team</button>
          )}
          TEAM {params.id}
          {JSON.stringify(cachedTeam || uncachedTeam)}
        </>
      )}
    </main>
  );
}
