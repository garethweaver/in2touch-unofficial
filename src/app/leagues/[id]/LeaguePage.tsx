import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { motion } from "framer-motion";
import { database } from "@/app/_firebase/config";
import LeagueTable from "@/app/leagues/_components/LeagueTable";
import ButtonNav from "@/app/_components/ButtonNav";
import Button from "@/app/_components/Button";
import Loader from "@/app/_components/Loader";
import type { League, Leagues } from "@/app/leagues/types";

export default function LeagueDetail({ id }: { readonly id: string }) {
  const [userLeagues, setUserLeagues] = useLocalStorage<Leagues>(
    "userLeagues",
    [],
  );
  const cachedLeague = userLeagues.find((l) => id === l.id);
  const [league, setLeague] = useState<League | undefined>(cachedLeague);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const addLeague = (newLeague: League) => {
    setUserLeagues([...userLeagues, newLeague]);
    setJustAdded(true);
  };

  useEffect(() => {
    // do not fetch if in local storage
    if (cachedLeague) return;
    // else fetch from databse
    const teamRef = ref(database, `leagues/${id}`);
    get(teamRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setTimeout(() => {
          setLeague(data);
        }, 100);
      }
    });
  }, []);

  return (
    <main>
      {league ? (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeInOut", duration: 0.2 }}
        >
          <h1>{league.name}</h1>
          {!cachedLeague && (
            <Button icon="plus" onClick={() => addLeague(league)}>
              Add league to homescreen
            </Button>
          )}
          {justAdded && (
            <Button icon="check" faux>
              League added
            </Button>
          )}
          <LeagueTable data={league.teams} />
          <div className="util-margin--t">
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
        </motion.div>
      ) : (
        <Loader type="center" />
      )}
    </main>
  );
}
