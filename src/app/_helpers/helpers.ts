import { Team, Teams, TeamsBasic } from "@/app/teams/types";
import { League, Leagues } from "@/app/leagues/types";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { ref, onValue, get } from "firebase/database";
import { database } from "@/app/_firebase/config";
import { FbCache } from "@/app/_firebase/types";
import { useLocalStorage } from "usehooks-ts";

interface SortItem {
  nameLowercased: string;
}

export const sortNameLowerByAlpha = (a: SortItem, b: SortItem): number => {
  if (a.nameLowercased < b.nameLowercased) {
    return -1;
  }
  if (a.nameLowercased > b.nameLowercased) {
    return 1;
  }
  return 0;
};

const fetchData = <T extends Team | League>(
  item: T,
  dbPath: string,
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
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

export const useCompareAndUpateCache = (
  setLoading: Dispatch<SetStateAction<boolean>>,
) => {
  const [, , removeAllTeams] = useLocalStorage<TeamsBasic>("allTeams", []);
  const [, , removeAllLeagues] = useLocalStorage<Leagues>("allLeagues", []);
  const [userTeams, setUserTeams] = useLocalStorage<Teams>("userTeams", []);
  const [userLeagues, setUserLeagues] = useLocalStorage<Leagues>(
    "userLeagues",
    [],
  );
  const [fbCache, setFbCache] = useLocalStorage<FbCache | {}>("fbCache", {});
  const cacheRef = useRef<FbCache | {}>(fbCache);

  useEffect(() => {
    const configRef = ref(database, "config");
    // on mount
    setLoading(true);

    onValue(
      configRef,
      async (snapshot) => {
        // on every hash change sync
        setLoading(true);
        console.log("Connected to fb");

        if (snapshot.exists()) {
          const latestCache: FbCache = snapshot.val();

          for (const [key, value] of Object.entries(latestCache)) {
            if (
              cacheRef.current[key as keyof (FbCache | undefined)] !== value
            ) {
              switch (key) {
                case "teamDataHash": {
                  console.log("Refreshing user teams");
                  const reqs = userTeams.map((team: Team, idx: number) =>
                    fetchData(team, "team-data"),
                  );
                  const response = await Promise.all(reqs);
                  setUserTeams(response);
                  break;
                }
                case "leaguesHash": {
                  console.log("Refreshing user leagues + all leagues list");
                  removeAllLeagues();
                  const reqs = userLeagues.map((league: League, idx: number) =>
                    fetchData(league, "leagues"),
                  );
                  const response = await Promise.all(reqs);
                  setUserLeagues(response);
                  break;
                }
                case "teamsHash": {
                  console.log("Binning all teams list");
                  removeAllTeams();
                  break;
                }
                default: {
                  // do nothing for updatedAt
                }
              }
            }
          }

          cacheRef.current = latestCache;
          setFbCache(latestCache);
        }

        setLoading(false);
      },
      (error) => {
        console.error(error);
      },
    );
  }, []);
};
