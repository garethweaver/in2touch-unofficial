"use client";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";
import { motion } from "framer-motion";
import Loader from "@/app/_components/Loader";
import { database } from "@/app/_firebase/config";
import { sortNameLowerByAlpha } from "@/app/_helpers/helpers";
import Icon from "@/app/_components/Icon";
import type { League } from "@/app/leagues/types";
import type { Team } from "@/app/teams/types";
import "./page.sass";

interface DynamicKey {
  db: string;
  cache: string;
  userSelected: string;
}

type Item = Team | League;
type List = (Team | League)[];

const searchFn = (t: { nameLowercased: string }, q: string) => {
  return t.nameLowercased.search(q) !== -1;
};

export default function Page({
  params,
}: {
  readonly params: { slug: string };
}) {
  const keys: DynamicKey = {
    db: params.slug,
    cache: `all${params.slug[0].toUpperCase() + params.slug.slice(1)}`,
    userSelected: `user${params.slug[0].toUpperCase() + params.slug.slice(1)}`,
  };

  const [localStorageCache] = useLocalStorage<List>(keys.userSelected, [], {
    initializeWithValue: false,
  });
  const localStorageCacheIDs = localStorageCache.map((t: Item) => t.id);
  const [cachedData, setCachedData] = useLocalStorage<List | null>(
    keys.cache,
    null,
    { initializeWithValue: false },
  );
  const [query, setQuery] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value.toLowerCase());
  };

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
      {cachedData ? (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeInOut", duration: 0.2 }}
        >
          <input
            className="SearchInput"
            type="search"
            placeholder="Search..."
            id="Search"
            onChange={handleSearch}
            autoFocus
          />
          <ul className="SearchList">
            {cachedData
              .filter((item) => searchFn(item, query))
              .map((item) => {
                const isAdded = localStorageCacheIDs.includes(item.id);
                return (
                  <li
                    key={item.id}
                    className={`${isAdded ? `SearchList__item--added` : ""}`}
                  >
                    <Link href={`/${keys.db}/${item.id}`} prefetch>
                      {item.name}
                      {isAdded && <Icon name="check" />}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </motion.div>
      ) : (
        <Loader className="center" />
      )}
    </main>
  );
}
