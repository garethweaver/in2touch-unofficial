import { Team, Teams, TeamsBasic } from "@/app/teams/types";
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

const fetchData = (team: Team): Promise<Team> => {
  return new Promise<Team>((resolve, reject) => {
    const teamsRef = ref(database, `team-data/${team.id}`);
    get(teamsRef)
      .then((snapshot) => {
        snapshot.exists() ? resolve(snapshot.val()) : reject();
      })
      .catch(() => reject());
  }).catch(() => {
    console.error(`Error fetching ${team.id}`);
    return team;
  });
};

export const useCompareAndUpateCache = () => {
  const [fbCache, setFbCache] = useLocalStorage<FbCache | null>(
    "fbCache",
    null,
  );

  const [userTeams, setUserTeams] = useLocalStorage<Teams>("userTeams", []);
  const [, , removeAllTeams] = useLocalStorage<TeamsBasic>("allTeams", []);

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
                fetchData(team),
              );
              Promise.all(reqs).then(setUserTeams);
              break;
            }
            case "teamsHash": {
              removeAllTeams();
              break;
            }
            default:
          }
        }
      }
    });
  }, []);
};
