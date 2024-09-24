"use client";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { database } from "@/app/_firebase/config";
import Button from "@/app/_components/Button";
import ButtonNav from "@/app/_components/ButtonNav";
import FixtureList from "../_components/FixtureList";
import type { Team, Teams } from "@/app/teams/types";

export default function Page({ params }: { params: { id: string } }) {
  const [userTeams, setUserTeams] = useLocalStorage<Teams>("userTeams", []);
  const cachedTeam = userTeams.find((t) => params.id === t.id);
  const [team, setTeam] = useState<Team | undefined>(cachedTeam);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const addTeam = (newTeam: Team) => {
    setUserTeams([...userTeams, newTeam]);
    setJustAdded(true);
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
          <h1>{team.name}</h1>
          {!cachedTeam && (
            <Button icon="plus" onClick={() => addTeam(team)}>
              Add team to homescreen
            </Button>
          )}
          {justAdded && (
            <Button icon="user-check" faux>
              Team added
            </Button>
          )}
          {team.fixtures && team.fixtures.length > 0 ? (
            <FixtureList fixtures={team.fixtures} />
          ) : (
            <div className="Margin--t">
              <em className="Color--muted">No team fixtures</em>
            </div>
          )}
          <div className="Margin--t">
            <ButtonNav
              stacked
              hrefs={[
                {
                  text: "View profile on In2Touch",
                  href: team.profileUrl,
                  icon: "arrow-up-right",
                  external: true,
                },
              ]}
            />
          </div>
        </>
      ) : (
        // TODO: loading state
        "loading..."
      )}
    </main>
  );
}
