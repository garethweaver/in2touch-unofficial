import { TeamData, TeamDataBasic, TeamsData } from "@/app/teams/types";
import { useEffect } from "react";
import { ref, onValue, child, get } from "firebase/database";
import { database } from "@/app/_firebase/config";
import { FbCache } from "../_firebase/types";
import { useLocalStorage } from "usehooks-ts";

export const getFromLocalStorage = (key: string, setDefault?: any) => {
  return localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key) ?? "")
    : setDefault;
};

export const sortTeamsAlpha = (a: TeamDataBasic, b: TeamDataBasic) => {
  if (a.nameLowercased < b.nameLowercased) {
    return -1;
  }
  if (a.nameLowercased > b.nameLowercased) {
    return 1;
  }
  return 0;
};

const fetchData = (team: TeamData): Promise<TeamData> => {
  return new Promise<TeamData>((resolve, reject) => {
    const teamsDataRef = ref(database, `team-data/${team.id}`);
    get(teamsDataRef)
      .then((snapshot) => {
        snapshot.exists() ? resolve(snapshot.val()) : reject();
      })
      .catch(() => reject());
  }).catch((error) => {
    console.error(`Error fetching ${team.id}`);
    return team;
  });
};

export const compareAndUpateCache = () => {
  const [fbCache, setFbCache] = useLocalStorage<FbCache | null>(
    "fbCache",
    null
  );

  const [userTeams, setUserTeams] = useLocalStorage<TeamsData>("userTeams", []);

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
            case "teamDataHash":
              console.log("bust teams");
              const reqs = userTeams.map((team: TeamData, idx: number) =>
                fetchData(team)
              );
              Promise.all(reqs).then((result) => {
                setUserTeams(result);
              });
              break;
            default:
          }
        }
      }
    });
  }, []);
};
