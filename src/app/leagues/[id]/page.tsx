"use client";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { database } from "@/app/_firebase/config";
import LeagueTable from "@/app/leagues/_components/LeagueTable";
import ButtonNav from "@/app/_components/ButtonNav";
import type { League, Leagues } from "@/app/leagues/types";

export default function Page({ params }: { params: { id: string } }) {
  const [userLeagues, setUserLeagues] = useLocalStorage<Leagues>(
    "userLeagues",
    [],
  );
  const cachedLeague = userLeagues.find((l) => params.id === l.id);
  const [league, setLeague] = useState<League | undefined>(cachedLeague);

  const addLeague = (newLeague: League) => {
    setUserLeagues([...userLeagues, newLeague]);
  };

  useEffect(() => {
    // do not fetch if in local storage
    if (cachedLeague) return;
    // else fetch from databse
    const teamRef = ref(database, `leagues/${params.id}`);
    get(teamRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setLeague(data);
      }
    });
  }, []);

  return (
    <main>
      {league ? (
        <>
          {!cachedLeague && (
            <button onClick={() => addLeague(league)}>Add league</button>
          )}
          <h1>{league.name}</h1>
          <LeagueTable data={league.teams} />
          <div className="Margin--t">
            <ButtonNav
              stacked
              hrefs={[
                {
                  text: "View fixtures on In2Touch",
                  href: league.fixturesUrl,
                  icon: "arrow-up-right",
                  external: true,
                },
                {
                  text: "View standings on In2Touch",
                  href: league.standingUrl,
                  icon: "arrow-up-right",
                  external: true,
                },
              ]}
            />
          </div>
        </>
      ) : (
        "loading..."
      )}
    </main>
  );
}
