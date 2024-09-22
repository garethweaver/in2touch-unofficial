"use client";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { database } from "@/app/_firebase/config";
import Button from "@/app/_components/ButtonExternal";
import type { Team, Teams } from "@/app/teams/types";

import FixtureList from "../_components/FixtureList";

export default function Page({ params }: { params: { id: string } }) {
  const [userTeams, setUserTeams] = useLocalStorage<Teams>("userTeams", []);
  const cachedTeam = userTeams.find((t) => params.id === t.id);
  const [team, setTeam] = useState<Team | undefined>(cachedTeam);

  const addTeam = (newTeam: Team) => {
    setUserTeams([...userTeams, newTeam]);
  };

  useEffect(() => {
    // do not fetch if in local storage
    if (cachedTeam) return;
    // else fetch from databse
    const teamRef = ref(database, `team-data/${params.id}`);
    get(teamRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setTeam(data);
      }
    });
  }, []);

  return (
    <main>
      {team ? (
        <>
          {!cachedTeam && (
            <button onClick={() => addTeam(team)}>Add team</button>
          )}

          <h1>{team.name}</h1>
          {team.fixtures && team.fixtures.length > 0 ? (
            <FixtureList fixtures={team.fixtures} />
          ) : (
            <em className="Color--muted">No team fixtures</em>
          )}
          <div className="Margin--t">
            <Button href={team.profileUrl}>View profile on In2Touch</Button>
          </div>
        </>
      ) : (
        "loading..."
      )}
    </main>
  );
}
