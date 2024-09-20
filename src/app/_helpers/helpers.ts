import { Team, Teams, TeamsBasic } from "@/app/teams/types";
import { League, Leagues } from "@/app/leagues/types";
import { useEffect } from "react";
import { ref, onValue, get } from "firebase/database";
import { database } from "@/app/_firebase/config";
import { FbCache } from "@/app/_firebase/types";
import { useLocalStorage } from "usehooks-ts";

type sortItem = { nameLowercased: string };

export const sortNameLowerByAlpha = (a: sortItem, b: sortItem): number => {
  if (a.nameLowercased < b.nameLowercased) {
    return -1;
  }
  if (a.nameLowercased > b.nameLowercased) {
    return 1;
  }
  return 0;
};

type dbItem = Team | League;

const fetchData = (item: dbItem, dbPath: string): Promise<dbItem> => {
  return new Promise<dbItem>((resolve, reject) => {
    const dbRef = ref(database, `${dbPath}/${item.id}`);
    get(dbRef)
      .then((snapshot) => {
        snapshot.exists() ? resolve(snapshot.val()) : reject();
      })
      .catch(() => reject());
  }).catch(() => {
    console.error(`Error fetching ${item.id}`);
    return item;
  });
};

export const useCompareAndUpateCache = () => {
  const [fbCache, setFbCache] = useLocalStorage<FbCache | null>(
    "fbCache",
    null,
  );

  const [userTeams, setUserTeams] = useLocalStorage<Teams>("userTeams", []);
  const [, , removeAllTeams] = useLocalStorage<TeamsBasic>("allTeams", []);
  const [, , removeAllLeagues] = useLocalStorage<Leagues>("allLeagues", []);
  const [userLeagues, setUserLeagues] = useLocalStorage<Leagues>(
    "userLeagues",
    [],
  );

  useEffect(() => {
    const configRef = ref(database, "config");

    onValue(configRef, (snapshot) => {
      const latestCache: FbCache = snapshot.val();

      // fresh start
      if (fbCache === null) {
        setFbCache(latestCache);
        return;
      }

      console.log("loading");

      for (const [key, value] of Object.entries(latestCache)) {
        if (fbCache?.[key as keyof FbCache] !== value) {
          switch (key) {
            case "teamDataHash": {
              console.log("bust user teams");
              const reqs = userTeams.map((team: Team, idx: number) =>
                fetchData(team, "team-data"),
              );
              Promise.all(reqs).then((response) =>
                setUserTeams(response as Teams),
              );
              break;
            }
            case "teamsHash": {
              removeAllTeams();
              break;
            }
            case "leaguesHash": {
              removeAllLeagues();
              console.log("bust user leagues");
              const reqs = userLeagues.map((league: League, idx: number) =>
                fetchData(league, "leagues"),
              );
              Promise.all(reqs).then((response) =>
                setUserLeagues(response as Leagues),
              );
              break;
            }
            default:
          }
        }
      }

      setFbCache(latestCache);
    });
  }, []);
};
