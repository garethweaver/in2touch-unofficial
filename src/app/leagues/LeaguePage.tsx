import { useState } from "react";
import { motion } from "framer-motion";
import LeagueTable from "@/app/leagues/_components/LeagueTable";
import ButtonNav from "@/app/_components/ButtonNav";
import Button from "@/app/_components/Button";
import Loader from "@/app/_components/Loader";
import LoadError from "@/app/_components/LoadError";
import { useFetchWhenOnline } from "@/app/_helpers/useFetchWhenOnline";
import type { League, Leagues } from "@/app/leagues/_utils/types";
import { useLocalStorage } from "usehooks-ts";

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

  // saved leagues come from local storage; anything else from the database
  const { status, retry } = useFetchWhenOnline<League>(
    `leagues/${id}`,
    !!cachedLeague,
    (data) => setTimeout(() => setLeague(data), 100),
  );

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
                ...(league.fixturesUrl
                  ? [
                      {
                        text: `View fixtures on ${process.env.NEXT_PUBLIC_APPNAME}`,
                        href: league.fixturesUrl,
                        icon: "arrow-up-right",
                        external: true,
                      },
                    ]
                  : []),
                ...(league.standingUrl
                  ? [
                      {
                        text: `View standings on ${process.env.NEXT_PUBLIC_APPNAME}`,
                        href: league.standingUrl,
                        icon: "arrow-up-right",
                        external: true,
                      },
                    ]
                  : []),
                ...(league.leagueUrl
                  ? [
                      {
                        text: `View league on ${process.env.NEXT_PUBLIC_APPNAME}`,
                        href: league.leagueUrl,
                        icon: "arrow-up-right",
                        external: true,
                      },
                    ]
                  : []),
              ]}
            />
          </div>
        </motion.div>
      ) : status === "loading" || status === "done" ? (
        <Loader type="center" />
      ) : (
        <div className="util-margin--t">
          <LoadError status={status} subject="this league" onRetry={retry} />
        </div>
      )}
    </main>
  );
}
