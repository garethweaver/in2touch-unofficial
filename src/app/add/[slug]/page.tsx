"use client";
import { get, ref } from "firebase/database";
import { useEffect } from "react";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";
import { database } from "@/app/_firebase/config";
import type { League } from "@/app/leagues/types";
import type { Team } from "@/app/teams/types";
import { sortNameLowerByAlpha } from "@/app/_helpers/helpers";

type DynamicKey = {
  db: string;
  cache: string;
  userSelected: string;
};

type Item = Team | League;
type List = (Team | League)[];

export default function Page({ params }: { params: { slug: string } }) {
  const keys: DynamicKey = {
    db: params.slug,
    cache: `all${params.slug[0].toUpperCase() + params.slug.slice(1)}`,
    userSelected: `user${params.slug[0].toUpperCase() + params.slug.slice(1)}`,
  };

  const [localStorageCache] = useLocalStorage<List>(keys.userSelected, []);
  const localStorageCacheIDs = localStorageCache.map((t: Item) => t.id);
  const [cachedData, setCachedData] = useLocalStorage<List | null>(
    keys.cache,
    null,
  );

  useEffect(() => {
    // do not fetch if in local storage
    if (cachedData) return;
    // else fetch from databse
    const dbRef = ref(database, keys.db);
    get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data: List = Object.values(snapshot.val());
        data.sort(sortNameLowerByAlpha);
        setCachedData(data);
      }
    });
  }, []);

  return (
    <main>
      <ul>
        {cachedData?.map((item) => (
          <li key={item.id}>
            {localStorageCacheIDs.includes(item.id) && <>✅</>}
            <Link href={`/${keys.db}/${item.id}`}>{item.nameLowercased}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
