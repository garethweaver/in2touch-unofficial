"use client";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "@/app/_firebase/config";
import { useLocalStorage } from "usehooks-ts";
import type { League, Leagues } from "@/app/leagues/types";

export default function Page({ params }: { params: { id: string } }) {
  const [userLeagues, setUserLeagues] = useLocalStorage<Leagues>(
    "userLeagues",
    [],
  );
  const cachedLeague = userLeagues.find((t) => params.id === t.id);
  const [uncachedLeague, setUncachedLeague] = useState<League | undefined>();

  const addLeague = (newLeague: League) => {
    setUserLeagues([...userLeagues, newLeague]);
    setUncachedLeague(undefined);
  };

  useEffect(() => {
    // do not fetch if in local storage
    if (cachedLeague) return;
    // else fetch from databse
    const dbRef = ref(database, `leagues/${params.id}`);
    get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUncachedLeague(data);
      }
    });
  }, []);

  return (
    <main>
      {(cachedLeague || uncachedLeague) && (
        <>
          {uncachedLeague && (
            <button onClick={() => addLeague(uncachedLeague)}>
              Add league
            </button>
          )}
          League {params.id}
          {JSON.stringify(cachedLeague || uncachedLeague)}
        </>
      )}
    </main>
  );
}
